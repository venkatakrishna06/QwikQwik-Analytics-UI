import {useEffect, useState} from 'react';
import {ChevronDown, Utensils, Table, CreditCard, UserCheck, TrendingUp, Activity, Sparkles, BarChart3, RefreshCw} from 'lucide-react';
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
  gradient: string;
  color: string;
  bgColor: string;
  hoverColor: string;
}[] = [
  { 
    id: 'sales', 
    label: 'Sales Analytics', 
    description: 'Revenue trends and performance metrics',
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-600',
    color: 'text-emerald-600',
    bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    hoverColor: 'hover:from-emerald-100 hover:to-teal-100'
  },
  { 
    id: 'menu_items', 
    label: 'Menu Performance', 
    description: 'Popular dishes and item analytics',
    icon: Utensils,
    gradient: 'from-orange-500 to-red-500',
    color: 'text-orange-600',
    bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
    hoverColor: 'hover:from-orange-100 hover:to-red-100'
  },
  { 
    id: 'staff_performance', 
    label: 'Staff Performance', 
    description: 'Team productivity and efficiency',
    icon: UserCheck,
    gradient: 'from-blue-500 to-indigo-600',
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    hoverColor: 'hover:from-blue-100 hover:to-indigo-100'
  },
  { 
    id: 'table_utilisation', 
    label: 'Table Utilization', 
    description: 'Seating efficiency and turnover rates',
    icon: Table,
    gradient: 'from-purple-500 to-pink-500',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    hoverColor: 'hover:from-purple-100 hover:to-pink-100'
  },
  { 
    id: 'payment_methods', 
    label: 'Payment Methods', 
    description: 'Transaction types and preferences',
    icon: CreditCard,
    gradient: 'from-indigo-500 to-purple-600',
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
    hoverColor: 'hover:from-indigo-100 hover:to-purple-100'
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('sales');
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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

  const handleRetry = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
    setActiveTab(activeTab); // This will trigger the useEffect to refetch
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative rounded-3xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <BarChart3 className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <p className="text-blue-100 text-lg">
                  Monitor your restaurant's performance with real-time insights
                </p>
              </div>
            </div>
          </div>
          
          {/* Floating stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-green-300" />
                <div>
                  <p className="text-sm text-blue-100">Live Analytics</p>
                  <p className="text-lg font-semibold">Real-time Data</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-blue-300" />
                <div>
                  <p className="text-sm text-blue-100">Dashboard Views</p>
                  <p className="text-lg font-semibold">{TABS.length} Available</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-yellow-300" />
                <div>
                  <p className="text-sm text-blue-100">Status</p>
                  <p className="text-lg font-semibold">All Systems Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Selection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Choose Your Analytics View
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Select from our comprehensive analytics dashboards to gain insights into your business
            </p>
          </div>
          {currentTab && (
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full">
              <div className={cn("p-1.5 rounded-lg", currentTab.bgColor)}>
                <currentTab.icon className={cn("h-4 w-4", currentTab.color)} />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentTab.label}
              </span>
            </div>
          )}
        </div>

        {isMobile ? (
          // Enhanced Mobile dropdown navigation
          <div className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-auto p-6 text-left border-2 hover:border-primary/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    {currentTab && (
                      <>
                        <div className={cn("p-3 rounded-xl", currentTab.bgColor)}>
                          <currentTab.icon className={cn("h-6 w-6", currentTab.color)} />
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{currentTab.label}</div>
                          <div className="text-sm text-gray-500">{currentTab.description}</div>
                        </div>
                      </>
                    )}
                  </div>
                  <ChevronDown className="h-5 w-5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[350px]">
                {TABS.map((tab) => (
                  <DropdownMenuItem
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "cursor-pointer p-4 transition-all duration-200",
                      activeTab === tab.id && "bg-primary/5 border-l-4 border-primary"
                    )}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className={cn("p-3 rounded-xl", tab.bgColor)}>
                        <tab.icon className={cn("h-5 w-5", tab.color)} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{tab.label}</div>
                        <div className="text-xs text-gray-500">{tab.description}</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          // Enhanced Desktop grid layout
          <div className={cn(
            "grid gap-6",
            isTablet ? "grid-cols-2" : "grid-cols-3 xl:grid-cols-5"
          )}>
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left",
                  "hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/20",
                  "transform-gpu will-change-transform",
                  activeTab === tab.id
                    ? "border-primary bg-primary/5 shadow-xl scale-105"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/30 shadow-lg"
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Background gradient overlay */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  tab.bgColor,
                  tab.hoverColor
                )} />
                
                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className={cn(
                    "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110",
                    activeTab === tab.id 
                      ? `bg-gradient-to-br ${tab.gradient} text-white shadow-lg` 
                      : `${tab.bgColor} group-hover:shadow-lg`
                  )}>
                    <tab.icon className={cn(
                      "h-8 w-8 transition-all duration-300",
                      activeTab === tab.id ? "text-white" : tab.color
                    )} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className={cn(
                      "font-bold text-base transition-colors duration-300",
                      activeTab === tab.id ? "text-primary" : "text-gray-900 dark:text-white group-hover:text-primary"
                    )}>
                      {tab.label}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {tab.description}
                    </p>
                  </div>
                </div>
                
                {/* Active indicator with pulse animation */}
                {activeTab === tab.id && (
                  <div className="absolute -top-2 -right-2">
                    <div className="relative">
                      <div className="h-4 w-4 bg-primary rounded-full border-2 border-white dark:border-gray-900" />
                      <div className="absolute inset-0 h-4 w-4 bg-primary rounded-full animate-ping opacity-75" />
                    </div>
                  </div>
                )}

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Dashboard Content */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
        {/* Enhanced Content Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {currentTab && (
                  <>
                    <div className={cn(
                      "p-3 rounded-2xl shadow-lg",
                      `bg-gradient-to-br ${currentTab.gradient} text-white`
                    )}>
                      <currentTab.icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentTab.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                  disabled={isRefreshing}
                  className="flex items-center gap-2 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Content Area */}
        <div className="relative" style={{ minHeight: '650px' }}>
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                  <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  <div className="absolute top-2 left-2 h-16 w-16 rounded-full border-4 border-purple-300 border-t-transparent animate-spin animation-delay-150"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Loading Analytics
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Preparing your {currentTab?.label.toLowerCase()} dashboard...
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-4">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce animation-delay-100"></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce animation-delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="mx-auto mb-8 h-20 w-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center shadow-lg">
                  <svg 
                    className="h-10 w-10 text-red-600 dark:text-red-400" 
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Unable to Load Dashboard
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                  {error}
                </p>
                <Button 
                  onClick={handleRetry}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-3 text-lg"
                >
                  <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
                  {isRefreshing ? 'Retrying...' : 'Try Again'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full" style={{ height: '650px' }}>
              {embedUrl && (
                <iframe 
                  src={embedUrl} 
                  className="w-full h-full border-0 transition-opacity duration-500 opacity-100" 
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