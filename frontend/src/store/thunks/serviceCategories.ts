import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  ServiceCategoryCreate,
  ServiceCategoryUpdate,
  ServiceCategoryImageUpdate,
} from './types';
import axios from 'axios';
import { API_URL } from '../../api';

export const getServiceCategories = createAsyncThunk(
  'serviceCategories/getServiceCategories',
  async ({
    lang,
    limit,
  }: {
    lang: string | undefined;
    limit: number | undefined;
  }) => {
    const params = new URLSearchParams();
    if (lang) {
      params.append('lang', lang);
    }
    if (limit) {
      params.append('limit', limit.toString());
    }
    const response = await axios.get(
      `${API_URL}/api/v1/service_categories?${params}`,
    );
    return response.data;
  },
);

export const createServiceCategory = createAsyncThunk(
  'serviceCategories/createServiceCategory',
  async (data: ServiceCategoryCreate) => {
    const response = await axios.post(
      `${API_URL}/api/v1/service_categories`,
      data,
    );
    return response.data;
  },
);

export const updateServiceCategory = createAsyncThunk(
  'serviceCategories/updateServiceCategory',
  async (data: ServiceCategoryUpdate) => {
    await axios.put(`${API_URL}/api/v1/service_categories/${data.id}`, data);
    if (data.translations) {
      for (const translation of data.translations) {
        const { language, name } = translation;
        await axios.put(
          `${API_URL}/api/v1/service_categories/${data.id}/translations?lang=${language}`,
          { name },
        );
      }
    }
    const lang = localStorage.getItem('language') || 'ro';
    const response = await axios.get(
      `${API_URL}/api/v1/service_categories/${data.id}?lang=${lang}`,
    );
    return response.data;
  },
);

export const deleteServiceCategory = createAsyncThunk(
  'serviceCategories/deleteServiceCategory',
  async (categoryId: number) => {
    await axios.delete(`${API_URL}/api/v1/service_categories/${categoryId}`);
    return categoryId;
  },
);

export const addServiceCategoryImage = createAsyncThunk(
  'serviceCategories/updateImage',
  async ({ categoryId, image }: ServiceCategoryImageUpdate) => {
    await fetch(`${API_URL}/api/v1/service_categories/${categoryId}/images`, {
      method: 'POST',
      body: image,
    });
  },
);

export const deleteServiceCategoryImage = createAsyncThunk(
  'serviceCategories/deleteImage',
  async ({ categoryId, imageId }: { categoryId: number; imageId: number }) => {
    await axios.delete(
      `${API_URL}/api/v1/service_categories/${categoryId}/images/${imageId}`,
    );
  },
);
