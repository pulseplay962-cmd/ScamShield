import "dotenv/config"
import express from "express"
import cors from "cors"
import OpenAI from "openai"
import { analyzeWithAI } from "./analyze.js"

const app = express()
const port = Number(process.env.PORT || 3001)
const model = process.env.OPENAI_MODEL || "gpt-5.6-luna"

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map(value => value.trim()) : true
}))
app.use(express.json({ limit: "100kb" }))

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "scamshield-api",
    aiConfigured: Boolean(process.env.OPENAI_API_KEY)
  })
})

app.post("/api/analyze", async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : ""

  if (!text) {
    return res.status(400).json({
      success: false,
      error: "Please provide text to analyze."
    })
  }

  if (text.length > 12000) {
    return res.status(413).json({
      success: false,
      error: "The submitted content is too long. Please keep it under 12,000 characters."
    })
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      success: false,
      error: "AI analysis is not configured yet."
    })
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const analysis = await analyzeWithAI(client, text, model)

    res.json({
      success: true,
      mode: "openai",
      model,
      analysis
    })
  } catch (error) {
    console.error("ScamShield analysis error:", error)
    res.status(502).json({
      success: false,
      error: "ScamShield could not complete the AI analysis. Please try again."
    })
  }
})

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Not found" })
})

app.listen(port, () => {
  console.log(`ScamShield API listening on port ${port}`)
})
