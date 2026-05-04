export type PlantType = {
  id: string;
  name: string;
  emoji: string[];
  growthTime: number;
  harvestCoins: number;
  seedCost: number;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare';
};

export type ShopItem = {
  id: string;
  name: string;
  emoji: string;
  category: 'seeds' | 'decorations' | 'themes' | 'pets';
  costCoins?: number;
  costGems?: number;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare';
  isNew?: boolean;
};

export type GrowthStage = 0 | 1 | 2 | 3;

export const PLANTS: Record<string, PlantType> = {
  sunflower: {
    id: 'sunflower',
    name: 'Sunflower',
    emoji: ['🌱', '🌿', '🌻', '🌻'],
    growthTime: 30000,
    harvestCoins: 12,
    seedCost: 5,
    description: 'Bright and cheerful, grows quickly in sunlight.',
    rarity: 'common',
  },
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    emoji: ['🌱', '🌿', '🍅', '🍅'],
    growthTime: 60000,
    harvestCoins: 20,
    seedCost: 8,
    description: 'Plump and juicy, a garden classic.',
    rarity: 'common',
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    emoji: ['🌱', '🌿', '🌹', '🌹'],
    growthTime: 45000,
    harvestCoins: 15,
    seedCost: 10,
    description: 'Beautiful blooms to brighten your garden.',
    rarity: 'uncommon',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    emoji: ['🌱', '🌿', '💜', '💜'],
    growthTime: 50000,
    harvestCoins: 18,
    seedCost: 12,
    description: 'Calming scent and soft purple hues.',
    rarity: 'uncommon',
  },
  mushroom: {
    id: 'mushroom',
    name: 'Mushroom',
    emoji: ['🌱', '🍄', '🍄', '🍄'],
    growthTime: 20000,
    harvestCoins: 8,
    seedCost: 4,
    description: 'Grows fast in shaded spots.',
    rarity: 'common',
  },
  pumpkin: {
    id: 'pumpkin',
    name: 'Pumpkin',
    emoji: ['🌱', '🌿', '🎃', '🎃'],
    growthTime: 90000,
    harvestCoins: 35,
    seedCost: 20,
    description: 'A grand harvest treasure, worth the wait.',
    rarity: 'rare',
  },
  cherry: {
    id: 'cherry',
    name: 'Cherry',
    emoji: ['🌱', '🌸', '🍒', '🍒'],
    growthTime: 70000,
    harvestCoins: 28,
    seedCost: 15,
    description: 'Sweet and delicate, blossoms first.',
    rarity: 'uncommon',
  },
  wheat: {
    id: 'wheat',
    name: 'Wheat',
    emoji: ['🌱', '🌾', '🌾', '🌾'],
    growthTime: 25000,
    harvestCoins: 10,
    seedCost: 3,
    description: 'A staple harvest, sturdy and reliable.',
    rarity: 'common',
  },
};

