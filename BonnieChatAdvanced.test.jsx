import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BonnieChatAdvanced from './BonnieChatAdvanced';

// Mock the useApiCall hook
jest.mock('./useApiCall', () => ({
  __esModule: true,
  default: () => ({
    makeRequest: jest.fn(),
    isLoading: false,
  }),
}));

describe('BonnieChatAdvanced', () => {
  let mockMakeRequest;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock the useApiCall hook implementation
    const useApiCall = require('./useApiCall').default;
    mockMakeRequest = jest.fn();
    useApiCall.mockReturnValue({
      makeRequest: mockMakeRequest,
      isLoading: false,
    });
  });

  afterEach(() => {
    // Clean up any injected styles
    const styleElement = document.getElementById('bonnie-chat-styles');
    if (styleElement) {
      styleElement.remove();
    }
  });

  describe('Component Rendering', () => {
    test('renders the chat interface with all main elements', () => {
      render(<BonnieChatAdvanced />);
      
      // Check header elements
      expect(screen.getByText('Bonnie 💋')).toBeInTheDocument();
      expect(screen.getByText(/Bond Level:/)).toBeInTheDocument();
      
      // Check input elements
      expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
    });

    test('injects styles only once', () => {
      const { rerender } = render(<BonnieChatAdvanced />);
      
      const firstStyleElement = document.getElementById('bonnie-chat-styles');
      expect(firstStyleElement).toBeInTheDocument();
      
      // Re-render the component
      rerender(<BonnieChatAdvanced />);
      
      // Should still only have one style element
      const styleElements = document.querySelectorAll('#bonnie-chat-styles');
      expect(styleElements).toHaveLength(1);
    });

    test('displays initial bond score of 50%', () => {
      render(<BonnieChatAdvanced />);
      expect(screen.getByText('Bond Level: 50%')).toBeInTheDocument();
    });
  });

  describe('Message Sending', () => {
    test('sends a message when Enter key is pressed', async () => {
      mockMakeRequest.mockResolvedValueOnce({
        reply: 'Hello darling!',
        emotion: 'flirty',
        bond_score: 55,
      });

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Hello Bonnie');
      
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(mockMakeRequest).toHaveBeenCalledWith(
          'https://bonnie-backend-server.onrender.com/bonnie-chat',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('Hello Bonnie'),
          })
        );
      });
    });

    test('sends a message when send button is clicked', async () => {
      mockMakeRequest.mockResolvedValueOnce({
        reply: 'Hi there!',
        emotion: 'playful',
      });

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      const sendButton = screen.getByRole('button', { name: 'Send message' });
      
      await userEvent.type(input, 'Hi');
      await userEvent.click(sendButton);
      
      await waitFor(() => {
        expect(mockMakeRequest).toHaveBeenCalled();
      });
    });

    test('does not send empty messages', async () => {
      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      const sendButton = screen.getByRole('button', { name: 'Send message' });
      
      // Try to send empty message
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      expect(mockMakeRequest).not.toHaveBeenCalled();
      
      // Button should be disabled for empty input
      expect(sendButton).toBeDisabled();
    });

    test('prevents sending while busy', async () => {
      mockMakeRequest.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          reply: 'Processing...',
          emotion: 'thoughtful',
        }), 1000))
      );

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      
      // Send first message
      await userEvent.type(input, 'First message');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      // Try to send second message immediately
      await userEvent.type(input, 'Second message');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      // Should only have one request
      expect(mockMakeRequest).toHaveBeenCalledTimes(1);
    });

    test('does not send on Shift+Enter', async () => {
      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Test message');
      
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true });
      
      expect(mockMakeRequest).not.toHaveBeenCalled();
    });
  });

  describe('Message Display', () => {
    test('displays user messages', async () => {
      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Hello!');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('Hello!')).toBeInTheDocument();
      });
    });

    test('displays Bonnie responses with chunking', async () => {
      mockMakeRequest.mockResolvedValueOnce({
        reply: 'This is a long message. It should be chunked properly!',
        emotion: 'thoughtful',
      });

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Tell me something');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText(/This is a long message/)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    test('shows typing indicator while processing', async () => {
      mockMakeRequest.mockResolvedValueOnce({
        reply: 'Typing...',
        emotion: 'playful',
      });

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Hi');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        const typingIndicator = document.querySelector('.typing-indicator-advanced');
        expect(typingIndicator).toBeInTheDocument();
      });
    });
  });

  describe('Emotion and Bond System', () => {
    test('updates emotion based on response', async () => {
      mockMakeRequest.mockResolvedValueOnce({
        reply: 'Oh darling!',
        emotion: 'flirty',
        bond_score: 60,
      });

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Hello');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        // Check if the emotion affects the styling
        const container = document.querySelector('div[style*="background"]');
        expect(container).toHaveStyle({
          background: expect.stringContaining('linear-gradient'),
        });
      });
    });

    test('updates bond score', async () => {
      mockMakeRequest.mockResolvedValueOnce({
        reply: 'Great conversation!',
        emotion: 'supportive',
        bond_score: 75,
      });

      render(<BonnieChatAdvanced />);
      
      expect(screen.getByText('Bond Level: 50%')).toBeInTheDocument();
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Hello');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('Bond Level: 75%')).toBeInTheDocument();
      });
    });

    test('clamps bond score between 0 and 100', async () => {
      mockMakeRequest.mockResolvedValueOnce({
        reply: 'Test',
        emotion: 'neutral',
        bond_score: 150, // Invalid high value
      });

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Test');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('Bond Level: 100%')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles API errors gracefully', async () => {
      mockMakeRequest.mockRejectedValueOnce(new Error('Network error'));

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Hello');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText(/connection seems a bit wobbly/)).toBeInTheDocument();
      });
    });

    test('handles invalid response format', async () => {
      mockMakeRequest.mockResolvedValueOnce(null);

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Hello');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText(/technical moment/)).toBeInTheDocument();
      });
    });

    test('provides default values for missing response fields', async () => {
      mockMakeRequest.mockResolvedValueOnce({
        // Missing reply and emotion
      });

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Hello');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText(/I'm here for you, darling/)).toBeInTheDocument();
      });
    });
  });

  describe('MessageProcessor Class', () => {
    test('chunks long messages correctly', () => {
      const { MessageProcessor } = require('./BonnieChatAdvanced');
      
      const longMessage = 'This is a very long message that should be split into multiple chunks. Each chunk should have appropriate delays and typing durations calculated based on the emotion.';
      
      const chunks = MessageProcessor.chunkMessage(longMessage, 'thoughtful');
      
      expect(chunks.length).toBeGreaterThan(1);
      chunks.forEach(chunk => {
        expect(chunk).toHaveProperty('text');
        expect(chunk).toHaveProperty('delay');
        expect(chunk).toHaveProperty('typing');
        expect(chunk.text.length).toBeLessThanOrEqual(80); // thoughtful max length
      });
    });

    test('calculates delays based on punctuation', () => {
      const { MessageProcessor } = require('./BonnieChatAdvanced');
      
      const questionDelay = MessageProcessor.calculateDelay('How are you?', 'neutral');
      const ellipsisDelay = MessageProcessor.calculateDelay('Well...', 'neutral');
      const exclamationDelay = MessageProcessor.calculateDelay('Great!', 'neutral');
      const normalDelay = MessageProcessor.calculateDelay('Hello', 'neutral');
      
      expect(questionDelay).toBeGreaterThan(normalDelay);
      expect(ellipsisDelay).toBeGreaterThan(normalDelay);
      expect(exclamationDelay).toBeLessThanOrEqual(normalDelay);
    });

    test('calculates typing duration based on text length and emotion', () => {
      const { MessageProcessor } = require('./BonnieChatAdvanced');
      
      const shortPlayful = MessageProcessor.calculateTypingDuration('Hi!', 'playful');
      const longThoughtful = MessageProcessor.calculateTypingDuration('This is a longer message', 'thoughtful');
      
      expect(longThoughtful).toBeGreaterThan(shortPlayful);
    });
  });

  describe('UI Interactions', () => {
    test('clears input after sending message', async () => {
      mockMakeRequest.mockResolvedValueOnce({
        reply: 'Response',
        emotion: 'playful',
      });

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Test message');
      
      expect(input).toHaveValue('Test message');
      
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    test('refocuses input after sending', async () => {
      mockMakeRequest.mockResolvedValueOnce({
        reply: 'Response',
        emotion: 'playful',
      });

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      await userEvent.type(input, 'Test');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        expect(input).toHaveFocus();
      }, { timeout: 2000 });
    });

    test('shows loading state on send button', async () => {
      mockMakeRequest.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      );

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      const sendButton = screen.getByRole('button', { name: 'Send message' });
      
      expect(sendButton).toHaveTextContent('💌');
      
      await userEvent.type(input, 'Test');
      fireEvent.click(sendButton);
      
      await waitFor(() => {
        expect(sendButton).toHaveTextContent('⏳');
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<BonnieChatAdvanced />);
      
      const sendButton = screen.getByRole('button', { name: 'Send message' });
      expect(sendButton).toHaveAttribute('aria-label', 'Send message');
    });

    test('disables input when loading', async () => {
      const useApiCall = require('./useApiCall').default;
      useApiCall.mockReturnValue({
        makeRequest: mockMakeRequest,
        isLoading: true,
      });

      render(<BonnieChatAdvanced />);
      
      const input = screen.getByPlaceholderText('Type your message...');
      expect(input).toBeDisabled();
    });
  });
});