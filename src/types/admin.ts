// Admin Dashboard Types

export type UserRole = 'super_admin' | 'admin' | 'delivery_agent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  isActive: boolean;
}

export type BookingStatus = 
  | 'pending_quote'
  | 'quoted'
  | 'confirmed'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type ServiceType = 
  | 'express'
  | 'standard'
  | 'international'
  | 'freight'
  | 'same_day';

export interface Booking {
  id: string;
  trackingNumber: string;
  
  // Sender info
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  
  // Receiver info
  receiverName: string;
  receiverEmail?: string;
  receiverPhone: string;
  receiverAddress: string;
  
  // Package info
  packageDescription: string;
  packageWeight: number;
  packageDimensions?: string;
  serviceType: ServiceType;
  
  // Pricing (quote-based)
  quotedAmount?: number;
  quoteSentAt?: string;
  quoteAcceptedAt?: string;
  
  // Status
  status: BookingStatus;
  statusHistory: StatusUpdate[];
  
  // Assignment
  assignedAgentId?: string;
  assignedAgentName?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  
  // Notes
  internalNotes?: string;
  customerNotes?: string;
}

export interface StatusUpdate {
  status: BookingStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
  location?: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: 'motorcycle' | 'car' | 'van' | 'truck';
  vehiclePlate?: string;
  isAvailable: boolean;
  currentDeliveries: number;
  maxDeliveries: number;
  zone?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  pendingQuotes: number;
  inTransit: number;
  delivered: number;
  cancelledCount: number;
  totalAgents: number;
  availableAgents: number;
  revenue: number;
}

export interface NotificationLog {
  id: string;
  bookingId: string;
  type: 'email' | 'sms' | 'whatsapp';
  recipient: string;
  subject?: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
}
