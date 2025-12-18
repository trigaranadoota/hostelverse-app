import type { Timestamp, FieldValue } from 'firebase/firestore';

export type Amenity = {
  id: string;
  name: string;
  icon: string; // Changed from React.ElementType to string
};

export type Review = {
  id: string;
  hostelId: string;
  userId: string;
  text: string;
  foodRating: number;
  cleanlinessRating: number;
  managementRating: number;
  safetyRating: number;
  createdAt: Timestamp | Date | FieldValue;
  userDisplayName?: string;
  userPhotoURL?: string;
  imageUrl?: string;
};

export type Room = {
  id: string;
  name: string;
  status: 'available' | 'occupied' | 'maintenance';
};

export type Hostel = {
  id: string;
  name: string;
  address: string;
  contact: string;
  location: {
    lat: number;
    lng: number;
  };
  images: { id: string; url: string; alt: string; hint: string }[];
  amenities: Amenity[];
  feeStructure: {
    rent: number;
    deposit: number;
    includes: string[];
    registration: {
      fee: number;
      deadline: string;
    };
  };
  verification: {
    ai: boolean;
    human: boolean;
  };
  reviews: {
    id: string;
    author: string;
    avatarUrl: string;
    date: string;
    content: string;
    imageUrl?: string;
    ratings: {
        food: number;
        cleanliness: number;
        management: number;
        safety: number;
    };
  }[];
  floors: {
    level: number;
    rooms: Room[];
  }[];
  gender: 'male' | 'female' | 'mixed';
  roomSharing: 'single' | 'double' | 'multiple';
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  preferredLanguage: string;
};

export type Wishlist = {
  id: string;
  userId: string;
  hostelId: string;
};
