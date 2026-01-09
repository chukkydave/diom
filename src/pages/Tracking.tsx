import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Search, Package, Truck, CheckCircle2, MapPin, Clock, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { useBookings } from "@/hooks/useBookings";
import { Booking, BookingStatus } from "@/types/admin";
import { format } from "date-fns";

const statusLabels: Record<BookingStatus, string> = {
  pending_quote: "Awaiting Quote",
  quoted: "Quote Sent",
  confirmed: "Order Confirmed",
  picked_up: "Package Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusColors: Record<BookingStatus, string> = {
  pending_quote: "bg-yellow-100 text-yellow-800",
  quoted: "bg-blue-100 text-blue-800",
  confirmed: "bg-indigo-100 text-indigo-800",
  picked_up: "bg-purple-100 text-purple-800",
  in_transit: "bg-cyan-100 text-cyan-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusIcons: Record<BookingStatus, React.ReactNode> = {
  pending_quote: <Clock className="w-4 h-4" />,
  quoted: <Package className="w-4 h-4" />,
  confirmed: <CheckCircle2 className="w-4 h-4" />,
  picked_up: <Package className="w-4 h-4" />,
  in_transit: <Truck className="w-4 h-4" />,
  out_for_delivery: <Truck className="w-4 h-4" />,
  delivered: <CheckCircle2 className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
};

const Tracking = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { getBookingByTracking, isLoading } = useBookings();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tracking-hero",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber || isLoading) return;

    setIsTracking(true);
    setNotFound(false);
    setBooking(null);

    setTimeout(() => {
      const foundBooking = getBookingByTracking(trackingNumber.trim());
      setIsTracking(false);

      if (foundBooking) {
        setBooking(foundBooking);

        gsap.fromTo(
          ".tracking-result",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );

        gsap.fromTo(
          ".tracking-step",
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power3.out", delay: 0.3 }
        );
      } else {
        setNotFound(true);

        gsap.fromTo(
          ".not-found-message",
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }
        );
      }
    }, 1000);
  };

  const serviceTypeLabels: Record<string, string> = {
    express: "Express",
    standard: "Standard",
    international: "International",
    freight: "Freight",
    same_day: "Same Day",
  };

  return (
    <Layout>
      <div ref={pageRef}>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-primary text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
          </div>

          <div className="container-custom relative z-10">
            <div className="tracking-hero max-w-3xl mx-auto text-center">
              <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
                Package Tracking
              </span>
              <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Track Your <span className="text-accent">Shipment</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                Enter your tracking number below to get real-time updates on your package location.
              </p>

              {/* Tracking Form */}
              <form onSubmit={handleTrack} className="max-w-xl mx-auto">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter tracking number (e.g., DIOM-20250109-A1B2)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                      className="pl-12 h-14 bg-card text-foreground border-0 text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isTracking || isLoading}
                    className="btn-glow bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8"
                  >
                    {isTracking ? "Tracking..." : "Track"}
                  </Button>
                </div>
              </form>

              {/* Sample Tracking Numbers */}
              <div className="mt-6 text-sm text-primary-foreground/60">
                <p>Try these sample tracking numbers:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {["DIOM-20250109-A1B2", "DIOM-20250109-C3D4", "DIOM-20250108-E5F6"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTrackingNumber(num)}
                      className="px-3 py-1 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors font-mono text-xs"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Not Found Message */}
        {notFound && (
          <section className="section-padding">
            <div className="container-custom">
              <div className="not-found-message max-w-xl mx-auto text-center">
                <div className="bg-card rounded-3xl p-10 border border-border">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <h3 className=" text-2xl font-bold text-foreground mb-3">
                    Shipment Not Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find a shipment with tracking number <strong className="text-foreground">{trackingNumber}</strong>.
                    Please check the tracking number and try again.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Make sure you've entered the complete tracking number</p>
                    <p>• Tracking numbers start with "DIOM-"</p>
                    <p>• Contact support if you need assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tracking Results */}
        {booking && (
          <section className="section-padding">
            <div className="container-custom">
              <div className="tracking-result max-w-4xl mx-auto">
                {/* Package Info Card */}
                <div className="bg-card rounded-3xl p-8 border border-border mb-8">
                  <div className="flex flex-wrap gap-8 justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
                      <p className="text-xl font-semibold text-foreground font-mono">{booking.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge className={`${statusColors[booking.status]} flex items-center gap-2 px-4 py-2`}>
                        {statusIcons[booking.status]}
                        {statusLabels[booking.status]}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {booking.status === 'delivered' ? 'Delivered On' : 'Estimated Delivery'}
                      </p>
                      <p className="text-xl font-semibold text-foreground">
                        {booking.deliveredAt
                          ? format(new Date(booking.deliveredAt), 'MMM d, yyyy')
                          : booking.estimatedDelivery
                            ? format(new Date(booking.estimatedDelivery), 'MMM d, yyyy')
                            : 'TBD'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">From</p>
                        <p className="font-medium text-foreground">{booking.senderName}</p>
                        <p className="text-sm text-muted-foreground">{booking.senderAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">To</p>
                        <p className="font-medium text-foreground">{booking.receiverName}</p>
                        <p className="text-sm text-muted-foreground">{booking.receiverAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Package</p>
                        <p className="font-medium text-foreground">
                          {booking.packageWeight} kg - {serviceTypeLabels[booking.serviceType]}
                        </p>
                        <p className="text-sm text-muted-foreground">{booking.packageDescription}</p>
                      </div>
                    </div>
                  </div>

                  {booking.assignedAgentName && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Agent</p>
                          <p className="font-medium text-foreground">{booking.assignedAgentName}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="bg-card rounded-3xl p-8 border border-border">
                  <h3 className=" text-xl font-semibold text-foreground mb-8">
                    Tracking History
                  </h3>

                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                    {booking.statusHistory.slice().reverse().map((update, index) => {
                      const isLatest = index === 0;
                      return (
                        <div key={index} className="tracking-step relative pl-12 pb-8 last:pb-0">
                          {/* Dot */}
                          <div
                            className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${isLatest
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground"
                              }`}
                          >
                            {statusIcons[update.status]}
                          </div>

                          <div>
                            <p className={`font-medium ${isLatest ? "text-foreground" : "text-muted-foreground"}`}>
                              {statusLabels[update.status]}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(update.timestamp), 'MMM d, yyyy - h:mm a')}
                            </p>
                            {update.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" />
                                {update.location}
                              </p>
                            )}
                            {update.note && (
                              <p className="text-sm text-accent mt-1">{update.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Help Section */}
        <section className="py-20 bg-muted/50">
          <div className="container-custom text-center">
            <h2 className=" text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need Help with Your Shipment?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our support team is available 24/7 to assist you with any tracking inquiries.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Contact Support
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                WhatsApp: +234 706 816 0887
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Tracking;
