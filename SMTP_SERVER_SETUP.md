# 📧 SMTP Server Setup Guide - Direct Email Reception

Complete guide to configure your Linux VPS with Postfix to receive emails and forward them to your app webhook.

---

## 🎯 What This Does

- Your VPS receives emails directly via Postfix
- Emails are instantly piped to a script
- Script calls your webhook: `https://chalet-balmotte810.com/api/webhooks/inbound-email`
- Conversations appear in your admin dashboard automatically
- **No delay** - instant processing!

---

## 📋 Prerequisites

- ✅ Linux VPS with root/sudo access
- ✅ Postfix installed
- ✅ Node.js installed on the server
- ✅ Domain: `chalet-balmotte810.com`

---

## 🔧 Installation Steps

### Step 1: Connect to Your VPS

```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

### Step 2: Install Node.js (if not installed)

```bash
# Check if Node.js is installed
node --version

# If not installed, install it:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install Postfix (if not installed)

```bash
# Check if Postfix is installed
postfix version

# If not installed:
sudo apt-get update
sudo apt-get install -y postfix

# During installation, select:
# - "Internet Site"
# - System mail name: chalet-balmotte810.com
```

### Step 4: Copy the Webhook Forwarder Script

Create the script on your server:

```bash
# Create scripts directory
sudo mkdir -p /opt/email-webhook

# Create the script file
sudo nano /opt/email-webhook/forwarder.js
```

**Copy and paste this content:**

```javascript
#!/usr/bin/env node

const https = require('https');
const http = require('http');

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://chalet-balmotte810.com/api/webhooks/inbound-email';
const LOG_FILE = '/var/log/email-webhook.log';

function parseEmail(rawEmail) {
  const lines = rawEmail.split('\n');
  const headers = {};
  let body = '';
  let inHeaders = true;
  let currentHeader = null;

  for (let line of lines) {
    if (inHeaders) {
      if (line.trim() === '') {
        inHeaders = false;
        continue;
      }

      if (line.match(/^\s/) && currentHeader) {
        headers[currentHeader] += ' ' + line.trim();
      } else {
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (match) {
          currentHeader = match[1].toLowerCase();
          headers[currentHeader] = match[2];
        }
      }
    } else {
      body += line + '\n';
    }
  }

  const fromMatch = headers['from']?.match(/(?:"?([^"]*)"?\s)?<?([^>]+)>?/);
  const fromEmail = fromMatch ? (fromMatch[2] || fromMatch[1]) : headers['from'];
  const fromName = fromMatch && fromMatch[1] ? fromMatch[1] : fromEmail?.split('@')[0];

  const toMatch = headers['to']?.match(/<?([^>]+)>?/);
  const toEmail = toMatch ? toMatch[1] : headers['to'];

  return {
    from: {
      email: fromEmail?.trim(),
      name: fromName?.trim()
    },
    to: toEmail?.trim(),
    subject: headers['subject'] || 'No Subject',
    text: body.trim(),
    html: body.trim(),
    headers: headers,
    raw: rawEmail
  };
}

function sendToWebhook(emailData) {
  return new Promise((resolve, reject) => {
    const url = new URL(WEBHOOK_URL);
    const protocol = url.protocol === 'https:' ? https : http;

    const payload = JSON.stringify(emailData);

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'EmailWebhookForwarder/1.0'
      }
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, body: data });
        } else {
          reject(new Error(`Webhook returned status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => { reject(error); });
    req.write(payload);
    req.end();
  });
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  try {
    require('fs').appendFileSync(LOG_FILE, logMessage);
  } catch (e) {
    process.stderr.write(logMessage);
  }
}

