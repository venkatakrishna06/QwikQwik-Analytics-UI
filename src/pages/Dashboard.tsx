import {useEffect, useState, useRef} from 'react';
import {Loader2, BarChart3, Menu} from 'lucide-react';
import {analyticsService} from '@/lib/api/services/analytics.service';
import {toast} from 'sonner';
import {cn} from '@/lib/utils';
import {useMediaQuery} from '@/hooks/use-media-query';

type DashboardTab = 'sales' | 'menu_items' | 'staff_performance' | 'table_utilisation' | 'payment_methods' | 'hourly-sales' | 'customers';

const TABS: { id: DashboardTab; label: string }[] = [
  { id: 'sales', label: 'Sales' },
  { id: 'menu_items', label: 'Menu Items' },
  { id: 'staff_performance', label: 'Staff' },
  { id: 'table_utilisation', label: 'Tables' },
  { id: 'payment_methods', label: 'Payment Methods' },

];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('sales');
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Responsive state
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  // Ref for the dashboard container
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Fetch embed URL when active tab changes
  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make API call to get embed URL for the selected dashboard
        const response = await analyticsService.getEmbedUrl(activeTab);

        if (response) {
          setEmbedUrl(response.iframeUrl);
        } else {
          setError('Failed to load dashboard');
          toast.error( 'Failed to load dashboard');
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center mb-2">
          <BarChart3 className="mr-2 h-6 w-6 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">View and analyze your business performance metrics</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        {isMobile ? (
          <div className="relative">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all"
            >
              <span className="font-medium flex items-center">
                <span className="w-5 h-5 mr-2 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                </span>
                {TABS.find(tab => tab.id === activeTab)?.label || 'Select Dashboard'}
              </span>
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>

            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border shadow-lg z-10">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors",
                      activeTab === tab.id ? "bg-primary/5 font-medium text-primary" : "text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-6 py-3 text-sm font-medium whitespace-nowrap transition-all focus:outline-none relative",
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Content */}
      <div 
        ref={dashboardRef}
        className="rounded-lg border bg-card shadow-md overflow-hidden relative"
        style={{ 
          height: isMobile ? 'calc(100vh - 220px)' : isTablet ? 'calc(100vh - 200px)' : 'calc(100vh - 180px)',
          minHeight: '400px'
        }}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm">
            <div className="flex flex-col items-center p-6 rounded-lg">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <span className="text-lg font-medium">Loading dashboard...</span>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-red-100 p-4 text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Failed to load dashboard</h3>
            <p className="text-muted-foreground mt-2 max-w-md">{error}</p>
            <button 
              className="mt-6 px-5 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm"
              onClick={() => setActiveTab(activeTab)} // Re-fetch the current tab
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="w-full h-full">
            {embedUrl && (
              <iframe 
                src={embedUrl} 
                className="w-full h-full border-0" 
                title={`${activeTab} Dashboard`}
                allowFullScreen
              ></iframe>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
