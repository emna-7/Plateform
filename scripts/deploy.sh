#!/bin/bash

# Deployment script for DevSecOps pipeline
set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}

echo "🚀 Deploying to $ENVIRONMENT environment..."

case $ENVIRONMENT in
  "staging")
    kubectl apply -f k8s/staging/
    kubectl rollout status deployment/plateform-app-staging -n staging
    ;;
  "production")
    kubectl apply -f k8s/production/
    kubectl rollout status deployment/plateform-app-production -n production
    ;;
  *)
    echo "❌ Invalid environment: $ENVIRONMENT"
    exit 1
    ;;
esac

echo "✅ Deployment to $ENVIRONMENT completed!"
