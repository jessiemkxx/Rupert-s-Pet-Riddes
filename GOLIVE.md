# Rupert's Pet Rides — Go-Live Guide
## Square Payments + Vercel Hosting + PWA

---

## What's in this package

```
ruberts_app_final.html        ← rename to index.html when deploying
square-setup/
  api/square-payment.js       ← Vercel serverless function (processes payments)
  manifest.json               ← PWA manifest (makes it installable as an app)
  sw.js                       ← Service worker (offline support + caching)
  vercel.json                 ← Vercel routing + security config
  GOLIVE.md                   ← This file
```

---

## STEP 1 — Create your Square Developer account

1. Go to **developer.squareup.com** and sign in with your Square account
   (or create one at squareup.com if you don't have one)
2. Click **Create an Application**
3. Name it `Rupert's Pet Rides`
4. From your new application, copy:
   - **Application ID** → looks like `sq0idp-xxxxxxxxxxxxxxxxxxxx`
   - **Location ID** → looks like `LXXXXXXXXXXXXXXXXX`
   - **Access Token** (Sandbox for testing, Production when going live)

---

## STEP 2 — Add your Square credentials to the app

Open `index.html` (renamed from ruberts_app_final.html) and find these two lines near the bottom:

```js
const SQUARE_APP_ID      = 'YOUR_APP_ID';
const SQUARE_LOCATION_ID = 'YOUR_LOCATION_ID';
```

Replace them with your real values:

```js
const SQUARE_APP_ID      = 'sq0idp-xxxxxxxxxxxxxxxxxxxx';
const SQUARE_LOCATION_ID = 'LXXXXXXXXXXXXXXXXX';
```

Also find the Square SDK script tag and swap sandbox → production when ready:
```html
<!-- SANDBOX (testing): -->
<script src="https://sandbox.web.squarecdn.com/v1/square.js"></script>

<!-- PRODUCTION (live payments): -->
<script src="https://web.squarecdn.com/v1/square.js"></script>
```

---

## STEP 3 — Set up Vercel

1. Go to **vercel.com** and sign up with GitHub (free)
2. Click **Add New Project**
3. Drag and drop your project folder (containing index.html, api/, sw.js, manifest.json, vercel.json)
   — OR — push to a GitHub repo and connect it
4. Before deploying, click **Environment Variables** and add:

   | Variable Name          | Value                              |
   |------------------------|------------------------------------|
   | `SQUARE_ACCESS_TOKEN`  | Your Square access token           |
   | `SQUARE_LOCATION_ID`   | Your Square location ID            |
   | `NODE_ENV`             | `production`                       |

5. Click **Deploy** — Vercel gives you a live HTTPS URL instantly
   e.g. `ruberts-pet-rides.vercel.app`

6. **Custom domain:** In Vercel → Settings → Domains, add `rupertspetrides.com.au`
   Then update your DNS with a CNAME record pointing to `cname.vercel-dns.com`

---

## STEP 4 — Install Square Node.js SDK (for the payment backend)

In your project folder, run:
```bash
npm init -y
npm install squareup
```

This installs the Square SDK that `api/square-payment.js` imports.

---

## STEP 5 — Add PWA to index.html

Add these two lines inside the `<head>` tag of your index.html:

```html
<link rel="manifest" href="/manifest.json"/>
<meta name="theme-color" content="#C8352A"/>
```

Add this before `</body>`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

---

## STEP 6 — App icons

Create two square PNG icons of Rupert's paw logo:
- `icons/icon-192.png` — 192×192px
- `icons/icon-512.png` — 512×512px

Use **Canva** to create these — red background (#C8352A), white 🐾 paw centred.

---

## STEP 7 — Test payments (Sandbox mode)

Use these Square test card numbers:
- **Successful payment:** `4111 1111 1111 1111` — any future date, any CVV
- **Declined:**           `4000 0000 0000 0002`
- **Insufficient funds:** `4000 0000 0000 9995`

---

## STEP 8 — Go live

1. In Square Developer Dashboard → your app → switch from **Sandbox** to **Production**
2. Copy your **Production Access Token** and update the `SQUARE_ACCESS_TOKEN` env var in Vercel
3. Swap the Square SDK script src to the production URL (remove `sandbox.`)
4. Redeploy on Vercel

---

## How customers install it as an app

**iPhone (Safari):**
1. Open your Vercel URL in Safari
2. Tap the Share button (box with arrow)
3. Tap **Add to Home Screen**
4. Tap Add — Rupert's icon appears on their home screen

**Android (Chrome):**
1. Open your Vercel URL in Chrome
2. Chrome auto-shows an **"Add to Home Screen"** banner
3. Tap Install

---

## Payment flow summary

```
Customer taps "Confirm & pay"
        ↓
Square Web SDK tokenizes card (client-side, PCI compliant)
        ↓
Token sent to /api/square-payment (your Vercel backend)
        ↓
Backend calls Square Payments API CreatePayment
        ↓
Square charges the card and returns COMPLETED status
        ↓
App shows confirmation screen 🎉
```

---

## Fees

Square charges **1.6% per transaction** for Australian cards (as of 2026).
No monthly fee, no setup fee. They deposit to your bank account within 1–2 business days.

---

*Built by Claude for Jessie @ Rupert's Pet Rides*
