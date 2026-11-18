# Security & Deployment Quick Start

> **TL;DR**: Follow these 5 simple steps to deploy your website securely.

---

## ⚡ 5-Minute Setup

### 1️⃣ Set Environment Variables

```bash
# Copy template
cp .env.local.example .env.local

# Edit the file (add your settings)
nano .env.local
```

**Minimum values needed:**
```
FORM_SUBMISSION_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=5
RATE_LIMIT_REQUESTS_PER_HOUR=20
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_ENVIRONMENT=production
```

### 2️⃣ Check Security Locally

```bash
# Check for vulnerabilities
npm audit

# Start development server
npm run dev

# Test form submission
# Open http://localhost:3000 in browser
# Try submitting the form
```

### 3️⃣ Choose Deployment Platform

**🟢 Easiest: Vercel** (Recommended)
- No server management
- Automatic HTTPS & security headers
- Free for most use cases
- **⏱️ Time to deploy: 5 minutes**
- **📖 Guide**: See `DEPLOYMENT_VERCEL.md`

**🔵 More Control: AWS Amplify**
- More customization
- Integrates with AWS services
- Scaling control
- **⏱️ Time to deploy: 15 minutes**
- **📖 Guide**: See `DEPLOYMENT_AWS.md` (Amplify section)

**🟡 Full Control: AWS EC2**
- Complete server control
- Maximum customization
- Requires more maintenance
- **⏱️ Time to deploy: 1 hour**
- **📖 Guide**: See `DEPLOYMENT_AWS.md` (EC2 section)

### 4️⃣ Deploy

**For Vercel:**
```bash
# Push to GitHub
git push origin main

# Go to https://vercel.com
# Click "New Project"
# Import your repository
# Add environment variables
# Click "Deploy"
```

**For AWS Amplify:**
```bash
# Push to GitHub
git push origin main

# Go to AWS Amplify Console
# Click "New app → Host web app"
# Connect your repository
# Add environment variables
# Click "Save and deploy"
```

### 5️⃣ Verify Security

```bash
# Wait for deployment to complete (2-5 minutes)

# Then run these checks:

# 1. Test your site
# Open: https://yourdomain.com
# Should show 🔒 green lock

# 2. Check security headers
# Go to: https://securityheaders.com
# Enter: yourdomain.com
# Should show: A+ grade

# 3. Check SSL
# Go to: https://www.ssllabs.com/ssltest/
# Enter: yourdomain.com
# Should show: A or A+

# 4. Test form submission
# Open site → Scroll to form → Submit
# Should complete without errors
```

---

## 📋 Deployment Checklist

Before going live, ensure:

```bash
# ✅ Code is clean
npm audit
git status  # Should be clean

# ✅ Build works
npm run build  # Should succeed without errors

# ✅ Environment file exists
ls -la .env.local  # Should exist

# ✅ No secrets in code
grep -r "password\|secret\|token" src/ --exclude-dir=node_modules

# ✅ All files committed
git status  # Should show nothing to commit
```

---

## 🚀 After Deployment

### Day 1: Initial Testing
- [ ] Website loads and looks correct
- [ ] Form submission works
- [ ] Mobile version responsive
- [ ] No errors in browser console (F12)
- [ ] Security headers show A+ on https://securityheaders.com

### Week 1: Monitoring
- [ ] Check deployment logs daily
- [ ] Monitor form submissions
- [ ] No error spikes

### Month 1: Optimization
- [ ] Review Google PageSpeed Insights
- [ ] Optimize images if needed
- [ ] Monitor uptime
- [ ] Review rate limit stats

---

## 🆘 Troubleshooting

### Website doesn't work?

```bash
# 1. Check if deployment succeeded
# View deployment logs in Vercel/AWS dashboard

# 2. Check environment variables
# Verify all env vars are set in platform dashboard

# 3. Check build output
# Look for build errors in deployment logs

# 4. Force redeploy
# In dashboard, find latest deployment and click "Redeploy"
```

### Form not working?

```bash
# 1. Open browser developer tools (F12)
# 2. Go to Console tab
# 3. Try submitting form again
# 4. Look for error messages
# 5. Take screenshot of error
# 6. Check if API route exists:
curl https://yourdomain.com/api/submit-inquiry
# Should return 405 (method not allowed)
# This means the endpoint exists!
```

### Security headers not showing?

```bash
# 1. Wait 24 hours for DNS propagation
# 2. Clear browser cache (Ctrl+Shift+Delete)
# 3. Check in incognito window
# 4. Try different domain checker:
curl -I https://yourdomain.com
# Should show security headers
```

### Rate limiting too strict?

Edit `.env.local`:
```
RATE_LIMIT_REQUESTS_PER_MINUTE=10  # Increase if needed
RATE_LIMIT_REQUESTS_PER_HOUR=50
```

Then redeploy.

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **SECURITY.md** | Detailed security explanations |
| **DEPLOYMENT_VERCEL.md** | Complete Vercel deployment guide |
| **DEPLOYMENT_AWS.md** | Complete AWS deployment guide |
| **SECURITY_CHECKLIST.md** | Pre/post deployment checklist |
| **.env.local.example** | Environment variables template |

---

## 💡 Tips for Success

✅ **Do this:**
- Start with Vercel (easiest)
- Keep `.env.local` secret
- Monitor logs regularly
- Keep dependencies updated
- Test on mobile

❌ **Don't do this:**
- Commit `.env.local` to git
- Use weak rate limiting values
- Ignore security warnings
- Hardcode secrets in code
- Deploy without testing

---

## 🎯 Next Steps

1. **Right now** → Set up `.env.local`
2. **Next 5 min** → Push to GitHub
3. **Next 10 min** → Deploy to Vercel/AWS
4. **Next 1 hour** → Verify with security checkers
5. **Next day** → Monitor and optimize

---

## 🆘 Still Need Help?

1. **Check relevant guide**:
   - Vercel issues? → `DEPLOYMENT_VERCEL.md`
   - AWS issues? → `DEPLOYMENT_AWS.md`
   - Security questions? → `SECURITY.md`

2. **Verify checklist**: `SECURITY_CHECKLIST.md`

3. **Ask in**: Platform support (Vercel/AWS)

4. **Resources**:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [AWS Docs](https://docs.aws.amazon.com)
   - [OWASP Security](https://owasp.org)

---

**You've got this! 🚀**
