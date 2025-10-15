# 🌐 Configuration du Domaine Personnalisé

## Domaine Cible
**URL principale :** https://www.chalet-balmotte810.com

## ⚠️ Configuration Requise

Le domaine `chalet-balmotte810.com` semble déjà être configuré dans un autre projet Vercel. Pour le configurer correctement :

### Option 1: Via l'Interface Web Vercel (Recommandé)

1. **Aller sur le Dashboard Vercel :** https://vercel.com/ras-projects-8da82c27/cosy-neige
2. **Cliquer sur "Domains"** dans les paramètres du projet
3. **Ajouter le domaine :** `chalet-balmotte810.com` et `www.chalet-balmotte810.com`
4. **Configurer les enregistrements DNS :**
   - Type A : `185.199.108.153`
   - Type A : `185.199.109.153`
   - Type A : `185.199.110.153`
   - Type A : `185.199.111.153`
   - CNAME www : `cname.vercel-dns.com`

### Option 2: Si le domaine est dans un ancien projet

1. **Identifier l'ancien projet** qui utilise le domaine
2. **Supprimer le domaine** de l'ancien projet
3. **L'ajouter au nouveau projet** `chalet-balmotte810`

### Option 3: Via CLI (après libération du domaine)

```bash
# Ajouter le domaine
npx vercel domains add chalet-balmotte810.com

# Créer l'alias
npx vercel alias set chalet-balmotte810.vercel.app chalet-balmotte810.com
npx vercel alias set chalet-balmotte810.vercel.app www.chalet-balmotte810.com
```

## 🔧 Variables d'Environnement Mises à Jour

- ✅ `NEXT_PUBLIC_BASE_URL` = `https://www.chalet-balmotte810.com`

## 📋 DNS Configuration

Configurer chez votre registraire de domaine :

### Enregistrements A (pour chalet-balmotte810.com)
```
@ A 185.199.108.153
@ A 185.199.109.153
@ A 185.199.110.153
@ A 185.199.111.153
```

### Enregistrement CNAME (pour www.chalet-balmotte810.com)
```
www CNAME cname.vercel-dns.com
```

## 🚀 Après Configuration

Une fois le domaine configuré, l'application sera accessible sur :
- https://chalet-balmotte810.com
- https://www.chalet-balmotte810.com

## 🔗 Liens Utiles

- **Dashboard Vercel :** https://vercel.com/ras-projects-8da82c27/cosy-neige
- **Documentation Domaines Vercel :** https://vercel.com/docs/custom-domains
- **Configuration DNS :** https://vercel.com/docs/custom-domains#dns-configuration

## 📞 Support

Si vous avez des difficultés, contactez le support Vercel via :
- Dashboard Vercel > Help
- https://vercel.com/help