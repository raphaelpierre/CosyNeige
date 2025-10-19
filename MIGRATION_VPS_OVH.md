# 🚀 Migration Vercel + Neon → VPS OVH

Guide complet pour migrer Chalet-Balmotte810 de Vercel/Neon vers un VPS OVH auto-hébergé.

---

## 📋 Vue d'ensemble

**Actuel:**
- Frontend/Backend: Vercel (Next.js serverless)
- Base de données: Neon PostgreSQL (managed)
- SSL/CDN: Vercel

**Cible:**
- VPS: OVH VPS SSD (4GB RAM minimum recommandé)
- OS: Ubuntu 22.04 LTS
- Stack: Node.js + PostgreSQL + Nginx + PM2
- SSL: Let's Encrypt (Certbot)

**Temps estimé:** 4-6 heures

---

## Phase 1: Préparation & Setup VPS OVH

### 1.1 Commander VPS OVH

**Recommandation VPS:**
- **VPS SSD 2** - 4GB RAM, 2 vCores, 80GB SSD (~12€/mois)
- OU **VPS SSD 3** - 8GB RAM, 4 vCores, 160GB SSD (~24€/mois) si trafic élevé

**OS:** Ubuntu 22.04 LTS

### 1.2 Connexion initiale et sécurité

```bash
# Connexion SSH (mot de passe envoyé par email OVH)
ssh ubuntu@<IP_VPS>

# Mise à jour système
sudo apt update && sudo apt upgrade -y

# Créer utilisateur non-root
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo su - deploy

# Configurer clé SSH
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Coller votre clé publique locale (cat ~/.ssh/id_rsa.pub)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Sécuriser SSH
sudo nano /etc/ssh/sshd_config
# Modifier:
# PermitRootLogin no
# PasswordAuthentication no
# Port 2222  # Optionnel: changer port par défaut
sudo systemctl restart sshd

# Installer et configurer firewall
sudo apt install ufw -y
sudo ufw allow 2222/tcp  # SSH (ou 22 si port par défaut)
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Installer fail2ban (protection brute force)
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

### 1.3 Installer Node.js

```bash
# Installer Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier installation
node --version  # v20.x.x
npm --version   # v10.x.x

# Installer pnpm (optionnel, si vous l'utilisez)
sudo npm install -g pnpm
```

### 1.4 Installer PostgreSQL

```bash
# Installer PostgreSQL 15
sudo apt install postgresql postgresql-contrib -y

# Démarrer et activer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier statut
sudo systemctl status postgresql

# Créer utilisateur et base de données
sudo -u postgres psql

-- Dans psql:
CREATE DATABASE chalet_balmotte810;
CREATE USER chalet_user WITH PASSWORD 'VOTRE_MOT_DE_PASSE_SECURISE';
GRANT ALL PRIVILEGES ON DATABASE chalet_balmotte810 TO chalet_user;
\q

# Configurer PostgreSQL pour connexions locales
sudo nano /etc/postgresql/15/main/pg_hba.conf
# Ajouter ligne:
# local   chalet_balmotte810   chalet_user   md5

sudo systemctl restart postgresql

# Tester connexion
psql -U chalet_user -d chalet_balmotte810 -h localhost
# Entrer mot de passe
\q
```

### 1.5 Installer Nginx

```bash
# Installer Nginx
sudo apt install nginx -y

# Démarrer et activer
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérifier
sudo systemctl status nginx
curl http://localhost  # Devrait afficher page Nginx par défaut
```

### 1.6 Installer PM2

```bash
# Installer PM2 (gestionnaire de processus Node.js)
sudo npm install -g pm2

# Configurer PM2 pour démarrage automatique
pm2 startup
# Copier/exécuter la commande affichée (sudo env PATH=...)

pm2 save
```

---

## Phase 2: Migration Base de Données

### 2.1 Exporter depuis Neon PostgreSQL

**Sur votre machine locale:**

```bash
# Récupérer DATABASE_URL depuis Vercel
# Aller sur Vercel Dashboard > Settings > Environment Variables
# Copier DATABASE_URL (format: postgresql://user:pass@host/db)

