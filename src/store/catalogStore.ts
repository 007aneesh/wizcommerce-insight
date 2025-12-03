import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Catalog } from '@/lib/types';

export interface CatalogState {
  catalogs: Catalog[];
  selectedCatalog: Catalog | null;
  isLoading: boolean;
}

export interface CatalogActions {
  setCatalogs: (catalogs: Catalog[]) => void;
  setSelectedCatalog: (catalog: Catalog) => void;
  setLoading: (isLoading: boolean) => void;
  clearCatalogs: () => void;
}

export type CatalogStore = CatalogState & CatalogActions;

export const useCatalogStore = create<CatalogStore>()(
  persist(
    (set) => ({
      catalogs: [],
      selectedCatalog: null,
      isLoading: false,

      setCatalogs: (catalogs: Catalog[]) => {
        // Find default catalog
        const defaultCatalog = catalogs.find((cat) => cat.is_default) || catalogs[0] || null;
        
        set({
          catalogs,
          selectedCatalog: defaultCatalog,
          isLoading: false,
        });
      },

      setSelectedCatalog: (catalog: Catalog) => {
        set({ selectedCatalog: catalog });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      clearCatalogs: () => {
        set({
          catalogs: [],
          selectedCatalog: null,
          isLoading: false,
        });
      },
    }),
    {
      name: 'catalog-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        catalogs: state.catalogs,
        selectedCatalog: state.selectedCatalog,
      }),
    }
  )
);

