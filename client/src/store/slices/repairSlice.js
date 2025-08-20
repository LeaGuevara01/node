import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { repairsApi } from '../../services/api/repairs';

// Async thunks
export const fetchRepairOrders = createAsyncThunk(
  'repairs/fetchRepairOrders',
  async () => {
    const response = await repairsApi.getAll();
    return response.data;
  }
);

export const fetchRepairOrderById = createAsyncThunk(
  'repairs/fetchRepairOrderById',
  async (id) => {
    const response = await repairsApi.getById(id);
    return response.data;
  }
);

export const createRepairOrder = createAsyncThunk(
  'repairs/createRepairOrder',
  async (repairData) => {
    const response = await repairsApi.create(repairData);
    return response.data;
  }
);

export const updateRepairOrder = createAsyncThunk(
  'repairs/updateRepairOrder',
  async ({ id, data }) => {
    const response = await repairsApi.update(id, data);
    return response.data;
  }
);

export const updateRepairStatus = createAsyncThunk(
  'repairs/updateRepairStatus',
  async ({ id, status }) => {
    const response = await repairsApi.updateStatus(id, status);
    return response.data;
  }
);

const repairSlice = createSlice({
  name: 'repairs',
  initialState: {
    repairOrders: [],
    currentRepair: null,
    repairDetails: [],
    totalCost: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentRepair: (state, action) => {
      state.currentRepair = action.payload;
    },
    clearCurrentRepair: (state) => {
      state.currentRepair = null;
    },
    calculateTotalCost: (state) => {
      if (state.currentRepair?.details) {
        state.totalCost = state.currentRepair.details.reduce(
          (total, detail) => total + (detail.costo || 0),
          0
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch repair orders
      .addCase(fetchRepairOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepairOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.repairOrders = action.payload;
      })
      .addCase(fetchRepairOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch repair order by ID
      .addCase(fetchRepairOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepairOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRepair = action.payload;
        state.repairDetails = action.payload.details || [];
      })
      .addCase(fetchRepairOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create repair order
      .addCase(createRepairOrder.fulfilled, (state, action) => {
        state.repairOrders.push(action.payload);
      })
      // Update repair order
      .addCase(updateRepairOrder.fulfilled, (state, action) => {
        const index = state.repairOrders.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.repairOrders[index] = action.payload;
        }
        if (state.currentRepair?.id === action.payload.id) {
          state.currentRepair = action.payload;
        }
      });
  },
});

export const { setCurrentRepair, clearCurrentRepair, calculateTotalCost } = repairSlice.actions;
export default repairSlice.reducer;
