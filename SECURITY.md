# Security Guidelines

Ce document décrit les mesures de sécurité implémentées dans le projet et les bonnes pratiques à suivre.

## 🔒 Vérifications de sécurité automatisées

### Pre-commit Hooks
- **Formatage automatique** : ESLint, Prettier
- **Vérifications de base** : trailing whitespace, fichiers volumineux
- **Validation** : JSON, YAML, XML
- **Détection** : conflits de merge, instructions de debug

### OWASP Security Checks
- **npm audit** : Vulnérabilités dans les dépendances
- **Dependency check** : Analyse approfondie des vulnérabilités
- **Packages obsolètes** : Détection des dépendances non mises à jour
- **Fichiers sensibles** : Vérification des permissions

## 🚀 Utilisation

### En local
```bash
# Installer les pre-commit hooks
npm run pre-commit:setup

# Exécuter les vérifications de sécurité
npm run security:owasp

# Audit npm
npm run security:audit
npm run security:audit:high
```

### Dans Jenkins
Les vérifications s'exécutent automatiquement dans la pipeline :
1. **Pre-commit Hooks** : Formatage et vérifications de base
2. **OWASP Security Check** : Analyse des vulnérabilités
3. **Lint & Type Check** : Vérification du code
4. **Tests** : Tests unitaires et d'intégration

## 📊 Rapports de sécurité

Les rapports sont générés dans `./security-reports/` :
- `npm-audit.json` : Résultats de l'audit npm
- `npm-audit-high.json` : Vulnérabilités critiques
- `npm-outdated.json` : Packages obsolètes
- `security-summary.md` : Synthèse des résultats

## 🛡️ Bonnes pratiques

### Dépendances
- ✅ Utiliser des versions fixes dans `package-lock.json`
- ✅ Mettre à jour régulièrement les dépendances
- ✅ Vérifier les vulnérabilités avant chaque déploiement
- ❌ Éviter les packages non maintenus

### Code
- ✅ Utiliser TypeScript pour la sécurité des types
- ✅ Valider toutes les entrées utilisateur
- ✅ Utiliser des variables d'environnement pour les secrets
- ❌ Ne jamais commiter de secrets dans le code

### Infrastructure
- ✅ Utiliser HTTPS en production
- ✅ Configurer des headers de sécurité
- ✅ Implémenter la rotation des secrets
- ❌ Éviter les permissions trop permissives

## 🚨 Gestion des vulnérabilités

### Niveaux de sévérité
- **Critical** : Correction immédiate requise
- **High** : Correction dans les 24h
- **Moderate** : Correction dans la semaine
- **Low** : Correction dans le mois

### Processus de correction
1. **Identifier** la vulnérabilité via les rapports
2. **Évaluer** l'impact sur l'application
3. **Mettre à jour** la dépendance vulnérable
4. **Tester** l'application après mise à jour
5. **Déployer** la correction

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Pre-commit Hooks](https://pre-commit.com/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
