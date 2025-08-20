import { configureStore } from '@reduxjs/toolkit';
import machineReducer from './slices/machineSlice';
import repairReducer from './slices/repairSlice';
import inventoryReducer from './slices/inventorySlice';
import supplierReducer from './slices/supplierSlice';

export const store = configureStore({
  reducer: {
    machines: machineReducer,
    repairs: repairReducer,
    inventory: inventoryReducer,
    suppliers: supplierReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
