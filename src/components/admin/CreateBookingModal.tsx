import { useState } from 'react';
import { Booking, ServiceType } from '@/types/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Package, User, MapPin } from 'lucide-react';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (booking: Omit<Booking, 'id' | 'trackingNumber' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>) => Booking;
}

const serviceTypes: { value: ServiceType; label: string }[] = [
  { value: 'same_day', label: 'Same Day Delivery' },
  { value: 'express', label: 'Express (1-2 days)' },
  { value: 'standard', label: 'Standard (3-5 days)' },
  { value: 'freight', label: 'Freight/Cargo' },
  { value: 'international', label: 'International' },
];

export const CreateBookingModal = ({ isOpen, onClose, onCreate }: CreateBookingModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverEmail: '',
    receiverPhone: '',
    receiverAddress: '',
    packageDescription: '',
    packageWeight: '',
    packageDimensions: '',
    serviceType: 'standard' as ServiceType,
    customerNotes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = [
        'senderName', 'senderEmail', 'senderPhone', 'senderAddress',
        'receiverName', 'receiverPhone', 'receiverAddress',
        'packageDescription', 'packageWeight'
      ];

      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          toast({
            title: 'Validation Error',
            description: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`,
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
      }

      const newBooking = onCreate({
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        senderPhone: formData.senderPhone,
        senderAddress: formData.senderAddress,
        receiverName: formData.receiverName,
        receiverEmail: formData.receiverEmail || undefined,
        receiverPhone: formData.receiverPhone,
        receiverAddress: formData.receiverAddress,
        packageDescription: formData.packageDescription,
        packageWeight: parseFloat(formData.packageWeight),
        packageDimensions: formData.packageDimensions || undefined,
        serviceType: formData.serviceType,
        customerNotes: formData.customerNotes || undefined,
      });

      toast({
        title: 'Booking Created',
        description: `Tracking number: ${newBooking.trackingNumber}`,
      });

      // Reset form
      setFormData({
        senderName: '',
        senderEmail: '',
        senderPhone: '',
        senderAddress: '',
        receiverName: '',
        receiverEmail: '',
        receiverPhone: '',
        receiverAddress: '',
        packageDescription: '',
        packageWeight: '',
        packageDimensions: '',
        serviceType: 'standard',
        customerNotes: '',
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create booking',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create New Booking
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {/* Sender Information */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" /> Sender Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="senderName">Full Name *</Label>
                    <Input
                      id="senderName"
                      value={formData.senderName}
                      onChange={(e) => handleChange('senderName', e.target.value)}
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderEmail">Email *</Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      value={formData.senderEmail}
                      onChange={(e) => handleChange('senderEmail', e.target.value)}
                      placeholder="john@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderPhone">Phone *</Label>
                    <Input
                      id="senderPhone"
                      value={formData.senderPhone}
                      onChange={(e) => handleChange('senderPhone', e.target.value)}
                      placeholder="+234 801 234 5678"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderAddress">Address *</Label>
                    <Input
                      id="senderAddress"
                      value={formData.senderAddress}
                      onChange={(e) => handleChange('senderAddress', e.target.value)}
                      placeholder="123 Victoria Island, Lagos"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Receiver Information */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" /> Receiver Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receiverName">Full Name *</Label>
                    <Input
                      id="receiverName"
                      value={formData.receiverName}
                      onChange={(e) => handleChange('receiverName', e.target.value)}
                      placeholder="Jane Smith"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiverEmail">Email</Label>
                    <Input
                      id="receiverEmail"
                      type="email"
                      value={formData.receiverEmail}
                      onChange={(e) => handleChange('receiverEmail', e.target.value)}
                      placeholder="jane@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiverPhone">Phone *</Label>
                    <Input
                      id="receiverPhone"
                      value={formData.receiverPhone}
                      onChange={(e) => handleChange('receiverPhone', e.target.value)}
                      placeholder="+234 802 345 6789"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="receiverAddress">Address *</Label>
                    <Input
                      id="receiverAddress"
                      value={formData.receiverAddress}
                      onChange={(e) => handleChange('receiverAddress', e.target.value)}
                      placeholder="456 Ikeja, Lagos"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4" /> Package Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="packageDescription">Description *</Label>
                    <Input
                      id="packageDescription"
                      value={formData.packageDescription}
                      onChange={(e) => handleChange('packageDescription', e.target.value)}
                      placeholder="Electronics - Laptop"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="packageWeight">Weight (kg) *</Label>
                    <Input
                      id="packageWeight"
                      type="number"
                      step="0.1"
                      value={formData.packageWeight}
                      onChange={(e) => handleChange('packageWeight', e.target.value)}
                      placeholder="2.5"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="packageDimensions">Dimensions (LxWxH cm)</Label>
                    <Input
                      id="packageDimensions"
                      value={formData.packageDimensions}
                      onChange={(e) => handleChange('packageDimensions', e.target.value)}
                      placeholder="30x20x15"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) => handleChange('serviceType', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="customerNotes">Customer Notes</Label>
                    <Textarea
                      id="customerNotes"
                      value={formData.customerNotes}
                      onChange={(e) => handleChange('customerNotes', e.target.value)}
                      placeholder="Any special instructions..."
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Booking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
