import { useState } from 'react'
import { analyzeText } from './analyzer'
import { analyzeWithApi } from './services/scamshieldApi'
import type { RiskLevel, ScanResult } from './types'

const riskMeta: Record<RiskLevel, { icon: string; label: string }> = {
  LOW: { icon: '✓', label: 'LOW RISK' },
  CAUTION: { icon: '!', label: 'CAUTION' },
  HIGH: { icon: '!', label: 'HIGH RISK' },
  CRITICAL: { icon: '×', label: 'CRITICAL' },
}

function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  async function checkContent() {
    const trimmed = input.trim()
    if (!trimmed || checking) return
    setChecking(true)
    setError('')
    try {
      setResult(await analyzeWithApi(trimmed))
    } catch {
      setResult(analyzeText(trimmed))
      setError('AI analysis is unavailable right now, so ScamShield used its local safety checker instead.')
    } finally {
      setChecking(false)
    }
  }

  function clearCheck() {
    setInput('')
    setResult(null)
    setError('')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-name">ScamShield</div>
            <div className="brand-tagline">Before You Click, Check.</div>
          </div>
        </div>
        <div className="privacy-pill">● Privacy-first</div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="eyebrow">YOUR SECOND OPINION</div>
          <h1>Something feel suspicious?</h1>
          <p>
            Paste the message here and ScamShield will look for common phishing
            and scam indicators — then explain what it found in plain English.
          </p>
        </section>

        <section className="checker-card">
          <div className="card-heading">
            <div>
              <span className="step">01</span>
              <h2>Check a message</h2>
            </div>
            <span className="input-type">EMAIL • TEXT</span>
          </div>

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Paste an email, text message, or suspicious content here…"
            aria-label="Message to check"
            rows={9}
            disabled={checking}
          />

          <div className="checker-footer">
            <span className="privacy-note">Your first-pass check runs locally in this demo.</span>
            <div className="actions">
              <button className="ghost-button" onClick={clearCheck} disabled={checking || (!input && !result)}>
                Clear
              </button>
              <button className="primary-button" onClick={checkContent} disabled={checking || !input.trim()}>
                {checking ? 'Checking…' : <>Check it <span>→</span></>}
              </button>
            </div>
          </div>
        </section>

        {error && <div className="fallback-notice">{error}</div>}

        {result && (
          <section className="result-card" aria-live="polite">
            <div className="result-top">
              <div className="risk-badge">
                <span>{riskMeta[result.risk].icon}</span>
                {riskMeta[result.risk].label}
              </div>
              <div className="score">Signal score: {result.score}/100</div>
            </div>

            <h2>Show Me Why</h2>
            <p className="summary">{result.summary}</p>

            <div className="findings">
              {result.findings.length === 0 ? (
                <div className="finding empty">
                  <span>✓</span>
                  <div>
                    <strong>No obvious indicators</strong>
                    <p>The checker did not find any of its current warning patterns.</p>
                  </div>
                </div>
              ) : (
                result.findings.map((finding) => (
                  <div className="finding" key={finding.title}>
                    <span className="finding-dot">!</span>
                    <div>
                      <strong>{finding.title}</strong>
                      <p>{finding.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="action-box">
              <div className="action-label">RECOMMENDED ACTION</div>
              <p>{result.action}</p>
            </div>

            <div className="disclaimer">
              ScamShield provides a second opinion, not a guarantee. A low-risk result does not prove that a message is safe.
            </div>
          </section>
        )}

        <section className="feature-grid">
          <article>
            <span className="feature-icon">⌁</span>
            <h3>Show Me Why</h3>
            <p>Understand the signals instead of getting a mysterious yes-or-no verdict.</p>
          </article>
          <article>
            <span className="feature-icon">◉</span>
            <h3>Check links safely</h3>
            <p>Future URL intelligence will inspect suspicious destinations without asking you to open them.</p>
          </article>
          <article>
            <span className="feature-icon">▣</span>
            <h3>Privacy by design</h3>
            <p>Scans should be minimized, protected, and never used to sell advertising profiles.</p>
          </article>
        </section>
      </main>

      <footer>
        <span>SCAMSHIELD V1</span>
        <span>Built for safer clicks.</span>
      </footer>
    </div>
  )
}

export default App
