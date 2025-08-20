import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { machinesApi } from '../../services/api/machines';

// Async thunks
export const fetchMachines = createAsyncThunk(
  'machines/fetchMachines',
  async () => {
    const response = await machinesApi.getAll();
    return response.data;
  }
);

export const fetchMachineById = createAsyncThunk(
  'machines/fetchMachineById',
  async (id) => {
    const response = await machinesApi.getById(id);
    return response.data;
  }
);

export const createMachine = createAsyncThunk(
  'machines/createMachine',
  async (machineData) => {
    const response = await machinesApi.create(machineData);
    return response.data;
  }
);

export const updateMachine = createAsyncThunk(
  'machines/updateMachine',
  async ({ id, data }) => {
    const response = await machinesApi.update(id, data);
    return response.data;
  }
);

export const deleteMachine = createAsyncThunk(
  'machines/deleteMachine',
  async (id) => {
    await machinesApi.delete(id);
    return id;
  }
);

const machineSlice = createSlice({
  name: 'machines',
  initialState: {
    machines: [],
    currentMachine: null,
    sections: [],
    components: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentMachine: (state, action) => {
      state.currentMachine = action.payload;
    },
    clearCurrentMachine: (state) => {
      state.currentMachine = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch machines
      .addCase(fetchMachines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.loading = false;
        state.machines = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch machine by ID
      .addCase(fetchMachineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMachineById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMachine = action.payload;
      })
      .addCase(fetchMachineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create machine
      .addCase(createMachine.fulfilled, (state, action) => {
        state.machines.push(action.payload);
      })
      // Update machine
      .addCase(updateMachine.fulfilled, (state, action) => {
        const index = state.machines.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.machines[index] = action.payload;
        }
        if (state.currentMachine?.id === action.payload.id) {
          state.currentMachine = action.payload;
        }
      })
      // Delete machine
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.machines = state.machines.filter(m => m.id !== action.payload);
        if (state.currentMachine?.id === action.payload) {
          state.currentMachine = null;
        }
      });
  },
});

export const { setCurrentMachine, clearCurrentMachine } = machineSlice.actions;
export default machineSlice.reducer;
