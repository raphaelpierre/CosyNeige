#!/bin/bash

echo "🔍 Vérification DNS pour Resend..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 DKIM Record (resend._domainkey):"
echo ""
dig +short TXT resend._domainkey.chalet-balmotte810.com @8.8.8.8
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 SPF Record (@):"
echo ""
dig +short TXT chalet-balmotte810.com @8.8.8.8 | grep spf
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Si vous voyez 'include:_spf.resend.com', le DNS est OK!"
echo "⏳ Sinon, attendez 5-15 minutes pour la propagation DNS"
echo ""
