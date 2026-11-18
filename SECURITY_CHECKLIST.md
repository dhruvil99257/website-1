# Security Deployment Checklist

Use this checklist before going live and regularly after deployment.

---

## Pre-Launch Checklist ✅

### Code Security
- [ ] Run `npm audit` and fix all vulnerabilities
- [ ] Review for hardcoded secrets (passwords, keys, tokens)
- [ ] Remove all `console.log()` debug statements
- [ ] Check for XSS vulnerabilities in components
- [ ] Verify input sanitization in API routes
- [ ] Remove test/mock data from production code
- [ ] Review dependencies for suspicious packages

### Configuration
- [ ] `.env.local` file created from `.env.local.example`
- [ ] All environment variables filled in
- [ ] `.env.local` is in `.gitignore`
- [ ] `NEXT_PUBLIC_ENVIRONMENT=production` set
- [ ] Rate limiting values configured
- [ ] Form submission enabled in production

### HTTPS/SSL
- [ ] SSL certificate is valid
- [ ] HTTPS enforced (redirects HTTP → HTTPS)
- [ ] Certificate renewal is automatic
- [ ] Security headers are present (verify with securityheaders.com)

### API Security
- [ ] Form API has input validation
- [ ] Rate limiting is implemented
- [ ] No sensitive data in error messages
- [ ] CORS is properly configured
- [ ] API logging doesn't expose sensitive data

### Form/Input Handling
- [ ] Frontend validation works
- [ ] Backend validation works
- [ ] Phone number validation is correct
- [ ] Date validation prevents past dates
- [ ] Passenger count is limited (1-56)
- [ ] XSS protection: User input is sanitized
- [ ] SQL injection not possible (using API, not direct DB)

### Data Privacy
- [ ] Privacy policy is published
- [ ] Data retention policy is defined
- [ ] No unnecessary data collection
- [ ] User data is not logged in plain text

---

## Deployment Checklist ✅

### Vercel Deployment
- [ ] GitHub repository is public/properly authenticated
- [ ] All environment variables added to Vercel dashboard
- [ ] Build succeeds without errors
- [ ] Deployment is completed
- [ ] Custom domain is configured
- [ ] DNS records are propagated
- [ ] HTTPS is working and showing 🔒
- [ ] No self-signed certificate warnings

### AWS Deployment
- [ ] Security group allows only needed ports (22, 80, 443)
- [ ] SSH key pair is secure and backed up
- [ ] Instance has latest security patches
- [ ] SSL certificate is installed and auto-renewing
- [ ] Firewall (UFW) is enabled
- [ ] Fail2Ban is running
- [ ] PM2 or similar process manager is configured

---

## Post-Deployment Verification ✅

### Functionality
- [ ] Website loads in browser
- [ ] All pages are accessible
- [ ] Navigation works correctly
- [ ] Forms are functional
- [ ] No JavaScript errors in console (F12)
- [ ] Contact form can be submitted
- [ ] Success message appears after submission
- [ ] WhatsApp link works (if applicable)

### Security Headers
- [ ] Run https://securityheaders.com check
- [ ] Should show **A+ grade**
- [ ] All security headers are present:
  - [ ] Strict-Transport-Security ✓
  - [ ] Content-Security-Policy ✓
  - [ ] X-Frame-Options ✓
  - [ ] X-Content-Type-Options ✓
  - [ ] X-XSS-Protection ✓
  - [ ] Referrer-Policy ✓
  - [ ] Permissions-Policy ✓

### HTTPS
- [ ] Run https://www.ssllabs.com/ssltest/ check
- [ ] Should show **A or A+**
- [ ] Certificate is valid and not self-signed
- [ ] HSTS header is present

### Performance
- [ ] Page load time is acceptable (<3 seconds)
- [ ] Run Google PageSpeed Insights check
- [ ] Mobile performance score >80
- [ ] Desktop performance score >80

---

## Ongoing Maintenance ✅

### Weekly
- [ ] Check error logs (Sentry, Vercel, AWS CloudWatch)
- [ ] Monitor form submission errors
- [ ] Check uptime status
- [ ] Review suspicious activity in logs