# Exporter dump complet
pg_dump "postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require" \
  --format=custom \
  --file=chalet_dump.sql \
  --no-owner \
  --no-acl

# Vérifier taille dump
ls -lh chalet_dump.sql

# Transférer dump vers VPS
scp -P 2222 chalet_dump.sql deploy@<IP_VPS>:/home/deploy/
```

### 2.2 Importer dans PostgreSQL VPS

**Sur le VPS:**

```bash
# Vérifier fichier dump
ls -lh ~/chalet_dump.sql

# Importer dump
pg_restore -U chalet_user -d chalet_balmotte810 -h localhost \
  --no-owner --no-acl ~/chalet_dump.sql

# Vérifier import
psql -U chalet_user -d chalet_balmotte810 -h localhost -c "\dt"
psql -U chalet_user -d chalet_balmotte810 -h localhost -c "SELECT COUNT(*) FROM \"User\";"
psql -U chalet_user -d chalet_balmotte810 -h localhost -c "SELECT COUNT(*) FROM \"Reservation\";"

# Nettoyer dump
rm ~/chalet_dump.sql
```

---

## Phase 3: Déploiement Application

### 3.1 Cloner et configurer

```bash
# Créer répertoire application
mkdir -p ~/apps
cd ~/apps

# Cloner repository
git clone https://github.com/raphaelpierre/CosyNeige.git
cd CosyNeige

# Créer fichier .env.local
nano .env.local
```

**Contenu `.env.local`:**

```bash
# Database
DATABASE_URL="postgresql://chalet_user:VOTRE_MOT_DE_PASSE@localhost:5432/chalet_balmotte810"

# Auth
NEXTAUTH_SECRET="GENERER_NOUVEAU_SECRET_32_CHARS_MIN"
NEXTAUTH_URL="https://www.chalet-balmotte810.com"
JWT_SECRET="GENERER_NOUVEAU_SECRET_32_CHARS_MIN"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxxxx"
ADMIN_EMAIL="contact@chalet-balmotte810.com"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxxxx"
STRIPE_SECRET_KEY="sk_live_xxxxxxx"

# Node
NODE_ENV="production"
```

**Générer secrets:**

```bash
# Générer secrets sécurisés
openssl rand -base64 32  # Pour NEXTAUTH_SECRET
openssl rand -base64 32  # Pour JWT_SECRET
```

### 3.2 Build application

```bash
# Installer dépendances
npm install --production=false

# Générer Prisma client
npx prisma generate

# Exécuter migrations Prisma (si nécessaire)
npx prisma migrate deploy

# Build Next.js
npm run build

# Vérifier build
ls -la .next/
```

### 3.3 Configurer PM2

```bash
# Créer fichier de config PM2
nano ecosystem.config.js
```

**Contenu `ecosystem.config.js`:**

```javascript
module.exports = {
  apps: [{
    name: 'chalet-balmotte810',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/home/deploy/apps/CosyNeige',
    instances: 2,  // 2 instances pour load balancing
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/deploy/logs/chalet-error.log',
    out_file: '/home/deploy/logs/chalet-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G'
  }]
};
```

```bash
# Créer répertoire logs
mkdir -p ~/logs

# Démarrer application avec PM2
pm2 start ecosystem.config.js

# Vérifier statut
pm2 status
pm2 logs chalet-balmotte810 --lines 50

# Sauvegarder config PM2
pm2 save

# Tester application
curl http://localhost:3000
```

### 3.4 Configurer Nginx reverse proxy

```bash
# Créer config Nginx
sudo nano /etc/nginx/sites-available/chalet-balmotte810
```

**Contenu Nginx config:**

```nginx
# HTTP - Redirection vers HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name chalet-balmotte810.com www.chalet-balmotte810.com;

    # Certbot validation
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirection HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name chalet-balmotte810.com www.chalet-balmotte810.com;

    # SSL (certificats ajoutés après Certbot)
    ssl_certificate /etc/letsencrypt/live/chalet-balmotte810.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chalet-balmotte810.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Headers sécurité
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logs
    access_log /var/log/nginx/chalet-access.log;
    error_log /var/log/nginx/chalet-error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # Reverse proxy vers Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    location /images {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

