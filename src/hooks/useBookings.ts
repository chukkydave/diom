import { useState, useEffect, useCallback } from 'react';
import { Booking, BookingStatus, StatusUpdate } from '@/types/admin';

const STORAGE_KEY = 'diom_bookings';

// Generate tracking number: DIOM-YYYYMMDD-XXXX
const generateTrackingNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DIOM-${dateStr}-${random}`;
};

// Initialize with sample data if empty
const getInitialBookings = (): Booking[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  // Sample data for demo
  const sampleBookings: Booking[] = [
    {
      id: '1',
      trackingNumber: 'DIOM-20250109-A1B2',
      senderName: 'John Doe',
      senderEmail: 'john@example.com',
      senderPhone: '+234 801 234 5678',
      senderAddress: '123 Victoria Island, Lagos',
      receiverName: 'Jane Smith',
      receiverEmail: 'jane@example.com',
      receiverPhone: '+234 802 345 6789',
      receiverAddress: '456 Ikeja, Lagos',
      packageDescription: 'Electronics - Laptop',
      packageWeight: 2.5,
      serviceType: 'express',
      status: 'in_transit',
      statusHistory: [
        { status: 'pending_quote', timestamp: '2025-01-08T10:00:00Z', updatedBy: 'System' },
        { status: 'quoted', timestamp: '2025-01-08T11:00:00Z', updatedBy: 'Admin User' },
        { status: 'confirmed', timestamp: '2025-01-08T14:00:00Z', updatedBy: 'System' },
        { status: 'picked_up', timestamp: '2025-01-09T09:00:00Z', updatedBy: 'Admin User', location: 'Victoria Island' },
        { status: 'in_transit', timestamp: '2025-01-09T10:00:00Z', updatedBy: 'Admin User' },
      ],
      quotedAmount: 15000,
      quoteSentAt: '2025-01-08T11:00:00Z',
      quoteAcceptedAt: '2025-01-08T14:00:00Z',
      createdAt: '2025-01-08T10:00:00Z',
      updatedAt: '2025-01-09T10:00:00Z',
      estimatedDelivery: '2025-01-09T18:00:00Z',
      assignedAgentId: 'agent-1',
      assignedAgentName: 'Michael Johnson',
    },
    {
      id: '2',
      trackingNumber: 'DIOM-20250109-C3D4',
      senderName: 'Alice Brown',
      senderEmail: 'alice@example.com',
      senderPhone: '+234 803 456 7890',
      senderAddress: '789 Lekki Phase 1, Lagos',
      receiverName: 'Bob Wilson',
      receiverPhone: '+234 804 567 8901',
      receiverAddress: '321 Surulere, Lagos',
      packageDescription: 'Documents',
      packageWeight: 0.5,
      serviceType: 'same_day',
      status: 'pending_quote',
      statusHistory: [
        { status: 'pending_quote', timestamp: '2025-01-09T08:00:00Z', updatedBy: 'System' },
      ],
      createdAt: '2025-01-09T08:00:00Z',
      updatedAt: '2025-01-09T08:00:00Z',
    },
    {
      id: '3',
      trackingNumber: 'DIOM-20250108-E5F6',
      senderName: 'Charlie Green',
      senderEmail: 'charlie@example.com',
      senderPhone: '+234 805 678 9012',
      senderAddress: '555 Ikoyi, Lagos',
      receiverName: 'Diana White',
      receiverEmail: 'diana@example.com',
      receiverPhone: '+234 806 789 0123',
      receiverAddress: '777 Abuja, FCT',
      packageDescription: 'Clothing items',
      packageWeight: 3.0,
      serviceType: 'standard',
      status: 'delivered',
      statusHistory: [
        { status: 'pending_quote', timestamp: '2025-01-06T10:00:00Z', updatedBy: 'System' },
        { status: 'quoted', timestamp: '2025-01-06T11:00:00Z', updatedBy: 'Admin User' },
        { status: 'confirmed', timestamp: '2025-01-06T14:00:00Z', updatedBy: 'System' },
        { status: 'picked_up', timestamp: '2025-01-07T09:00:00Z', updatedBy: 'Admin User' },
        { status: 'in_transit', timestamp: '2025-01-07T10:00:00Z', updatedBy: 'Admin User' },
        { status: 'out_for_delivery', timestamp: '2025-01-08T14:00:00Z', updatedBy: 'Admin User' },
        { status: 'delivered', timestamp: '2025-01-08T16:30:00Z', updatedBy: 'Admin User', note: 'Received by Diana' },
      ],
      quotedAmount: 25000,
      createdAt: '2025-01-06T10:00:00Z',
      updatedAt: '2025-01-08T16:30:00Z',
      deliveredAt: '2025-01-08T16:30:00Z',
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleBookings));
  return sampleBookings;
};

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setBookings(getInitialBookings());
    setIsLoading(false);
  }, []);

  const saveBookings = useCallback((newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookings));
  }, []);

  const createBooking = useCallback((bookingData: Omit<Booking, 'id' | 'trackingNumber' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: crypto.randomUUID(),
      trackingNumber: generateTrackingNumber(),
      status: 'pending_quote',
      statusHistory: [
        {
          status: 'pending_quote',
          timestamp: new Date().toISOString(),
          updatedBy: 'System',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newBookings = [newBooking, ...bookings];
    saveBookings(newBookings);
    return newBooking;
  }, [bookings, saveBookings]);

  const updateBookingStatus = useCallback((
    bookingId: string,
    newStatus: BookingStatus,
    updatedBy: string,
    note?: string,
    location?: string
  ) => {
    const newBookings = bookings.map(booking => {
      if (booking.id !== bookingId) return booking;

      const statusUpdate: StatusUpdate = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        updatedBy,
        note,
        location,
      };

      return {
        ...booking,
        status: newStatus,
        statusHistory: [...booking.statusHistory, statusUpdate],
        updatedAt: new Date().toISOString(),
        deliveredAt: newStatus === 'delivered' ? new Date().toISOString() : booking.deliveredAt,
      };
    });

    saveBookings(newBookings);
  }, [bookings, saveBookings]);

  const updateBooking = useCallback((bookingId: string, updates: Partial<Booking>) => {
    const newBookings = bookings.map(booking => {
      if (booking.id !== bookingId) return booking;
      return {
        ...booking,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    });

    saveBookings(newBookings);
  }, [bookings, saveBookings]);

  const assignAgent = useCallback((bookingId: string, agentId: string, agentName: string) => {
    updateBooking(bookingId, { assignedAgentId: agentId, assignedAgentName: agentName });
  }, [updateBooking]);

  const setQuote = useCallback((bookingId: string, amount: number, updatedBy: string) => {
    const newBookings = bookings.map(booking => {
      if (booking.id !== bookingId) return booking;

      const statusUpdate: StatusUpdate = {
        status: 'quoted',
        timestamp: new Date().toISOString(),
        updatedBy,
        note: `Quote set: ₦${amount.toLocaleString()}`,
      };

      return {
        ...booking,
        quotedAmount: amount,
        quoteSentAt: new Date().toISOString(),
        status: 'quoted' as BookingStatus,
        statusHistory: [...booking.statusHistory, statusUpdate],
        updatedAt: new Date().toISOString(),
      };
    });

    saveBookings(newBookings);
  }, [bookings, saveBookings]);

  const deleteBooking = useCallback((bookingId: string) => {
    const newBookings = bookings.filter(b => b.id !== bookingId);
    saveBookings(newBookings);
  }, [bookings, saveBookings]);

  const getBookingByTracking = useCallback((trackingNumber: string): Booking | undefined => {
    return bookings.find(b => b.trackingNumber.toUpperCase() === trackingNumber.toUpperCase());
  }, [bookings]);

  return {
    bookings,
    isLoading,
    createBooking,
    updateBooking,
    updateBookingStatus,
    assignAgent,
    setQuote,
    deleteBooking,
    getBookingByTracking,
  };
};
