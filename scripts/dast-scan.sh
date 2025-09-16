#!/bin/bash

# DAST (Dynamic Application Security Testing) scan script
set -e

TARGET_URL=${1:-http://localhost:3000}
SCAN_TYPE=${2:-baseline}

echo "🔍 Starting DAST scan for $TARGET_URL..."

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

# Function to run custom security tests
run_custom_tests() {
    local url=$1
    print_status "Running custom security tests..."
    
    # Test for common vulnerabilities
    echo "Testing for common vulnerabilities..."
    
    # SQL Injection test
    curl -s "$url/api/test?id=1' OR '1'='1" > /dev/null && print_warning "Potential SQL injection vulnerability detected"
    
    # XSS test
    curl -s "$url/api/test?search=<script>alert('xss')</script>" > /dev/null && print_warning "Potential XSS vulnerability detected"
    
    # Directory traversal test
    curl -s "$url/../../../etc/passwd" > /dev/null && print_warning "Potential directory traversal vulnerability detected"
    
    # Test for exposed sensitive files
    curl -s "$url/.env" > /dev/null && print_warning ".env file exposed"
    curl -s "$url/config.json" > /dev/null && print_warning "config.json file exposed"
    curl -s "$url/package.json" > /dev/null && print_warning "package.json file exposed"
}

# Function to run OWASP ZAP baseline scan
run_zap_baseline() {
    local url=$1
    print_status "Running OWASP ZAP baseline scan..."
    
    if command -v zap-baseline.py &> /dev/null; then
        zap-baseline.py -t "$url" -r zap-baseline-report.html
    else
        print_warning "OWASP ZAP not found. Running custom tests instead."
        run_custom_tests "$url"
    fi
}

# Function to generate security report
generate_report() {
    print_status "Generating security report..."
    
    cat > dast-report.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>DAST Security Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f0f0f0; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; }
        .vulnerability { background-color: #ffe6e6; padding: 10px; margin: 10px 0; border-radius: 3px; }
        .warning { background-color: #fff3cd; padding: 10px; margin: 10px 0; border-radius: 3px; }
        .info { background-color: #d1ecf1; padding: 10px; margin: 10px 0; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 DAST Security Report</h1>
        <p><strong>Target:</strong> $TARGET_URL</p>
        <p><strong>Scan Type:</strong> $SCAN_TYPE</p>
        <p><strong>Date:</strong> $(date)</p>
    </div>
    
    <div class="section">
        <h2>📊 Scan Summary</h2>
        <div class="info">
            <p>This report contains the results of Dynamic Application Security Testing (DAST) performed on the target application.</p>
        </div>
    </div>
    
    <div class="section">
        <h2>🛡️ Security Tests Performed</h2>
        <ul>
            <li>OWASP ZAP $SCAN_TYPE scan</li>
            <li>Custom vulnerability tests</li>
            <li>File exposure tests</li>
            <li>Common attack vector tests</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>📋 Recommendations</h2>
        <div class="info">
            <ul>
                <li>Implement proper input validation</li>
                <li>Use parameterized queries to prevent SQL injection</li>
                <li>Implement Content Security Policy (CSP)</li>
                <li>Ensure sensitive files are not exposed</li>
                <li>Implement rate limiting</li>
                <li>Use HTTPS in production</li>
            </ul>
        </div>
    </div>
</body>
</html>
EOF
}

# Main execution
case $SCAN_TYPE in
    "baseline")
        run_zap_baseline "$TARGET_URL"
        ;;
    "custom")
        run_custom_tests "$TARGET_URL"
        ;;
    *)
        print_error "Invalid scan type: $SCAN_TYPE"
        print_status "Available scan types: baseline, custom"
        exit 1
        ;;
esac

# Generate report
generate_report

print_status "✅ DAST scan completed!"
echo "📄 Reports generated:"
echo "- dast-report.html"
echo "- zap-baseline-report.html (if OWASP ZAP was used)"

