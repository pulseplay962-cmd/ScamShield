import type { Finding, RiskLevel, ScanResult } from './types'

const rules: Array<{ test: RegExp; finding: Finding; points: number }> = [
  {
    test: /urgent|immediately|act now|final warning|within \d+ (minutes?|hours?)/i,
    points: 22,
    finding: {
      title: 'Urgency or pressure',
      detail: 'The message pushes you to act quickly, a common social-engineering tactic.',
      severity: 'CAUTION',
    },
  },
  {
    test: /password|passcode|verification code|one-time code|otp|login|sign in/i,
    points: 28,
    finding: {
      title: 'Credential or code request',
      detail: 'Requests involving passwords, login details, or security codes deserve extra verification.',
      severity: 'HIGH',
    },
  },
  {
    test: /gift card|wire transfer|bitcoin|crypto|payment|pay now|bank account|routing number/i,
    points: 30,
    finding: {
      title: 'Payment or financial request',
      detail: 'Requests for money or financial information are a significant scam indicator.',
      severity: 'HIGH',
    },
  },
  {
    test: /click here|tap here|open the link|verify your account|confirm your account/i,
    points: 18,
    finding: {
      title: 'Call to click or verify',
      detail: 'The message asks you to use a link or verification flow instead of independently opening the official service.',
      severity: 'CAUTION',
    },
  },
  {
    test: /you have won|winner|prize|free money|claim your reward/i,
    points: 26,
    finding: {
      title: 'Unexpected prize or reward',
      detail: 'Unsolicited prize claims are frequently used to lure people into scam flows.',
      severity: 'HIGH',
    },
  },
  {
    test: /irs|social security|police|arrest|lawsuit|warrant|account will be closed/i,
    points: 24,
    finding: {
      title: 'Threat or authority impersonation language',
      detail: 'Threats involving authorities or account closure can be used to create fear and pressure.',
      severity: 'HIGH',
    },
  },
]

export function analyzeText(input: string): ScanResult {
  const findings: Finding[] = []
  let score = 0

  for (const rule of rules) {
    if (rule.test.test(input)) {
      findings.push(rule.finding)
      score += rule.points
    }
  }

  if (/https?:\/\/|www\.|\.com\b|\.net\b|\.org\b/i.test(input)) {
    findings.push({
      title: 'Link or domain present',
      detail: 'A link can be legitimate or malicious. Check the destination carefully and avoid using a link from a suspicious message.',
      severity: 'CAUTION',
    })
    score += 8
  }

  score = Math.min(score, 100)

  let risk: RiskLevel = 'LOW'
  if (score >= 70) risk = 'CRITICAL'
  else if (score >= 45) risk = 'HIGH'
  else if (score >= 18) risk = 'CAUTION'

  const summary =
    risk === 'LOW'
      ? 'No obvious scam indicators were detected by the first-pass checker.'
      : 'This content contains characteristics commonly associated with scams or phishing. Verify independently before taking action.'

  const action =
    risk === 'LOW'
      ? 'If you were not expecting this message, verify the sender through a trusted channel before responding.'
      : 'Do not click links, open unexpected attachments, send money, or share codes. Visit the organization’s official website or use a trusted phone number you already have.'

  return { risk, score, summary, findings, action }
}