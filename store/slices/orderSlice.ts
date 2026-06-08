import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/lib/axios";

interface PaginationState {
  totalRecords: number;
  currentPage: number;
  limit: number;
}

interface OrderStats {
  totalOrders: number;
  pendingAmount: number;
  completedAmount: number;
}

interface OrderState {
  myOrders: any[];
  allOrders: any[];
  myStats: { pendingAmount: number };
  stats: OrderStats;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  myOrders: [],
  allOrders: [],
  myStats: { pendingAmount: 0 },
  stats: { totalOrders: 0, pendingAmount: 0, completedAmount: 0 },
  pagination: { totalRecords: 0, currentPage: 1, limit: 10 },
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

interface FetchAllOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMode?: string;
  deliveryStatus?: string;
}

export const fetchMyOrderStatsAsync = createAsyncThunk(
  "order/fetchMyOrderStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/order/my-stats");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch my order stats",
      );
    }
  },
);

export const fetchAllOrdersAsync = createAsyncThunk(
  "order/fetchAllOrders",
  async (params: FetchAllOrdersParams | void, { rejectWithValue }) => {
    try {
      const response = await api.get("/order/all", { params: params || {} });
      return response.data; // Return full response to get pagination and data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all orders",
      );
    }
  },
);

export const fetchOrderStatsAsync = createAsyncThunk(
  "order/fetchOrderStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/order/stats");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order stats",
      );
    }
  },
);


export const updateAdminOrderAsync = createAsyncThunk(
  "order/updateAdminOrder",
  async ({ orderId, data }: { orderId: string, data: any }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${orderId}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order",
      );
    }
  },
);

export const deleteOrderAsync = createAsyncThunk(
  "order/deleteOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/order/${orderId}`);
      return orderId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order",
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
      })
      // fetchMyOrderStats
      .addCase(fetchMyOrderStatsAsync.fulfilled, (state, action) => {
        state.myStats = action.payload;
      })
      // fetchAllOrders
      .addCase(fetchAllOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload.data;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchOrderStats
      .addCase(fetchOrderStatsAsync.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // updateAdminOrder
      .addCase(updateAdminOrderAsync.fulfilled, (state, action) => {
        const index = state.allOrders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.allOrders[index] = action.payload;
        }
      })
      // deleteOrder
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.allOrders = state.allOrders.filter(o => o._id !== action.payload);
      });
  },
});

export default orderSlice.reducer;
// Trigger HMR rebuild
