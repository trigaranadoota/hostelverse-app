
import { Hostel } from './types';

export const seedHostels: Omit<Hostel, 'id'>[] = [
  {
    name: 'The Wanderer\'s Rest',
    address: '123 Adventure Ave, Metro City',
    contact: '555-1234',
    location: { lat: 12.9716, lng: 77.5946 },
    images: [
      {
        id: 'wanderer-1',
        url: 'https://picsum.photos/seed/wanderer1/600/400',
        alt: 'Cozy common area at The Wanderer\'s Rest',
        hint: 'hostel lounge'
      },
      {
        id: 'wanderer-2',
        url: 'https://picsum.photos/seed/wanderer2/600/400',
        alt: 'Bunk bed dormitory',
        hint: 'hostel room'
      },
    ],
    amenities: [
      { id: '1', name: 'Free Wi-Fi', icon: 'Wifi' },
      { id: '3', name: 'Shared Kitchen', icon: 'UtensilsCrossed' },
      { id: '5', name: 'TV Room', icon: 'Tv' },
    ],
    feeStructure: {
      rent: 8000,
      deposit: 16000,
      includes: ['Wi-Fi', 'Water', 'Electricity'],
      registration: {
        fee: 1000,
        deadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      },
    },
    verification: { ai: true, human: true },
    reviews: [],
    floors: [
      {
        level: 1,
        rooms: [
          { id: 'w-101', name: 'R101', status: 'available' },
          { id: 'w-102', name: 'R102', status: 'occupied' },
          { id: 'w-103', name: 'R103', status: 'available' },
          { id: 'w-104', name: 'R104', status: 'maintenance' },
        ],
      },
    ],
    gender: 'mixed',
    roomSharing: 'multiple',
  },
  {
    name: 'Sunset Point Hostel',
    address: '456 Ocean View, Coastal Town',
    contact: '555-5678',
    location: { lat: 12.9141, lng: 74.8560 },
    images: [
      {
        id: 'sunset-1',
        url: 'https://picsum.photos/seed/sunset1/600/400',
        alt: 'View from Sunset Point Hostel',
        hint: 'ocean view'
      },
       {
        id: 'sunset-2',
        url: 'https://picsum.photos/seed/sunset2/600/400',
        alt: 'Clean and modern dormitory',
        hint: 'hostel dormitory'
      },
    ],
    amenities: [
      { id: '1', name: 'Free Wi-Fi', icon: 'Wifi' },
      { id: '4', name: 'Air Conditioning', icon: 'Wind' },
      { id: '6', name: 'Laundry', icon: 'WashingMachine' },
    ],
    feeStructure: {
      rent: 12000,
      deposit: 24000,
      includes: ['Wi-Fi', 'AC', 'Laundry'],
       registration: {
        fee: 1500,
        deadline: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
      },
    },
    verification: { ai: true, human: false },
    reviews: [],
    floors: [
      {
        level: 1,
        rooms: [
          { id: 's-101', name: 'S101', status: 'available' },
          { id: 's-102', name: 'S102', status: 'available' },
        ],
      },
      {
        level: 2,
        rooms: [
          { id: 's-201', name: 'S201', status: 'occupied' },
          { id: 's-202', name: 'S202', status: 'available' },
        ],
      },
    ],
    gender: 'female',
    roomSharing: 'double',
  },
  {
    name: 'Urban Hive',
    address: '789 Downtown Plaza, Busy City',
    contact: '555-9101',
    location: { lat: 19.0760, lng: 72.8777 },
    images: [
      {
        id: 'urban-1',
        url: 'https://picsum.photos/seed/urban1/600/400',
        alt: 'Rooftop terrace at Urban Hive',
        hint: 'city rooftop'
      },
       {
        id: 'urban-2',
        url: 'https://picsum.photos/seed/urban2/600/400',
        alt: 'Private room with city view',
        hint: 'private room'
      },
    ],
    amenities: [
      { id: '1', name: 'Free Wi-Fi', icon: 'Wifi' },
      { id: '2', name: 'Parking', icon: 'ParkingCircle' },
      { id: '3', name: 'Shared Kitchen', icon: 'UtensilsCrossed' },
      { id: '4', name: 'Air Conditioning', icon: 'Wind' },
    ],
    feeStructure: {
      rent: 15000,
      deposit: 30000,
      includes: ['All utilities'],
       registration: {
        fee: 2000,
        deadline: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
      },
    },
    verification: { ai: false, human: false },
    reviews: [],
    floors: [
      {
        level: 1,
        rooms: [
          { id: 'u-101', name: 'U101', status: 'available' },
        ],
      },
    ],
    gender: 'male',
    roomSharing: 'single',
  },
];


export const seedReviews: (Omit<Review, 'id' | 'hostelId' | 'createdAt'> & {hostelName: string, imageUrl?: string})[] = [
    {
        hostelName: 'The Wanderer\'s Rest',
        userId: 'seeder-user-1',
        text: 'Great place to meet fellow travelers! The common area is fantastic.',
        foodRating: 4,
        cleanlinessRating: 5,
        managementRating: 4,
        safetyRating: 5,
        userDisplayName: 'Alex',
        imageUrl: 'https://picsum.photos/seed/review1/400/300',
    },
    {
        hostelName: 'The Wanderer\'s Rest',
        userId: 'seeder-user-2',
        text: 'It was decent for the price. A bit noisy at night but facilities were clean.',
        foodRating: 3,
        cleanlinessRating: 4,
        managementRating: 3,
        safetyRating: 4,
        userDisplayName: 'Maria',
    },
    {
        hostelName: 'Sunset Point Hostel',
        userId: 'seeder-user-3',
        text: 'Absolutely stunning views and the staff were incredibly friendly. Highly recommend!',
        foodRating: 5,
        cleanlinessRating: 5,
        managementRating: 5,
        safetyRating: 5,
        userDisplayName: 'Chloe',
    }
];
