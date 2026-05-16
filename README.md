# 🍛 Taste of India Malta — Website

**Live at:** https://tasteofindiaeu.com  
**GitHub:** https://github.com/mohdsmrkhan99-hub/tasteofindiaeu

---

## 📁 Files in This Website

```
tasteofindiaeu/
├── index.html       ← Main homepage (all sections)
├── css/
│   └── style.css    ← All styling
├── js/
│   └── main.js      ← Interactions & WhatsApp links
├── CNAME            ← Connects tasteofindiaeu.com domain
└── README.md        ← This file
```

---

## 🚀 HOW TO UPLOAD TO GITHUB (Step by Step)

### Step 1 — Go to your GitHub
Open: https://github.com/mohdsmrkhan99-hub

### Step 2 — Create New Repository
1. Click the green **"New"** button
2. Repository name: `tasteofindiaeu`
3. Set to **Public**
4. Do NOT tick "Add README"
5. Click **Create repository**

### Step 3 — Upload the Files
1. On the new empty repo page, click **"uploading an existing file"**
2. Drag and drop ALL files from this folder:
   - `index.html`
   - `CNAME`
   - `README.md`
   - The `css/` folder (with style.css)
   - The `js/` folder (with main.js)
3. Click **"Commit changes"**

### Step 4 — Enable GitHub Pages
1. Go to repo **Settings** (top menu)
2. Click **Pages** in left sidebar
3. Under Source: choose **Deploy from branch**
4. Branch: **main**, Folder: **/ (root)**
5. Click **Save**
6. Wait 2 minutes → your site is live at:
   `https://mohdsmrkhan99-hub.github.io/tasteofindiaeu`

### Step 5 — Connect Your GoDaddy Domain
In your GoDaddy DNS settings, add these records:

| Type  | Name | Value               | TTL  |
|-------|------|---------------------|------|
| A     | @    | 185.199.108.153     | 600  |
| A     | @    | 185.199.109.153     | 600  |
| A     | @    | 185.199.110.153     | 600  |
| A     | @    | 185.199.111.153     | 600  |
| CNAME | www  | mohdsmrkhan99-hub.github.io | 600 |

Then in GitHub Pages settings, add custom domain: `tasteofindiaeu.com`

Wait 24 hours → https://tasteofindiaeu.com is LIVE! ✅

---

## 📋 AFTER GOING LIVE — To Do

- [ ] Add your restaurant to **Google My Business** (free, great for SEO)
- [ ] Share the link on **Facebook, Instagram**
- [ ] Add the website URL to your WhatsApp status
- [ ] Print the website URL on your receipts/bags

---

## ✏️ HOW TO EDIT THE MENU

Open `index.html` and find the section you want to change.
Each menu item looks like this:

```html
<div class="menu-card">
  <div class="menu-card-header">
    <span class="menu-card-name">Butter Chicken</span>
    <span class="menu-card-price">€8.99</span>
  </div>
  <div class="menu-card-desc">Description here</div>
</div>
```

Just change the name, price or description and re-upload the file.

---

## 📞 Support
WhatsApp: 9979 6995
