#!/usr/bin/env node

/**
 * Email to Webhook Forwarder
 *
 * This script receives an email via stdin (piped from Postfix)
 * and forwards it to the webhook endpoint as JSON.
 *
 * Usage: This script is called by Postfix when an email arrives
 */

const https = require('https');
const http = require('http');

// Configuration
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://chalet-balmotte810.com/api/webhooks/inbound-email';
const LOG_FILE = '/var/log/email-webhook.log';

// Simple email parser
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

      // Handle multi-line headers
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

  // Parse From header
  const fromMatch = headers['from']?.match(/(?:"?([^"]*)"?\s)?<?([^>]+)>?/);
  const fromEmail = fromMatch ? (fromMatch[2] || fromMatch[1]) : headers['from'];
  const fromName = fromMatch && fromMatch[1] ? fromMatch[1] : fromEmail?.split('@')[0];

  // Parse To header
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
    html: body.trim(), // We'll use the same content for both
    headers: headers,
    raw: rawEmail
  };
}

// Send to webhook
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

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ statusCode: res.statusCode, body: data });
        } else {
          reject(new Error(`Webhook returned status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  // Try to write to log file, fallback to stderr
  try {
    require('fs').appendFileSync(LOG_FILE, logMessage);
  } catch (e) {
    process.stderr.write(logMessage);
  }
}

// Main execution
async function main() {
  try {
    // Read email from stdin
    let rawEmail = '';

    process.stdin.setEncoding('utf8');

    for await (const chunk of process.stdin) {
      rawEmail += chunk;
    }

    if (!rawEmail) {
      throw new Error('No email data received from stdin');
    }

    log(`Received email (${rawEmail.length} bytes)`);

    // Parse email
    const emailData = parseEmail(rawEmail);
    log(`Parsed email - From: ${emailData.from.email}, To: ${emailData.to}, Subject: ${emailData.subject}`);

    // Send to webhook
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
