#!/bin/bash

# Security scanning script for DevSecOps pipeline
set -e

echo "🔒 Starting security scan..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. NPM Audit
print_status "Running NPM audit..."
npm audit --audit-level=moderate --json > audit-results.json || true

# Check for high/critical vulnerabilities
HIGH_VULNS=$(cat audit-results.json | jq '.metadata.vulnerabilities.high // 0')
CRITICAL_VULNS=$(cat audit-results.json | jq '.metadata.vulnerabilities.critical // 0')

if [ "$CRITICAL_VULNS" -gt 0 ]; then
    print_error "Found $CRITICAL_VULNS critical vulnerabilities!"
    exit 1
fi

if [ "$HIGH_VULNS" -gt 0 ]; then
    print_warning "Found $HIGH_VULNS high vulnerabilities!"
fi

# 2. ESLint Security Rules
print_status "Running ESLint security scan..."
npx eslint . --ext .ts,.tsx --format json --output-file eslint-security-report.json || true

# 3. TypeScript Security Check
print_status "Running TypeScript security check..."
npx tsc --noEmit --strict

print_status "Security scan completed!"
echo "Reports generated:"
echo "- audit-results.json"
echo "- eslint-security-report.json"
