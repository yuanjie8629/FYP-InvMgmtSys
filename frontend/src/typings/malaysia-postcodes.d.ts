declare module 'malaysia-postcodes' {
  export const allPostcodes: {
    name: string;
    city: { name: string; postcode: string[] }[];
  }[];
  export function getStates(): string[];
  export function getCities(state: string): string[];
  export function getPostcodes(state: string, city: string): string[];
  export function findPostcode(postcode: string): {
    found: boolean;
    state: string;
    city: string;
  };
}
