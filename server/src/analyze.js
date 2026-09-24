const resultSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    risk: { type: "string", enum: ["LOW", "CAUTION", "HIGH", "CRITICAL"] },
    score: { type: "number", minimum: 0, maximum: 100 },
    summary: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          detail: { type: "string" },
          severity: { type: "string", enum: ["LOW", "CAUTION", "HIGH", "CRITICAL"] }
        },
        required: ["title", "detail", "severity"]
      }
    },
    action: { type: "string" }
  },
  required: ["risk", "score", "summary", "findings", "action"]
}

export async function analyzeWithAI(client, text, model) {
  const response = await client.responses.create({
    model,
    instructions: [
      "You are ScamShield, a defensive scam and phishing analysis assistant.",
      "Analyze the submitted message as a second opinion.",
      "Do not claim certainty unless the evidence supports it.",
      "Explain concrete indicators in plain English.",
      "Never tell the user to click a suspicious link, call a number contained in the suspicious message, open an attachment, or provide credentials.",
      "Recommend independently navigating to the organization's official website or using trusted contact information.",
      "Treat a low-risk result as not proof of safety.",
      "Return only the requested structured result."
    ].join(" "),
    input: text,
    text: {
      format: {
        type: "json_schema",
        name: "scamshield_analysis",
        strict: true,
        schema: resultSchema
      }
    }
  })

  if (!response.output_text) {
    throw new Error("AI returned no analysis")
  }

  return JSON.parse(response.output_text)
}