export const SHOP_ITEMS: ShopItem[] = [
  // Seeds
  { id: 'seed_sunflower', name: 'Sunflower Seeds', emoji: '🌻', category: 'seeds', costCoins: 5, description: 'x3 sunflower seeds', rarity: 'common' },
  { id: 'seed_tomato', name: 'Tomato Seeds', emoji: '🍅', category: 'seeds', costCoins: 8, description: 'x3 tomato seeds', rarity: 'common' },
  { id: 'seed_rose', name: 'Rose Seeds', emoji: '🌹', category: 'seeds', costCoins: 10, description: 'x3 rose seeds', rarity: 'uncommon' },
  { id: 'seed_mushroom', name: 'Mushroom Spores', emoji: '🍄', category: 'seeds', costCoins: 4, description: 'x3 mushroom spores', rarity: 'common' },
  { id: 'seed_pumpkin', name: 'Pumpkin Seeds', emoji: '🎃', category: 'seeds', costCoins: 20, description: 'x2 pumpkin seeds', rarity: 'rare', isNew: true },
  { id: 'seed_cherry', name: 'Cherry Seeds', emoji: '🍒', category: 'seeds', costCoins: 15, description: 'x3 cherry seeds', rarity: 'uncommon' },
  { id: 'seed_lavender', name: 'Lavender Seeds', emoji: '💜', category: 'seeds', costCoins: 12, description: 'x3 lavender seeds', rarity: 'uncommon' },
  { id: 'seed_wheat', name: 'Wheat Seeds', emoji: '🌾', category: 'seeds', costCoins: 3, description: 'x5 wheat seeds', rarity: 'common' },

  // Decorations
  { id: 'deco_fountain', name: 'Stone Fountain', emoji: '⛲', category: 'decorations', costCoins: 80, description: 'A trickling centerpiece', rarity: 'uncommon' },
  { id: 'deco_bench', name: 'Garden Bench', emoji: '🪑', category: 'decorations', costCoins: 50, description: 'A cozy spot to rest', rarity: 'common' },
  { id: 'deco_lantern', name: 'Lantern', emoji: '🏮', category: 'decorations', costCoins: 30, description: 'Warm glow at night', rarity: 'common', isNew: true },
  { id: 'deco_windmill', name: 'Windmill', emoji: '🌀', category: 'decorations', costCoins: 120, description: 'Spins gently in the breeze', rarity: 'rare' },
  { id: 'deco_birdhouse', name: 'Birdhouse', emoji: '🏠', category: 'decorations', costGems: 5, description: 'Attracts colorful birds', rarity: 'uncommon' },
  { id: 'deco_rainbow', name: 'Rainbow Arc', emoji: '🌈', category: 'decorations', costGems: 8, description: 'A magical decoration', rarity: 'rare' },

  // Themes
  { id: 'theme_autumn', name: 'Autumn Theme', emoji: '🍂', category: 'themes', costCoins: 200, description: 'Warm oranges and falling leaves', rarity: 'uncommon' },
  { id: 'theme_winter', name: 'Winter Theme', emoji: '❄️', category: 'themes', costCoins: 200, description: 'Snowy peaceful wonderland', rarity: 'uncommon' },
  { id: 'theme_summer', name: 'Summer Theme', emoji: '☀️', category: 'themes', costCoins: 150, description: 'Bright sunlit days', rarity: 'common' },
  { id: 'theme_sakura', name: 'Sakura Theme', emoji: '🌸', category: 'themes', costGems: 15, description: 'Cherry blossom paradise', rarity: 'rare', isNew: true },

  // Pets
  { id: 'pet_bunny', name: 'Garden Bunny', emoji: '🐰', category: 'pets', costCoins: 150, description: 'Hops around your garden', rarity: 'common' },
  { id: 'pet_butterfly', name: 'Butterfly', emoji: '🦋', category: 'pets', costCoins: 120, description: 'Floats between flowers', rarity: 'uncommon' },
  { id: 'pet_hedgehog', name: 'Hedgehog', emoji: '🦔', category: 'pets', costCoins: 180, description: 'Snuffles through the garden', rarity: 'uncommon' },
  { id: 'pet_fox', name: 'Garden Fox', emoji: '🦊', category: 'pets', costGems: 20, description: 'A magical rare companion', rarity: 'rare', isNew: true },
];

export const RARITY_COLORS = {
  common: '#7A8C76',
  uncommon: '#5B8FB9',
  rare: '#C49A3C',
} as const;

export const INITIAL_INVENTORY: { item_id: string; item_type: string; quantity: number }[] = [
  { item_id: 'seed_sunflower', item_type: 'seeds', quantity: 5 },
  { item_id: 'seed_tomato', item_type: 'seeds', quantity: 3 },
  { item_id: 'seed_mushroom', item_type: 'seeds', quantity: 3 },
  { item_id: 'seed_wheat', item_type: 'seeds', quantity: 5 },
];
