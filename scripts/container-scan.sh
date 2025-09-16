#!/bin/bash

# Container security scanning script
set -e

IMAGE_NAME=${1:-plateform-app}
IMAGE_TAG=${2:-latest}
REGISTRY=${3:-your-registry.com}

echo "🐳 Starting container security scan for $REGISTRY/$IMAGE_NAME:$IMAGE_TAG..."

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

# Function to run Trivy scan
run_trivy_scan() {
    local image=$1
    print_status "Running Trivy vulnerability scan..."
    
    if command -v trivy &> /dev/null; then
        # Scan for vulnerabilities
        trivy image --format json --output trivy-vulnerabilities.json "$image" || true
        trivy image --format table --output trivy-vulnerabilities.txt "$image" || true
        
        # Scan for secrets
        trivy image --scanners secret --format json --output trivy-secrets.json "$image" || true
        trivy image --scanners secret --format table --output trivy-secrets.txt "$image" || true
        
        # Scan for misconfigurations
        trivy image --scanners config --format json --output trivy-config.json "$image" || true
        trivy image --scanners config --format table --output trivy-config.txt "$image" || true
        
        # Generate HTML report
        trivy image --format template --template "@contrib/html.tpl" --output trivy-report.html "$image" || true
    else
        print_warning "Trivy not found. Installing..."
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get update
            sudo apt-get install wget apt-transport-https gnupg lsb-release
            wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
            echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
            sudo apt-get update
            sudo apt-get install trivy
            trivy image --format json --output trivy-vulnerabilities.json "$image" || true
        else
            print_error "Please install Trivy manually from https://github.com/aquasecurity/trivy"
            return 1
        fi
    fi
}

# Function to analyze Dockerfile
analyze_dockerfile() {
    print_status "Analyzing Dockerfile..."
    
    if [ -f "Dockerfile" ]; then
        # Check for security best practices
        echo "Dockerfile Security Analysis:" > dockerfile-analysis.txt
        echo "=============================" >> dockerfile-analysis.txt
        echo "" >> dockerfile-analysis.txt
        
        # Check for root user
        if grep -q "USER root" Dockerfile; then
            echo "⚠️  WARNING: Running as root user" >> dockerfile-analysis.txt
        fi
        
        # Check for latest tags
        if grep -q "FROM.*:latest" Dockerfile; then
            echo "⚠️  WARNING: Using latest tag" >> dockerfile-analysis.txt
        fi
        
        # Check for COPY vs ADD
        if grep -q "ADD " Dockerfile; then
            echo "⚠️  WARNING: Using ADD instead of COPY" >> dockerfile-analysis.txt
        fi
        
        # Check for exposed ports
        if grep -q "EXPOSE" Dockerfile; then
            echo "✅ Ports are explicitly exposed" >> dockerfile-analysis.txt
        fi
        
        # Check for health check
        if grep -q "HEALTHCHECK" Dockerfile; then
            echo "✅ Health check configured" >> dockerfile-analysis.txt
        else
            echo "⚠️  WARNING: No health check configured" >> dockerfile-analysis.txt
        fi
        
        # Check for multi-stage build
        if grep -q "FROM.*AS" Dockerfile; then
            echo "✅ Multi-stage build detected" >> dockerfile-analysis.txt
        else
            echo "⚠️  WARNING: Not using multi-stage build" >> dockerfile-analysis.txt
        fi
    else
        print_warning "Dockerfile not found."
    fi
}

# Function to generate container security report
generate_container_report() {
    print_status "Generating container security report..."
    
    cat > container-security-report.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Container Security Report</title>
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
        <h1>🐳 Container Security Report</h1>
        <p><strong>Image:</strong> $REGISTRY/$IMAGE_NAME:$IMAGE_TAG</p>
        <p><strong>Date:</strong> $(date)</p>
    </div>
    
    <div class="section">
        <h2>📊 Scan Summary</h2>
        <div class="info">
            <p>This report contains the results of container security scanning performed on the Docker image.</p>
        </div>
    </div>
    
    <div class="section">
        <h2>🛡️ Security Tests Performed</h2>
        <ul>
            <li>Trivy vulnerability scan</li>
            <li>Trivy secrets scan</li>
            <li>Trivy configuration scan</li>
            <li>Dockerfile analysis</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>📋 Security Recommendations</h2>
        <div class="info">
            <ul>
                <li>Update base image to latest stable version</li>
                <li>Remove unnecessary packages and dependencies</li>
                <li>Use non-root user in container</li>
                <li>Implement proper secrets management</li>
                <li>Use multi-stage builds to reduce image size</li>
                <li>Implement health checks</li>
                <li>Scan images regularly for vulnerabilities</li>
            </ul>
        </div>
    </div>
    
    <div class="section">
        <h2>📁 Generated Reports</h2>
        <ul>
            <li>trivy-vulnerabilities.json/txt</li>
            <li>trivy-secrets.json/txt</li>
            <li>trivy-config.json/txt</li>
            <li>trivy-report.html</li>
            <li>dockerfile-analysis.txt</li>
        </ul>
    </div>
</body>
</html>
EOF
}

# Main execution
print_status "Starting comprehensive container security scan..."

# Run all container security scans
run_trivy_scan "$REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
analyze_dockerfile

# Generate comprehensive report
generate_container_report

print_status "✅ Container security scan completed!"
echo "📄 Reports generated:"
echo "- container-security-report.html"
echo "- trivy-vulnerabilities.json/txt"
echo "- trivy-secrets.json/txt"
echo "- trivy-config.json/txt"
echo "- trivy-report.html"
echo "- dockerfile-analysis.txt"

