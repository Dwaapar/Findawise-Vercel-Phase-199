import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, 
  Menu, 
  X, 
  Shield, 
  Zap, 
  TrendingUp, 
  Globe,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Bell,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface EmpireHeaderProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export default function EmpireHeader({ onNavigate, currentPath }: EmpireHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    {
      name: "Empire Dashboard",
      path: "/empire",
      icon: Crown,
      description: "Command center for your digital empire"
    },
    {
      name: "Revenue Streams",
      path: "/revenue",
      icon: TrendingUp,
      description: "Multi-vertical monetization"
    },
    {
      name: "Security Center",
      path: "/security",
      icon: Shield,
      description: "Enterprise-grade protection"
    },
    {
      name: "AI Brain",
      path: "/ai-center",
      icon: Zap,
      description: "Autonomous intelligence hub"
    },
    {
      name: "Global Markets",
      path: "/markets",
      icon: Globe,
      description: "Worldwide expansion"
    }
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Empire Logo */}
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onNavigate("/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <Crown className="h-8 w-8 text-yellow-400" />
                <motion.div
                  className="absolute -inset-2 bg-yellow-400/20 rounded-full blur-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                  Findawise
                </span>
                <span className="text-xs text-gray-400 -mt-1">
                  Empire
                </span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <motion.div key={item.path} className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                          currentPath === item.path
                            ? "bg-white/10 text-yellow-400 shadow-lg"
                            : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.name}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-64 bg-black/90 backdrop-blur-xl border-white/10"
                    >
                      <DropdownMenuItem 
                        onClick={() => onNavigate(item.path)}
                        className="cursor-pointer hover:bg-white/10"
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-400">
                            {item.description}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Enterprise Search */}
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search empire..."
                  className="w-64 pl-10 pr-4 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:ring-yellow-400/50 focus:border-yellow-400/50"
                />
              </div>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative text-gray-300 hover:text-white hover:bg-white/5"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-black" />
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-black/90 backdrop-blur-xl border-white/10"
                  align="end"
                >
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                    <Settings className="h-4 w-4 mr-2" />
                    Empire Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-white/10 text-red-400">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-2">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      currentPath === item.path
                        ? "bg-white/10 text-yellow-400"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Header Spacer */}
      <div className="h-16" />
    </>
  );
}