/*
  # Cozy Garden Life - Initial Schema

  ## Overview
  Sets up all tables needed for the Cozy Garden Life mobile game.

  ## New Tables

  ### profiles
  - Extends auth.users with game-specific profile data
  - Stores currency (coins, gems), level, experience, preferences
  - Theme, sound, music, notification toggles

  ### garden_plots
  - Represents each planting slot in a user's garden (3x4 grid = 12 plots)
  - Tracks plant type, when planted, growth stage, harvest count
  - Growth stages: 0=empty, 1=seedling, 2=growing, 3=ready

  ### inventory_items
  - Items owned by the player (seeds, decorations, themes, pets)
  - Tracks quantity per item type

  ### shop_purchases
  - Audit log of all shop transactions

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  avatar_url text,
  coins integer DEFAULT 150 NOT NULL,
  gems integer DEFAULT 10 NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  experience integer DEFAULT 0 NOT NULL,
  theme text DEFAULT 'spring' NOT NULL,
  sound_enabled boolean DEFAULT true NOT NULL,
  music_enabled boolean DEFAULT true NOT NULL,
  notifications_enabled boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Garden plots table
CREATE TABLE IF NOT EXISTS garden_plots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plot_index integer NOT NULL,
  plant_type text,
  planted_at timestamptz,
  growth_stage integer DEFAULT 0 NOT NULL,
  harvested_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, plot_index)
);

ALTER TABLE garden_plots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own garden plots"
  ON garden_plots FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own garden plots"
  ON garden_plots FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own garden plots"
  ON garden_plots FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  item_type text NOT NULL,
  quantity integer DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, item_id)
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own inventory"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inventory"
  ON inventory_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory"
  ON inventory_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory"
  ON inventory_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Shop purchases table
CREATE TABLE IF NOT EXISTS shop_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  item_type text NOT NULL,
  cost_coins integer DEFAULT 0 NOT NULL,
  cost_gems integer DEFAULT 0 NOT NULL,
  purchased_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE shop_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own purchases"
  ON shop_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
  ON shop_purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
