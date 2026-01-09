import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Amina Bello",
    role: "E-commerce Owner",
    location: "Lagos",
    content: "DIOM Courier Services delivered my package within Lagos in just one day! The tracking was spot on, and the service was excellent. Highly recommend for any e-commerce business!",
    rating: 5,
  },
  {
    name: "Tunde Adebayo",
    role: "Business Manager",
    location: "Abuja",
    content: "Reliable and affordable interstate delivery with DIOM. They handled my shipment across Nigeria flawlessly with great support! My go-to courier for all business shipments.",
    rating: 5,
  },
  {
    name: "Chika Okonkwo",
    role: "Exporter",
    location: "Port Harcourt",
    content: "Shipping internationally with DIOM was a breeze. Their freight forwarding services and secure handling kept my goods safe and on time. Professional team!",
    rating: 5,
  },
  {
    name: "Fatima Ibrahim",
    role: "Retailer",
    location: "Kano",
    content: "The real-time tracking feature gave me complete peace of mind. I could monitor my package every step of the way. DIOM has transformed how I handle logistics.",
    rating: 5,
  },
  {
    name: "Emmanuel Obi",
    role: "Manufacturer",
    location: "Onitsha",
    content: "Their trucking services are top-notch. Large shipments handled with care and delivered on schedule. DIOM understands the needs of businesses like mine.",
    rating: 5,
  },
];

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const newIndex = (currentIndex + newDirection + testimonials.length) % testimonials.length;
    setCurrentIndex(newIndex);
    setPage([page + newDirection, newDirection]);
  };

  const nextTestimonial = () => paginate(1);
  const prevTestimonial = () => paginate(-1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-header",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonial-header",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section ref={sectionRef} className="section-padding bg-primary text-primary-foreground overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="testimonial-header text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
            Customer Stories
          </span>
          <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            What Our <span className="text-accent">Customers</span> Say
          </h2>
          <p className="text-lg text-primary-foreground/70">
            Don't just take our word for it. Here's what our valued customers have to say about their experience with DIOM Courier Services.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <Quote className="absolute -top-4 -left-4 md:-top-8 md:-left-8 w-16 h-16 md:w-24 md:h-24 text-accent/20" />

          {/* Main Testimonial */}
          <div className="bg-primary-foreground/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-primary-foreground/10 min-h-[320px] relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-xl md:text-2xl text-primary-foreground/90 leading-relaxed mb-8 italic">
                  "{testimonials[currentIndex].content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent  font-bold text-xl">
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-primary-foreground text-lg">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-primary-foreground/60">
                      {testimonials[currentIndex].role}, {testimonials[currentIndex].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setPage([index, index > currentIndex ? 1 : -1]);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${index === currentIndex
                      ? "w-8 bg-accent"
                      : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                    }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
