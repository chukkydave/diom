import { useRef, useEffect } from "react";
import { Clock, Shield, Users, Award, Headphones, DollarSign } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import warehouseImage from "@/assets/warehouse.jpg";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Clock,
    title: "Nationwide Speed",
    description: "2-3 day delivery across all 36 states and FCT. Our efficient network ensures urgent shipments arrive quickly.",
  },
  {
    icon: Shield,
    title: "Real-Time Tracking",
    description: "Monitor your delivery with our advanced tracking system. Full visibility from pickup to drop-off.",
  },
  {
    icon: Users,
    title: "Customer Oriented",
    description: "Your satisfaction is our priority. Personalized, professional support for all deliveries.",
  },
  {
    icon: Award,
    title: "Professional Handling",
    description: "Expert care for all parcels. Secure packaging and handling ensures your items arrive safely.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support. We're always here to assist with your shipping needs.",
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description: "Competitive rates without compromising quality. Professional service at fair prices.",
  },
];

const WhyChooseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-image",
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".why-image",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".why-content",
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".why-content",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".feature-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-background overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="why-image relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img
                src={warehouseImage}
                alt="DIOM Warehouse Operations"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-card rounded-2xl p-6 shadow-xl border border-border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                  <Award className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <p className="text-3xl  font-bold text-foreground">10+</p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          </div>

          {/* Content Side */}
          <div className="why-content">
            <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
              Why Choose Us
            </span>
            <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Why Choose <span className="text-accent">DIOM</span> Courier Services
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Experience professional, efficient, and affordable logistics solutions tailored for you.
              We're committed to delivering excellence in every shipment.
            </p>

            {/* Features Grid */}
            <div className="features-grid grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="feature-item flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
