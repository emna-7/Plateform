#!/bin/bash

# Health check script for monitoring
set -e

URL=${1:-http://localhost:3000/health}
TIMEOUT=${2:-30}

echo "🏥 Checking health at $URL..."

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

# Function to check health endpoint
check_health() {
    local url=$1
    local timeout=$2
    
    print_status "Checking application health..."
    
    if curl -f -s --max-time $timeout "$url" > /dev/null; then
        print_status "✅ Health check passed"
        return 0
    else
        print_error "❌ Health check failed"
        return 1
    fi
}

# Function to check response time
check_response_time() {
    local url=$1
    print_status "Checking response time..."
    
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' "$url")
    RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc)
    
    if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
        print_status "✅ Response time: ${RESPONSE_TIME_MS}ms (Good)"
    elif (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
        print_warning "⚠️ Response time: ${RESPONSE_TIME_MS}ms (Acceptable)"
    else
        print_error "❌ Response time: ${RESPONSE_TIME_MS}ms (Slow)"
        return 1
    fi
}

# Function to check HTTP status codes
check_http_status() {
    local url=$1
    print_status "Checking HTTP status codes..."
    
    # Check main endpoint
    STATUS_CODE=$(curl -o /dev/null -s -w '%{http_code}' "$url")
    
    case $STATUS_CODE in
        200)
            print_status "✅ HTTP Status: $STATUS_CODE (OK)"
            ;;
        301|302)
            print_warning "⚠️ HTTP Status: $STATUS_CODE (Redirect)"
            ;;
        404)
            print_error "❌ HTTP Status: $STATUS_CODE (Not Found)"
            return 1
            ;;
        500|502|503|504)
            print_error "❌ HTTP Status: $STATUS_CODE (Server Error)"
            return 1
            ;;
        *)
            print_warning "⚠️ HTTP Status: $STATUS_CODE (Unknown)"
            ;;
    esac
}

# Function to check SSL certificate (if HTTPS)
check_ssl_certificate() {
    local url=$1
    print_status "Checking SSL certificate..."
    
    if [[ $url == https://* ]]; then
        DOMAIN=$(echo $url | sed 's/https:\/\///' | cut -d'/' -f1)
        
        # Check certificate expiration
        CERT_EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
        
        if [ -n "$CERT_EXPIRY" ]; then
            EXPIRY_DATE=$(date -d "$CERT_EXPIRY" +%s)
            CURRENT_DATE=$(date +%s)
            DAYS_UNTIL_EXPIRY=$(( (EXPIRY_DATE - CURRENT_DATE) / 86400 ))
            
            if [ $DAYS_UNTIL_EXPIRY -gt 30 ]; then
                print_status "✅ SSL Certificate expires in $DAYS_UNTIL_EXPIRY days"
            elif [ $DAYS_UNTIL_EXPIRY -gt 7 ]; then
                print_warning "⚠️ SSL Certificate expires in $DAYS_UNTIL_EXPIRY days"
            else
                print_error "❌ SSL Certificate expires in $DAYS_UNTIL_EXPIRY days"
                return 1
            fi
        fi
    else
        print_status "ℹ️ Not using HTTPS, skipping SSL check"
    fi
}

# Function to generate health report
generate_health_report() {
    print_status "Generating health report..."
    
    cat > health-report.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Health Check Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f0f0f0; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; }
        .success { background-color: #d4edda; padding: 10px; margin: 10px 0; border-radius: 3px; }
        .warning { background-color: #fff3cd; padding: 10px; margin: 10px 0; border-radius: 3px; }
        .error { background-color: #f8d7da; padding: 10px; margin: 10px 0; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Health Check Report</h1>
        <p><strong>Target:</strong> $URL</p>
        <p><strong>Date:</strong> $(date)</p>
    </div>
    
    <div class="section">
        <h2>📊 Health Check Summary</h2>
        <div class="success">
            <p>Health check completed successfully!</p>
        </div>
    </div>
    
    <div class="section">
        <h2>🔍 Tests Performed</h2>
        <ul>
            <li>Application health endpoint</li>
            <li>Response time measurement</li>
            <li>HTTP status code verification</li>
            <li>SSL certificate validation (if HTTPS)</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>📋 Recommendations</h2>
        <div class="warning">
            <ul>
                <li>Monitor response times regularly</li>
                <li>Set up automated health checks</li>
                <li>Implement proper error handling</li>
                <li>Use load balancing for high availability</li>
                <li>Monitor SSL certificate expiration</li>
            </ul>
        </div>
    </div>
</body>
</html>
EOF
}

# Main execution
print_status "Starting comprehensive health check..."

# Run all health checks
check_health $URL $TIMEOUT
check_response_time $URL
check_http_status $URL
check_ssl_certificate $URL

# Generate comprehensive report
generate_health_report

print_status "✅ All health checks passed!"
echo "📄 Report generated: health-report.html"
