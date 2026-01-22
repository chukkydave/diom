// Type definitions for Google Maps
declare namespace google {
    namespace maps {
        namespace places {
            interface AutocompleteOptions {
                componentRestrictions?: { country: string | string[] };
                fields?: string[];
                types?: string[];
            }

            class Autocomplete {
                constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
                getPlace(): PlaceResult;
                addListener(
                    eventName: string,
                    handler: () => void
                ): google.maps.MapsEventListener;
            }

            interface PlaceResult {
                formatted_address?: string;
                name?: string;
                geometry?: {
                    location: google.maps.LatLng;
                };
                address_components?: google.maps.places.PlaceAddressComponent[];
            }

            interface PlaceAddressComponent {
                long_name: string;
                short_name: string;
                types: string[];
            }
        }

        interface MapsEventListener {
            remove(): void;
        }

        interface LatLng {
            lat(): number;
            lng(): number;
        }

        namespace event {
            function removeListener(listener: MapsEventListener): void;
        }
    }
}
