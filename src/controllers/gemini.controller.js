import axios from "axios";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const askQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question) {
    throw new ApiError(400, "Question is required");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = process.env.GEMINI_API_URL; // e.g. https://api.example.com/v1/gemini

  if (!apiKey || !apiUrl) {
    throw new ApiError(
      500,
      "Gemini API is not configured (GEMINI_API_KEY or GEMINI_API_URL missing)"
    );
  }

  try {
    const response = await axios.post(
      apiUrl,
      { question },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const data = response.data;

    return res.status(200).json(new ApiResponse(200, data, "Success"));
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    throw new ApiError(502, "Failed to get response from Gemini API");
  }
});

export { askQuestion };
