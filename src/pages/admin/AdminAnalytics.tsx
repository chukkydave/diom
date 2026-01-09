import { useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useBookings } from '@/hooks/useBookings';
import { useDeliveryAgents } from '@/hooks/useDeliveryAgents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  DollarSign,
  Clock,
} from 'lucide-react';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminAnalytics = () => {
  const { bookings, isLoading: bookingsLoading } = useBookings();
  const { agents, isLoading: agentsLoading } = useDeliveryAgents();

  const isLoading = bookingsLoading || agentsLoading;

  // Calculate analytics data
  const analytics = useMemo(() => {
    if (!bookings.length) return null;

    // Bookings by status
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
    }));

    // Bookings by service type
    const serviceTypeCounts = bookings.reduce((acc, booking) => {
      acc[booking.serviceType] = (acc[booking.serviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const serviceData = Object.entries(serviceTypeCounts).map(([type, count]) => ({
      name: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
    }));

    // Daily bookings for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return startOfDay(date);
    });

    const dailyBookings = last7Days.map(date => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = bookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        return isWithinInterval(bookingDate, { start: date, end: nextDay });
      }).length;

      return {
        date: format(date, 'EEE'),
        bookings: count,
      };
    });

    // Revenue data (only from bookings with quotedAmount and accepted)
    const totalRevenue = bookings
      .filter(b => b.quotedAmount && b.quoteAcceptedAt)
      .reduce((sum, b) => sum + (b.quotedAmount || 0), 0);

    const pendingRevenue = bookings
      .filter(b => b.quotedAmount && !b.quoteAcceptedAt && b.status !== 'cancelled')
      .reduce((sum, b) => sum + (b.quotedAmount || 0), 0);

    // Agent performance
    const agentDeliveries = agents.map(agent => ({
      name: agent.name.split(' ')[0],
      deliveries: agent.currentDeliveries,
      capacity: agent.maxDeliveries,
    }));

    // Calculate trends (simplified - compare today vs yesterday)
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setDate(yesterdayEnd.getDate() + 1);

    const todayBookings = bookings.filter(b =>
      isWithinInterval(new Date(b.createdAt), { start: today, end: tomorrow })
    ).length;

    const yesterdayBookings = bookings.filter(b =>
      isWithinInterval(new Date(b.createdAt), { start: yesterday, end: yesterdayEnd })
    ).length;

    const bookingTrend = yesterdayBookings > 0
      ? ((todayBookings - yesterdayBookings) / yesterdayBookings) * 100
      : todayBookings > 0 ? 100 : 0;

    return {
      statusData,
      serviceData,
      dailyBookings,
      totalRevenue,
      pendingRevenue,
      agentDeliveries,
      totalBookings: bookings.length,
      deliveredCount: statusCounts['delivered'] || 0,
      inTransitCount: statusCounts['in_transit'] || 0,
      pendingCount: statusCounts['pending_quote'] || 0,
      bookingTrend,
      averageDeliveryTime: '2.3 days', // Placeholder
    };
  }, [bookings, agents]);

  if (isLoading || !analytics) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl  font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Overview of your logistics operations</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold">{analytics.totalBookings}</p>
                  <div className="flex items-center mt-1 text-sm">
                    {analytics.bookingTrend >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500">+{analytics.bookingTrend.toFixed(0)}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-red-500">{analytics.bookingTrend.toFixed(0)}%</span>
                      </>
                    )}
                    <span className="text-muted-foreground ml-1">vs yesterday</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed Revenue</p>
                  <p className="text-3xl font-bold">₦{analytics.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ₦{analytics.pendingRevenue.toLocaleString()} pending
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Deliveries Completed</p>
                  <p className="text-3xl font-bold">{analytics.deliveredCount}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {analytics.inTransitCount} in transit
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
                  <p className="text-3xl font-bold">{analytics.averageDeliveryTime}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {analytics.pendingCount} awaiting quotes
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bookings (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.dailyBookings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.statusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bookings by Service Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.serviceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Agent Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agent Workload</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.agentDeliveries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="deliveries" name="Current" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="capacity" name="Max Capacity" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
