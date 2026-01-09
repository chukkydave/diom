import { useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Package, Truck, Plane, Ship, MapPin, Clock, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroTruck from "@/assets/hero-truck.jpg";
import cargoPlane from "@/assets/cargo-plane.jpg";
import cargoShip from "@/assets/cargo-ship.jpg";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "lagos-delivery",
    icon: Package,
    title: "Lagos Delivery",
    subtitle: "Same-Day Service",
    description: "Fast and reliable same-day delivery within Lagos. Your parcels reach their destination promptly with real-time tracking and secure handling.",
    features: [
      "Same-day delivery guarantee",
      "Real-time GPS tracking",
      "Secure packaging",
      "SMS/Email notifications",
    ],
    image: heroTruck,
    link: "/services/lagos-delivery",
  },
  {
    id: "interstate-delivery",
    icon: Truck,
    title: "Interstate Delivery",
    subtitle: "2-3 Working Days",
    description: "Efficient delivery across all 36 states and FCT within 2-3 working days. Nationwide coverage with professional handling.",
    features: [
      "Covers all 36 states + FCT",
      "Door-to-door service",
      "Insurance coverage",
      "Dedicated support",
    ],
    image: heroTruck,
    link: "/services/interstate-delivery",
  },
  {
    id: "international-shipping",
    icon: Plane,
    title: "International Shipping",
    subtitle: "Global Reach",
    description: "Reliable air freight services extending beyond Nigeria for global reach. Connect with the world through our international network.",
    features: [
      "Worldwide destinations",
      "Customs clearance assistance",
      "Express & economy options",
      "Package insurance",
    ],
    image: cargoPlane,
    link: "/services/international-shipping",
  },
  {
    id: "freight-forwarding",
    icon: Ship,
    title: "Freight Forwarding",
    subtitle: "Sea & Air Freight",
    description: "Expert handling for your sea and air freight needs. Smooth logistics for bulky goods and cargo containers.",
    features: [
      "Sea & air freight options",
      "Container shipping",
      "Bulk cargo handling",
      "Warehousing solutions",
    ],
    image: cargoShip,
    link: "/services/freight-forwarding",
  },
  {
    id: "trucking",
    icon: Truck,
    title: "Trucking Services",
    subtitle: "Heavy Cargo",
    description: "Professional trucking solutions for large shipments. Safe and timely delivery of heavy goods across Nigeria.",
    features: [
      "Fleet of modern trucks",
      "Heavy cargo handling",
      "Scheduled pickups",
      "Route optimization",
    ],
    image: heroTruck,
    link: "/services/trucking",
  },
  {
    id: "tracking",
    icon: MapPin,
    title: "Real-Time Tracking",
    subtitle: "Live GPS",
    description: "Monitor your shipment's journey with our advanced tracking system. Complete visibility from pickup to delivery.",
    features: [
      "Live GPS tracking",
      "Status updates",
      "Delivery estimates",
      "Mobile app access",
    ],
    image: heroTruck,
    link: "/tracking",
  },
];

const benefits = [
  { icon: Clock, title: "Fast Delivery", description: "Quick turnaround times for all shipments" },
  { icon: Shield, title: "Secure Handling", description: "Your packages are safe with us" },
  { icon: Headphones, title: "24/7 Support", description: "Always available when you need us" },
  { icon: MapPin, title: "Wide Coverage", description: "Nationwide and international reach" },
];

const Services = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-hero",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        ".service-row",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-list",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".benefit-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".benefits-grid",
            start: "top 85%",
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

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
            <div className="services-hero max-w-3xl mx-auto text-center">
              <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
                Our Services
              </span>
              <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Comprehensive <span className="text-accent">Logistics</span> Solutions
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                From local deliveries to international freight, we offer tailored shipping solutions
                designed to meet your unique needs with professional efficiency.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Bar */}
        <section className="py-12 bg-accent">
          <div className="container-custom">
            <div className="benefits-grid grid grid-cols-2 md:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card flex items-center gap-4 text-accent-foreground">
                  <benefit.icon className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{benefit.title}</p>
                    <p className="text-sm opacity-80">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="section-padding services-list">
          <div className="container-custom">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`service-row grid lg:grid-cols-2 gap-12 items-center mb-20 last:mb-0 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative rounded-3xl overflow-hidden aspect-video">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-accent font-medium text-sm">{service.subtitle}</span>
                  </div>

                  <h2 className=" text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-foreground">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to={service.link}>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-custom text-center">
            <h2 className=" text-3xl md:text-4xl font-bold mb-6">
              Ready to Ship with <span className="text-accent">DIOM?</span>
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              Get started today and experience the difference of professional logistics.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/booking">
                <Button size="lg" className="btn-glow bg-accent text-accent-foreground hover:bg-accent/90">
                  Book a Shipment
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
        </section>
      </div>
    </Layout>
  );
};

export default Services;
