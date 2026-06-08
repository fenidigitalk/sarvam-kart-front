import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/axios';

export interface CartItem {
  _id: string;
  productId: any;
  variantId: string;
  title: string;
  sku: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  wishlist: any[];
  loading: boolean;
  error: string | null;
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  wishlist: [],
  loading: false,
  error: null,
  totalQuantity: 0,
  totalPrice: 0,
};

// Recalculate totals helper
const calculateTotals = (state: CartState) => {
  state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart');
      return response.data.data; // array of cart items
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (payload: { productId: string; variantId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/add', payload);
      // Backend returns the added/updated array of cart items from addToCartService
      // but payload can be single object so backend response.data.data is an array
      return response.data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ cartItemId, quantity }: { cartItemId: string, quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${cartItemId}/update-quantity`, { quantity });
      return response.data.data; // returns updated item
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      return cartItemId; // return the id so we can remove it from state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const fetchWishlistAsync = createAsyncThunk(
  'cart/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist');
      return response.data.data; // array of populated products
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const toggleWishlistAsync = createAsyncThunk(
  'cart/toggleWishlistAsync',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/wishlist/toggle', { productId });
      return { productId, action: response.data.data.action }; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle wishlist');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.wishlist = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
    toggleWishlist: (state, action) => {
      // Keep synchronous toggle if needed for optimistic updates, or let the thunk handle it.
      // We will do optimistic updates in toggleWishlistAsync.fulfilled.
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlistAsync.fulfilled, (state, action) => {
        state.wishlist = action.payload || [];
      })
      
      // Toggle Wishlist
      .addCase(toggleWishlistAsync.fulfilled, (state, action) => {
        const { productId, action: toggleAction } = action.payload;
        if (toggleAction === "removed") {
          state.wishlist = state.wishlist.filter(item => (item.shopifyId || item.id || item._id) !== productId);
        } else {
          // Note: we can't fully populate the product here optimistically without the full object.
          // The page will probably need to re-fetch or we pass the product object to toggleWishlistAsync.
          // For now, let's keep it simple. Ideally, we should pass the full product so we can push it.
        }
      })
      // Fetch Cart
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        calculateTotals(state);
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Add
      .addCase(addToCartAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const addedItems = action.payload; // array
        addedItems.forEach((addedItem: CartItem) => {
          const index = state.items.findIndex(i => i._id === addedItem._id);
          if (index !== -1) {
            state.items[index] = addedItem;
          } else {
            state.items.push(addedItem);
          }
        });
        calculateTotals(state);
      })
      
      // Update Qty
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.items.findIndex(i => i._id === updatedItem._id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        calculateTotals(state);
      })

      // Remove
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        calculateTotals(state);
      });
  },
});

export const { clearCartState, toggleWishlist } = cartSlice.actions;
export default cartSlice.reducer;
