import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import cargoPlane from "@/assets/cargo-plane.jpg";

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-content",
            start: "top 80%",
          },
        }
      );

      // Parallax on image
      gsap.to(".cta-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="cta-bg absolute inset-0 z-0">
        <img
          src={cargoPlane}
          alt="International Freight Services"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="cta-content max-w-3xl">
          <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Start Shipping Today
          </span>
          <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Ship with <span className="text-accent">DIOM</span> Courier Services
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl">
            With advanced tracking, professional handling, and affordable rates —
            your shipments are in safe hands. Join thousands of satisfied customers today.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link to="/booking">
              <Button size="lg" className="btn-glow bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8">
                Get a Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="tel:+2347068160887">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/60 text-primary-foreground bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-primary-foreground shadow-lg text-base px-8"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
            </a>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-8 text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Fast Deliveries within Lagos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Affordable Pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Professional Handling</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