```bash
# Activer site
sudo ln -s /etc/nginx/sites-available/chalet-balmotte810 /etc/nginx/sites-enabled/

# Désactiver site par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester config Nginx
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

---

## Phase 4: Configuration Emails

### 4.1 Option 1: Continuer avec Resend (Recommandé - Simple)

**Resend reste fonctionnel** car c'est un service externe qui envoie des emails via API. Aucune modification nécessaire.

**Vérifications:**

```bash
# Dans .env.local, vérifier:
RESEND_API_KEY="re_xxxxxxxxxxxxxxx"
ADMIN_EMAIL="contact@chalet-balmotte810.com"
```

**Tester envoi email:**

```bash
# Depuis le VPS
cd ~/apps/CosyNeige

# Créer script test
nano test-email.js
```

```javascript
// test-email.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'Chalet Balmotte <noreply@chalet-balmotte810.com>',
      to: 'votre-email@test.com',
      subject: 'Test Migration VPS',
      html: '<p>Email envoyé depuis le VPS OVH ✅</p>'
    });
    console.log('✅ Email envoyé:', data);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testEmail();
```

```bash
# Charger variables env et tester
node -r dotenv/config test-email.js dotenv_config_path=.env.local

# Nettoyer
rm test-email.js
```

**Configuration DNS Resend (Important):**

Pour que Resend puisse envoyer depuis `@chalet-balmotte810.com`, configurer DNS:

1. **Aller sur Resend Dashboard** → Domains → Add Domain
2. Ajouter `chalet-balmotte810.com`
3. **Copier les enregistrements DNS fournis**

**Ajouter chez votre registrar (OVH, Gandi, etc.):**

```
Type: TXT
Nom: @
Valeur: v=spf1 include:send.resend.com ~all
TTL: 300

Type: TXT
Nom: resend._domainkey
Valeur: [DKIM fourni par Resend]
TTL: 300

Type: CNAME
Nom: resend
Valeur: feedback-smtp.resend.com
TTL: 300
```

**Vérifier propagation:**

```bash
dig TXT chalet-balmotte810.com
dig TXT resend._domainkey.chalet-balmotte810.com
```

**Avantages Resend:**
- ✅ Simple, déjà configuré
- ✅ Délivrabilité excellente
- ✅ Analytics inclus
- ✅ Plan gratuit: 3000 emails/mois

**Coût:** Gratuit jusqu'à 3000 emails/mois, puis 20$/mois pour 50k emails

---

### 4.2 Option 2: SMTP Local avec Postfix (Avancé)

**⚠️ Option complexe** - Délivrabilité difficile (risque spam). **Non recommandé** sauf si expert SMTP.

**Installation Postfix:**

```bash
# Installer Postfix
sudo apt install postfix mailutils -y

# Configuration interactive:
# - Type: Internet Site
# - System mail name: chalet-balmotte810.com

# Configurer Postfix
sudo nano /etc/postfix/main.cf
```

**Modifications `main.cf`:**

```conf
myhostname = mail.chalet-balmotte810.com
mydomain = chalet-balmotte810.com
myorigin = $mydomain
inet_interfaces = all
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain

# SMTP Auth
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = $myhostname

# TLS
smtpd_tls_cert_file=/etc/letsencrypt/live/chalet-balmotte810.com/fullchain.pem
smtpd_tls_key_file=/etc/letsencrypt/live/chalet-balmotte810.com/privkey.pem
smtpd_use_tls=yes
smtpd_tls_auth_only = yes
```

```bash
# Redémarrer Postfix
sudo systemctl restart postfix

# Tester envoi
echo "Test email VPS" | mail -s "Test" votre-email@test.com
```

**Configuration DNS SMTP (Obligatoire):**

```
# Enregistrement MX
Type: MX
Nom: @
Valeur: mail.chalet-balmotte810.com
Priorité: 10
TTL: 300

