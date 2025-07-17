# Bonnie Chat Style Guide 💋

## Design Philosophy
A seductive, mobile-first chat interface that creates an intimate, emotionally engaging experience through thoughtful visual design and smooth interactions.

## Color Palette

### Primary Colors
- **Seductive Pink**: `#e91e63` - Main brand color
- **Soft Pink**: `#f06292` - Secondary/gradient end
- **Background Pink**: `#fff0f6` - Light background
- **Border Pink**: `#ffe6f0` - Subtle borders

### Supporting Colors
- **Online Green**: `#28a745` - Connection status
- **Text Dark**: `#333333` - Primary text
- **White**: `#ffffff` - Clean backgrounds
- **Gray Light**: `#f8f9fa` - Input background

## Typography
- **Font Stack**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Base Size**: `16px` (1rem)
- **Line Height**: `1.4` for messages
- **Letter Spacing**: `-0.5px` for headers

## Spacing System
- **Base Unit**: `0.25rem` (4px)
- **Common Spacings**:
  - `0.75rem` (12px) - Tight spacing
  - `1rem` (16px) - Standard spacing
  - `1.25rem` (20px) - Comfortable spacing
  - `2rem` (32px) - Section spacing

## Component Styles

### Messages
- **Border Radius**: `20px` with `4px` on tail corner
- **Padding**: `0.75rem 1rem`
- **Max Width**: `75%` (85% on mobile)
- **Shadow**: `0 2px 10px rgba(0, 0, 0, 0.05)`

### Input Field
- **Border Radius**: `25px` (pill shape)
- **Padding**: `0.75rem 1rem`
- **Focus State**: Pink border with soft shadow
- **Transition**: `all 0.3s ease`

### Send Button
- **Size**: `48px` circular
- **Shadow**: `0 4px 15px rgba(233, 30, 99, 0.3)`
- **Hover Scale**: `1.05`
- **Icons**: Emoji-based (💌, ⏳)

## Animations

### Typing Indicator
```css
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-10px); opacity: 1; }
}
```
- **Duration**: `1.4s`
- **Stagger**: `0.2s` between dots

### Message Entry
```css
@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```
- **Duration**: `0.3s ease-out`

### Status Pulse
```css
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(40, 167, 69, 0); }
  100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
}
```
- **Duration**: `2s infinite`

## Mobile Optimizations
1. **Fullscreen Layout**: `position: fixed; inset: 0`
2. **Visual Viewport Handling**: Dynamic height adjustment
3. **Touch Optimizations**: `touch-action: pan-y`
4. **Smooth Scrolling**: `-webkit-overflow-scrolling: touch`
5. **No Tap Highlight**: `-webkit-tap-highlight-color: transparent`

## Visual Effects
- **Backdrop Blur**: `20px` on header/footer
- **Gradient Backgrounds**: 135° angle for depth
- **Soft Shadows**: Multiple layers for depth
- **Smooth Transitions**: `0.2s-0.3s` for interactions

## Implementation Notes

### Performance
- Limit message history to 100 messages
- Dynamic typing duration based on message length
- Efficient re-renders with React.memo where applicable

### Accessibility
- High contrast between text and backgrounds
- Clear focus states on interactive elements
- Semantic HTML structure
- Keyboard navigation support

### Browser Support
- Modern browsers with CSS Grid/Flexbox
- iOS Safari visual viewport API
- Webkit-specific optimizations for smooth scrolling

## Usage Examples

### Creating a New Theme Variant
```javascript
const darkTheme = {
  ...styles,
  container: {
    ...styles.container,
    background: 'linear-gradient(135deg, #1a0a0f 0%, #2d1420 100%)',
  },
  // Override other properties as needed
};
```

### Adding New Animations
```javascript
const heartbeat = `
  @keyframes heartbeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;
```

## Emotional Design Elements
- **Anticipation**: Typing indicators with variable timing
- **Delight**: Smooth transitions and playful emoji
- **Intimacy**: Soft colors and rounded corners
- **Responsiveness**: Immediate visual feedback
- **Personality**: Flirtatious pink accent throughout

This style guide ensures consistency while maintaining the seductive, engaging personality of the Bonnie Chat interface.