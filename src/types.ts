export type RiskLevel = 'LOW' | 'CAUTION' | 'HIGH' | 'CRITICAL'

export interface Finding {
  title: string
  detail: string
  severity: RiskLevel
}

export interface ScanResult {
  risk: RiskLevel
  score: number
  summary: string
  findings: Finding[]
  action: string
}