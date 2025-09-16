#!/bin/bash

# SAST (Static Application Security Testing) scan script
set -e

echo "🔍 Starting SAST scan..."

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

# Function to run ESLint security scan
run_eslint_security() {
    print_status "Running ESLint security scan..."
    
    if [ -f ".eslintrc.security.js" ]; then
        npx eslint . --ext .ts,.tsx --config .eslintrc.security.js --format json --output-file eslint-security-report.json || true
        npx eslint . --ext .ts,.tsx --config .eslintrc.security.js --format html --output-file eslint-security-report.html || true
    else
        print_warning "ESLint security config not found. Using default config."
        npx eslint . --ext .ts,.tsx --format json --output-file eslint-security-report.json || true
    fi
}

# Function to run TypeScript security check
run_typescript_security() {
    print_status "Running TypeScript security check..."
    
    # Check for unsafe any usage
    grep -r "any" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v ".git" > typescript-any-usage.txt || true
    
    # Check for unsafe type assertions
    grep -r "as " --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v ".git" > typescript-assertions.txt || true
    
    # Run TypeScript compiler with strict mode
    npx tsc --noEmit --strict --skipLibCheck || true
}

# Function to run dependency security scan
run_dependency_scan() {
    print_status "Running dependency security scan..."
    
    # NPM audit
    npm audit --audit-level=moderate --json > npm-audit-report.json || true
    
    # Check for outdated dependencies
    npm outdated --json > npm-outdated-report.json || true
    
    # License check
    npx license-checker --json > license-report.json || true
}

# Function to run code quality scan
run_code_quality() {
    print_status "Running code quality scan..."
    
    # Check for TODO/FIXME comments
    grep -r -i "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v ".git" > code-todos.txt || true
    
    # Check for console.log statements
    grep -r "console\.log\|console\.warn\|console\.error" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v ".git" > console-statements.txt || true
}

# Function to generate SAST report
generate_sast_report() {
    print_status "Generating SAST report..."
    
    cat > sast-report.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>SAST Security Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f0f0f0; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; }
        .vulnerability { background-color: #ffe6e6; padding: 10px; margin: 10px 0; border-radius: 3px; }
        .warning { background-color: #fff3cd; padding: 10px; margin: 10px 0; border-radius: 3px; }
        .info { background-color: #d1ecf1; padding: 10px; margin: 10px 0; border-radius: 3px; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background-color: #e9ecef; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 SAST Security Report</h1>
        <p><strong>Date:</strong> $(date)</p>
        <p><strong>Project:</strong> Plateform Application</p>
    </div>
    
    <div class="section">
        <h2>📊 Scan Summary</h2>
        <div class="info">
            <p>This report contains the results of Static Application Security Testing (SAST) performed on the source code.</p>
        </div>
    </div>
    
    <div class="section">
        <h2>🛡️ Security Tests Performed</h2>
        <ul>
            <li>ESLint security rules scan</li>
            <li>TypeScript security checks</li>
            <li>Dependency vulnerability scan</li>
            <li>Code quality analysis</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>📋 Security Recommendations</h2>
        <div class="info">
            <ul>
                <li>Review and fix all ESLint security warnings</li>
                <li>Update vulnerable dependencies</li>
                <li>Remove hardcoded secrets and credentials</li>
                <li>Implement proper input validation</li>
                <li>Use TypeScript strict mode</li>
                <li>Implement secure coding practices</li>
            </ul>
        </div>
    </div>
    
    <div class="section">
        <h2>📁 Generated Reports</h2>
        <ul>
            <li>eslint-security-report.json/html</li>
            <li>npm-audit-report.json</li>
            <li>typescript-any-usage.txt</li>
            <li>code-todos.txt</li>
        </ul>
    </div>
</body>
</html>
EOF
}

# Main execution
print_status "Starting comprehensive SAST scan..."

# Run all SAST scans
run_eslint_security
run_typescript_security
run_dependency_scan
run_code_quality

# Generate comprehensive report
generate_sast_report

print_status "✅ SAST scan completed!"
echo "📄 Reports generated:"
echo "- sast-report.html"
echo "- eslint-security-report.json/html"
echo "- npm-audit-report.json"
echo "- typescript-any-usage.txt"
echo "- code-todos.txt"
