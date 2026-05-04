import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PLANTS, INITIAL_INVENTORY, PlantType, GrowthStage } from '@/lib/gameData';
import { supabase } from '@/lib/supabase';

export type Plot = {
  index: number;
  plantType: string | null;
  plantedAt: number | null;
  growthStage: GrowthStage;
  harvestedCount: number;
};

export type InventoryItem = {
  item_id: string;
  item_type: string;
  quantity: number;
};

type GameState = {
  plots: Plot[];
  inventory: InventoryItem[];
  coins: number;
  gems: number;
  level: number;
  experience: number;
  userId: string | null;
  isGuest: boolean;
};

type GameContextType = {
  state: GameState;
  plantSeed: (plotIndex: number, plantType: string) => void;
  harvestPlot: (plotIndex: number) => void;
  purchaseItem: (itemId: string, itemType: string, costCoins: number, costGems: number) => boolean;
  getPlotGrowthProgress: (plot: Plot) => number;
  getInventoryCount: (itemId: string) => number;
  refreshGrowth: () => void;
};

const TOTAL_PLOTS = 12;

const buildInitialPlots = (): Plot[] =>
  Array.from({ length: TOTAL_PLOTS }, (_, i) => ({
    index: i,
    plantType: null,
    plantedAt: null,
    growthStage: 0,
    harvestedCount: 0,
  }));

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children, userId }: { children: React.ReactNode; userId: string | null }) {
  const [state, setState] = useState<GameState>({
    plots: buildInitialPlots(),
    inventory: INITIAL_INVENTORY,
    coins: 150,
    gems: 10,
    level: 1,
    experience: 0,
    userId,
    isGuest: !userId,
  });

  useEffect(() => {
    if (userId) loadFromSupabase(userId);
  }, [userId]);

  const loadFromSupabase = async (uid: string) => {
    const [{ data: profile }, { data: plots }, { data: items }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
      supabase.from('garden_plots').select('*').eq('user_id', uid),
      supabase.from('inventory_items').select('*').eq('user_id', uid),
    ]);

    if (!profile) {
      await supabase.from('profiles').insert({ id: uid, coins: 150, gems: 10 });
      await supabase.from('inventory_items').insert(
        INITIAL_INVENTORY.map((i) => ({ ...i, user_id: uid }))
      );
      return;
    }

    const loadedPlots = buildInitialPlots();
    (plots ?? []).forEach((p: any) => {
      loadedPlots[p.plot_index] = {
        index: p.plot_index,
        plantType: p.plant_type,
        plantedAt: p.planted_at ? new Date(p.planted_at).getTime() : null,
        growthStage: p.growth_stage as GrowthStage,
        harvestedCount: p.harvested_count,
      };
    });

    setState((prev) => ({
      ...prev,
      plots: loadedPlots,
      inventory: (items ?? []).map((i: any) => ({ item_id: i.item_id, item_type: i.item_type, quantity: i.quantity })),
      coins: profile.coins ?? 150,
      gems: profile.gems ?? 10,
      level: profile.level ?? 1,
      experience: profile.experience ?? 0,
    }));
  };

  const getPlotGrowthProgress = useCallback((plot: Plot): number => {
    if (!plot.plantType || !plot.plantedAt) return 0;
    const plant = PLANTS[plot.plantType];
    if (!plant) return 0;
    const elapsed = Date.now() - plot.plantedAt;
    return Math.min(elapsed / plant.growthTime, 1);
  }, []);

  const computeGrowthStage = (progress: number): GrowthStage => {
    if (progress >= 1) return 3;
    if (progress >= 0.6) return 2;
    if (progress >= 0.1) return 1;
    return 1;
  };

  const refreshGrowth = useCallback(() => {
    setState((prev) => {
      const updatedPlots = prev.plots.map((plot) => {
        if (!plot.plantType || !plot.plantedAt) return plot;
        const progress = getPlotGrowthProgress(plot);
        const newStage = computeGrowthStage(progress);
        if (newStage !== plot.growthStage) return { ...plot, growthStage: newStage };
        return plot;
      });
      const changed = updatedPlots.some((p, i) => p.growthStage !== prev.plots[i].growthStage);
      return changed ? { ...prev, plots: updatedPlots } : prev;
    });
  }, [getPlotGrowthProgress]);

  useEffect(() => {
    const interval = setInterval(refreshGrowth, 3000);
    return () => clearInterval(interval);
  }, [refreshGrowth]);

  const plantSeed = useCallback(
    async (plotIndex: number, plantType: string) => {
      const seedId = `seed_${plantType}`;
      const seedCount = state.inventory.find((i) => i.item_id === seedId)?.quantity ?? 0;
      if (seedCount <= 0) return;

      const now = Date.now();
      setState((prev) => {
        const plots = [...prev.plots];
        plots[plotIndex] = { index: plotIndex, plantType, plantedAt: now, growthStage: 1, harvestedCount: 0 };
        const inventory = prev.inventory.map((i) =>
          i.item_id === seedId ? { ...i, quantity: i.quantity - 1 } : i
        ).filter((i) => i.quantity > 0);
        return { ...prev, plots, inventory };
      });

      if (userId) {
        await supabase.from('garden_plots').upsert({
          user_id: userId,
          plot_index: plotIndex,
          plant_type: plantType,
          planted_at: new Date(now).toISOString(),
          growth_stage: 1,
        });
        await supabase.from('inventory_items')
          .update({ quantity: seedCount - 1 })
          .eq('user_id', userId)
          .eq('item_id', seedId);
      }
    },
    [state.inventory, userId]
  );

  const harvestPlot = useCallback(
    async (plotIndex: number) => {
      const plot = state.plots[plotIndex];
      if (!plot.plantType || plot.growthStage !== 3) return;
      const plant = PLANTS[plot.plantType];
      if (!plant) return;

      const coinsEarned = plant.harvestCoins;
      const expEarned = 5;

      setState((prev) => {
        const plots = [...prev.plots];
        plots[plotIndex] = { index: plotIndex, plantType: null, plantedAt: null, growthStage: 0, harvestedCount: plot.harvestedCount + 1 };
        const newExp = prev.experience + expEarned;
        const newLevel = Math.floor(newExp / 50) + 1;
        return { ...prev, plots, coins: prev.coins + coinsEarned, experience: newExp, level: newLevel };
      });

      if (userId) {
        await supabase.from('garden_plots').upsert({
          user_id: userId,
          plot_index: plotIndex,
          plant_type: null,
          planted_at: null,
          growth_stage: 0,
          harvested_count: plot.harvestedCount + 1,
        });
        await supabase.from('profiles').update({
          coins: state.coins + coinsEarned,
          experience: state.experience + expEarned,
        }).eq('id', userId);
      }
    },
    [state.plots, state.coins, state.experience, userId]
  );

  const purchaseItem = useCallback(
    (itemId: string, itemType: string, costCoins: number, costGems: number): boolean => {
      if (costCoins > 0 && state.coins < costCoins) return false;
      if (costGems > 0 && state.gems < costGems) return false;

      setState((prev) => {
        const existing = prev.inventory.find((i) => i.item_id === itemId);
        const inventory = existing
          ? prev.inventory.map((i) => (i.item_id === itemId ? { ...i, quantity: i.quantity + 1 } : i))
          : [...prev.inventory, { item_id: itemId, item_type: itemType, quantity: 1 }];
        return {
          ...prev,
          inventory,
          coins: prev.coins - costCoins,
          gems: prev.gems - costGems,
        };
      });

      if (userId) {
        supabase.from('shop_purchases').insert({
          user_id: userId,
          item_id: itemId,
          item_type: itemType,
          cost_coins: costCoins,
          cost_gems: costGems,
        });
      }
      return true;
    },
    [state.coins, state.gems, userId]
  );

  const getInventoryCount = useCallback(
    (itemId: string) => state.inventory.find((i) => i.item_id === itemId)?.quantity ?? 0,
    [state.inventory]
  );

  return (
    <GameContext.Provider value={{ state, plantSeed, harvestPlot, purchaseItem, getPlotGrowthProgress, getInventoryCount, refreshGrowth }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
