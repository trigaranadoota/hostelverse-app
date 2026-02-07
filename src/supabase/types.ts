// Database types for Supabase
// This file provides TypeScript types for your Supabase tables

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    first_name: string;
                    last_name: string;
                    email: string;
                    mobile_number: string | null;
                    date_of_birth: string | null;
                    preferred_language: string;
                    address: string | null;
                    pin_code: string | null;
                    country: string | null;
                    state: string | null;
                    category: string | null;
                    annual_income: number | null;
                    score_10th: number | null;
                    score_12th: number | null;
                    distance: number | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    first_name: string;
                    last_name: string;
                    email: string;
                    mobile_number?: string | null;
                    date_of_birth?: string | null;
                    preferred_language?: string;
                    address?: string | null;
                    pin_code?: string | null;
                    country?: string | null;
                    state?: string | null;
                    category?: string | null;
                    annual_income?: number | null;
                    score_10th?: number | null;
                    score_12th?: number | null;
                    distance?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    first_name?: string;
                    last_name?: string;
                    email?: string;
                    mobile_number?: string | null;
                    date_of_birth?: string | null;
                    preferred_language?: string;
                    address?: string | null;
                    pin_code?: string | null;
                    country?: string | null;
                    state?: string | null;
                    category?: string | null;
                    annual_income?: number | null;
                    score_10th?: number | null;
                    score_12th?: number | null;
                    distance?: number | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            hostels: {
                Row: {
                    id: string;
                    name: string;
                    address: string;
                    contact: string;
                    location_lat: number;
                    location_lng: number;
                    rent: number;
                    deposit: number;
                    fee_includes: string[];
                    registration_fee: number;
                    registration_deadline: string;
                    verification_ai: boolean;
                    verification_human: boolean;
                    gender: 'male' | 'female' | 'mixed';
                    room_sharing: 'single' | 'double' | 'multiple';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    address: string;
                    contact: string;
                    location_lat: number;
                    location_lng: number;
                    rent: number;
                    deposit: number;
                    fee_includes?: string[];
                    registration_fee?: number;
                    registration_deadline?: string;
                    verification_ai?: boolean;
                    verification_human?: boolean;
                    gender: 'male' | 'female' | 'mixed';
                    room_sharing: 'single' | 'double' | 'multiple';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    address?: string;
                    contact?: string;
                    location_lat?: number;
                    location_lng?: number;
                    rent?: number;
                    deposit?: number;
                    fee_includes?: string[];
                    registration_fee?: number;
                    registration_deadline?: string;
                    verification_ai?: boolean;
                    verification_human?: boolean;
                    gender?: 'male' | 'female' | 'mixed';
                    room_sharing?: 'single' | 'double' | 'multiple';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            hostel_images: {
                Row: {
                    id: string;
                    hostel_id: string;
                    url: string;
                    alt: string;
                    hint: string;
                    display_order: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    hostel_id: string;
                    url: string;
                    alt?: string;
                    hint?: string;
                    display_order?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    hostel_id?: string;
                    url?: string;
                    alt?: string;
                    hint?: string;
                    display_order?: number;
                    created_at?: string;
                };
            };
            hostel_amenities: {
                Row: {
                    id: string;
                    hostel_id: string;
                    name: string;
                    icon: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    hostel_id: string;
                    name: string;
                    icon: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    hostel_id?: string;
                    name?: string;
                    icon?: string;
                    created_at?: string;
                };
            };
            hostel_floors: {
                Row: {
                    id: string;
                    hostel_id: string;
                    level: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    hostel_id: string;
                    level: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    hostel_id?: string;
                    level?: number;
                    created_at?: string;
                };
            };
            hostel_rooms: {
                Row: {
                    id: string;
                    floor_id: string;
                    name: string;
                    status: 'available' | 'occupied' | 'maintenance';
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    floor_id: string;
                    name: string;
                    status?: 'available' | 'occupied' | 'maintenance';
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    floor_id?: string;
                    name?: string;
                    status?: 'available' | 'occupied' | 'maintenance';
                    created_at?: string;
                };
            };
            reviews: {
                Row: {
                    id: string;
                    hostel_id: string;
                    user_id: string;
                    text: string;
                    food_rating: number;
                    cleanliness_rating: number;
                    management_rating: number;
                    safety_rating: number;
                    image_url: string | null;
                    user_display_name: string;
                    user_photo_url: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    hostel_id: string;
                    user_id: string;
                    text: string;
                    food_rating: number;
                    cleanliness_rating: number;
                    management_rating: number;
                    safety_rating: number;
                    image_url?: string | null;
                    user_display_name: string;
                    user_photo_url?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    hostel_id?: string;
                    user_id?: string;
                    text?: string;
                    food_rating?: number;
                    cleanliness_rating?: number;
                    management_rating?: number;
                    safety_rating?: number;
                    image_url?: string | null;
                    user_display_name?: string;
                    user_photo_url?: string | null;
                    created_at?: string;
                };
            };
            wishlists: {
                Row: {
                    id: string;
                    user_id: string;
                    hostel_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    hostel_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    hostel_id?: string;
                    created_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}

// Helper types for easier use
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Hostel = Database['public']['Tables']['hostels']['Row'];
export type HostelImage = Database['public']['Tables']['hostel_images']['Row'];
export type HostelAmenity = Database['public']['Tables']['hostel_amenities']['Row'];
export type HostelFloor = Database['public']['Tables']['hostel_floors']['Row'];
export type HostelRoom = Database['public']['Tables']['hostel_rooms']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Wishlist = Database['public']['Tables']['wishlists']['Row'];

// Extended hostel type with relations
export type HostelWithRelations = Hostel & {
    hostel_images: HostelImage[];
    hostel_amenities: HostelAmenity[];
    hostel_floors: (HostelFloor & { hostel_rooms: HostelRoom[] })[];
    reviews: Review[];
};
