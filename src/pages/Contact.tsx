import { useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import gsap from "gsap";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Office",
    details: ["Office C4 Gbaja Shopping Mall", "Off Akerele Rd, Opp St Anthony's", "Catholic Church, Surulere, Nigeria"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+234 706 816 0887", "+234 800 DIOM EXPRESS"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["diomexpress@gmail.com", "support@diomcourier.com"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Monday - Friday: 8AM - 8PM", "Saturday: 9AM - 5PM", "Sunday: Closed"],
  },
];

const Contact = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-hero",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        ".contact-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-grid",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".contact-form",
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".contact-form",
            start: "top 80%",
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
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
            <div className="contact-hero max-w-3xl mx-auto text-center">
              <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
                Contact Us
              </span>
              <h1 className=" text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Get in <span className="text-accent">Touch</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Have questions about our services? Need a custom quote? Our team is here to help. 
                Reach out to us through any of the channels below.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 -mt-10">
          <div className="container-custom">
            <div className="contact-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="contact-card bg-card rounded-2xl p-6 border border-border text-center card-hover"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{item.title}</h3>
                  {item.details.map((detail, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Content */}
              <div>
                <span className="inline-block text-accent font-medium tracking-widest uppercase text-sm mb-4">
                  Send a Message
                </span>
                <h2 className=" text-3xl md:text-4xl font-bold text-foreground mb-6">
                  We'd Love to <span className="text-accent">Hear</span> From You
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Whether you have a question about our services, need a custom quote, or want to 
                  discuss partnership opportunities, our team is ready to assist you.
                </p>

                {/* WhatsApp CTA */}
                <div className="bg-accent/10 rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Quick Response via WhatsApp</h4>
                      <p className="text-sm text-muted-foreground">Get instant support on WhatsApp</p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/2347068160887"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-accent font-medium hover:underline"
                  >
                    Chat on WhatsApp
                    <Send className="w-4 h-4" />
                  </a>
                </div>

                {/* Map Placeholder */}
                <div className="rounded-2xl overflow-hidden aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Surulere, Lagos, Nigeria</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form bg-card rounded-3xl p-8 md:p-10 border border-border">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+234 XXX XXX XXXX" />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="How can we help?" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-20 bg-muted/50">
          <div className="container-custom text-center">
            <h2 className=" text-2xl md:text-3xl font-bold text-foreground mb-4">
              Have More Questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Check our frequently asked questions or reach out directly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View FAQs
              </Button>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                Book a Consultation
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
