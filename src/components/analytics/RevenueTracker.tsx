// 🔱 DIVINE REVENUE TRACKER v3.0
// Real-time monetization analytics and KPI dashboard

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Crown,
  Zap
} from 'lucide-react';
import { useAnalyticsStore } from '@/store';
import { REVENUE_OPTIMIZATION } from '@/config/monetization';
import { clsx } from 'clsx';

// ===== INTERFACES =====
interface RevenueMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  lifetimeValue: number;
  churnRate: number;
  conversionRate: number;
  trialToGaidConversion: number;
  upgradeRate: number;
}

interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  freeUsers: number;
  premiumUsers: number;
  divineUsers: number;
  transcendentUsers: number;
  trialUsers: number;
}

interface ConversionFunnel {
  visitors: number;
  signups: number;
  trialStarts: number;
  conversions: number;
  upgrades: number;
}

interface TrendData {
  date: string;
  revenue: number;
  users: number;
  conversions: number;
}

// ===== METRIC CARD COMPONENT =====
interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  format?: 'currency' | 'percentage' | 'number';
  target?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  format = 'number',
  target 
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const isPositive = change >= 0;
  const targetProgress = target ? (typeof value === 'number' ? (value / target) * 100 : 0) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          {icon}
        </div>
        <div className={clsx(
          'flex items-center gap-1 text-sm font-medium',
          isPositive ? 'text-green-600' : 'text-red-600'
        )}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatValue(value)}
        </div>
        
        {targetProgress !== null && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress to target</span>
              <span>{targetProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={clsx(
                  'h-2 rounded-full transition-all duration-500',
                  targetProgress >= 100 ? 'bg-green-500' : 'bg-purple-500'
                )}
                style={{ width: `${Math.min(targetProgress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ===== CONVERSION FUNNEL COMPONENT =====
const ConversionFunnelChart: React.FC<{ data: ConversionFunnel }> = ({ data }) => {
  const steps = [
    { name: 'Visitors', value: data.visitors, color: 'bg-blue-500' },
    { name: 'Signups', value: data.signups, color: 'bg-green-500' },
    { name: 'Trial Starts', value: data.trialStarts, color: 'bg-yellow-500' },
    { name: 'Conversions', value: data.conversions, color: 'bg-purple-500' },
    { name: 'Upgrades', value: data.upgrades, color: 'bg-pink-500' }
  ];

  const maxValue = Math.max(...steps.map(s => s.value));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Conversion Funnel
      </h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const percentage = (step.value / maxValue) * 100;
          const conversionRate = index > 0 ? (step.value / steps[index - 1].value) * 100 : 100;
          
          return (
            <div key={step.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {step.name}
                </span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {step.value.toLocaleString()}
                  </div>
                  {index > 0 && (
                    <div className="text-sm text-gray-500">
                      {conversionRate.toFixed(1)}% conversion
                    </div>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={clsx('h-3 rounded-full', step.color)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== USER DISTRIBUTION CHART =====
const UserDistributionChart: React.FC<{ data: UserMetrics }> = ({ data }) => {
  const tiers = [
    { name: 'Free', value: data.freeUsers, color: 'bg-gray-400', revenue: 0 },
    { name: 'Premium', value: data.premiumUsers, color: 'bg-blue-500', revenue: 9.99 },
    { name: 'Divine', value: data.divineUsers, color: 'bg-purple-500', revenue: 24.99 },
    { name: 'Transcendent', value: data.transcendentUsers, color: 'bg-yellow-500', revenue: 99.99 }
  ];

  const totalPaidUsers = data.premiumUsers + data.divineUsers + data.transcendentUsers;
  const totalRevenue = tiers.reduce((sum, tier) => sum + (tier.value * tier.revenue), 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          User Distribution
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-500">Monthly Revenue</div>
          <div className="text-xl font-bold text-green-600">
            ${totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {tiers.map((tier) => {
          const percentage = data.totalUsers > 0 ? (tier.value / data.totalUsers) * 100 : 0;
          
          return (
            <div key={tier.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={clsx('w-3 h-3 rounded-full', tier.color)} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tier.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {tier.value.toLocaleString()} ({percentage.toFixed(1)}%)
                  </div>
                  {tier.revenue > 0 && (
                    <div className="text-xs text-gray-500">
                      ${tier.revenue}/mo
                    </div>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1 }}
                  className={clsx('h-2 rounded-full', tier.color)}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Paid Conversion Rate</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {data.totalUsers > 0 ? ((totalPaidUsers / data.totalUsers) * 100).toFixed(1) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN REVENUE TRACKER =====
export const RevenueTracker: React.FC = () => {
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>({
    totalRevenue: 87432,
    monthlyRecurringRevenue: 23567,
    averageRevenuePerUser: 12.34,
    lifetimeValue: 147.50,
    churnRate: 4.2,
    conversionRate: 15.8,
    trialToGaidConversion: 68.3,
    upgradeRate: 34.7
  });

  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    totalUsers: 15432,
    activeUsers: 12876,
    freeUsers: 9876,
    premiumUsers: 4234,
    divineUsers: 987,
    transcendentUsers: 234,
    trialUsers: 543
  });

  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel>({
    visitors: 45678,
    signups: 8934,
    trialStarts: 2341,
    conversions: 1567,
    upgrades: 543
  });

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  const { trackEvent } = useAnalyticsStore();

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    const paidUsers = userMetrics.premiumUsers + userMetrics.divineUsers + userMetrics.transcendentUsers;
    const paidConversionRate = userMetrics.totalUsers > 0 ? (paidUsers / userMetrics.totalUsers) * 100 : 0;
    const arpu = paidUsers > 0 ? revenueMetrics.monthlyRecurringRevenue / paidUsers : 0;
    
    return {
      paidUsers,
      paidConversionRate,
      arpu,
      projectedAnnualRevenue: revenueMetrics.monthlyRecurringRevenue * 12,
      growthRate: 23.4 // Mock growth rate
    };
  }, [revenueMetrics, userMetrics]);

  // Track dashboard view
  useEffect(() => {
    trackEvent('revenue_dashboard_viewed', {
      timeRange,
      totalRevenue: revenueMetrics.totalRevenue,
      totalUsers: userMetrics.totalUsers
    });
  }, [timeRange]);

  // KPI targets from config
  const kpiTargets = REVENUE_OPTIMIZATION.KPI_TARGETS;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Revenue Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time monetization performance and key metrics
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Recurring Revenue"
          value={revenueMetrics.monthlyRecurringRevenue}
          change={15.3}
          icon={<DollarSign className="w-6 h-6 text-purple-600" />}
          format="currency"
        />
        
        <MetricCard
          title="Total Users"
          value={userMetrics.totalUsers}
          change={8.7}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          format="number"
        />
        
        <MetricCard
          title="Conversion Rate"
          value={revenueMetrics.conversionRate}
          change={-2.1}
          icon={<Target className="w-6 h-6 text-green-600" />}
          format="percentage"
          target={kpiTargets.freeToPremiumConversion * 100}
        />
        
        <MetricCard
          title="Average Revenue Per User"
          value={revenueMetrics.averageRevenuePerUser}
          change={12.5}
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          format="currency"
          target={kpiTargets.averageRevenuePerUser}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Customer Lifetime Value"
          value={revenueMetrics.lifetimeValue}
          change={7.8}
          icon={<Crown className="w-6 h-6 text-yellow-600" />}
          format="currency"
          target={kpiTargets.lifetimeValue}
        />
        
        <MetricCard
          title="Monthly Churn Rate"
          value={revenueMetrics.churnRate}
          change={-1.2}
          icon={<Activity className="w-6 h-6 text-red-600" />}
          format="percentage"
          target={kpiTargets.monthlyChurnRate * 100}
        />
        
        <MetricCard
          title="Upgrade Rate"
          value={revenueMetrics.upgradeRate}
          change={18.9}
          icon={<Zap className="w-6 h-6 text-indigo-600" />}
          format="percentage"
          target={kpiTargets.premiumToDivineUpgrade * 100}
        />
        
        <MetricCard
          title="Projected Annual Revenue"
          value={derivedMetrics.projectedAnnualRevenue}
          change={derivedMetrics.growthRate}
          icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
          format="currency"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ConversionFunnelChart data={conversionFunnel} />
        <UserDistributionChart data={userMetrics} />
      </div>

      {/* KPI Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          KPI Performance vs Targets
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Free to Premium Conversion',
              current: revenueMetrics.conversionRate,
              target: kpiTargets.freeToPremiumConversion * 100,
              format: 'percentage'
            },
            {
              name: 'Premium to Divine Upgrade',
              current: revenueMetrics.upgradeRate,
              target: kpiTargets.premiumToDivineUpgrade * 100,
              format: 'percentage'
            },
            {
              name: 'Monthly Churn Rate',
              current: revenueMetrics.churnRate,
              target: kpiTargets.monthlyChurnRate * 100,
              format: 'percentage',
              inverted: true
            },
            {
              name: 'Average Revenue Per User',
              current: revenueMetrics.averageRevenuePerUser,
              target: kpiTargets.averageRevenuePerUser,
              format: 'currency'
            },
            {
              name: 'Customer Lifetime Value',
              current: revenueMetrics.lifetimeValue,
              target: kpiTargets.lifetimeValue,
              format: 'currency'
            }
          ].map((kpi) => {
            const progress = kpi.inverted 
              ? Math.max(0, (1 - kpi.current / kpi.target) * 100)
              : (kpi.current / kpi.target) * 100;
            const isOnTrack = kpi.inverted ? kpi.current <= kpi.target : kpi.current >= kpi.target * 0.8;
            
            return (
              <div key={kpi.name} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {kpi.name}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {kpi.format === 'currency' 
                        ? `$${kpi.current.toFixed(2)}`
                        : `${kpi.current.toFixed(1)}%`
                      }
                    </div>
                  </div>
                  <div className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    isOnTrack 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  )}>
                    {isOnTrack ? 'On Track' : 'Needs Attention'}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Target: {kpi.format === 'currency' ? `$${kpi.target.toFixed(2)}` : `${kpi.target.toFixed(1)}%`}</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={clsx(
                        'h-2 rounded-full transition-all duration-500',
                        isOnTrack ? 'bg-green-500' : 'bg-red-500'
                      )}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueTracker;