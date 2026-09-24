import type { ScanResult } from '../types'

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export async function analyzeWithApi(text: string): Promise<ScanResult> {
  if (!apiUrl) throw new Error('AI API is not configured')

  const response = await fetch(`${apiUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  const payload = await response.json()
  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'AI analysis failed')
  }

  return payload.analysis as ScanResult
}
