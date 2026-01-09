import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BookingStatusBadge } from '@/components/admin/BookingStatusBadge';
import { BookingDetailsModal } from '@/components/admin/BookingDetailsModal';
import { CreateBookingModal } from '@/components/admin/CreateBookingModal';
import { useBookings } from '@/hooks/useBookings';
import { useDeliveryAgents } from '@/hooks/useDeliveryAgents';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Booking } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Plus, Search, Eye } from 'lucide-react';

const AdminBookings = () => {
  const { bookings, createBooking, updateBookingStatus, setQuote, assignAgent } = useBookings();
  const { agents } = useDeliveryAgents();
  const { user } = useAdminAuth();
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filtered = bookings.filter(b =>
    b.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.senderName.toLowerCase().includes(search.toLowerCase()) ||
    b.receiverName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Bookings" breadcrumbs={[{ label: 'Bookings' }]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input 
              placeholder="Search bookings..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10 glass-card border-border/50 transition-smooth" 
            />
          </div>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
          >
            <Plus className="h-4 w-4 mr-2" />New Booking
          </Button>
        </div>

        <div className="glass-card border-border/50 rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-b border-border/50">
                <TableHead className="font-semibold text-foreground">Tracking #</TableHead>
                <TableHead className="font-semibold text-foreground">Sender</TableHead>
                <TableHead className="font-semibold text-foreground">Receiver</TableHead>
                <TableHead className="font-semibold text-foreground">Service</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Date</TableHead>
                <TableHead className="font-semibold text-foreground"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(booking => (
                <TableRow key={booking.id} className="hover:bg-accent/5 transition-smooth border-b border-border/30">
                  <TableCell className="font-mono font-medium">{booking.trackingNumber}</TableCell>
                  <TableCell>{booking.senderName}</TableCell>
                  <TableCell>{booking.receiverName}</TableCell>
                  <TableCell className="capitalize">{booking.serviceType.replace('_', ' ')}</TableCell>
                  <TableCell><BookingStatusBadge status={booking.status} /></TableCell>
                  <TableCell>{format(new Date(booking.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(booking)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onUpdateStatus={(id, status, note, loc) => { updateBookingStatus(id, status, user?.name || 'Admin', note, loc); setSelectedBooking(null); }}
        onSetQuote={(id, amount) => { setQuote(id, amount, user?.name || 'Admin'); }}
        onAssignAgent={(id, agentId, name) => { assignAgent(id, agentId, name); }}
        agents={agents}
        updatedBy={user?.name || 'Admin'}
      />

      <CreateBookingModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={createBooking} />
    </AdminLayout>
  );
};

export default AdminBookings;
