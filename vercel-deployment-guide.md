# Deploy `EmployeeManagementUI` to Vercel (GitHub Method)

This is the easiest free deployment flow for your frontend.

---

## 1) Before you start

Make sure these are already true:

- `EmployeeManagementUI/js/config.js` has:

```js
API_BASE_URL: "https://emp-mgmt-api.runasp.net/api"
```

- `EmployeeManagementUI/vercel.json` exists (already added) for SPA-friendly fallback.

---

## 2) Push code to GitHub

From repository root, run:

```bash
git add .
git commit -m "Prepare frontend for Vercel deployment"
git push origin main
```

---

## 3) Create project in Vercel

1. Go to https://vercel.com
2. Login with GitHub
3. Click **Add New...** → **Project**
4. Select your repository
5. Click **Import**

---

## 4) Important Vercel settings

Because your repo has backend + frontend, set:

- **Root Directory**: `EmployeeManagementUI`

Build settings for this static app:

- **Framework Preset**: `Other`
- **Build Command**: *(leave empty)*
- **Output Directory**: *(leave empty)*

Then click **Deploy**.

---

## 5) Test deployed app

After deploy, Vercel gives URL like:

`https://your-project-name.vercel.app`

Open and test:

- `https://your-project-name.vercel.app/#/login`
- Login/Register
- Dashboard data
- Employees page
- Departments page

---

## 6) Quick troubleshooting

### App opens but API calls fail
- Open browser DevTools → **Network**
- Confirm request URL starts with:
  `https://emp-mgmt-api.runasp.net/api`

### Unauthorized / old token issue
- Run in browser console:

```js
localStorage.clear();
```

- Refresh and login again.

### Blank page after update
- Hard refresh (`Ctrl + F5`)

---

## 7) Future updates

When you push new commits to GitHub, Vercel auto-deploys latest frontend changes.