async function main() {
  try {
    let rawEmail = '';
    process.stdin.setEncoding('utf8');

    for await (const chunk of process.stdin) {
      rawEmail += chunk;
    }

    if (!rawEmail) {
      throw new Error('No email data received from stdin');
    }

    log(`Received email (${rawEmail.length} bytes)`);

    const emailData = parseEmail(rawEmail);
    log(`Parsed email - From: ${emailData.from.email}, To: ${emailData.to}, Subject: ${emailData.subject}`);

    const result = await sendToWebhook(emailData);
    log(`Successfully forwarded to webhook - Status: ${result.statusCode}`);

    process.exit(0);
  } catch (error) {
    log(`ERROR: ${error.message}`);
    log(`Stack: ${error.stack}`);
    process.exit(1);
  }
}

main();
```

**Save and exit** (`Ctrl+X`, then `Y`, then `Enter`)

### Step 5: Make the Script Executable

```bash
sudo chmod +x /opt/email-webhook/forwarder.js

# Create log file with proper permissions
sudo touch /var/log/email-webhook.log
sudo chmod 666 /var/log/email-webhook.log
```

### Step 6: Configure Postfix

#### 6.1 Create Virtual Alias Map

```bash
sudo nano /etc/postfix/virtual
```

Add these lines:

```
contact@chalet-balmotte810.com    webhook
admin@chalet-balmotte810.com      webhook
info@chalet-balmotte810.com       webhook
```

Save and exit.

#### 6.2 Create Alias for Piping

```bash
sudo nano /etc/aliases
```

Add this line at the end:

```
webhook: "|/opt/email-webhook/forwarder.js"
```

Save and exit.

#### 6.3 Update Postfix Main Configuration

```bash
sudo nano /etc/postfix/main.cf
```

Add or update these lines:

```
# Domain configuration
myhostname = mail.chalet-balmotte810.com
mydomain = chalet-balmotte810.com
myorigin = $mydomain

# Virtual aliases
virtual_alias_domains = chalet-balmotte810.com
virtual_alias_maps = hash:/etc/postfix/virtual

# Network configuration
mydestination = $myhostname, localhost.$mydomain, localhost
inet_interfaces = all
inet_protocols = ipv4

# Security
smtpd_banner = $myhostname ESMTP
```

Save and exit.

#### 6.4 Apply Configuration Changes

```bash
# Update virtual alias database
sudo postmap /etc/postfix/virtual

# Update aliases database
sudo newaliases

# Restart Postfix
sudo systemctl restart postfix

# Check Postfix status
sudo systemctl status postfix
```

### Step 7: Configure Firewall (if applicable)

```bash
# Allow SMTP port
sudo ufw allow 25/tcp

# Or with iptables:
sudo iptables -A INPUT -p tcp --dport 25 -j ACCEPT
sudo iptables-save
```

### Step 8: Update DNS MX Records

Go to your DNS provider (OVH) and update MX records:

**Remove or change priority of existing OVH MX records:**
```
Priority 100: mx0.mail.ovh.net
Priority 105: mx1.mail.ovh.net
Priority 150: mx2.mail.ovh.net
Priority 200: mx3.mail.ovh.net
```

**Add your VPS MX record:**
```
Type: MX
Host: @ (or chalet-balmotte810.com)
Priority: 10
Target: mail.chalet-balmotte810.com
TTL: 3600
```

**Also add an A record for the mail subdomain:**
```
Type: A
Host: mail
Value: YOUR_VPS_IP_ADDRESS
TTL: 3600
```

### Step 9: Configure SPF Record (Optional but Recommended)

Add or update SPF TXT record:

```
Type: TXT
Host: @ (or chalet-balmotte810.com)
Value: v=spf1 mx ip4:YOUR_VPS_IP_ADDRESS include:_spf.resend.com ~all
TTL: 3600
```

---

## 🧪 Testing

### Test 1: Check Postfix is Running

```bash
sudo systemctl status postfix
```

Should show: `active (running)`

### Test 2: Test Script Manually

```bash
# Create a test email file
cat > /tmp/test-email.txt << 'EOF'
From: test@example.com
To: contact@chalet-balmotte810.com
Subject: Test Email

This is a test message.
EOF

# Test the script
cat /tmp/test-email.txt | /opt/email-webhook/forwarder.js

