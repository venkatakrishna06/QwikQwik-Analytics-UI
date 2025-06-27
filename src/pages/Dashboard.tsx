import {useEffect, useState} from 'react';
import {ChevronDown, Loader2} from 'lucide-react';
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

  // Check if the screen is mobile-sized
  const isMobile = useMediaQuery('(max-width: 768px)');

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
    <div>
      {/* Tab Navigation */}
      <div className="border-b">
        {isMobile ? (
          // Mobile dropdown navigation
          <div className="p-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium border rounded-md bg-background hover:bg-muted/50 transition-colors focus:outline-none">
                {TABS.find(tab => tab.id === activeTab)?.label || 'Select Dashboard'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                {TABS.map((tab) => (
                  <DropdownMenuItem
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "cursor-pointer",
                      activeTab === tab.id && "bg-muted font-medium"
                    )}
                  >
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          // Desktop horizontal tabs
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus:outline-none",
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dashboard Content */}
      <div className="rounded-lg border mt-2 bg-card shadow-sm min-h-[600px] relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading dashboard...</span>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              onClick={() => setActiveTab(activeTab)} // Re-fetch the current tab
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="w-full h-[600px]">
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
