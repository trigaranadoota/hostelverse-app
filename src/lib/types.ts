export type Amenity = {
  id: string;
  name: string;
  icon: React.ElementType;
};

export type Review = {
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
  images: { id: string; url: string; alt: string; hint: string }[];
  amenities: Amenity[];
  feeStructure: {
    rent: number;
    deposit: number;
    includes: string[];
  };
  verification: {
    ai: boolean;
    human: boolean;
  };
  reviews: Review[];
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
  preferredLanguage: string;
};
