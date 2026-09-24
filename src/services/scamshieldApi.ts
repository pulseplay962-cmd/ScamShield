import type { ScanResult } from '../types'

const apiUrl = (
  import.meta.env.VITE_API_URL ||
  'https://scamshield-api-0n7o.onrender.com'
).replace(/\/$/, '')

export async function analyzeWithApi(text: string): Promise<ScanResult> {
  if (!apiUrl) throw new Error('AI API is not configured')

  try {
    const response = await fetch(`${apiUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    const payload = await response.json()
    if (!response.ok || !payload.success) {
      throw new Error(payload.error || `AI analysis failed (HTTP ${response.status})`)
    }

    return payload.analysis as ScanResult
  } catch (error) {
    console.error('ScamShield API request failed:', error)
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`)
    }
    throw new Error('API request failed for an unknown reason')
  }
}
