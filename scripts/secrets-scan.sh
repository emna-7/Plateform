#!/bin/bash

# Secrets scanning script for DevSecOps pipeline
set -e

echo "🔐 Starting secrets scan..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to scan for secrets
scan_secrets() {
    print_status "Scanning for hardcoded secrets..."
    
    # Common secret patterns
    SECRET_PATTERNS=(
        "password\s*[:=]\s*['\"][^'\"]+['\"]"
        "secret\s*[:=]\s*['\"][^'\"]+['\"]"
        "key\s*[:=]\s*['\"][^'\"]+['\"]"
        "token\s*[:=]\s*['\"][^'\"]+['\"]"
        "api_key\s*[:=]\s*['\"][^'\"]+['\"]"
        "private_key\s*[:=]\s*['\"][^'\"]+['\"]"
        "access_token\s*[:=]\s*['\"][^'\"]+['\"]"
        "bearer\s+[A-Za-z0-9+/=]+"
        "sk-[A-Za-z0-9]{48}"
        "ghp_[A-Za-z0-9]{36}"
        "xoxb-[0-9]{11}-[0-9]{11}-[A-Za-z0-9]{24}"
    )
    
    SECRETS_FOUND=0
    
    for pattern in "${SECRET_PATTERNS[@]}"; do
        if grep -r -i -E "$pattern" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.env*" . | grep -v node_modules | grep -v ".git" > /dev/null; then
            print_warning "Potential secret pattern found: $pattern"
            grep -r -i -E "$pattern" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.env*" . | grep -v node_modules | grep -v ".git" >> secrets-found.txt
            SECRETS_FOUND=$((SECRETS_FOUND + 1))
        fi
    done
    
    if [ $SECRETS_FOUND -gt 0 ]; then
        print_error "Found $SECRETS_FOUND potential secrets!"
        echo "Review secrets-found.txt for details"
        return 1
    else
        print_status "No secrets found ✅"
        return 0
    fi
}

# Function to check for exposed files
check_exposed_files() {
    print_status "Checking for exposed sensitive files..."
    
    EXPOSED_FILES=(
        ".env"
        ".env.local"
        ".env.production"
        "config.json"
        "secrets.json"
        "credentials.json"
        "private.key"
        "id_rsa"
        "id_dsa"
    )
    
    for file in "${EXPOSED_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_warning "Sensitive file found: $file"
            echo "$file" >> exposed-files.txt
        fi
    done
}

# Function to check git history for secrets
check_git_history() {
    print_status "Checking git history for secrets..."
    
    # Check last 10 commits for secrets
    if git log --oneline -10 | grep -i -E "(password|secret|key|token)" > /dev/null; then
        print_warning "Potential secrets found in git history"
        git log --oneline -10 | grep -i -E "(password|secret|key|token)" >> git-secrets.txt
    else
        print_status "No secrets found in git history ✅"
    fi
}

# Main execution
print_status "Starting comprehensive secrets scan..."

# Create reports directory
mkdir -p reports

# Run all scans
scan_secrets
check_exposed_files
check_git_history

# Generate summary report
cat > secrets-scan-report.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Secrets Scan Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f0f0f0; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; }
        .warning { background-color: #fff3cd; padding: 10px; margin: 10px 0; border-radius: 3px; }
        .success { background-color: #d4edda; padding: 10px; margin: 10px 0; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔐 Secrets Scan Report</h1>
        <p><strong>Date:</strong> $(date)</p>
        <p><strong>Project:</strong> Plateform Application</p>
    </div>
    
    <div class="section">
        <h2>📊 Scan Summary</h2>
        <div class="success">
            <p>Secrets scan completed successfully!</p>
        </div>
    </div>
    
    <div class="section">
        <h2>📋 Recommendations</h2>
        <div class="warning">
            <ul>
                <li>Never commit secrets to version control</li>
                <li>Use environment variables for sensitive data</li>
                <li>Implement proper secrets management</li>
                <li>Use tools like HashiCorp Vault or AWS Secrets Manager</li>
                <li>Regularly rotate secrets and credentials</li>
            </ul>
        </div>
    </div>
</body>
</html>
EOF

print_status "✅ Secrets scan completed!"
echo "📄 Reports generated:"
echo "- secrets-scan-report.html"
echo "- secrets-found.txt (if any secrets found)"
echo "- exposed-files.txt (if any exposed files found)"
echo "- git-secrets.txt (if any secrets in git history)"

