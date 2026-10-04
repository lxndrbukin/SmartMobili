import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  LatestWorkCreate,
  LatestWorkRequest,
  LatestWorkUpdate,
  LatestWorksRequest,
  LatestWorkImageUpdate,
} from './types';
import axios from 'axios';
import { API_URL } from '../../api';

export const getLatestWorks = createAsyncThunk(
  'latestWorks/getLatestWorks',
  async ({ lang, limit, skip, includeInactive }: LatestWorksRequest) => {
    const params = new URLSearchParams();
    if (lang) {
      params.append('lang', lang);
    }
    if (limit) {
      params.append('limit', limit.toString());
    }
    if (skip) {
      params.append('skip', skip.toString());
    }
    if (includeInactive) {
      params.append('include_inactive', includeInactive.toString());
    }
    const response = await axios.get(
      `${API_URL}/api/v1/latest_works?${params}`,
    );
    return response.data.data;
  },
);

export const getLatestWork = createAsyncThunk(
  'latestWorks/getLatestWork',
  async ({ latestWorkId, lang }: LatestWorkRequest) => {
    const response = await axios.get(
      `${API_URL}/api/v1/latest_works/${latestWorkId}?lang=${lang}`,
    );
    return response.data;
  },
);

export const createLatestWork = createAsyncThunk(
  'latestWorks/createLatestWork',
  async (data: LatestWorkCreate) => {
    const response = await axios.post(`${API_URL}/api/v1/latest_works`, data);
    return response.data;
  },
);

export const updateLatestWork = createAsyncThunk(
  'latestWorks/updateLatestWork',
  async (data: LatestWorkUpdate) => {
    await axios.put(`${API_URL}/api/v1/latest_works/${data.id}`, {
      is_active: data.is_active,
    });

    if (data.translations) {
      for (const translation of data.translations) {
        const { language, title, description } = translation;
        await axios.put(
          `${API_URL}/api/v1/latest_works/${data.id}/translations?lang=${language}`,
          { title, description },
        );
      }
    }
    const lang = localStorage.getItem('language') || 'ro';
    const response = await axios.get(
      `${API_URL}/api/v1/latest_works/${data.id}?lang=${lang}`,
    );
    return response.data;
  },
);

export const deleteLatestWork = createAsyncThunk(
  'latestWorks/deleteLatestWork',
  async (latestWorkId: number) => {
    await axios.delete(`${API_URL}/api/v1/latest_works/${latestWorkId}`);
    return latestWorkId;
  },
);

export const addLatestWorkImage = createAsyncThunk(
  'latestWorks/addImage',
  async (data: LatestWorkImageUpdate) => {
    const response = await axios.post(
      `${API_URL}/api/v1/latest_works/${data.latestWorkId}/images`,
      data.image,
    );
    return response.data;
  },
);

export const deleteLatestWorkImage = createAsyncThunk(
  'latestWorks/deleteImage',
  async (data: { latestWorkId: number; imageId: number }) => {
    await axios.delete(
      `${API_URL}/api/v1/latest_works/${data.latestWorkId}/images/${data.imageId}`,
    );
  },
);
