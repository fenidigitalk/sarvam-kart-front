import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/axios";

interface OrderState {
  myOrders: any[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  myOrders: [],
  loading: false,
  error: null,
};

export const fetchMyOrdersAsync = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/order/my-orders");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders",
      );
    }
  },
);

export const checkoutOrderAsync = createAsyncThunk(
  "order/checkout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/order/checkout");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to checkout",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchMyOrders
      .addCase(fetchMyOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
