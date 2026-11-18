# Deployment Guide: Vercel (Recommended)

> **Why Vercel?** Easiest for Next.js, free HTTPS, automatic scaling, built-in security.

---

## Step 1: Prepare Your Repository

```bash
# Ensure code is committed and pushed to GitHub/GitLab/Bitbucket
git status
git push origin main
```

---

## Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Connect your Git provider (GitHub recommended)
4. Authorize Vercel to access your repositories

---

## Step 3: Import Project

1. Click **"New Project"**
2. Find your repository and click **"Import"**
3. Vercel auto-detects Next.js configuration
4. Click **"Deploy"** (builds automatically)

---

## Step 4: Configure Environment Variables

1. Go to **Project Settings → Environment Variables**
2. Add all variables from `.env.local.example`:

```
FORM_SUBMISSION_ENABLED = true
RATE_LIMIT_REQUESTS_PER_MINUTE = 5
RATE_LIMIT_REQUESTS_PER_HOUR = 20
NEXT_PUBLIC_SITE_URL = https://yourdomain.com
NEXT_PUBLIC_ENVIRONMENT = production
```

3. Select scopes:
   - **Production** ✓
   - **Preview** (for testing)
   - **Development** (optional)

4. Click **"Save"**

---

## Step 5: Custom Domain

1. Go to **Project Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Update your domain's DNS records:

   **For Vercel nameservers** (easiest):
   ```
   Change nameservers to:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
   ```

   **Or CNAME record** (if keeping current provider):
   ```
   CNAME yourdomain.com cname.vercel-dns.com
   ```

5. Wait 24-48 hours for DNS propagation

---

## Step 6: SSL Certificate

Vercel automatically provides free SSL certificates via Let's Encrypt.

**Verify HTTPS is working:**
```bash
curl -I https://yourdomain.com
# Should show: HTTP/2 200 and security headers
```

---

## Step 7: Monitoring

### Vercel Dashboard
- **Deployments**: View all deployments and rollback if needed
- **Analytics**: Performance metrics, edge requests
- **Functions**: Monitor API endpoint logs

### Add Sentry for Error Tracking
1. Create account at [sentry.io](https://sentry.io)
2. Create new Next.js project
3. Get `NEXT_PUBLIC_SENTRY_DSN`
4. Add to Vercel environment variables
5. Install Sentry in your project:
   ```bash
   npm install @sentry/nextjs
   ```

---

## Step 8: Security Headers Verification

1. Go to [https://securityheaders.com](https://securityheaders.com)
2. Enter your domain: `yourdomain.com`
3. Should show **A+ grade**
4. If not, check `next.config.ts` headers configuration

---

## Step 9: Continuous Deployment

**Automatic Deployments:**
- Push to `main` branch → Production deployment
- Create pull request → Preview deployment
- Each commit auto-deploys

**Manual Deployments:**
1. Go to **Deployments** tab
2. Click redeploy any previous version

---

## Step 10: Scaling & Performance

Vercel handles scaling automatically:
- ✅ Automatic edge caching
- ✅ Serverless functions auto-scale
- ✅ Image optimization built-in
- ✅ Rate limiting handled by API route

---

## Step 11: Database (Optional)

If you want to store inquiries, Vercel integrates with:
- **Vercel Postgres** (PostgreSQL)
- **Vercel KV** (Redis)

```bash
# Install Vercel Postgres
npm install @vercel/postgres
```

---

## Troubleshooting

### Builds Failing
```bash
# Check build logs in Vercel dashboard
# Common issues:
# 1. Environment variables missing
# 2. TypeScript errors
# 3. Dependency conflicts
```

### HTTPS Not Working
- Wait 24 hours for DNS propagation
- Clear browser cache (Ctrl+Shift+Delete)
- Verify domain DNS settings

### Rate Limiting Not Working
- Check environment variables are set
- Restart deployment: **Deployments → Redeploy**

### Form Submissions Failing
- Check API route exists: `/api/submit-inquiry`
- Review Vercel function logs
- Test with curl:
  ```bash
  curl -X POST https://yourdomain.com/api/submit-inquiry \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","phone":"9876543210"}'
  ```

---

## Cost

- **Free Plan**: Perfect for most sites
  - 1 GB bandwidth per month
  - 10 deployments per day
  - Automatic SSL
  - Custom domains

- **Pro Plan**: For high traffic
  - $20/month
  - Unlimited bandwidth
  - Priority support

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure custom domain
3. ✅ Add environment variables
4. ✅ Verify security headers
5. ✅ Set up error monitoring
6. ✅ Monitor analytics
7. ✅ Update README with live link
