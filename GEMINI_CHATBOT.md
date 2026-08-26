# Gemini Chatbot — Integration Guide

Purpose

- Brief: forward user questions to an external Gemini model API and return the model's response.

Endpoint

- URL: `POST /api/v1/gemini`
- Request JSON: `{ "question": "..." }`
- Success response: project's `ApiResponse` JSON shape: `{ statusCode: number, data: any, message: string }` — `data` contains the Gemini API response object.

Configuration

- Environment variables required:
  - `GEMINI_API_KEY` — Bearer token used to authenticate to the Gemini API.
  - `GEMINI_API_URL` — Full POST URL for the Gemini API endpoint.
- Dependency: `axios` (already added to `package.json`).

Usage example (curl)

```bash
curl -X POST http://localhost:8000/api/v1/gemini \
  -H "Content-Type: application/json" \
  -d '{"question":"What is the capital of France?"}'
```

Example response (shape)

```json
{
  "statusCode": 200,
  "data": {
    /* Gemini API response payload */
  },
  "message": "Success"
}
```

Error cases

- `400` — missing `question` in request body.
- `500` — missing `GEMINI_API_KEY` or `GEMINI_API_URL` in environment.
- `502` — upstream Gemini API failure; server logs will include the provider error details.

Implementation notes

- Controller: `src/controllers/gemini.controller.js` — validates input, reads env vars, forwards the request to the configured Gemini API using `axios`, and wraps the provider response with the project's `ApiResponse` wrapper.
- Router: `src/routes/gemini.router.js` — mounted at `/api/v1/gemini` from `src/app.js`.

Customization tips

- If the real Gemini API expects a different request body or headers, update `src/controllers/gemini.controller.js` to match the spec (change JSON shape, add extra headers, or stream handling).
- To handle streaming or token-by-token responses, replace `axios.post` with an HTTP client that supports streaming and adapt the response handling.

Security & production

- Keep `GEMINI_API_KEY` secret; do not commit it to source control.
- Consider rate-limiting and per-user quotas to protect the API key and control costs.
- Log minimal request metadata (no PII) and only surface provider errors in server logs.

Troubleshooting

- Verify the env vars are loaded by printing `process.env.GEMINI_API_URL` (locally) if requests fail.
- Check server console for `Gemini API error:` logs when the upstream provider returns non-2xx.

Next steps

- Add tests/mocks for the controller to validate request/response behavior.
- Optionally add a small front-end widget that POSTs to this endpoint for quick QA.

---

If you'd like, I can also: install deps and run the server here, switch the payload to a specific Gemini API format, or add a minimal test file.
