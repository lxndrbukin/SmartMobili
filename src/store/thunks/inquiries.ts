import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../api";
import type { InquiryCreate, InquiryUpdate } from "./types";

export const submitInquiry = createAsyncThunk(
  "inquiries/submitInquiry",
  async (data: InquiryCreate) => {
    const response = await axios.post(
      `${API_URL}/api/v1/inquiries`,
      data,
    );
    return response.data;
  },
);

export const getInquiries = createAsyncThunk(
  "inquiries/getInquiries",
  async () => {
    const response = await axios.get(`${API_URL}/api/v1/inquiries`);
    return response.data;
  },
);

export const getInquiry = createAsyncThunk(
  "inquiries/getInquiry",
  async (inquiryId: number) => {
    const response = await axios.get(
      `${API_URL}/api/v1/inquiries/${inquiryId}`,
    );
    return response.data;
  },
);

export const updateInquiry = createAsyncThunk(
  "inquiries/updateInquiry",
  async (data: InquiryUpdate) => {
    const response = await axios.put(
      `${API_URL}/api/v1/inquiries/${data.id}`,
      data,
    );
    return response.data;
  },
);

export const deleteInquiry = createAsyncThunk(
  "inquiries/deleteInquiry",
  async (inquiryId: number) => {
    await axios.delete(`${API_URL}/api/v1/inquiries/${inquiryId}`);
    return;
  },
);
