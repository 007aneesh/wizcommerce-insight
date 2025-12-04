import { create } from "zustand";

export interface Segment {
  id: string;
  name: string;
  description?: string;
  type: "buyer" | "product";
  criteria?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  member_count?: number;
}

interface SegmentsState {
  buyerSegments: Segment[];
  productSegments: Segment[];
  isLoading: boolean;
  setBuyerSegments: (segments: Segment[]) => void;
  setProductSegments: (segments: Segment[]) => void;
  addBuyerSegment: (segment: Segment) => void;
  addProductSegment: (segment: Segment) => void;
  updateBuyerSegment: (id: string, segment: Partial<Segment>) => void;
  updateProductSegment: (id: string, segment: Partial<Segment>) => void;
  deleteBuyerSegment: (id: string) => void;
  deleteProductSegment: (id: string) => void;
  setLoading: (loading: boolean) => void;
  getAllSegments: () => Segment[];
  getBuyerSegments: () => Segment[];
  getProductSegments: () => Segment[];
}

export const useSegmentsStore = create<SegmentsState>((set, get) => ({
  buyerSegments: [],
  productSegments: [],
  isLoading: false,

  setBuyerSegments: (segments) => set({ buyerSegments: segments }),
  setProductSegments: (segments) => set({ productSegments: segments }),

  addBuyerSegment: (segment) =>
    set((state) => ({
      buyerSegments: [...state.buyerSegments, segment],
    })),

  addProductSegment: (segment) =>
    set((state) => ({
      productSegments: [...state.productSegments, segment],
    })),

  updateBuyerSegment: (id, updates) =>
    set((state) => ({
      buyerSegments: state.buyerSegments.map((seg) =>
        seg.id === id ? { ...seg, ...updates } : seg
      ),
    })),

  updateProductSegment: (id, updates) =>
    set((state) => ({
      productSegments: state.productSegments.map((seg) =>
        seg.id === id ? { ...seg, ...updates } : seg
      ),
    })),

  deleteBuyerSegment: (id) =>
    set((state) => ({
      buyerSegments: state.buyerSegments.filter((seg) => seg.id !== id),
    })),

  deleteProductSegment: (id) =>
    set((state) => ({
      productSegments: state.productSegments.filter((seg) => seg.id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  getAllSegments: () => {
    const state = get();
    return [...state.buyerSegments, ...state.productSegments];
  },

  getBuyerSegments: () => get().buyerSegments,
  getProductSegments: () => get().productSegments,
}));

