import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ServicesState,
  ServiceProps,
  ServiceCategoryProps,
} from './types';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from '../thunks/services';
import {
  getServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} from '../thunks/serviceCategories';

const initialState: ServicesState = {
  services: [],
  currentService: null,
  serviceNotFound: false,
  categories: [],
  categoriesLoaded: false,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearServices: (state: ServicesState) => {
      state.services = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getServices.fulfilled,
      (state: ServicesState, action: PayloadAction<Array<ServiceProps>>) => {
        state.services = [...state.services, ...action.payload];
      },
    );
    builder.addCase(
      getService.fulfilled,
      (state: ServicesState, action: PayloadAction<ServiceProps>) => {
        state.currentService = action.payload;
        state.serviceNotFound = false;
      },
    );
    builder.addCase(getService.pending, (state: ServicesState) => {
      state.currentService = null;
      state.serviceNotFound = false;
    });
    builder.addCase(getService.rejected, (state: ServicesState) => {
      state.currentService = null;
      state.serviceNotFound = true;
    });
    builder.addCase(
      createService.fulfilled,
      (state: ServicesState, action: PayloadAction<ServiceProps>) => {
        state.services = [...state.services, action.payload];
      },
    );
    builder.addCase(
      updateService.fulfilled,
      (state: ServicesState, action: PayloadAction<ServiceProps>) => {
        const updatedService = action.payload;
        state.currentService = action.payload;
        const index = state.services.findIndex((s) => s.id === updatedService.id);
        if (index !== -1) {
          state.services[index] = updatedService;
        }
      },
    );
    builder.addCase(
      deleteService.fulfilled,
      (state: ServicesState, action: PayloadAction<number>) => {
        state.services = state.services.filter((s) => s.id !== action.payload);
      },
    );
    builder.addCase(
      getServiceCategories.fulfilled,
      (
        state: ServicesState,
        action: PayloadAction<Array<ServiceCategoryProps>>,
      ) => {
        state.categories = action.payload;
        state.categoriesLoaded = true;
      },
    );
    builder.addCase(getServiceCategories.pending, (state: ServicesState) => {
      state.categories = [];
      state.categoriesLoaded = false;
    });
    builder.addCase(getServiceCategories.rejected, (state: ServicesState) => {
      state.categoriesLoaded = true;
    });
    builder.addCase(
      createServiceCategory.fulfilled,
      (state: ServicesState, action: PayloadAction<ServiceCategoryProps>) => {
        state.categories.push(action.payload);
      },
    );
    builder.addCase(
      updateServiceCategory.fulfilled,
      (state: ServicesState, action: PayloadAction<ServiceCategoryProps>) => {
        const updatedCategory = action.payload;
        const index = state.categories.findIndex(
          (c) => c.id === updatedCategory.id,
        );
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      },
    );
    builder.addCase(
      deleteServiceCategory.fulfilled,
      (state: ServicesState, action: PayloadAction<number>) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      },
    );
  },
});

export const { clearServices } = servicesSlice.actions;
export default servicesSlice.reducer;