# Enregistrement A pour mail
Type: A
Nom: mail
Valeur: <IP_VPS>
TTL: 300

# SPF
Type: TXT
Nom: @
Valeur: v=spf1 mx ip4:<IP_VPS> ~all
TTL: 300

# DKIM (optionnel mais recommandé)
# Installer opendkim
sudo apt install opendkim opendkim-tools -y

# Générer clés DKIM
sudo mkdir -p /etc/opendkim/keys
sudo opendkim-genkey -D /etc/opendkim/keys/ -d chalet-balmotte810.com -s default

# Publier clé publique
sudo cat /etc/opendkim/keys/default.txt
# Copier dans DNS:
Type: TXT
Nom: default._domainkey
Valeur: [contenu de default.txt]

# DMARC
Type: TXT
Nom: _dmarc
Valeur: v=DMARC1; p=none; rua=mailto:contact@chalet-balmotte810.com
TTL: 300
```

**Modifier `.env.local` pour SMTP local:**

```bash
# Au lieu de Resend, utiliser SMTP
SMTP_HOST="localhost"
SMTP_PORT="587"
SMTP_USER="noreply@chalet-balmotte810.com"
SMTP_PASSWORD="votre_mot_de_passe"
SMTP_FROM="Chalet Balmotte <noreply@chalet-balmotte810.com>"
```

**⚠️ Problèmes courants SMTP local:**
- Emails marqués comme spam (IP VPS souvent blacklistée)
- Configuration complexe DKIM/SPF/DMARC
- Maintenance et monitoring requis
- Quota envois limités par providers

**Recommandation:** **Utiliser Resend (Option 1)** sauf si contrainte spécifique.

---

### 4.3 Option 3: SMTP Relay via Service Tiers

**Alternative:** Utiliser un relay SMTP professionnel depuis VPS.

**Services recommandés:**
- **SendGrid** (100 emails/jour gratuit)
- **Mailgun** (5000 emails/mois gratuit)
- **Amazon SES** (~$1 pour 10k emails)

**Exemple avec SendGrid:**

```bash
# S'inscrire sur SendGrid.com
# Créer API Key SMTP

# Modifier .env.local
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="SG.xxxxxxxxxxxxxxx"
SMTP_FROM="noreply@chalet-balmotte810.com"
```

**Modifier code Next.js (lib/email.ts):**

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true pour 465, false pour 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html
  });
}
```

**Configuration DNS identique Option 1** (SPF, DKIM du service tiers).

---

### 4.4 Comparaison Options Emails

| Option | Complexité | Coût | Délivrabilité | Recommandé |
|--------|------------|------|---------------|------------|
| **Resend** | ⭐ Faible | Gratuit (3k/mois) | ⭐⭐⭐⭐⭐ Excellente | ✅ **OUI** |
| **SMTP Local** | ⭐⭐⭐⭐⭐ Très élevée | Gratuit | ⭐⭐ Médiocre | ❌ Non |
| **SendGrid** | ⭐⭐ Moyenne | Gratuit (100/jour) | ⭐⭐⭐⭐ Bonne | ✅ Alternative |
| **Mailgun** | ⭐⭐ Moyenne | Gratuit (5k/mois) | ⭐⭐⭐⭐ Bonne | ✅ Alternative |
| **Amazon SES** | ⭐⭐⭐ Élevée | ~$1/10k emails | ⭐⭐⭐⭐ Bonne | ⚠️ Si AWS |

**Recommandation finale:** **Continuer avec Resend**, juste configurer les DNS.

---

## Phase 5: SSL & Domaine

### 5.1 Configuration DNS

**Chez votre registrar (ex: OVH, Gandi, etc.):**

1. Créer enregistrement A:
   - Type: `A`
   - Nom: `@` (ou vide)
   - Valeur: `<IP_VPS_OVH>`
   - TTL: `300` (5 min pour migration)

2. Créer enregistrement A pour www:
   - Type: `A`
   - Nom: `www`
   - Valeur: `<IP_VPS_OVH>`
   - TTL: `300`

