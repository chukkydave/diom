import { useState } from 'react';
import { Booking, BookingStatus, DeliveryAgent } from '@/types/admin';
import { BookingStatusBadge } from './BookingStatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Package, User, MapPin, Clock, Truck, DollarSign, FileText } from 'lucide-react';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (bookingId: string, status: BookingStatus, note?: string, location?: string) => void;
  onSetQuote: (bookingId: string, amount: number) => void;
  onAssignAgent: (bookingId: string, agentId: string, agentName: string) => void;
  agents: DeliveryAgent[];
  updatedBy: string;
}

const statusFlow: BookingStatus[] = [
  'pending_quote',
  'quoted',
  'confirmed',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
];

export const BookingDetailsModal = ({
  booking,
  isOpen,
  onClose,
  onUpdateStatus,
  onSetQuote,
  onAssignAgent,
  agents,
  updatedBy,
}: BookingDetailsModalProps) => {
  const [quoteAmount, setQuoteAmount] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [statusLocation, setStatusLocation] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  if (!booking) return null;

  const currentStatusIndex = statusFlow.indexOf(booking.status);
  const nextStatus = currentStatusIndex < statusFlow.length - 1 ? statusFlow[currentStatusIndex + 1] : null;

  const handleSetQuote = () => {
    const amount = parseFloat(quoteAmount);
    if (!isNaN(amount) && amount > 0) {
      onSetQuote(booking.id, amount);
      setQuoteAmount('');
    }
  };

  const handleAdvanceStatus = () => {
    if (nextStatus) {
      onUpdateStatus(booking.id, nextStatus, statusNote || undefined, statusLocation || undefined);
      setStatusNote('');
      setStatusLocation('');
    }
  };

  const handleAssignAgent = () => {
    const agent = agents.find(a => a.id === selectedAgent);
    if (agent) {
      onAssignAgent(booking.id, agent.id, agent.name);
      setSelectedAgent('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-5 w-5" />
            Booking Details - {booking.trackingNumber}
            <BookingStatusBadge status={booking.status} />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="details" className="space-y-6">
              {/* Sender Info */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" /> Sender Information
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{booking.senderName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{booking.senderEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{booking.senderPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{booking.senderAddress}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Receiver Info */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Receiver Information
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{booking.receiverName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{booking.receiverEmail || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{booking.receiverPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{booking.receiverAddress}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Package Info */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" /> Package Details
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{booking.packageDescription}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{booking.packageWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dimensions</p>
                    <p className="font-medium">{booking.packageDimensions || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Type</p>
                    <p className="font-medium capitalize">{booking.serviceType.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Pricing
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Quoted Amount</p>
                    <p className="font-medium">
                      {booking.quotedAmount ? `₦${booking.quotedAmount.toLocaleString()}` : 'Not quoted yet'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quote Sent</p>
                    <p className="font-medium">
                      {booking.quoteSentAt ? format(new Date(booking.quoteSentAt), 'PPp') : '-'}
                    </p>
                  </div>
                </div>

                {booking.status === 'pending_quote' && (
                  <div className="flex gap-2 pl-6 mt-4">
                    <Input
                      type="number"
                      placeholder="Enter quote amount"
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(e.target.value)}
                      className="w-48"
                    />
                    <Button onClick={handleSetQuote}>Set Quote</Button>
                  </div>
                )}
              </div>

              {/* Notes */}
              {(booking.internalNotes || booking.customerNotes) && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Notes
                    </h3>
                    {booking.customerNotes && (
                      <div className="pl-6">
                        <p className="text-sm text-muted-foreground">Customer Notes</p>
                        <p className="font-medium">{booking.customerNotes}</p>
                      </div>
                    )}
                    {booking.internalNotes && (
                      <div className="pl-6">
                        <p className="text-sm text-muted-foreground">Internal Notes</p>
                        <p className="font-medium">{booking.internalNotes}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="status" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Current Status</h3>
                <div className="flex items-center gap-3">
                  <BookingStatusBadge status={booking.status} className="text-base px-4 py-2" />
                  {booking.status === 'delivered' && booking.deliveredAt && (
                    <span className="text-sm text-muted-foreground">
                      Delivered on {format(new Date(booking.deliveredAt), 'PPp')}
                    </span>
                  )}
                </div>
              </div>

              {nextStatus && booking.status !== 'cancelled' && (
                <div className="space-y-4">
                  <Separator />
                  <h3 className="font-semibold">Advance Status</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Next Status</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Move to: <span className="font-medium capitalize">{nextStatus.replace('_', ' ')}</span>
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="status-note">Note (optional)</Label>
                      <Textarea
                        id="status-note"
                        placeholder="Add a note for this status update..."
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status-location">Location (optional)</Label>
                      <Input
                        id="status-location"
                        placeholder="Current location..."
                        value={statusLocation}
                        onChange={(e) => setStatusLocation(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleAdvanceStatus} className="w-full">
                      Update to {nextStatus.replace('_', ' ')}
                    </Button>
                  </div>
                </div>
              )}

              {booking.status !== 'cancelled' && booking.status !== 'delivered' && (
                <div className="space-y-4">
                  <Separator />
                  <Button
                    variant="destructive"
                    onClick={() => onUpdateStatus(booking.id, 'cancelled', 'Booking cancelled')}
                    className="w-full"
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="assignment" className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Current Assignment
                </h3>
                {booking.assignedAgentId ? (
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">{booking.assignedAgentName}</p>
                    <p className="text-sm text-muted-foreground">Agent ID: {booking.assignedAgentId}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No agent assigned</p>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Assign Agent</h3>
                <div className="space-y-3">
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.filter(a => a.isAvailable).map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name} - {agent.zone} ({agent.currentDeliveries}/{agent.maxDeliveries})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAssignAgent} disabled={!selectedAgent} className="w-full">
                    Assign Agent
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" /> Status History
              </h3>
              <div className="space-y-4">
                {[...booking.statusHistory].reverse().map((update, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="w-3 h-3 rounded-full bg-accent mt-1.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <BookingStatusBadge status={update.status} />
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(update.timestamp), 'PPp')}
                        </span>
                      </div>
                      <p className="text-sm mt-1">Updated by: {update.updatedBy}</p>
                      {update.location && (
                        <p className="text-sm text-muted-foreground">Location: {update.location}</p>
                      )}
                      {update.note && (
                        <p className="text-sm text-muted-foreground mt-1">{update.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
