import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { type InquiryCreate } from "./types";

export const submitInquiry = createAsyncThunk(
  "inquiries/submitInquiry",
  async (data: InquiryCreate) => {
    const response = await axios.post(
      "http://localhost:8000/api/v1/inquiries",
      data,
    );
    return response.data;
  },
);

export const getInquiries = createAsyncThunk(
  "inquiries/getInquiries",
  async () => {
    const response = await axios.get("http://localhost:8000/api/v1/inquiries");
    return response.data;
  },
);
