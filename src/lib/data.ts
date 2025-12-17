import { Hostel, Amenity } from './types';
import { Wifi, ParkingCircle, UtensilsCrossed, Wind, Tv, WashingMachine } from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';

const getImageUrl = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const amenities: Amenity[] = [
  { id: '1', name: 'Free Wi-Fi', icon: Wifi },
  { id: '2', name: 'Parking', icon: ParkingCircle },
  { id: '3', name: 'Shared Kitchen', icon: UtensilsCrossed },
  { id: '4', name: 'Air Conditioning', icon: Wind },
  { id: '5', name: 'TV Room', icon: Tv },
  { id: '6', name: 'Laundry', icon: WashingMachine },
];

export const hostels: Hostel[] = [
  {
    id: '1',
    name: "The Wanderer's Hub",
    address: '123 Adventure Ave, Metro City',
    contact: 'contact@wanderershub.com',
    images: [
      { id: 'h1i1', url: getImageUrl('hostel-1-exterior'), alt: 'Exterior of The Wanderer\'s Hub', hint: 'hostel exterior' },
      { id: 'h1i2', url: getImageUrl('hostel-1-room'), alt: 'Dorm room at The Wanderer\'s Hub', hint: 'dorm room' },
      { id: 'h1i3', url: getImageUrl('hostel-1-common'), alt: 'Common area at The Wanderer\'s Hub', hint: 'hostel lounge' },
    ],
    amenities: [amenities[0], amenities[2], amenities[4], amenities[5]],
    feeStructure: {
      rent: 5000,
      deposit: 10000,
      includes: ['Wi-Fi', 'Water', 'Electricity'],
    },
    verification: { ai: true, human: true },
    reviews: [
      {
        id: 'r1',
        author: 'Alex',
        avatarUrl: getImageUrl('avatar-1'),
        date: '2 weeks ago',
        content: 'Amazing place! Very clean and the staff is super friendly. The common area is a great place to meet new people. Highly recommended!',
        imageUrl: getImageUrl('review-1-img'),
        ratings: { food: 4, cleanliness: 5, management: 5, safety: 5 },
      },
    ],
    floors: [
      {
        level: 1,
        rooms: [
          { id: '101', name: 'Room 101', status: 'available' },
          { id: '102', name: 'Room 102', status: 'occupied' },
          { id: '103', name: 'Room 103', status: 'maintenance' },
          { id: '104', name: 'Room 104', status: 'available' },
        ],
      },
      {
        level: 2,
        rooms: [
          { id: '201', name: 'Room 201', status: 'occupied' },
          { id: '202', name: 'Room 202', status: 'occupied' },
          { id: '203', name: 'Room 203', status: 'available' },
          { id: '204', name: 'Room 204', status: 'maintenance' },
        ],
      },
    ],
    gender: 'mixed',
    roomSharing: 'multiple',
  },
  {
    id: '2',
    name: 'The City Nomad',
    address: '456 Urban St, Central Plaza',
    contact: 'info@citynomad.com',
    images: [
        { id: 'h2i1', url: getImageUrl('hostel-2-exterior'), alt: 'Exterior of The City Nomad', hint: 'city building' },
        { id: 'h2i2', url: getImageUrl('hostel-2-room'), alt: 'Bunk beds at The City Nomad', hint: 'bunk beds' },
        { id: 'h2i3', url: getImageUrl('hostel-2-kitchen'), alt: 'Kitchen at The City Nomad', hint: 'hostel kitchen' },
    ],
    amenities: [amenities[0], amenities[1], amenities[2], amenities[3]],
    feeStructure: {
      rent: 8000,
      deposit: 15000,
      includes: ['Wi-Fi', 'AC', 'Housekeeping'],
    },
    verification: { ai: true, human: false },
    reviews: [
      {
        id: 'r2',
        author: 'Sarah',
        avatarUrl: getImageUrl('avatar-2'),
        date: '1 month ago',
        content: "Great location, right in the heart of the city. Rooms are a bit small, but it's a great value for the price. The kitchen is well-equipped.",
        ratings: { food: 3, cleanliness: 4, management: 4, safety: 4 },
      },
    ],
    floors: [
        {
          level: 1,
          rooms: [
            { id: '101', name: 'Bed 1A', status: 'occupied' },
            { id: '102', name: 'Bed 1B', status: 'occupied' },
            { id: '103', name: 'Bed 2A', status: 'available' },
            { id: '104', name: 'Bed 2B', status: 'available' },
            { id: '105', name: 'Bed 3A', status: 'maintenance' },
            { id: '106', name: 'Bed 3B', status: 'occupied' },
          ],
        },
      ],
    gender: 'female',
    roomSharing: 'double',
  },
  {
    id: '3',
    name: 'The Green Haven (Men)',
    address: '789 Nature Ln, Verdant Valley',
    contact: 'stay@greenhaven.com',
    images: [
        { id: 'h3i1', url: getImageUrl('hostel-3-exterior'), alt: 'Exterior of The Green Haven', hint: 'building nature' },
        { id: 'h3i2', url: getImageUrl('hostel-3-room'), alt: 'Room at The Green Haven', hint: 'bedroom window' },
    ],
    amenities: [amenities[0], amenities[1]],
    feeStructure: {
      rent: 6500,
      deposit: 12000,
      includes: ['Wi-Fi', 'Parking'],
    },
    verification: { ai: false, human: false },
    reviews: [],
    floors: [
        {
          level: 1,
          rooms: [
            { id: '101', name: 'Room 1', status: 'available' },
            { id: '102', name: 'Room 2', status: 'available' },
            { id: '103', name: 'Room 3', status: 'occupied' },
          ],
        },
    ],
    gender: 'male',
    roomSharing: 'single',
  },
];
