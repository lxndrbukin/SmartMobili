import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  ServiceCreate,
  ServiceRequest,
  ServiceUpdate,
  ServicesRequest,
  ServiceImageUpdate,
} from './types';
import axios from 'axios';
import { API_URL } from '../../api';

export const getServices = createAsyncThunk(
  'services/getServices',
  async ({
    lang,
    categoryId,
    desc,
    categorySlug,
    searchQuery,
    limit,
    skip,
  }: ServicesRequest) => {
    const params = new URLSearchParams();
    if (desc) {
      params.append('desc', desc.toString());
    }
    if (lang) {
      params.append('lang', lang);
    }
    if (categoryId) {
      params.append('category_id', categoryId.toString());
    }
    if (categorySlug) {
      params.append('category_slug', categorySlug.toString());
    }
    if (searchQuery) {
      params.append('search_query', searchQuery.toString());
    }
    if (limit) {
      params.append('limit', limit.toString());
    }
    if (skip) {
      params.append('skip', skip.toString());
    }
    const response = await axios.get(`${API_URL}/api/v1/services?${params}`);
    return response.data.data;
  },
);

export const getService = createAsyncThunk(
  'services/getService',
  async ({ serviceId, lang }: ServiceRequest) => {
    const response = await axios.get(
      `${API_URL}/api/v1/services/${serviceId}?lang=${lang}`,
    );
    return response.data;
  },
);

export const createService = createAsyncThunk(
  'services/createService',
  async (data: ServiceCreate) => {
    const response = await axios.post(`${API_URL}/api/v1/services`, data);
    return response.data;
  },
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async (data: ServiceUpdate) => {
    await axios.put(`${API_URL}/api/v1/services/${data.id}`, data);

    if (data.translations) {
      for (const translation of data.translations) {
        const { language, title, description } = translation;
        await axios.put(
          `${API_URL}/api/v1/services/${data.id}/translations?lang=${language}`,
          { title, description },
        );
      }
    }
    const lang = localStorage.getItem('language') || 'ro';
    const response = await axios.get(
      `${API_URL}/api/v1/services/${data.id}?lang=${lang}`,
    );
    return response.data;
  },
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (serviceId: number) => {
    await axios.delete(`${API_URL}/api/v1/services/${serviceId}`);
    return serviceId;
  },
);

export const addServiceImage = createAsyncThunk(
  'services/updateImage',
  async (data: ServiceImageUpdate) => {
    const response = await axios.post(
      `${API_URL}/api/v1/services/${data.serviceId}/images`,
      data.image,
    );
    return response.data;
  },
);

export const deleteServiceImage = createAsyncThunk(
  'services/deleteImage',
  async (data: { serviceId: number; imageId: number }) => {
    await axios.delete(
      `${API_URL}/api/v1/services/${data.serviceId}/images/${data.imageId}`,
    );
  },
);
