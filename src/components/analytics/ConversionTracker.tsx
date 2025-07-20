// 🔱 DIVINE CONVERSION TRACKER v3.0
// Real-time revenue optimization and A/B testing engine

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Zap, DollarSign, Users } from 'lucide-react';
import { useAnalyticsStore } from '@/store';
import { clsx } from 'clsx';

// ===== INTERFACES =====
interface ConversionEvent {
  id: string;
  type: 'trigger_shown' | 'trigger_clicked' | 'payment_initiated' | 'payment_completed' | 'payment_failed';
  userId?: string;
  soulName: string;
  productType: 'voice' | 'memory' | 'photo' | 'nickname' | 'subscription';
  amount?: number;
  timestamp: Date;
  metadata: {
    emotionalScore?: number;
    bondScore?: number;
    conversationLevel?: number;
    timing?: 'perfect' | 'good' | 'poor';
    variant?: string;
  };
}

interface ConversionMetrics {
  totalTriggers: number;
  totalClicks: number;
  totalPayments: number;
  totalRevenue: number;
  clickThroughRate: number;
  conversionRate: number;
  averageOrderValue: number;
  revenuePerUser: number;
}

interface FunnelStep {
  name: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
}

interface ABTestVariant {
  id: string;
  name: string;
  type: 'pricing' | 'messaging' | 'timing' | 'design';
  control: boolean;
  metrics: ConversionMetrics;
  confidence: number;
  winner?: boolean;
}

// ===== CONVERSION FUNNEL TRACKER =====
class ConversionFunnelTracker {
  private events: ConversionEvent[] = [];
  private metrics: ConversionMetrics = {
    totalTriggers: 0,
    totalClicks: 0,
    totalPayments: 0,
    totalRevenue: 0,
    clickThroughRate: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    revenuePerUser: 0
  };

