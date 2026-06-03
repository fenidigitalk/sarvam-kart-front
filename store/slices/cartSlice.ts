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

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      // Identify product by shopifyId or _id
      const pId = product.shopifyId || product.id || product._id;
      const index = state.wishlist.findIndex(item => (item.shopifyId || item.id || item._id) === pId);
      if (index !== -1) {
        state.wishlist.splice(index, 1);
      } else {
        state.wishlist.push(product);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
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
