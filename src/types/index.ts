// 🔱 DIVINE TYPE DEFINITIONS v3.0
// Comprehensive TypeScript types for enterprise-grade type safety

// ===== CORE TYPES =====
export type ID = string;
export type Timestamp = string; // ISO 8601 format
export type URL = string;
export type Email = string;
export type Currency = 'usd' | 'eur' | 'gbp' | 'jpy';

// ===== USER TYPES =====
export interface User {
  id: ID;
  email: Email;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: URL;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  isVerified: boolean;
  subscription?: Subscription;
  preferences: UserPreferences;
  metadata: Record<string, unknown>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  chatSettings: ChatSettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  dataSharing: boolean;
  analytics: boolean;
}

export interface ChatSettings {
  autoSave: boolean;
  typingIndicators: boolean;
  readReceipts: boolean;
  soundEffects: boolean;
}

// ===== AUTHENTICATION TYPES =====
export interface LoginCredentials {
  email: Email;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: Email;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username: string;
  agreeToTerms: boolean;
  subscribeToNewsletter?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ===== SOUL TYPES =====
export type SoulRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Divine';
export type BondType = 'Pure Love' | 'Power Exchange' | 'Mystic Bond' | 'Cosmic Unity';
export type ChatTheme = 'heavenly' | 'dark' | 'mystic' | 'cosmic' | 'elegant';

export interface Soul {
  id: ID;
  name: string;
  title: string;
  rarity: SoulRarity;
  bondType: BondType;
  essence: string;
  quote: string;
  seductionLine: string;
  personalityTraits: string[];
  color: string;
  gradient: string;
  darkGradient: string;
  aura: string;
  glowColor: string;
  imageUrl: URL;
  icon: string;
  route: string;
  personality: string;
  promise: string;
  description: string;
  voiceStyle: string;
  chatTheme: ChatTheme;
  isLocked?: boolean;
  unlockPrice?: number;
  popularity: number;
  rating: number;
  metadata: SoulMetadata;
}

export interface SoulMetadata {
  conversationCount: number;
  averageSessionLength: number;
  userSatisfactionScore: number;
  lastUpdated: Timestamp;
  features: string[];
  tags: string[];
}

// ===== CHAT TYPES =====
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'file' | 'system';
export type MessageSender = 'user' | 'ai' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: ID;
  conversationId: ID;
  content: string;
  sender: MessageSender;
  type: MessageType;
  timestamp: Timestamp;
  status: MessageStatus;
  metadata?: MessageMetadata;
  replyTo?: ID;
  reactions?: MessageReaction[];
}

export interface MessageMetadata {
  editedAt?: Timestamp;
  deletedAt?: Timestamp;
  fileSize?: number;
  fileName?: string;
  mimeType?: string;
  duration?: number; // for audio/video
  dimensions?: { width: number; height: number }; // for images/video
  aiModel?: string;
  processingTime?: number;
  confidence?: number;
}

export interface MessageReaction {
  emoji: string;
  userId: ID;
  timestamp: Timestamp;
}

export interface Conversation {
  id: ID;
  soulId: ID;
  userId: ID;
  title?: string;
  lastMessageAt: Timestamp;
  messageCount: number;
  isArchived: boolean;
  isPinned: boolean;
  metadata: ConversationMetadata;
}

export interface ConversationMetadata {
  sessionLength: number;
  mood: 'positive' | 'neutral' | 'negative';
  topics: string[];
  summary?: string;
  lastActivity: Timestamp;
}

export interface TypingStatus {
  isTyping: boolean;
  userId?: ID;
  timestamp: Timestamp;
}

// ===== PAYMENT TYPES =====
export interface PaymentIntent {
  id: ID;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  clientSecret: string;
  createdAt: Timestamp;
  metadata: Record<string, string>;
}

export type PaymentStatus = 
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

export interface PaymentMethod {
  id: ID;
  type: 'card' | 'bank_account' | 'wallet';
  card?: PaymentCard;
  isDefault: boolean;
  createdAt: Timestamp;
}

export interface PaymentCard {
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  country?: string;
}

