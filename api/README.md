# Launching "A Letter From Your Future Self" — Step by Step

No coding required. Just copy-paste and click. Should take about 20-30 minutes total.

---

## Step 1 — Get a free Groq API key (the AI "brain")

1. Go to https://console.groq.com and sign up (email or Google login, no credit card).
2. Once inside, click **API Keys** in the left sidebar → **Create API Key**.
3. Copy the key it gives you (starts with `gsk_...`) and paste it somewhere safe for now — you'll need it in Step 3.

This is free — Groq's free tier gives you thousands of requests per day, more than enough to get started.

---

## Step 2 — Put the code on GitHub (free file storage + deployment source)

1. Go to https://github.com and create a free account if you don't have one.
2. Click the **+** icon top-right → **New repository**.
3. Name it something like `future-self-letter`, keep it **Public**, click **Create repository**.
4. Click **uploading an existing file** on the next screen.
5. Drag in all three files from this folder: `index.html`, the `api` folder (with `generate-letter.js` inside it), and this `README.md`.
6. Click **Commit changes**.

---

## Step 3 — Deploy it live with Vercel (free hosting)

1. Go to https://vercel.com and sign up using your GitHub account (one click).
2. Click **Add New → Project**.
3. Find and **Import** the `future-self-letter` repo you just created.
4. Before clicking Deploy, expand **Environment Variables** and add:
   - Name: `GROQ_API_KEY`
   - Value: paste the key you copied in Step 1
5. Click **Deploy**.

In under a minute, Vercel gives you a live link like `future-self-letter.vercel.app` — that's your real, working, public website. Anyone in the world can now open it and get a letter.

---

## Step 4 — Test it for real

Open your new link, fill in the form yourself, and confirm a letter comes back. If something breaks:
- Check that `GROQ_API_KEY` is spelled exactly right in Vercel's Environment Variables.
- Check Vercel's **Deployments → Functions logs** tab for the actual error message.

---

## Step 5 — (Optional, later) Get a nicer domain

Once it's working, you can buy a cheap `.xyz` or `.app` domain (₹100-800/year from Namecheap or similar) and point it at your Vercel project under **Settings → Domains** — but the free `.vercel.app` link works perfectly fine to launch and test with.

---

## If Groq's free daily limit runs out during a viral spike

Swap `llama-3.3-70b-versatile` for `llama-3.1-8b-instant` in `api/generate-letter.js` (higher daily request limit, slightly less polished writing) — or get a second free key from Google AI Studio (https://aistudio.google.com) as a backup provider if this really takes off.
