import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ArrowRight, Package, Truck, Plane, Ship, CheckCircle2, Clock, Shield, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import heroTruck from "@/assets/hero-truck.jpg";
import cargoPlane from "@/assets/cargo-plane.jpg";
import cargoShip from "@/assets/cargo-ship.jpg";

const servicesData: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Package;
  image: string;
  features: string[];
  benefits: { title: string; description: string }[];
  pricing: { type: string; price: string; details: string }[];
}> = {
  "lagos-delivery": {
    title: "Lagos Delivery",
    subtitle: "Same-Day Delivery Service",
    description: "Experience lightning-fast same-day delivery within Lagos. Our extensive network of riders and drivers ensures your packages reach their destination within hours, not days. Perfect for e-commerce businesses, documents, and urgent deliveries.",
    icon: Package,
    image: heroTruck,
    features: [
      "Same-day delivery guarantee within Lagos",
      "Real-time GPS tracking for all packages",
      "Secure handling and packaging",
      "SMS and email notifications",
      "Proof of delivery confirmation",
      "Insurance coverage available",
    ],
    benefits: [
      { title: "Speed", description: "Delivery within 2-6 hours depending on location" },
      { title: "Reliability", description: "99% on-time delivery rate" },
      { title: "Flexibility", description: "Multiple pickup and delivery time slots" },
      { title: "Security", description: "Tamper-proof packaging and handling" },
    ],
    pricing: [
      { type: "Mainland to Mainland", price: "₦1,500", details: "Up to 5kg" },
      { type: "Mainland to Island", price: "₦2,500", details: "Up to 5kg" },
      { type: "Island to Island", price: "₦2,000", details: "Up to 5kg" },
    ],
  },
  "interstate-delivery": {
    title: "Interstate Delivery",
    subtitle: "Nationwide Coverage in 2-3 Days",
    description: "Connect with customers across Nigeria through our reliable interstate delivery service. We cover all 36 states and FCT, ensuring your packages arrive safely within 2-3 working days.",
    icon: Truck,
    image: heroTruck,
    features: [
      "Coverage across all 36 states and FCT",
      "2-3 working days delivery guarantee",
      "Door-to-door service",
      "Package insurance up to ₦500,000",
      "Dedicated customer support",
      "Corporate accounts available",
    ],
    benefits: [
      { title: "Reach", description: "Deliver to any location in Nigeria" },
      { title: "Tracking", description: "Real-time updates throughout the journey" },
      { title: "Safety", description: "Secure handling at every transit point" },
      { title: "Support", description: "24/7 customer service" },
    ],
    pricing: [
      { type: "Zone 1 (Nearby States)", price: "₦3,000", details: "Up to 5kg" },
      { type: "Zone 2 (Mid-distance)", price: "₦4,500", details: "Up to 5kg" },
      { type: "Zone 3 (Far States)", price: "₦6,000", details: "Up to 5kg" },
    ],
  },
  "international-shipping": {
    title: "International Shipping",
    subtitle: "Global Reach, Local Expertise",
    description: "Expand your business globally with our comprehensive international shipping solutions. We handle everything from documentation to customs clearance, ensuring smooth delivery to destinations worldwide.",
    icon: Plane,
    image: cargoPlane,
    features: [
      "Shipping to 200+ countries",
      "Customs clearance assistance",
      "Express and economy options",
      "Full package insurance",
      "Import and export services",
      "Documentation support",
    ],
    benefits: [
      { title: "Global Network", description: "Partnerships with major carriers worldwide" },
      { title: "Expertise", description: "Years of international logistics experience" },
      { title: "Compliance", description: "Full regulatory compliance and documentation" },
      { title: "Options", description: "Air and sea freight available" },
    ],
    pricing: [
      { type: "Express Air Freight", price: "Contact Us", details: "3-5 business days" },
      { type: "Economy Air Freight", price: "Contact Us", details: "7-10 business days" },
      { type: "Sea Freight", price: "Contact Us", details: "30-45 days" },
    ],
  },
  "freight-forwarding": {
    title: "Freight Forwarding",
    subtitle: "Bulk Cargo Solutions",
    description: "Specialized freight forwarding services for businesses with bulk shipping needs. We handle sea and air freight for cargo of all sizes, with comprehensive logistics management.",
    icon: Ship,
    image: cargoShip,
    features: [
      "Full container load (FCL) services",
      "Less than container load (LCL) services",
      "Air freight for time-sensitive cargo",
      "Warehousing and distribution",
      "Cargo insurance",
      "Supply chain management",
    ],
    benefits: [
      { title: "Capacity", description: "Handle shipments of any size" },
      { title: "Cost-Effective", description: "Competitive rates for bulk shipping" },
      { title: "Flexibility", description: "Sea and air freight options" },
      { title: "End-to-End", description: "Complete logistics management" },
    ],
    pricing: [
      { type: "FCL 20ft Container", price: "Contact Us", details: "Volume-based pricing" },
      { type: "FCL 40ft Container", price: "Contact Us", details: "Volume-based pricing" },
      { type: "LCL Shipment", price: "Contact Us", details: "Per CBM pricing" },
    ],
  },
  "trucking": {
    title: "Trucking Services",
    subtitle: "Heavy Cargo Transport",
    description: "Professional trucking solutions for large and heavy cargo across Nigeria. Our modern fleet of trucks is equipped to handle any cargo size with the utmost care and efficiency.",
    icon: Truck,
    image: heroTruck,
    features: [
      "Fleet of modern trucks",
      "Heavy cargo handling equipment",
      "Scheduled and on-demand pickups",
      "GPS tracking on all vehicles",
      "Experienced drivers",
      "Route optimization",
    ],
    benefits: [
      { title: "Capacity", description: "Trucks from 3 to 30 tons capacity" },
      { title: "Coverage", description: "Nationwide delivery network" },
      { title: "Safety", description: "Regular vehicle maintenance and checks" },
      { title: "Efficiency", description: "Optimized routes for faster delivery" },
    ],
    pricing: [
      { type: "3-5 Ton Truck", price: "Contact Us", details: "Distance-based pricing" },
      { type: "10-15 Ton Truck", price: "Contact Us", details: "Distance-based pricing" },
      { type: "20-30 Ton Truck", price: "Contact Us", details: "Distance-based pricing" },
    ],
  },
};

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const pageRef = useRef<HTMLDivElement>(null);

  const service = serviceId ? servicesData[serviceId] : null;

  useEffect(() => {
    if (!service) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-hero",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        ".service-content",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".service-content",
            start: "top 80%",
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [service]);

  if (!service) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl  font-bold mb-4">Service Not Found</h1>
            <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
            <Link to="/services">
              <Button>View All Services</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const ServiceIcon = service.icon;

  return (
    <Layout>
      <div ref={pageRef}>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/90" />
          </div>

          <div className="container-custom relative z-10">
            <div className="service-hero max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <ServiceIcon className="w-6 h-6 text-accent-foreground" />
                </div>
                <span className="text-accent font-medium">{service.subtitle}</span>
              </div>
              <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                {service.title}
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/booking">
                  <Button size="lg" className="btn-glow bg-accent text-accent-foreground hover:bg-accent/90">
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-primary-foreground/60 text-primary-foreground bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-primary-foreground shadow-lg">
                    Get a Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="service-content grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
                  Features
                </span>
                <h2 className=" text-3xl md:text-4xl font-bold text-foreground mb-6">
                  What's Included
                </h2>
                <ul className="space-y-4">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {service.benefits.map((benefit, index) => (
                  <div key={index} className="bg-card rounded-2xl p-6 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="section-padding bg-muted/50">
          <div className="container-custom">
            <div className="service-content text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
                Pricing
              </span>
              <h2 className=" text-3xl md:text-4xl font-bold text-foreground mb-4">
                Transparent Pricing
              </h2>
              <p className="text-muted-foreground">
                Competitive rates with no hidden fees. Get the best value for your shipments.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {service.pricing.map((price, index) => (
                <div key={index} className="bg-card rounded-2xl p-8 border border-border text-center card-hover">
                  <h4 className="font-semibold text-foreground mb-2">{price.type}</h4>
                  <p className="text-3xl  font-bold text-accent mb-2">{price.price}</p>
                  <p className="text-sm text-muted-foreground">{price.details}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-muted-foreground mb-4">
                Need a custom quote? Contact us for personalized pricing.
              </p>
              <Link to="/contact">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Request Custom Quote
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className=" text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              Book your {service.title.toLowerCase()} today and experience the DIOM difference.
            </p>
            <Link to="/booking">
              <Button size="lg" className="btn-glow bg-accent text-accent-foreground hover:bg-accent/90">
                Book Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ServiceDetail;