**Attendre propagation DNS (5-30 minutes):**

```bash
# Vérifier propagation
dig chalet-balmotte810.com
dig www.chalet-balmotte810.com

# OU
nslookup chalet-balmotte810.com
```

### 4.2 Installer SSL avec Certbot

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Générer certificats SSL
sudo certbot --nginx -d chalet-balmotte810.com -d www.chalet-balmotte810.com

# Suivre instructions:
# - Entrer email: contact@chalet-balmotte810.com
# - Accepter ToS
# - Redirection HTTPS: Yes (2)

# Vérifier certificats
sudo certbot certificates

# Tester auto-renouvellement
sudo certbot renew --dry-run
```

**Certbot configurera automatiquement Nginx et ajoutera un cron pour renouvellement auto.**

---

## Phase 5: Tests & Validation

### 5.1 Tests fonctionnels complets

```bash
# Vérifier services actifs
sudo systemctl status nginx
sudo systemctl status postgresql
pm2 status

# Tester accès HTTPS
curl -I https://www.chalet-balmotte810.com

# Vérifier logs Next.js
pm2 logs chalet-balmotte810 --lines 100

# Vérifier logs Nginx
sudo tail -f /var/log/nginx/chalet-access.log
sudo tail -f /var/log/nginx/chalet-error.log
```

**Tests manuels (navigateur):**
- ✅ Homepage charge correctement
- ✅ Authentification (login/register)
- ✅ Dashboard client/admin
- ✅ Système réservation (calendrier, prix)
- ✅ Paiements Stripe (mode test)
- ✅ Envoi emails (Resend)
- ✅ Upload/affichage images
- ✅ Switch langue FR/EN
- ✅ Responsive mobile

### 5.2 Tests performance

```bash
# Installer Apache Bench (optionnel)
sudo apt install apache2-utils -y

# Test charge basique
ab -n 100 -c 10 https://www.chalet-balmotte810.com/

# Vérifier métriques
pm2 monit
```

**Outils en ligne:**
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

### 5.3 Configurer backups automatiques PostgreSQL

```bash
# Créer script backup
mkdir -p ~/backups
nano ~/backups/backup-postgres.sh
```

**Contenu `backup-postgres.sh`:**

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/deploy/backups"
DB_NAME="chalet_balmotte810"
DB_USER="chalet_user"
RETENTION_DAYS=7

# Créer backup
pg_dump -U $DB_USER -h localhost $DB_NAME \
  --format=custom \
  --file="$BACKUP_DIR/backup_${DB_NAME}_${DATE}.sql"

# Compresser
gzip "$BACKUP_DIR/backup_${DB_NAME}_${DATE}.sql"

# Supprimer backups > 7 jours
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: backup_${DB_NAME}_${DATE}.sql.gz"
```

```bash
# Rendre exécutable
chmod +x ~/backups/backup-postgres.sh

# Tester backup
~/backups/backup-postgres.sh

# Configurer cron (tous les jours à 3h du matin)
crontab -e

# Ajouter ligne:
0 3 * * * /home/deploy/backups/backup-postgres.sh >> /home/deploy/logs/backup.log 2>&1
```

**Backups distants (optionnel - OVH Object Storage):**

```bash
# Installer rclone
curl https://rclone.org/install.sh | sudo bash

# Configurer OVH Object Storage
rclone config
# Suivre instructions pour S3-compatible (OVH Object Storage)

# Modifier script backup pour upload auto
nano ~/backups/backup-postgres.sh
# Ajouter à la fin:
# rclone copy $BACKUP_DIR rclone:ovh-backup/chalet-db/
```

---

## Phase 6: Monitoring & Production

### 6.1 Monitoring PM2

```bash
# Activer monitoring PM2 (optionnel - payant)
pm2 link <SECRET_KEY> <PUBLIC_KEY>

# OU utiliser monitoring intégré
pm2 install pm2-logrotate

# Configurer rotation logs
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 6.2 Monitoring serveur

```bash
# Installer htop (monitoring ressources)
sudo apt install htop -y