# Check logs
tail -f /var/log/email-webhook.log
```

### Test 3: Check Postfix Logs

```bash
# Watch Postfix logs in real-time
sudo tail -f /var/log/mail.log

# Or on some systems:
sudo tail -f /var/log/maillog
```

### Test 4: Send Real Email

1. Wait 30-60 minutes for DNS propagation
2. Send an email from your Gmail to `contact@chalet-balmotte810.com`
3. Check logs:
   ```bash
   sudo tail -f /var/log/mail.log
   sudo tail -f /var/log/email-webhook.log
   ```
4. Check your admin dashboard: https://chalet-balmotte810.com/admin/conversations

### Test 5: Verify MX Records

```bash
# From your local machine or the server
dig MX chalet-balmotte810.com

# Should show:
# chalet-balmotte810.com. 3600 IN MX 10 mail.chalet-balmotte810.com.
```

---

## 🐛 Troubleshooting

### Email Not Arriving

1. **Check DNS propagation:**
   ```bash
   dig MX chalet-balmotte810.com
   ```

2. **Check Postfix is running:**
   ```bash
   sudo systemctl status postfix
   ```

3. **Check mail logs:**
   ```bash
   sudo tail -100 /var/log/mail.log | grep contact@
   ```

4. **Check firewall:**
   ```bash
   sudo ufw status
   # Port 25 should be allowed
   ```

### Script Errors

1. **Check script permissions:**
   ```bash
   ls -la /opt/email-webhook/forwarder.js
   # Should be executable: -rwxr-xr-x
   ```

2. **Check webhook logs:**
   ```bash
   sudo tail -50 /var/log/email-webhook.log
   ```

3. **Test script manually:**
   ```bash
   echo "From: test@example.com
   To: contact@chalet-balmotte810.com
   Subject: Test

   Test body" | /opt/email-webhook/forwarder.js
   ```

### Webhook Not Receiving

1. **Test webhook directly:**
   ```bash
   curl -X POST https://chalet-balmotte810.com/api/webhooks/inbound-email \
     -H "Content-Type: application/json" \
     -d '{
       "from": {"email": "test@example.com", "name": "Test"},
       "to": "contact@chalet-balmotte810.com",
       "subject": "Test",
       "text": "Test message"
     }'
   ```

2. **Check if script can reach webhook:**
   ```bash
   curl -I https://chalet-balmotte810.com/api/webhooks/inbound-email
   ```

### Postfix Configuration Issues

```bash
# Check Postfix configuration
sudo postfix check

# Reload configuration
sudo postfix reload

# View Postfix configuration
sudo postconf -n
```

---

## 📊 Monitoring

### Check Email Processing

```bash
# Real-time webhook logs
sudo tail -f /var/log/email-webhook.log

# Real-time Postfix logs
sudo tail -f /var/log/mail.log

# Count processed emails today
sudo grep "$(date +%Y-%m-%d)" /var/log/email-webhook.log | grep "Successfully forwarded" | wc -l
```

### Log Rotation

Create log rotation config:

```bash
sudo nano /etc/logrotate.d/email-webhook
```

Add:

```
/var/log/email-webhook.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

---

## 🔐 Security Recommendations

1. **Keep Postfix Updated:**
   ```bash
   sudo apt-get update && sudo apt-get upgrade postfix
   ```

2. **Configure SPF/DKIM/DMARC** (prevents your emails being marked as spam)

3. **Limit SMTP access** (only allow from trusted IPs if possible)

4. **Monitor logs regularly** for suspicious activity

5. **Enable fail2ban** to prevent brute force attacks:
   ```bash
   sudo apt-get install fail2ban
   ```

---

## 📞 Support

If you encounter issues:

1. Check the logs (mail.log and email-webhook.log)
2. Verify DNS with `dig MX chalet-balmotte810.com`
3. Test the webhook manually with curl
4. Check Postfix status with `systemctl status postfix`

---

**Setup Date:** January 2025
**Status:** Ready to deploy ✅
