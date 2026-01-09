import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Mail,
  MessageSquare,
  Phone,
  Send,
  RefreshCcw,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
} from 'lucide-react';
import { NotificationLog } from '@/types/admin';
import { format } from 'date-fns';
import { toast } from 'sonner';

const typeIcons = {
  email: Mail,
  sms: Phone,
  whatsapp: MessageSquare,
};

const statusColors = {
  sent: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const statusIcons = {
  sent: CheckCircle,
  failed: XCircle,
  pending: Clock,
};

const AdminNotifications = () => {
  const {
    notifications,
    isLoading,
    createNotification,
    updateNotificationStatus,
    deleteNotification,
  } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationLog | null>(null);
  const [formData, setFormData] = useState({
    bookingId: '',
    type: 'email' as NotificationLog['type'],
    recipient: '',
    subject: '',
    message: '',
  });

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch =
      notif.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.bookingId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || notif.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notif.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    failed: notifications.filter(n => n.status === 'failed').length,
    pending: notifications.filter(n => n.status === 'pending').length,
  };

  const resetForm = () => {
    setFormData({
      bookingId: '',
      type: 'email',
      recipient: '',
      subject: '',
      message: '',
    });
  };

  const handleCreateNotification = () => {
    if (!formData.recipient || !formData.message) {
      toast.error('Please fill in recipient and message');
      return;
    }

    createNotification({
      bookingId: formData.bookingId || 'manual',
      type: formData.type,
      recipient: formData.recipient,
      subject: formData.subject,
      message: formData.message,
      status: 'pending',
    });

    toast.success('Notification queued for sending');
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleRetry = (notifId: string) => {
    updateNotificationStatus(notifId, 'pending');
    toast.success('Notification queued for retry');
  };

  const handleDelete = (notifId: string) => {
    if (confirm('Are you sure you want to delete this notification log?')) {
      deleteNotification(notifId);
      toast.success('Notification deleted');
    }
  };

  if (isLoading) {
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl  font-bold">Notifications Log</h1>
            <p className="text-muted-foreground">Track all customer communications</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Sent</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-sm text-muted-foreground">Failed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead className="max-w-[300px]">Message</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notif) => {
                const TypeIcon = typeIcons[notif.type];
                const StatusIcon = statusIcons[notif.status];
                return (
                  <TableRow key={notif.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4" />
                        <span className="capitalize">{notif.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{notif.recipient}</p>
                        {notif.subject && (
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {notif.subject}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p
                        className="text-sm truncate cursor-pointer hover:text-clip"
                        onClick={() => setSelectedNotification(notif)}
                      >
                        {notif.message}
                      </p>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {notif.bookingId}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[notif.status]} flex items-center gap-1 w-fit`}>
                        <StatusIcon className="h-3 w-3" />
                        {notif.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(notif.sentAt), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {notif.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRetry(notif.id)}
                            title="Retry"
                          >
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(notif.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredNotifications.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No notifications found
            </div>
          )}
        </div>
      </div>

      {/* Create Notification Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Notification Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: NotificationLog['type']) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Recipient *</Label>
              <Input
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                placeholder={formData.type === 'email' ? 'customer@example.com' : '+234 800 000 0000'}
              />
            </div>
            {formData.type === 'email' && (
              <div>
                <Label>Subject</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Your Shipment Update"
                />
              </div>
            )}
            <div>
              <Label>Booking ID (optional)</Label>
              <Input
                value={formData.bookingId}
                onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
                placeholder="DIOM-XXXXXXXX-XXXX"
              />
            </div>
            <div>
              <Label>Message *</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter your message..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNotification}>
              <Send className="h-4 w-4 mr-2" />
              Queue Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Notification Modal */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="capitalize">{selectedNotification.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className={statusColors[selectedNotification.status]}>
                    {selectedNotification.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Recipient</p>
                  <p>{selectedNotification.recipient}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sent At</p>
                  <p>{format(new Date(selectedNotification.sentAt), 'PPpp')}</p>
                </div>
              </div>
              {selectedNotification.subject && (
                <div>
                  <p className="text-muted-foreground text-sm">Subject</p>
                  <p>{selectedNotification.subject}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-sm">Message</p>
                <div className="bg-muted p-3 rounded-lg mt-1">
                  <p className="whitespace-pre-wrap">{selectedNotification.message}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminNotifications;
