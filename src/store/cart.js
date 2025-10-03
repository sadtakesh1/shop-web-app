import { create } from "zustand";

export const useCart = create((set) => ({
  items: [],

  // Добавить товар
  add: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    }),

  // Уменьшить количество
  decrease: (productId) =>
    set((state) => {
      return {
        items: state.items
          .map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    }),

  // Удалить полностью
  remove: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  clear: () => set({ items: [] }),
}));
