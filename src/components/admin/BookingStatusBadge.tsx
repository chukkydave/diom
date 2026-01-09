import { Badge } from '@/components/ui/badge';
import { BookingStatus } from '@/types/admin';
import { cn } from '@/lib/utils';

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  pending_quote: {
    label: 'Pending Quote',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  quoted: {
    label: 'Quoted',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-primary/10 text-primary border-primary/30',
  },
  picked_up: {
    label: 'Picked Up',
    className: 'bg-primary/15 text-primary border-primary/40',
  },
  in_transit: {
    label: 'In Transit',
    className: 'bg-primary/20 text-primary border-primary/50',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    className: 'bg-orange-100 text-orange-700 border-orange-300',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
};

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export const BookingStatusBadge = ({ status, className }: BookingStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        'border font-semibold px-3 py-1 rounded-full transition-smooth hover:scale-105',
        config.className, 
        className
      )}
    >
      {config.label}
    </Badge>
  );
};
