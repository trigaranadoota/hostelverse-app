import { Hostel } from './types';

export const sampleHostels: Hostel[] = [
  {
    id: 'hostel-1',
    name: 'The Wanderer\'s Nook',
    address: '123 Adventure Ave, Mountain View, CA',
    contact: '555-1234',
    location: { lat: 37.422, lng: -122.084 },
    images: [
      {
        id: 'img-1-1',
        url: 'https://picsum.photos/seed/h1/800/600',
        alt: 'Cozy common area with beanbags and a bookshelf',
        hint: 'common area',
      },
      {
        id: 'img-1-2',
        url: 'https://picsum.photos/seed/h1-2/800/600',
        alt: 'Bunk bed room with clean sheets',
        hint: 'bunk beds',
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
        deadline: '2024-09-01T00:00:00Z',
      },
    },
    verification: {
      ai: true,
      human: true,
    },
    reviews: [], // Reviews will be added dynamically by users
    floors: [
      {
        level: 1,
        rooms: [
          { id: '1-101', name: 'Room 101', status: 'available' },
          { id: '1-102', name: 'Room 102', status: 'occupied' },
          { id: '1-103', name: 'Room 103', status: 'available' },
          { id: '1-104', name: 'Room 104', status: 'maintenance' },
        ],
      },
    ],
    gender: 'mixed',
    roomSharing: 'multiple',
  },
  {
    id: 'hostel-2',
    name: 'Serene Stays',
    address: '456 Tranquil Lane, Lakeside, ON',
    contact: '555-5678',
    location: { lat: 43.6532, lng: -79.3832 },
    images: [
      {
        id: 'img-2-1',
        url: 'https://picsum.photos/seed/h2/800/600',
        alt: 'Modern private room with a double bed',
        hint: 'private room',
      },
      {
        id: 'img-2-2',
        url: 'https://picsum.photos/seed/h2-2/800/600',
        alt: 'Rooftop patio with city view',
        hint: 'rooftop patio',
      },
    ],
    amenities: [
      { id: '1', name: 'Free Wi-Fi', icon: 'Wifi' },
      { id: '2', name: 'Parking', icon: 'ParkingCircle' },
      { id: '4', name: 'Air Conditioning', icon: 'Wind' },
      { id: '6', name: 'Laundry', icon: 'WashingMachine' },
    ],
    feeStructure: {
      rent: 15000,
      deposit: 30000,
      includes: ['Wi-Fi', 'AC', 'Laundry'],
      registration: {
        fee: 2500,
        deadline: '2024-08-15T00:00:00Z',
      },
    },
    verification: {
      ai: true,
      human: false,
    },
    reviews: [],
    floors: [
      {
        level: 1,
        rooms: [
          { id: '2-101', name: 'A1', status: 'occupied' },
          { id: '2-102', name: 'A2', status: 'occupied' },
        ],
      },
      {
        level: 2,
        rooms: [
          { id: '2-201', name: 'B1', status: 'available' },
          { id: '2-202', name: 'B2', status: 'available' },
        ],
      },
    ],
    gender: 'female',
    roomSharing: 'single',
  },
  {
    id: 'hostel-3',
    name: 'Urban Hive',
    address: '789 City Center Plaza, New York, NY',
    contact: '555-9101',
    location: { lat: 40.7128, lng: -74.006 },
    images: [
      {
        id: 'img-3-1',
        url: 'https://picsum.photos/seed/h3/800/600',
        alt: 'Lively cafe area inside the hostel',
        hint: 'hostel cafe',
      },
    ],
    amenities: [
      { id: '1', name: 'Free Wi-Fi', icon: 'Wifi' },
      { id: '3', name: 'Shared Kitchen', icon: 'UtensilsCrossed' },
    ],
    feeStructure: {
      rent: 12000,
      deposit: 12000,
      includes: ['Wi-Fi'],
      registration: {
        fee: 1200,
        deadline: '2024-09-10T00:00:00Z',
      },
    },
    verification: {
      ai: false,
      human: false,
    },
    reviews: [],
    floors: [
      {
        level: 1,
        rooms: [
          { id: '3-101', name: 'Pod 1', status: 'available' },
          { id: '3-102', name: 'Pod 2', status: 'available' },
          { id: '3-103', name: 'Pod 3', status: 'occupied' },
          { id: '3-104', name: 'Pod 4', status: 'available' },
          { id: '3-105', name: 'Pod 5', status: 'maintenance' },
          { id: '3-106', name: 'Pod 6', status: 'occupied' },
        ],
      },
    ],
    gender: 'male',
    roomSharing: 'double',
  },
];
