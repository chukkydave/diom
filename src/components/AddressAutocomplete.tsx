import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { loadGoogleMapsScript } from "@/lib/googleMaps";

// Google Maps integration - commented out for now
// Uncomment when ready to use Google Maps Places API
/*
// Extend Window interface to include Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            inputField: HTMLInputElement,
            opts?: {
              componentRestrictions?: { country: string | string[] };
              fields?: string[];
              types?: string[];
            }
          ) => {
            getPlace: () => {
              formatted_address?: string;
              name?: string;
              geometry?: {
                location: {
                  lat(): number;
                  lng(): number;
                };
              };
              address_components?: Array<{
                long_name: string;
                short_name: string;
                types: string[];
              }>;
            };
            addListener: (
              eventName: string,
              handler: () => void
            ) => { remove: () => void };
          };
        };
        event: {
          removeListener: (listener: { remove: () => void }) => void;
        };
      };
    };
  }
}
*/

interface AddressAutocompleteProps {
    id: string;
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export const AddressAutocomplete = ({
    id,
    label,
    placeholder = "Enter address...",
    value,
    onChange,
    required = false,
}: AddressAutocompleteProps) => {
    // Google Maps integration - commented out for now
    /*
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<InstanceType<typeof window.google.maps.places.Autocomplete> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    // Load Google Maps script
    useEffect(() => {
      loadGoogleMapsScript()
        .then(() => {
          setIsGoogleMapsLoaded(true);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to load Google Maps:", err);
          setError("Failed to load address search. Please refresh the page.");
          setIsGoogleMapsLoaded(false);
        });
    }, []);
  
    // Initialize Google Maps Autocomplete
    useEffect(() => {
      if (!isGoogleMapsLoaded || !inputRef.current) return;
  
      // Create autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: "ng" }, // Restrict to Nigeria
          fields: ["formatted_address", "geometry", "name", "address_components"],
          types: ["address"], // Focus on addresses
        }
      );
  
      autocompleteRef.current = autocomplete;
  
      // Handle place selection
      const placeChangedListener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setIsLoading(false);
  
        if (place.formatted_address) {
          onChange(place.formatted_address);
        } else if (place.name) {
          onChange(place.name);
        }
        
        // Blur the input after selection
        if (inputRef.current) {
          inputRef.current.blur();
        }
      });
  
      return () => {
        if (placeChangedListener) {
          window.google.maps.event.removeListener(placeChangedListener);
        }
      };
    }, [isGoogleMapsLoaded, onChange]);
    */

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    value={value}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full pr-10"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
        </div>
    );
};