export interface Subscription {
  id: ID;
  status: SubscriptionStatus;
  priceId: string;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Timestamp;
  plan: SubscriptionPlan;
}

export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: Currency;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}

// ===== UI TYPES =====
export type Theme = 'light' | 'dark' | 'system';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type ModalType = 'payment' | 'settings' | 'profile' | 'confirmation' | 'soul-details';

export interface Notification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: NotificationAction;
  metadata?: Record<string, unknown>;
  timestamp: Timestamp;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface Modal {
  id: string;
  type: ModalType;
  props: Record<string, unknown>;
  isOpen: boolean;
}

// ===== API TYPES =====
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data: T;
  message?: string;
  errors?: ValidationError[];
  metadata?: ResponseMetadata;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: Timestamp;
  version: string;
  rateLimit?: RateLimit;
  pagination?: Pagination;
}

export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

// ===== ERROR TYPES =====
export interface AppError {
  name: string;
  message: string;
  statusCode: number;
  isOperational: boolean;
  metadata: Record<string, unknown>;
  timestamp: Timestamp;
  stack?: string;
}

// ===== ANALYTICS TYPES =====
export interface AnalyticsEvent {
  id: ID;
  name: string;
  properties: Record<string, unknown>;
  userId?: ID;
  sessionId: string;
  timestamp: Timestamp;
  url: string;
}

export interface UserSession {
  id: ID;
  userId?: ID;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration?: number;
  pageViews: number;
  events: AnalyticsEvent[];
  device: DeviceInfo;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  browser: string;
  version: string;
  isMobile: boolean;
  screenResolution: string;
  timezone: string;
}

// ===== WEBSOCKET TYPES =====
export type WebSocketEventType = 
  | 'message'
  | 'typing_start'
  | 'typing_stop'
  | 'user_online'
  | 'user_offline'
  | 'connection_error';

export interface WebSocketEvent {
  type: WebSocketEventType;
  payload: Record<string, unknown>;
  timestamp: Timestamp;
}

// ===== FORM TYPES =====
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: FormOption[];
}

export interface FormOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number;
  message: string;
  validator?: (value: unknown) => boolean;
}

// ===== UTILITY TYPES =====
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Partial<T> = {
  [P in keyof T]?: T[P];
};
export type Required<T> = {
  [P in keyof T]-?: T[P];
};
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ===== STORE TYPES =====
export interface StoreState {
  user: UserState;
  chat: ChatState;
  ui: UIState;
  payment: PaymentState;
  analytics: AnalyticsState;
}

export interface UserState {
  user: Nullable<User>;
  isAuthenticated: boolean;
  subscription: Nullable<Subscription>;
  isLoading: boolean;
  error: Nullable<string>;
}

export interface ChatState {
  activeSoul: Nullable<Soul>;
  conversations: Record<ID, Message[]>;
  isTyping: boolean;
  error: Nullable<string>;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
}

export interface UIState {
  theme: Theme;
  isMobile: boolean;
  sidebarOpen: boolean;
  modalStack: Modal[];
  notifications: Notification[];
  isLoading: boolean;
}

export interface PaymentState {
  isProcessing: boolean;
  paymentIntent: Nullable<PaymentIntent>;
  subscription: Nullable<Subscription>;
  error: Nullable<string>;
}

export interface AnalyticsState {
  events: AnalyticsEvent[];
  sessionId: Nullable<string>;
  userId: Nullable<ID>;
}

// ===== HOOK TYPES =====
export interface UseApiOptions {
  retry?: number;
  retryDelay?: number;
  timeout?: number;
  cache?: boolean;
  cacheTime?: number;
}

export interface UseApiResult<T> {
  data: Nullable<T>;
  loading: boolean;
  error: Nullable<AppError>;
  refetch: () => Promise<void>;
  mutate: (data: Partial<T>) => void;
}

// ===== COMPONENT TYPES =====
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

// ===== ENVIRONMENT TYPES =====
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  VITE_API_URL: string;
  VITE_STRIPE_PUBLIC_KEY: string;
  VITE_ANALYTICS_ID?: string;
  VITE_SENTRY_DSN?: string;
  VITE_APP_VERSION: string;
}