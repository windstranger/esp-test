export type JSONData = { data: { [key: number]: User }, ids: number[] }
// Define metadata for User type

export type User = {
    _id: string; // ObjectId as a string
    index: number; // Sequential index
    guid: string; // Globally unique identifier
    isActive: boolean; // Boolean flag for activity status
    balance: string; // Formatted balance string (e.g., "$0,0.00")
    picture: string; // URL to a picture
    age: number; // Integer between 20 and 40
    eyeColor: "blue" | "brown" | "green"; // Eye color options
    name: string; // Full name (first name + surname)
    gender: "male" | "female" | "other"; // Gender
    company: string; // Company name in uppercase
    email: string; // Email address
    phone: string; // Phone number
    address: string; // Full address as a string
    about: string; // Paragraph of lorem ipsum text
    registered: string; // Date string in the format "YYYY-MM-ddThh:mm:ss Z"
    latitude: number; // Floating point latitude
    longitude: number; // Floating point longitude
};
