import { createAsyncThunk } from "@reduxjs/toolkit";
import type { BannerCreate, BannerUpdate, BannerTranslationCreateProps, BannerImageUpdate } from "./types";
import axios from "axios";
import { API_URL } from "../../api";

export const getBanners = createAsyncThunk(
  "banners/getBanners",
  async (lang: string | undefined) => {
    const params = new URLSearchParams();
    if (lang) {
      params.append("lang", lang);
    }
    const response = await axios.get(
      `${API_URL}/api/v1/banners?${params}`,
    );
    return response.data.data;
  },
);

export const createBanner = createAsyncThunk(
  "banners/createBanner",
  async (data: BannerCreate) => {
    const response = await axios.post(
      `${API_URL}/api/v1/banners`,
      data,
    );
    return response.data;
  },
);

export const updateBanner = createAsyncThunk(
  "banners/updateBanner",
  async (data: BannerUpdate & { translations?: Array<BannerTranslationCreateProps> }) => {
    await axios.put(`${API_URL}/api/v1/banners/${data.id}`, { url: data.url });
    if (data.translations) {
      for (const translation of data.translations) {
        const { language, header, body } = translation;
        await axios.put(
          `${API_URL}/api/v1/banners/${data.id}/translations?lang=${language}`,
          { header, body },
        );
      }
    }
    const lang = localStorage.getItem("language") || "ro";
    const response = await axios.get(
      `${API_URL}/api/v1/banners/${data.id}?lang=${lang}`,
    );
    return response.data;
  },
);

export const deleteBanner = createAsyncThunk(
  "banners/deleteBanner",
  async (bannerId: number) => {
    await axios.delete(`${API_URL}/api/v1/banners/${bannerId}`);
    return bannerId;
  },
);

export const addBannerImage = createAsyncThunk(
  "banners/updateImage",
  async ({ bannerId, image }: BannerImageUpdate) => {
    await fetch(`${API_URL}/api/v1/banners/${bannerId}/images`, {
      method: "POST",
      body: image,
    });
  },
);

export const deleteBannerImage = createAsyncThunk(
  "banners/deleteImage",
  async ({ bannerId, imageId }: { bannerId: number; imageId: number; }) => {
    await axios.delete(
      `${API_URL}/api/v1/banners/${bannerId}/images/${imageId}`,
    );
  },
);
