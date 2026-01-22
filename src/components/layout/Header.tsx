import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/services", label: "Services" },
    { path: "/tracking", label: "Tracking" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-card/95 backdrop-blur-lg shadow-lg py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/Diom2.png"
            alt="DIOM Courier Services"
            className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className={`font-bold text-xl tracking-tight ${isScrolled ? 'text-primary' : 'text-primary-foreground'}`}>
              DIOM
            </span>
            <span className={`text-[10px] tracking-widest-custom uppercase ${isScrolled ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
              Courier Services
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link text-sm font-medium transition-colors ${isActive(link.path)
                ? "text-accent"
                : isScrolled
                  ? "text-foreground hover:text-accent"
                  : "text-primary-foreground/90 hover:text-accent"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/tracking">
            <Button
              variant="outline"
              size="sm"
              className={`transition-all ${isScrolled
                ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                : 'border-primary-foreground/60 text-primary-foreground bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-primary-foreground shadow-md'}`}
            >
              Track Shipment
            </Button>
          </Link>
          <Link to="/booking">
            <Button size="sm" className="btn-glow bg-accent text-accent-foreground hover:bg-accent/90">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-card shadow-xl transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <nav className="container-custom py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-medium py-2 ${isActive(link.path) ? "text-accent" : "text-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <Link to="/tracking" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Track Shipment
              </Button>
            </Link>
            <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-accent text-accent-foreground">
                Book Now
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2 pt-4 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span className="text-sm">+234 706 816 0887</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
