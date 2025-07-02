import {LogOut, User, Settings, Bell, Search, Menu, X, BarChart3, Sparkles} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import {Button} from './ui/button';
import {useState} from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Brand Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Animated Logo */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative p-3 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
              </div>
              
              {/* Brand Text */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    Analytics
                  </h1>
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Restaurant Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Center Section - Search (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search analytics, reports, insights..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Right Section - User Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-11 w-11 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-11 w-11 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-11 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-white">
                          {user?.staff?.name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    </div>
                    
                    {/* User Info (Desktop) */}
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.staff?.name || user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user?.role || 'Staff'}
                      </p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-64 p-2">
                {/* User Info Header */}
                <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-white">
                        {user?.staff?.name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user?.staff?.name || user?.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mt-1 capitalize">
                        {user?.role || 'Staff'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>Preferences</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-2" />
                
                {/* Logout */}
                <DropdownMenuItem 
                  onClick={logout}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search analytics..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              {/* Mobile User Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">
                    {user?.staff?.name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user?.staff?.name || user?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role || 'Staff'}
                  </p>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <User className="h-4 w-4" />
                  Profile Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <Settings className="h-4 w-4" />
                  Preferences
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                  <Bell className="h-4 w-4" />
                  Notifications
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="w-full justify-start gap-3 h-12 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}