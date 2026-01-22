// Utility to load Google Maps Places API dynamically
export const loadGoogleMapsScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.google && window.google.maps && window.google.maps.places) {
            resolve();
            return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector(
            'script[src*="maps.googleapis.com"]'
        );
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve());
            existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
            return;
        }

        // Get API key from environment variable
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            console.warn(
                "Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file"
            );
            reject(new Error("Google Maps API key not configured"));
            return;
        }

        // Create and load script
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Maps script"));
        document.head.appendChild(script);
    });
};
