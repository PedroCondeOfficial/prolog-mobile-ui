# Prolog Mobile UI

A small Next.js front end for [`prolog-mobile-api`](../prolog-mobile-api). Press **Fetch data** and it calls the API, shows a circuit animation while the request runs, then lists inventory by category. Tap a category row to see its items.

```
Browser (localhost:3000)  ──GET──▶  prolog-mobile-api (localhost:5286)  ──▶  upstream Prolog API
       this repo                       ../prolog-mobile-api
```

## Prerequisites

- Node.js 20.9 or newer, with npm
- .NET 10 SDK, for the API
- Both repos checked out side by side:

  ```
  ~/Documents/
  ├── prolog-mobile-api/
  └── prolog-mobile-ui/
  ```

## 1. Start the API

The API needs the upstream Prolog API's URL and key. They are left empty in `appsettings.json`, so set them with .NET user secrets (stored outside the repo):

```bash
cd ~/Documents/prolog-mobile-api
dotnet user-secrets set "PrologApi:BaseUrl" "<upstream base URL>"
dotnet user-secrets set "PrologApi:ApiKey"  "<your API key>"
```

If either value is missing, the API fails at startup with an options validation error.

Run it with the `http` profile so it listens on port 5286:

```bash
dotnet run --launch-profile http
```

Check that it's up:

```bash
curl http://localhost:5286/api/prolog/health   # {"status":"online"}
curl http://localhost:5286/api/prolog/         # JSON array of categories
```

CORS is set up in the API's `appsettings.Development.json` (`Cors:AllowedOrigins`) and already allows `http://localhost:3000`. If you serve the UI from another port or host, add that origin there.

## 2. Start the UI

```bash
cd ~/Documents/prolog-mobile-ui
cp .env.example .env    # skip if .env already exists
npm install
npm run dev
```

Open http://localhost:3000 and press **Fetch data**.

### Configuration

| Variable              | Default                                | Purpose                         |
| --------------------- | -------------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5286/api/prolog/`    | Endpoint the Fetch button calls |

The browser calls the API directly, so the variable needs the `NEXT_PUBLIC_` prefix. Next.js reads it when the dev server starts or the app is built, so restart `npm run dev` after you change it.

## Response shape

`GET /api/prolog/` returns an array of category summaries:

```json
[
  {
    "category": "Electronics",
    "totalInventoryValue": 18253.18,
    "availableRecordCount": 25,
    "mostRecentlyUpdated": { "id": 1037, "name": "Barcode Scanner MK-1037", "lastUpdated": "2026-09-23T17:05:00+00:00" },
    "items": [
      { "id": 1001, "name": "Thermal Receipt Printer MK-1001", "category": "Electronics", "price": 4.99, "quantity": 0, "lastUpdated": "2026-09-01T00:00:00+00:00" }
    ]
  }
]
```

The API's `ASSUMPTIONS.md` explains how these values are calculated. For example, `availableRecordCount` counts only items with quantity above zero, and `totalInventoryValue` is the sum of price × quantity.

## Troubleshooting

- **"Failed to fetch" / network error**: the API isn't running on port 5286, or CORS is blocking the request. Check the browser console. A CORS error means the UI's origin is missing from `Cors:AllowedOrigins`.
- **`Request failed: 500`**: the API couldn't reach the upstream service. Check the user secrets and the API's console output.
- **"NEXT_PUBLIC_API_URL is not set"**: `.env` is missing. Copy `.env.example` and restart the dev server.

## Project layout

```
app/
├── page.tsx                  # Fetch button, error state, table
├── components/
│   ├── CategoryTable.tsx     # Category rows with expandable item rows
│   └── CircuitLoader.tsx     # Loading modal with the circuit animation
├── lib/inventory.ts          # Types, fetch call, formatting helpers
└── globals.css               # Tailwind plus the circuit keyframes
```

## Scripts

| Command         | What it does               |
| --------------- | -------------------------- |
| `npm run dev`   | Dev server on port 3000    |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | ESLint                     |