# Utiliser
htop

# Installer netdata (monitoring avancé - optionnel)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Accès: http://<IP_VPS>:19999
```

### 6.3 Scripts utiles maintenance

**Redémarrage application:**

```bash
# Créer script
nano ~/scripts/restart-app.sh
```

```bash
#!/bin/bash
cd /home/deploy/apps/CosyNeige
git pull origin main
npm install
npm run build
npx prisma generate
npx prisma migrate deploy
pm2 restart chalet-balmotte810
pm2 save
```

```bash
chmod +x ~/scripts/restart-app.sh
```

### 6.4 Basculement final

**⚠️ AVANT basculement:**
- ✅ Tous tests OK
- ✅ Backups configurés
- ✅ SSL valide
- ✅ DNS propagé

**Basculement:**

1. **Mettre Vercel en maintenance (optionnel):**
   - Créer page `maintenance.html`
   - Configurer Vercel pour redirection temporaire

2. **Exporter données finales depuis Neon:**
   ```bash
   # Dernier dump avant migration
   pg_dump <NEON_URL> --format=custom --file=final_dump.sql
   pg_restore -U chalet_user -d chalet_balmotte810 final_dump.sql
   ```

3. **Vérifier production VPS** une dernière fois

4. **Attendre 48h** avant désactiver Vercel/Neon (sécurité)

5. **Annuler abonnements:**
   - Vercel: Passer à plan gratuit ou supprimer projet
   - Neon: Supprimer base de données

---

## 📊 Comparaison Coûts

| Service | Avant (Vercel/Neon) | Après (VPS OVH) |
|---------|---------------------|-----------------|
| Hosting | ~20€/mois (Vercel Pro) | ~12-24€/mois (VPS) |
| Database | ~25€/mois (Neon) | Inclus VPS |
| **Total** | **~45€/mois** | **~12-24€/mois** |
| **Économie** | - | **~21-33€/mois** |

---

## 🔧 Commandes Maintenance Courantes

```bash
# Logs application
pm2 logs chalet-balmotte810
pm2 logs chalet-balmotte810 --lines 200

# Redémarrer application
pm2 restart chalet-balmotte810

# Mettre à jour application
cd ~/apps/CosyNeige
git pull
npm install
npm run build
pm2 restart chalet-balmotte810

# Vérifier espace disque
df -h

# Vérifier RAM/CPU
free -h
htop

# Logs Nginx
sudo tail -f /var/log/nginx/chalet-access.log
sudo tail -f /var/log/nginx/chalet-error.log

# Redémarrer Nginx
sudo systemctl restart nginx

# Redémarrer PostgreSQL
sudo systemctl restart postgresql

# Backup manuel BD
~/backups/backup-postgres.sh

# Restaurer backup
pg_restore -U chalet_user -d chalet_balmotte810 ~/backups/backup_xxx.sql.gz
```

---

## 🚨 Troubleshooting

### Application ne démarre pas

```bash
# Vérifier logs PM2
pm2 logs chalet-balmotte810 --err

# Vérifier .env.local
cat ~/apps/CosyNeige/.env.local

# Rebuild
cd ~/apps/CosyNeige
npm run build
pm2 restart chalet-balmotte810
```

### Erreurs base de données

```bash
# Vérifier PostgreSQL actif
sudo systemctl status postgresql

# Tester connexion
psql -U chalet_user -d chalet_balmotte810 -h localhost

# Vérifier logs PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### SSL expiré

```bash
# Renouveler manuellement
sudo certbot renew

# Vérifier config auto-renouvellement
sudo systemctl status certbot.timer
```

### Nginx erreurs

```bash
# Tester config
sudo nginx -t

# Voir erreurs détaillées
sudo tail -f /var/log/nginx/error.log

# Redémarrer
sudo systemctl restart nginx
```

---

## 📚 Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/backup-dump.html)
- [Certbot](https://certbot.eff.org/)

---

**Bon courage pour la migration ! 🚀**
