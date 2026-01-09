import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Package, Truck, Plane, Ship, ArrowRight, Calculator, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import gsap from "gsap";
import { toast } from "sonner";

const serviceTypes = [
  { value: "lagos", label: "Lagos Delivery", icon: Package, description: "Same-day within Lagos" },
  { value: "interstate", label: "Interstate Delivery", icon: Truck, description: "2-3 days nationwide" },
  { value: "international", label: "International Shipping", icon: Plane, description: "Global delivery" },
  { value: "freight", label: "Freight Forwarding", icon: Ship, description: "Bulk cargo shipping" },
];

const nigerianStates = [
  "Lagos", "Abuja (FCT)", "Kano", "Rivers", "Oyo", "Kaduna", "Ogun", "Anambra",
  "Delta", "Enugu", "Edo", "Akwa Ibom", "Cross River", "Imo", "Abia", "Kwara",
  "Osun", "Ekiti", "Ondo", "Plateau", "Benue", "Niger", "Kogi", "Nassarawa",
  "Bauchi", "Borno", "Adamawa", "Gombe", "Yobe", "Taraba", "Sokoto", "Kebbi",
  "Zamfara", "Katsina", "Jigawa", "Bayelsa", "Ebonyi"
];

const Booking = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState("lagos");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".booking-hero",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        ".service-option",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.3 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
      toast.success("Booking request submitted successfully!");

      gsap.fromTo(
        ".success-message",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }, 2000);
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
            <div className="booking-hero max-w-3xl mx-auto text-center">
              <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
                Book a Shipment
              </span>
              <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Ship with <span className="text-accent">Confidence</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Book your shipment in minutes. Get instant quotes and schedule pickups at your convenience.
              </p>
            </div>
          </div>
        </section>

        {/* Booking Form Section */}
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            {step < 3 ? (
              <form onSubmit={handleSubmit}>
                {/* Step 1: Select Service */}
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="text-center mb-12">
                      <h2 className=" text-2xl md:text-3xl font-bold text-foreground mb-2">
                        Select Service Type
                      </h2>
                      <p className="text-muted-foreground">Choose the delivery service that fits your needs</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {serviceTypes.map((service) => (
                        <button
                          key={service.value}
                          type="button"
                          onClick={() => setSelectedService(service.value)}
                          className={`service-option p-6 rounded-2xl border-2 text-left transition-all ${selectedService === service.value
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                            }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedService === service.value ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                              }`}>
                              <service.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">{service.label}</h3>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-end pt-8">
                      <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Shipment Details */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div className="text-center mb-12">
                      <h2 className=" text-2xl md:text-3xl font-bold text-foreground mb-2">
                        Shipment Details
                      </h2>
                      <p className="text-muted-foreground">Provide your pickup and delivery information</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Sender Details */}
                      <div className="space-y-6 p-6 rounded-2xl bg-muted/50">
                        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm">1</div>
                          Sender Information
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="senderName">Full Name</Label>
                            <Input id="senderName" placeholder="Enter sender name" required />
                          </div>
                          <div>
                            <Label htmlFor="senderPhone">Phone Number</Label>
                            <Input id="senderPhone" type="tel" placeholder="+234 XXX XXX XXXX" required />
                          </div>
                          <div>
                            <Label htmlFor="senderEmail">Email</Label>
                            <Input id="senderEmail" type="email" placeholder="email@example.com" required />
                          </div>
                          <div>
                            <Label htmlFor="pickupState">Pickup State</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {nigerianStates.map((state) => (
                                  <SelectItem key={state} value={state.toLowerCase()}>{state}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="pickupAddress">Pickup Address</Label>
                            <Textarea id="pickupAddress" placeholder="Enter full pickup address" required />
                          </div>
                        </div>
                      </div>

                      {/* Receiver Details */}
                      <div className="space-y-6 p-6 rounded-2xl bg-muted/50">
                        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm">2</div>
                          Receiver Information
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="receiverName">Full Name</Label>
                            <Input id="receiverName" placeholder="Enter receiver name" required />
                          </div>
                          <div>
                            <Label htmlFor="receiverPhone">Phone Number</Label>
                            <Input id="receiverPhone" type="tel" placeholder="+234 XXX XXX XXXX" required />
                          </div>
                          <div>
                            <Label htmlFor="receiverEmail">Email</Label>
                            <Input id="receiverEmail" type="email" placeholder="email@example.com" />
                          </div>
                          <div>
                            <Label htmlFor="deliveryState">Delivery State</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {nigerianStates.map((state) => (
                                  <SelectItem key={state} value={state.toLowerCase()}>{state}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="deliveryAddress">Delivery Address</Label>
                            <Textarea id="deliveryAddress" placeholder="Enter full delivery address" required />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="space-y-6 p-6 rounded-2xl bg-muted/50">
                      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm">3</div>
                        Package Information
                      </h3>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input id="weight" type="number" placeholder="e.g., 2.5" min="0.1" step="0.1" required />
                        </div>
                        <div>
                          <Label htmlFor="dimensions">Dimensions (cm)</Label>
                          <Input id="dimensions" placeholder="L x W x H" />
                        </div>
                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input id="quantity" type="number" placeholder="1" min="1" defaultValue="1" required />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Package Description</Label>
                        <Textarea id="description" placeholder="Describe the contents of your package" required />
                      </div>
                    </div>

                    <div className="flex justify-between pt-8">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Booking"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              /* Success Message */
              <div className="success-message text-center py-20">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-accent" />
                </div>
                <h2 className=" text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Booking Submitted!
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
                  Thank you for your booking request. Our team will contact you shortly with a quote and pickup details.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={() => {
                      setStep(1);
                      setSelectedService("lagos");
                    }}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Book Another Shipment
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/tracking">Track a Package</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quote Calculator Teaser */}
        <section className="py-20 bg-muted/50">
          <div className="container-custom text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
              <Calculator className="w-4 h-4" />
              <span className="text-sm font-medium">Instant Quote</span>
            </div>
            <h2 className=" text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need a Quick Quote?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Contact our team for an instant shipping quote tailored to your needs.
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              WhatsApp: +234 706 816 0887
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Booking;
