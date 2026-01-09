import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { useBookings } from '@/hooks/useBookings';
import { useDeliveryAgents } from '@/hooks/useDeliveryAgents';
import { Package, Truck, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { bookings } = useBookings();
  const { agents } = useDeliveryAgents();

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending_quote').length,
    inTransit: bookings.filter(b => ['picked_up', 'in_transit', 'out_for_delivery'].includes(b.status)).length,
    delivered: bookings.filter(b => b.status === 'delivered').length,
    availableAgents: agents.filter(a => a.isAvailable).length,
  };

  return (
    <AdminLayout title="Dashboard" breadcrumbs={[{ label: 'Dashboard' }]}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Bookings" 
          value={stats.total} 
          icon={<Package className="h-6 w-6" />} 
          className="border-l-4 border-primary" 
        />
        <StatsCard 
          title="Pending Quotes" 
          value={stats.pending} 
          icon={<Clock className="h-6 w-6" />} 
          className="border-l-4 border-accent" 
        />
        <StatsCard 
          title="In Transit" 
          value={stats.inTransit} 
          icon={<Truck className="h-6 w-6" />} 
          className="border-l-4 border-primary" 
        />
        <StatsCard 
          title="Delivered" 
          value={stats.delivered} 
          icon={<CheckCircle className="h-6 w-6" />} 
          className="border-l-4 border-accent" 
        />
        <StatsCard 
          title="Available Agents" 
          value={`${stats.availableAgents}/${agents.length}`} 
          icon={<Users className="h-6 w-6" />} 
          className="border-l-4 border-primary" 
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
