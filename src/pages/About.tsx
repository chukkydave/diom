import { useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, Heart, Users, Award, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import deliveryPerson from "@/assets/delivery-person.jpg";
import warehouseImage from "@/assets/warehouse.jpg";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in every delivery, ensuring the highest quality service.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "Honesty and transparency guide every interaction with our customers.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Your satisfaction is our priority. We go above and beyond for you.",
  },
  {
    icon: Award,
    title: "Reliability",
    description: "Count on us for consistent, dependable service every single time.",
  },
];

const stats = [
  { value: "10+", label: "Years of Experience" },
  { value: "50,000+", label: "Successful Deliveries" },
  { value: "36+", label: "States Covered" },
  { value: "99%", label: "Customer Satisfaction" },
];

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-hero-content",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        ".about-section",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-sections",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".value-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".values-grid",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".stat-item",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".stats-grid",
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
            <div className="about-hero-content max-w-3xl mx-auto text-center">
              <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
                About Us
              </span>
              <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Your Trusted <span className="text-accent">Logistics Partner</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                At DIOM Courier Services, we connect Nigeria and the world one delivery at a time.
                Professional, efficient, and affordable logistics solutions tailored for you.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="section-padding about-sections">
          <div className="container-custom">
            <div className="about-section grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden">
                  <img
                    src={deliveryPerson}
                    alt="DIOM Courier Team"
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-2xl p-6 shadow-xl">
                  <p className="text-4xl  font-bold">10+</p>
                  <p className="text-sm">Years of Excellence</p>
                </div>
              </div>

              <div>
                <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
                  Our Story
                </span>
                <h2 className=" text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Building Trust, One <span className="text-accent">Delivery</span> at a Time
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Founded with a vision to revolutionize logistics in Nigeria, DIOM Courier Services
                  has grown from a small local delivery company to a trusted nationwide logistics partner.
                  Our journey began with a simple promise: to deliver excellence in every package.
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Today, we serve thousands of customers across all 36 states and FCT, handling everything
                  from same-day Lagos deliveries to international freight forwarding. Our commitment to
                  professionalism, reliability, and customer satisfaction remains unwavering.
                </p>
                <Link to="/services">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Explore Our Services
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-muted/50">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="about-section bg-card rounded-3xl p-8 md:p-12 border border-border">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-accent" />
                </div>
                <h3 className=" text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To provide reliable, efficient, and affordable logistics solutions that connect
                  businesses and individuals across Nigeria and beyond. We are committed to delivering
                  excellence through innovation, professionalism, and customer-focused service.
                </p>
              </div>

              <div className="about-section bg-card rounded-3xl p-8 md:p-12 border border-border">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-accent" />
                </div>
                <h3 className=" text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To become Africa's most trusted and innovative logistics company, setting the
                  standard for excellence in delivery services. We envision a future where distance
                  is no barrier to connectivity and commerce.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
                Core Values
              </span>
              <h2 className=" text-3xl md:text-4xl font-bold text-foreground">
                The Principles That <span className="text-accent">Guide</span> Us
              </h2>
            </div>

            <div className="values-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="value-card bg-card rounded-2xl p-8 border border-border text-center card-hover"
                >
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className=" text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-custom">
            <div className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item text-center">
                  <p className="text-4xl md:text-5xl  font-bold text-accent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-primary-foreground/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={warehouseImage}
              alt="DIOM Operations"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/90" />
          </div>

          <div className="container-custom relative z-10 text-center">
            <h2 className=" text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Experience <span className="text-accent">Excellence?</span>
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
              Join thousands of satisfied customers who trust DIOM Courier Services
              for their logistics needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/booking">
                <Button size="lg" className="btn-glow bg-accent text-accent-foreground hover:bg-accent/90">
                  Book a Shipment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
