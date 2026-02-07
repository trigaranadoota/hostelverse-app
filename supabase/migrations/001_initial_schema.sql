-- Supabase Database Migration for HostelVerse
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  mobile_number TEXT,
  date_of_birth TEXT,
  preferred_language TEXT DEFAULT 'en',
  address TEXT,
  pin_code TEXT,
  country TEXT,
  state TEXT,
  category TEXT,
  annual_income NUMERIC,
  score_10th NUMERIC,
  score_12th NUMERIC,
  distance NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- HOSTELS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hostels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact TEXT NOT NULL,
  location_lat NUMERIC NOT NULL,
  location_lng NUMERIC NOT NULL,
  rent NUMERIC NOT NULL DEFAULT 0,
  deposit NUMERIC NOT NULL DEFAULT 0,
  fee_includes TEXT[] DEFAULT '{}',
  registration_fee NUMERIC DEFAULT 0,
  registration_deadline TEXT,
  verification_ai BOOLEAN DEFAULT FALSE,
  verification_human BOOLEAN DEFAULT FALSE,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'mixed')),
  room_sharing TEXT NOT NULL CHECK (room_sharing IN ('single', 'double', 'multiple')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hostels ENABLE ROW LEVEL SECURITY;

-- Hostels are publicly readable
CREATE POLICY "Hostels are viewable by everyone" ON hostels
  FOR SELECT USING (true);

-- Only authenticated users can insert/update (admin would need additional logic)
CREATE POLICY "Authenticated users can insert hostels" ON hostels
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update hostels" ON hostels
  FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- HOSTEL IMAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hostel_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  hint TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hostel_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hostel images are viewable by everyone" ON hostel_images
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage hostel images" ON hostel_images
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- HOSTEL AMENITIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hostel_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hostel_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hostel amenities are viewable by everyone" ON hostel_amenities
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage hostel amenities" ON hostel_amenities
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- HOSTEL FLOORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hostel_floors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hostel_floors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hostel floors are viewable by everyone" ON hostel_floors
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage hostel floors" ON hostel_floors
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- HOSTEL ROOMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hostel_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  floor_id UUID NOT NULL REFERENCES hostel_floors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE hostel_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hostel rooms are viewable by everyone" ON hostel_rooms
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage hostel rooms" ON hostel_rooms
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  food_rating INTEGER NOT NULL CHECK (food_rating >= 1 AND food_rating <= 5),
  cleanliness_rating INTEGER NOT NULL CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  management_rating INTEGER NOT NULL CHECK (management_rating >= 1 AND management_rating <= 5),
  safety_rating INTEGER NOT NULL CHECK (safety_rating >= 1 AND safety_rating <= 5),
  image_url TEXT,
  user_display_name TEXT NOT NULL,
  user_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Reviews are publicly readable
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Only authenticated users can insert reviews
CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- WISHLISTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hostel_id UUID NOT NULL REFERENCES hostels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, hostel_id)
);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Users can only see their own wishlist
CREATE POLICY "Users can view own wishlist" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own wishlist" ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist" ON wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- ENABLE REALTIME
-- =====================================================
-- Enable realtime for tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE hostels;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE wishlists;

-- =====================================================
-- STORAGE BUCKET
-- =====================================================
-- Note: Run these in a separate SQL statement or use the Dashboard
-- to create storage buckets:

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('review-images', 'review-images', true);

-- Storage policies for review-images bucket:
-- CREATE POLICY "Anyone can view review images"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'review-images');

-- CREATE POLICY "Authenticated users can upload review images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'review-images' AND auth.role() = 'authenticated');
