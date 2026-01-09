import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  UserCog,
  BarChart3,
  Calculator,
  Bell,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Bookings',
    url: '/admin/bookings',
    icon: Package,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Delivery Agents',
    url: '/admin/agents',
    icon: Truck,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: BarChart3,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Pricing Calculator',
    url: '/admin/pricing',
    icon: Calculator,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Notifications',
    url: '/admin/notifications',
    icon: Bell,
    roles: ['super_admin', 'admin'],
  },
  {
    title: 'Admin Users',
    url: '/admin/users',
    icon: UserCog,
    roles: ['super_admin'],
  },
];

export const AdminSidebar = () => {
  const { user, logout, hasPermission } = useAdminAuth();
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const visibleItems = menuItems.filter(item =>
    item.roles.some(role => hasPermission(role as any))
  );

  return (
    <Sidebar collapsible="icon" className="glass-sidebar border-r border-border/50 shadow-glass-lg">
      <SidebarHeader className="border-b border-border/50 p-5">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-base">D</span>
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">DIOM Admin</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-base">D</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 hover:bg-primary/10 transition-smooth"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ${isCollapsed ? 'sr-only' : 'px-3'}`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                    className="transition-smooth hover:bg-primary/5 rounded-lg"
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth ${
                        location.pathname === item.url 
                          ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${location.pathname === item.url ? 'text-primary' : 'text-muted-foreground'}`} />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        {!isCollapsed && user && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">
              {user.role.replace('_', ' ')}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size={isCollapsed ? 'icon' : 'default'}
          onClick={logout}
          className={`w-full transition-smooth rounded-lg ${isCollapsed ? '' : 'justify-start'} text-destructive hover:text-destructive hover:bg-destructive/10`}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
