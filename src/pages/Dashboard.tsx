import {useEffect, useState} from 'react';
import {ChevronDown, Loader2, BarChart3, Users, Utensils, Table, CreditCard, Clock, UserCheck, TrendingUp, Activity} from 'lucide-react';
import {analyticsService} from '@/lib/api/services/analytics.service';
import {toast} from 'sonner';
import {cn} from '@/lib/utils';
import {useMediaQuery} from '@/lib/hooks/useMediaQuery';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';

type DashboardTab = 'sales' | 'menu_items' | 'staff_performance' | 'table_utilisation' | 'payment_methods' | 'hourly-sales' | 'customers';

const TABS: { 
  id: DashboardTab; 
  label: string; 
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}[] = [
  { 
    id: 'sales', 
    label: 'Sales Analytics', 
    description: 'Revenue trends and performance metrics',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100'
  },
  { 
    id: 'menu_items', 
    label: 'Menu Performance', 
    description: 'Popular dishes and item analytics',
    icon: Utensils,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100'
  },
  { 
    id: 'staff_performance', 
    label: 'Staff Performance', 
    description: 'Team productivity and efficiency',
    icon: UserCheck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  { 
    id: 'table_utilisation', 
    label: 'Table Utilization', 
    description: 'Seating efficiency and turnover rates',
    icon: Table,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100'
  },
  { 
    id: 'payment_methods', 
    label: 'Payment Methods', 
    description: 'Transaction types and preferences',
    icon: CreditCard,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100'
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('sales');
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if the screen is mobile-sized
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  // Get current tab data
  const currentTab = TABS.find(tab => tab.id === activeTab);

  // Fetch embed URL when active tab changes
  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make API call to get embed URL for the selected dashboard
        const response = await analyticsService.getEmbedUrl(activeTab);

        if (response && response.iframeUrl) {
          setEmbedUrl(response.iframeUrl);
        } else {
          setError('Failed to load dashboard');
          toast.error('Failed to load dashboard');
        }
      } catch (err) {
        setError('An error occurred while loading the dashboard');
        toast.error('An error occurred while loading the dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedUrl();
  }, [activeTab]);

  const handleTabChange = (tabId: DashboardTab) => {
    setActiveTab(tabId);
  };

  const handleRetry = () => {
    setActiveTab(activeTab); // This will trigger the useEffect to refetch
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Monitor your restaurant's performance with real-time insights
        </p>
      </div>

      {/* Analytics Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Select Analytics View
          </h2>
          {currentTab && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <currentTab.icon className={cn("h-4 w-4", currentTab.color)} />
              <span>Currently viewing: {currentTab.label}</span>
            </div>
          )}
        </div>

        {isMobile ? (
          // Mobile dropdown navigation
          <div className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-auto p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    {currentTab && (
                      <>
                        <div className={cn("p-2 rounded-lg", currentTab.bgColor)}>
                          <currentTab.icon className={cn("h-5 w-5", currentTab.color)} />
                        </div>
                        <div>
                          <div className="font-medium">{currentTab.label}</div>
                          <div className="text-sm text-gray-500">{currentTab.description}</div>
                        </div>
                      </>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[300px]">
                {TABS.map((tab) => (
                  <DropdownMenuItem
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "cursor-pointer p-3",
                      activeTab === tab.id && "bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={cn("p-2 rounded-lg", tab.bgColor)}>
                        <tab.icon className={cn("h-4 w-4", tab.color)} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs text-gray-500">{tab.description}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          // Desktop grid layout
          <div className={cn(
            "grid gap-4",
            isTablet ? "grid-cols-2" : "grid-cols-3 xl:grid-cols-5"
          )}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "group relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  "hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  activeTab === tab.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={cn(
                    "p-3 rounded-xl transition-colors",
                    activeTab === tab.id ? tab.bgColor : "bg-gray-50 dark:bg-gray-800 group-hover:" + tab.bgColor.split(' ')[1]
                  )}>
                    <tab.icon className={cn(
                      "h-6 w-6 transition-colors",
                      activeTab === tab.id ? tab.color : "text-gray-600 dark:text-gray-400"
                    )} />
                  </div>
                  <div>
                    <h3 className={cn(
                      "font-semibold text-sm transition-colors",
                      activeTab === tab.id ? "text-primary" : "text-gray-900 dark:text-white"
                    )}>
                      {tab.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {tab.description}
                    </p>
                  </div>
                </div>
                
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-white dark:border-gray-900" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dashboard Content */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Content Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentTab && (
                <>
                  <div className={cn("p-2 rounded-lg", currentTab.bgColor)}>
                    <currentTab.icon className={cn("h-5 w-5", currentTab.color)} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentTab.label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentTab.description}
                    </p>
                  </div>
                </>
              )}
            </div>
            
            {!loading && !error && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative" style={{ minHeight: '600px' }}>
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                  <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Loading Analytics
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Preparing your {currentTab?.label.toLowerCase()} dashboard...
                  </p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <svg 
                    className="h-8 w-8 text-red-600 dark:text-red-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Unable to Load Dashboard
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {error}
                </p>
                <Button 
                  onClick={handleRetry}
                  className="flex items-center gap-2"
                >
                  <Activity className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full" style={{ height: '600px' }}>
              {embedUrl && (
                <iframe 
                  src={embedUrl} 
                  className="w-full h-full border-0" 
                  title={`${currentTab?.label} Dashboard`}
                  allowFullScreen
                  loading="lazy"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}