### Monthly
- [ ] Run `npm audit` and review results
- [ ] Check for dependency updates
- [ ] Review security headers on https://securityheaders.com
- [ ] Test SSL certificate renewal
- [ ] Check website availability from multiple locations
- [ ] Review access logs for suspicious patterns

### Quarterly
- [ ] Update all dependencies carefully
- [ ] Run full security audit
- [ ] Penetration testing (consider hiring professionals)
- [ ] Review and update SECURITY.md
- [ ] SSL certificate renewal verification
- [ ] Database backups verification (if applicable)
- [ ] Disaster recovery plan review

### Annually
- [ ] Full infrastructure review
- [ ] Security audit by third-party
- [ ] Update security policies
- [ ] Review and update GDPR/privacy compliance
- [ ] SSL certificate re-issuance

---

## Common Issues & Fixes 🔧

### Issue: Security headers not showing

**Solution:**
1. Verify `next.config.ts` has headers configuration
2. Rebuild and redeploy
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check domain propagation (wait 24-48 hours for DNS)

```bash
# Check headers
curl -I https://yourdomain.com
```

### Issue: Form submissions failing

**Solution:**
1. Check API endpoint exists: `/api/submit-inquiry`
2. Verify environment variables are set
3. Check browser console for errors (F12)
4. Test API directly:
   ```bash
   curl -X POST https://yourdomain.com/api/submit-inquiry \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","phone":"9876543210","pickup":"City A","destination":"City B","date":"2025-01-01","passengers":"4","seating":"","tripType":"sightseeing"}'
   ```

### Issue: Rate limiting too strict

**Solution:**
1. Adjust environment variables:
   ```
   RATE_LIMIT_REQUESTS_PER_MINUTE = 10  # Increase from 5
   RATE_LIMIT_REQUESTS_PER_HOUR = 50     # Increase from 20
   ```
2. Redeploy
3. Test again

### Issue: SSL certificate expiring soon

**Solution:**
1. For Vercel: Automatic renewal (no action needed)
2. For AWS:
   ```bash
   sudo certbot renew --dry-run
   sudo certbot renew
   ```

### Issue: High error rate in logs

**Solution:**
1. Check if rate limit is being hit
2. Review recent code changes
3. Check for bot/scraper attacks
4. Enable IP blocking in Nginx/security group
5. Contact hosting provider for support

---

## Security Incident Response 🚨

### If Website is Compromised

1. **Immediately** (within 15 minutes):
   - [ ] Take site offline (if critical data exposure)
   - [ ] Revoke all API keys and tokens
   - [ ] Change all passwords
   - [ ] Check for unauthorized commits/changes
   - [ ] Enable enhanced logging

2. **Within 1 hour**:
   - [ ] Identify attack vector
   - [ ] Assess what was accessed/modified
   - [ ] Deploy fix/patch
   - [ ] Notify team members
   - [ ] Save evidence for investigation

3. **Within 24 hours**:
   - [ ] Complete investigation
   - [ ] Update all documentation
   - [ ] Notify affected users (if data was exposed)
   - [ ] File incident report
   - [ ] Implement preventive measures

4. **Within 1 week**:
   - [ ] Full security audit
   - [ ] Update all systems
   - [ ] Review and strengthen access controls
   - [ ] Increase monitoring

---

## Tools & Resources

### Security Testing
- **HTTPS Check**: https://www.ssllabs.com/ssltest/
- **Security Headers**: https://securityheaders.com/
- **Vulnerability Scanner**: https://www.owasp.org/index.php/Category:Vulnerability_Scanning_Tools
- **Dependency Check**: `npm audit`

### Monitoring Tools
- **Error Tracking**: Sentry, LogRocket
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Analytics**: Google Analytics
- **Logs**: Vercel/AWS native logs

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

## Questions?

If you're unsure about any security measure:
1. Check SECURITY.md for detailed explanations
2. Review DEPLOYMENT_VERCEL.md or DEPLOYMENT_AWS.md
3. Consult OWASP and MDN resources
4. Contact your hosting provider's support

---

**Last Updated**: 2024
**Next Review**: [Set quarterly reminder]
