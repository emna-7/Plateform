# Pre-commit Hooks

Ce projet utilise des pre-commit hooks pour maintenir la qualité du code et s'assurer que tous les commits respectent les standards du projet.

## 🚀 Installation rapide

### Windows
```bash
npm run pre-commit:setup
```

### Linux/macOS
```bash
npm run pre-commit:setup
```

### Installation manuelle
```bash
# Installer pre-commit
pip install pre-commit

# Installer les hooks
pre-commit install

# Tester les hooks
pre-commit run --all-files
```

## 🔧 Hooks configurés

### Hooks de base
- **trailing-whitespace** : Supprime les espaces en fin de ligne
- **end-of-file-fixer** : Ajoute une nouvelle ligne à la fin des fichiers
- **check-yaml** : Vérifie la syntaxe des fichiers YAML
- **check-json** : Vérifie la syntaxe des fichiers JSON
- **check-added-large-files** : Empêche l'ajout de fichiers trop volumineux
- **check-merge-conflict** : Détecte les marqueurs de conflit de merge
- **debug-statements** : Détecte les instructions de debug oubliées

### Hooks de formatage
- **black** : Formate le code Python
- **eslint** : Lint le code JavaScript/TypeScript
- **prettier** : Formate le code (JS, TS, JSON, CSS, Markdown, YAML)

### Hooks de sécurité
- **npm-audit** : Vérifie les vulnérabilités npm
- **npm-outdated** : Vérifie les dépendances obsolètes

## 📋 Utilisation

### Exécution automatique
Les hooks s'exécutent automatiquement à chaque `git commit`.

### Exécution manuelle
```bash
# Exécuter sur tous les fichiers
npm run pre-commit:run

# Ou directement
pre-commit run --all-files

# Exécuter sur un fichier spécifique
pre-commit run --files src/components/MyComponent.tsx
```

### Ignorer temporairement
```bash
# Ignorer les hooks pour un commit
git commit --no-verify -m "commit message"
```

## 🛠️ Configuration

Le fichier `.pre-commit-config.yaml` contient la configuration des hooks. Vous pouvez :

1. **Ajouter de nouveaux hooks** : Modifier `.pre-commit-config.yaml`
2. **Mettre à jour les versions** : Changer les `rev` dans le fichier
3. **Exclure des fichiers** : Utiliser les options `exclude` ou `files`

## 🐛 Résolution de problèmes

### Hook échoue
```bash
# Voir les détails de l'erreur
pre-commit run --all-files --verbose

# Corriger automatiquement (si possible)
pre-commit run --all-files --hook-stage manual
```

### Mise à jour des hooks
```bash
# Mettre à jour les hooks
pre-commit autoupdate

# Réinstaller
pre-commit uninstall
pre-commit install
```

## 📚 Ressources

- [Documentation pre-commit](https://pre-commit.com/)
- [Hooks disponibles](https://pre-commit.com/hooks.html)
- [Configuration avancée](https://pre-commit.com/#advanced)
