import express from "express";
import { askQuestion } from "../controllers/gemini.controller.js";

const router = express.Router();

// POST /api/v1/gemini { question: string }
router.post("/", askQuestion);

export default router;
