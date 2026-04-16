# Deploy AI SEO Tool to Netlify

## What You Need (5 mins to get these)

| Item | Where to get it | Cost |
|------|----------------|------|
| Claude API Key | https://console.anthropic.com | Free credits to start |
| Netlify Account | https://netlify.com | Free |
| GitHub Account | https://github.com | Free |

---

## Step-by-Step Deployment

### Step 1 — Get Your Claude API Key
1. Go to https://console.anthropic.com
2. Sign up / Log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

---

### Step 2 — Push to GitHub
```bash
# In the ai-seo-tool folder:
git init
git add .
git commit -m "Initial AI SEO Tool"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-seo-tool.git
git push -u origin main
```

---

### Step 3 — Deploy on Netlify
1. Go to https://app.netlify.com
2. Click **Add new site** → **Import an existing project**
3. Connect GitHub → Select your `ai-seo-tool` repo
4. Build settings will auto-detect from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**

---

### Step 4 — Add Environment Variable
1. In Netlify → Your Site → **Site configuration**
2. Go to **Environment variables** → **Add a variable**
3. Add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-YOUR_KEY_HERE`
4. Click **Save** → **Trigger redeploy**

---

### Step 5 — You're Live! 🎉
Your AI SEO Tool will be live at:
`https://YOUR-SITE-NAME.netlify.app`

---

## Running Locally (for testing)

```bash
# Install dependencies
npm install

# Install Netlify CLI globally
npm install -g netlify-cli

# Copy env file
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run locally
npm run dev
# Open http://localhost:8888
```

---

## Upgrading to Path B (Ahrefs)

When ready to add real keyword data:
1. Get Ahrefs API key from https://ahrefs.com/api
2. Add `AHREFS_API_KEY` to Netlify environment variables
3. The functions are pre-wired to use it automatically

---

## Estimated Monthly Cost (Path A)

| Service | Plan | Cost |
|---------|------|------|
| Netlify | Free | $0 |
| Claude API | Pay-as-you-go | ~$10-15/mo |
| GitHub | Free | $0 |
| **Total** | | **~$10-15/mo** |
