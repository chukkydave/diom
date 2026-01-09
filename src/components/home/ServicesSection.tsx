import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Plane, Ship, Package, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Package,
    title: "Lagos Delivery",
    description: "Fast and reliable same-day delivery within Lagos. Your parcels reach their destination promptly with real-time tracking.",
    link: "/services/lagos-delivery",
    highlight: "Same Day",
  },
  {
    icon: Truck,
    title: "Interstate Delivery",
    description: "Efficient delivery across all 36 states and FCT within 2-3 working days. Nationwide coverage you can count on.",
    link: "/services/interstate-delivery",
    highlight: "2-3 Days",
  },
  {
    icon: Plane,
    title: "International Shipping",
    description: "Reliable air freight services extending beyond Nigeria for global reach. Connect with the world seamlessly.",
    link: "/services/international-shipping",
    highlight: "Global",
  },
  {
    icon: Ship,
    title: "Freight Forwarding",
    description: "Expert handling for your sea freight needs. Smooth logistics for bulky goods and cargo containers.",
    link: "/services/freight-forwarding",
    highlight: "Sea & Air",
  },
  {
    icon: Truck,
    title: "Trucking Services",
    description: "Professional trucking solutions for large shipments. Safe and timely delivery of heavy goods across Nigeria.",
    link: "/services/trucking",
    highlight: "Heavy Cargo",
  },
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    description: "Monitor your shipment's journey with our advanced tracking system. Complete visibility from pickup to delivery.",
    link: "/tracking",
    highlight: "Live GPS",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const ServicesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-header",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".service-header",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-muted/50">
      <div className="container-custom">
        {/* Header */}
        <div className="service-header text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Our Services
          </span>
          <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Comprehensive Logistics <span className="text-accent">Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From local deliveries to international freight, we offer tailored shipping solutions
            designed to meet your unique needs with professional efficiency.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Link
                to={service.link}
                className="group relative bg-card rounded-2xl p-8 border border-border hover:border-accent/50 block h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Highlight Badge */}
                <span className="absolute top-6 right-6 text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                  {service.highlight}
                </span>

                {/* Icon */}
                <div className="service-icon mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                  <service.icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className=" text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Link */}
                <div className="flex items-center text-accent font-medium text-sm">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/services">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
