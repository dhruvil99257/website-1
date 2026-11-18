# Security Guide

## Overview
This document outlines the security measures implemented in this website and best practices for deployment.

---

## 1. Environment Variables

### Setup
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Fill in your actual values in `.env.local`
3. **NEVER commit `.env.local` to git** (already in `.gitignore`)

### Variables
- `FORM_SUBMISSION_ENABLED` - Enable/disable form submissions
- `RATE_LIMIT_REQUESTS_PER_MINUTE` - Max form submissions per minute per IP
- `RATE_LIMIT_REQUESTS_PER_HOUR` - Max form submissions per hour per IP
- `NEXT_PUBLIC_SITE_URL` - Your website URL (used for security headers)
- `NEXT_PUBLIC_ENVIRONMENT` - Set to "production" on live site

---

## 2. Security Headers

The following security headers are automatically applied:

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Force HTTPS |
| `Content-Security-Policy` | Restrictive CSP | Prevent XSS, injection attacks |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Enable browser XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer data |
| `Permissions-Policy` | Restrict APIs | Disable unused browser features |

---

## 3. Form Security

### Input Validation
- **Frontend**: Client-side validation for UX
- **Backend**: Server-side validation on API endpoint `/api/submit-inquiry`

### Data Sanitization
- Maximum input length: 500 characters
- Remove dangerous characters: `< >`
- Phone number validation: Indian format (10 digits, starts with 6-9)
- Date validation: Must be today or later
- Passengers validation: 1-56 people

### Rate Limiting
- **Per minute**: 5 requests per IP
- **Per hour**: 20 requests per IP
- Returns `429 Too Many Requests` when limit exceeded
- Prevents spam and brute force attacks

### Phone Number Handling
- Accepts: "98xxxxxxxx", "+91 98xxx xxxxx", "098xxxxxxxx"
- Normalized to 10 digits
- Validated with Indian mobile regex

---

## 4. Data Protection

### What We Don't Store
- Form data is NOT stored permanently by default
- Currently sends to WhatsApp for business use
- No database connection in current setup

### If Adding Database Storage:
```typescript
// Hash sensitive data
import bcrypt from 'bcrypt';

const hashedPhone = await bcrypt.hash(phone, 10);
// Store hashedPhone instead of plain phone
```

### Best Practices:
- Use HTTPS only (enforced by HSTS header)
- Encrypt sensitive data at rest
- Implement access controls
- Regular security audits
- Keep dependencies updated

---

## 5. Deployment Security

### Pre-Deployment Checklist
- [ ] Review all environment variables are set
- [ ] Test rate limiting in production
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Security headers are applied (verify with https://securityheaders.com)
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update dependencies: `npm update`
- [ ] Remove any debug logs from code
- [ ] Test form submission and error handling
- [ ] Configure proper CORS if needed
- [ ] Set up monitoring and error tracking

### HTTPS Certificate
- Use Let's Encrypt (free) or purchase from CA
- Auto-renew certificates
- Minimum TLS 1.2

### Dependencies
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# View details
npm audit --long
```

---

## 6. Monitoring & Logging

### What to Monitor
- Form submission errors
- Rate limit violations (potential attack)
- API response times
- Uptime/downtime

### Recommended Tools
- **Error Tracking**: Sentry, LogRocket
- **Uptime Monitoring**: Pingdom, UptimeRobot, Healthchecks.io
- **Analytics**: Google Analytics (optional)
- **Logs**: Cloud provider logs (Vercel, AWS)

### Security Logging
- Log client IP, timestamp, and submission status
- Log rate limit hits (potential attack indicators)
- Do NOT log form data with sensitive info
- Review logs regularly for suspicious patterns

---

## 7. Third-Party Scripts

### Current Scripts
- **GSAP** (animation library) - From NPM, trusted
- **Google Fonts** - Standard, safe
- **Tailwind CSS** - From NPM, trusted

### Adding New Scripts
- Only add from trusted CDNs (cdn.jsdelivr.net, cdnjs.cloudflare.com)
- Verify SHA integrity if possible
- Test thoroughly before deploying
- Document reason for adding

---

## 8. GDPR & Privacy

### Privacy Notice
- Display clear privacy policy before collecting data
- Explain what data is collected and how it's used
- Provide opt-out mechanisms where applicable

### Data Retention
- Define how long form submissions are stored
- Implement data deletion after retention period
- Respect user data minimization principles

---

## 9. Regular Maintenance

### Weekly
- Monitor error logs
- Check uptime status
- Review suspicious activity

### Monthly
- Run `npm audit`
- Review security headers
- Update dependencies (carefully)
- Test backup restoration

### Quarterly
- Full security audit
- Penetration testing (consider hiring professionals)
- Dependency upgrade review
- SSL certificate renewal check

---

## 10. Incident Response

### If Compromised
1. **Immediately**:
   - Revoke all API keys/tokens
   - Change database passwords
   - Increase logging and monitoring

2. **Within 24 Hours**:
   - Identify what was accessed
   - Notify affected users if needed
   - Deploy patches

3. **Within 72 Hours**:
   - Complete investigation report
   - Implement preventive measures
   - Update security documentation

---

## 11. Contact & Support

For security issues or vulnerabilities:
- Do NOT post on public forums
- Contact: [admin email]
- Include: Vulnerability description, reproduction steps, impact
- Allow time for response before public disclosure

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [MDN Security Guide](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CWE Top 25](https://cwe.mitre.org/top25/)
