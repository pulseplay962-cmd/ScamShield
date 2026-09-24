# ScamShield API

## Local setup

1. Copy `.env.example` to `.env`.
2. Add your OpenAI API key.
3. Install dependencies:

```bash
npm install
```

4. Start the API:

```bash
npm run dev
```

Health check:

```
GET /api/health
```

AI analysis:

```
POST /api/analyze
Content-Type: application/json

{"text":"Paste the suspicious message here"}
```

The API does not persist submitted message content. Keep the API key on the server and never expose it in the React application.