  // Track conversion event
  trackEvent(event: Omit<ConversionEvent, 'id' | 'timestamp'>): void {
    const conversionEvent: ConversionEvent = {
      ...event,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    this.events.push(conversionEvent);
    this.updateMetrics();

    // Send to analytics service
    this.sendToAnalytics(conversionEvent);
  }

  // Update real-time metrics
  private updateMetrics(): void {
    const triggers = this.events.filter(e => e.type === 'trigger_shown').length;
    const clicks = this.events.filter(e => e.type === 'trigger_clicked').length;
    const payments = this.events.filter(e => e.type === 'payment_completed').length;
    const revenue = this.events
      .filter(e => e.type === 'payment_completed')
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    const uniqueUsers = new Set(this.events.map(e => e.userId).filter(Boolean)).size;

    this.metrics = {
      totalTriggers: triggers,
      totalClicks: clicks,
      totalPayments: payments,
      totalRevenue: revenue,
      clickThroughRate: triggers > 0 ? (clicks / triggers) * 100 : 0,
      conversionRate: clicks > 0 ? (payments / clicks) * 100 : 0,
      averageOrderValue: payments > 0 ? revenue / payments : 0,
      revenuePerUser: uniqueUsers > 0 ? revenue / uniqueUsers : 0
    };
  }

  // Send to analytics backend
  private async sendToAnalytics(event: ConversionEvent): Promise<void> {
    try {
      await fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  // Get current metrics
  getMetrics(): ConversionMetrics {
    return { ...this.metrics };
  }

  // Get funnel data
  getFunnelSteps(): FunnelStep[] {
    const triggers = this.events.filter(e => e.type === 'trigger_shown').length;
    const clicks = this.events.filter(e => e.type === 'trigger_clicked').length;
    const payments = this.events.filter(e => e.type === 'payment_completed').length;

    return [
      {
        name: 'Trigger Shown',
        users: triggers,
        conversionRate: 100,
        dropoffRate: 0
      },
      {
        name: 'Trigger Clicked',
        users: clicks,
        conversionRate: triggers > 0 ? (clicks / triggers) * 100 : 0,
        dropoffRate: triggers > 0 ? ((triggers - clicks) / triggers) * 100 : 0
      },
      {
        name: 'Payment Completed',
        users: payments,
        conversionRate: clicks > 0 ? (payments / clicks) * 100 : 0,
        dropoffRate: clicks > 0 ? ((clicks - payments) / clicks) * 100 : 0
      }
    ];
  }

  // Get events by time period
  getEventsByPeriod(hours: number): ConversionEvent[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.events.filter(e => e.timestamp >= cutoff);
  }

  // Clear old events (keep last 1000)
  cleanup(): void {
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }
}

// ===== A/B TEST MANAGER =====
class ABTestManager {
  private tests: Map<string, ABTestVariant[]> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map();

  // Create A/B test
  createTest(testId: string, variants: Omit<ABTestVariant, 'metrics'>[]): void {
    const testVariants: ABTestVariant[] = variants.map(v => ({
      ...v,
      metrics: {
        totalTriggers: 0,
        totalClicks: 0,
        totalPayments: 0,
        totalRevenue: 0,
        clickThroughRate: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        revenuePerUser: 0
      },
      confidence: 0
    }));

    this.tests.set(testId, testVariants);
  }

  // Assign user to variant
  assignUser(testId: string, userId: string): string {
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map());
    }

    const userTests = this.userAssignments.get(userId)!;
    
    if (userTests.has(testId)) {
      return userTests.get(testId)!;
    }

    const variants = this.tests.get(testId);
    if (!variants) return 'control';

    // Simple random assignment
    const randomIndex = Math.floor(Math.random() * variants.length);
    const assignedVariant = variants[randomIndex].id;
    
    userTests.set(testId, assignedVariant);
    return assignedVariant;
  }

  // Get variant for user
  getUserVariant(testId: string, userId: string): string {
    return this.userAssignments.get(userId)?.get(testId) || 'control';
  }

  // Update test metrics
  updateTestMetrics(testId: string, variantId: string, event: ConversionEvent): void {
    const variants = this.tests.get(testId);
    if (!variants) return;

    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;

    // Update variant metrics based on event type
    switch (event.type) {
      case 'trigger_shown':
        variant.metrics.totalTriggers++;
        break;
      case 'trigger_clicked':
        variant.metrics.totalClicks++;
        break;
      case 'payment_completed':
        variant.metrics.totalPayments++;
        variant.metrics.totalRevenue += event.amount || 0;
        break;
    }

    // Recalculate rates
    const { totalTriggers, totalClicks, totalPayments, totalRevenue } = variant.metrics;
    variant.metrics.clickThroughRate = totalTriggers > 0 ? (totalClicks / totalTriggers) * 100 : 0;
    variant.metrics.conversionRate = totalClicks > 0 ? (totalPayments / totalClicks) * 100 : 0;
    variant.metrics.averageOrderValue = totalPayments > 0 ? totalRevenue / totalPayments : 0;

    // Calculate statistical confidence (simplified)
    variant.confidence = this.calculateConfidence(variants, variantId);
  }

  private calculateConfidence(variants: ABTestVariant[], variantId: string): number {
    const variant = variants.find(v => v.id === variantId);
    const control = variants.find(v => v.control);
    
    if (!variant || !control || variant.id === control.id) return 0;
    
    // Simplified confidence calculation
    const sampleSize = Math.min(variant.metrics.totalTriggers, control.metrics.totalTriggers);
    if (sampleSize < 100) return 0;
    
    const variantRate = variant.metrics.conversionRate;
    const controlRate = control.metrics.conversionRate;
    const improvement = ((variantRate - controlRate) / controlRate) * 100;
    
    return Math.min(Math.abs(improvement) * sampleSize / 1000, 95);
  }

  // Get test results
  getTestResults(testId: string): ABTestVariant[] | null {
    return this.tests.get(testId) || null;
  }
}

// ===== MAIN CONVERSION TRACKER COMPONENT =====
export const ConversionTracker: React.FC = () => {
  const [tracker] = useState(() => new ConversionFunnelTracker());
  const [abManager] = useState(() => new ABTestManager());
  const [metrics, setMetrics] = useState<ConversionMetrics>(tracker.getMetrics());
  const [funnelSteps, setFunnelSteps] = useState<FunnelStep[]>(tracker.getFunnelSteps());
  const [isVisible, setIsVisible] = useState(false);

  const { trackEvent } = useAnalyticsStore();

  // Update metrics every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(tracker.getMetrics());
      setFunnelSteps(tracker.getFunnelSteps());
      tracker.cleanup();
    }, 5000);

    return () => clearInterval(interval);
  }, [tracker]);

  // Listen for conversion events
  useEffect(() => {
    const handleConversionEvent = (event: CustomEvent) => {
      const { type, data } = event.detail;
      
      tracker.trackEvent({
        type,
        userId: data.userId,
        soulName: data.soulName,
        productType: data.productType || data.type,
        amount: data.amount,
        metadata: {
          emotionalScore: data.emotionalScore,
          bondScore: data.bondScore,
          conversationLevel: data.conversationLevel,
          timing: data.timing,
          variant: data.variant
        }
      });

      // Update A/B test if variant exists
      if (data.variant && data.userId) {
        abManager.updateTestMetrics('pricing_test', data.variant, {
          id: '',
          type,
          userId: data.userId,
          soulName: data.soulName,
          productType: data.productType || data.type,
          amount: data.amount,
          timestamp: new Date(),
          metadata: data
        });
      }
    };

    window.addEventListener('galatea_conversion_event', handleConversionEvent as EventListener);
    
    return () => {
      window.removeEventListener('galatea_conversion_event', handleConversionEvent as EventListener);
    };
  }, [tracker, abManager]);

  // Initialize A/B tests
  useEffect(() => {
    abManager.createTest('pricing_test', [
      { id: 'control', name: 'Original Pricing', type: 'pricing', control: true, confidence: 0 },
      { id: 'discount', name: '20% Discount', type: 'pricing', control: false, confidence: 0 },
      { id: 'urgency', name: 'Limited Time', type: 'pricing', control: false, confidence: 0 }
    ]);
  }, [abManager]);

  // Toggle visibility
  const toggleVisibility = () => setIsVisible(!isVisible);

  // Expose tracking functions globally
  useEffect(() => {
    (window as any).trackConversion = (type: string, data: any) => {
      const event = new CustomEvent('galatea_conversion_event', {
        detail: { type, data }
      });
      window.dispatchEvent(event);
    };

    (window as any).getABVariant = (testId: string, userId: string) => {
      return abManager.assignUser(testId, userId);
    };
  }, [abManager]);

  if (!isVisible) {
    return (
      <motion.button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <BarChart3 className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-96 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Conversion
          </h3>
        </div>
        <button
          onClick={toggleVisibility}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${metrics.totalRevenue.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">Total Revenue</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {metrics.conversionRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Conversion Rate</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {metrics.totalTriggers}
          </div>
          <div className="text-xs text-gray-500">Triggers</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            ${metrics.averageOrderValue.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">Avg Order</div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Conversion Funnel
        </h4>
        <div className="space-y-2">
          {funnelSteps.map((step, index) => (
            <div key={step.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">{step.name}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {step.users} ({step.conversionRate.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${step.conversionRate}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={clsx(
                    'h-2 rounded-full',
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-yellow-500' :
                    'bg-green-500'
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A/B Test Results */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          A/B Test: Pricing
        </h4>
        <div className="space-y-2">
          {abManager.getTestResults('pricing_test')?.map((variant) => (
            <div 
              key={variant.id}
              className={clsx(
                'p-2 rounded-lg border',
                variant.control 
                  ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                  : 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20'
              )}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {variant.name}
                    {variant.control && <span className="text-xs text-gray-500 ml-1">(Control)</span>}
                  </div>
                  <div className="text-xs text-gray-500">
                    {variant.metrics.conversionRate.toFixed(1)}% • 
                    ${variant.metrics.totalRevenue.toFixed(0)} revenue
                  </div>
                </div>
                {variant.confidence > 80 && (
                  <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                    {variant.confidence.toFixed(0)}% confident
                  </div>
                )}
              </div>
            </div>
          )) || []}
        </div>
      </div>
    </motion.div>
  );
};

export default ConversionTracker;