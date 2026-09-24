# ScamShield V1 Product Specification

## Product

ScamShield — Before You Click, Check.

## Core promise

Give people a clear second opinion when a message, screenshot, or URL feels suspicious.

## Inputs

1. Email or text message
2. URL
3. Screenshot

## Analysis output

- Risk level
- Plain-English summary
- Suspicious indicators
- Evidence found
- Recommended action
- Safe verification guidance

## Risk levels

- LOW RISK — no obvious indicators detected
- CAUTION — characteristics deserve verification
- HIGH RISK — multiple scam/phishing indicators detected
- CRITICAL — strong indicators of credential theft, payment fraud, or malicious activity

## Design principles

- Explain the evidence; do not rely on a black-box verdict.
- Avoid claiming certainty when evidence is incomplete.
- Never instruct users to interact with a suspicious link to verify it.
- Encourage verification through independently obtained official contact information.
- Minimize collection and retention of submitted content.
- Do not sell scan data or use scan contents for advertising.

## V1 screens

### Dashboard
- Check a message
- Check a link
- Upload screenshot
- Recent checks
- Safety tips

### Analysis
- Risk indicator
- Show Me Why
- Evidence Found
- Recommended Action

### History
- Previous checks
- Search/filter
- Delete individual check
- Delete all history

### Settings
- Privacy
- Data retention
- Notifications
- Subscription

## Non-goals for V1

- Antivirus replacement
- Browser extension
- Email inbox monitoring
- Automatic deletion/blocking of messages
- Guaranteed scam detection
