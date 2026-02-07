-- Allow anonymous inserts for seeding data
-- Run this in Supabase SQL Editor to unblock seeding

-- Hostels
CREATE POLICY "Enable insert for anon users on hostels"
ON hostels FOR INSERT
WITH CHECK (true);

-- Images
CREATE POLICY "Enable insert for anon users on hostel_images"
ON hostel_images FOR INSERT
WITH CHECK (true);

-- Amenities
CREATE POLICY "Enable insert for anon users on hostel_amenities"
ON hostel_amenities FOR INSERT
WITH CHECK (true);

-- Floors
CREATE POLICY "Enable insert for anon users on hostel_floors"
ON hostel_floors FOR INSERT
WITH CHECK (true);

-- Rooms
CREATE POLICY "Enable insert for anon users on hostel_rooms"
ON hostel_rooms FOR INSERT
WITH CHECK (true);
