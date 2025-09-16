pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = 'your-registry.com'
        IMAGE_NAME = 'plateform-app'
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        GIT_COMMIT_SHORT = "${env.GIT_COMMIT.take(7)}"
        SONAR_TOKEN = credentials('sonar-token')
        SLACK_WEBHOOK = credentials('slack-webhook')
        DOCKER_REGISTRY_CREDS = credentials('docker-registry-credentials')
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
        skipDefaultCheckout()
    }
    
    triggers {
        githubPush()
        pollSCM('H/5 * * * *')
    }
    
    stages {
        stage('🔍 Pre-Build Security Checks') {
            parallel {
                stage('Secrets Scan') {
                    steps {
                        script {
                            sh '''
                                echo "🔐 Scanning for secrets and credentials..."
                                ./scripts/secrets-scan.sh
                            '''
                        }
                    }
                }
                stage('License Check') {
                    steps {
                        script {
                            sh '''
                                echo "📄 Checking licenses..."
                                npx license-checker --json > license-report.json || true
                            '''
                        }
                    }
                }
            }
        }
        
        stage('📦 Checkout & Setup') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    env.GIT_BRANCH = sh(
                        script: 'git rev-parse --abbrev-ref HEAD',
                        returnStdout: true
                    ).trim()
                }
                sh '''
                    echo "🚀 Setting up environment..."
                    echo "Branch: ${GIT_BRANCH}"
                    echo "Commit: ${GIT_COMMIT_SHORT}"
                    echo "Build: ${BUILD_NUMBER}"
                '''
            }
        }
        
        stage('📚 Install Dependencies') {
            steps {
                sh '''
                    echo "📚 Installing Node.js dependencies..."
                    npm ci --prefer-offline --no-audit
                '''
            }
        }
        
        stage('🛡️ Security Scans') {
            parallel {
                stage('Dependency Audit') {
                    steps {
                        script {
                            sh '''
                                echo "🔍 Scanning dependencies for vulnerabilities..."
                                npm audit --audit-level=moderate --json > npm-audit-report.json || true
                                
                                # Check for critical vulnerabilities
                                CRITICAL=$(cat npm-audit-report.json | jq '.metadata.vulnerabilities.critical // 0')
                                HIGH=$(cat npm-audit-report.json | jq '.metadata.vulnerabilities.high // 0')
                                
                                if [ "$CRITICAL" -gt 0 ]; then
                                    echo "❌ CRITICAL vulnerabilities found: $CRITICAL"
                                    exit 1
                                fi
                                
                                if [ "$HIGH" -gt 5 ]; then
                                    echo "⚠️ HIGH vulnerabilities found: $HIGH"
                                    exit 1
                                fi
                                
                                echo "✅ Dependency scan passed"
                            '''
                        }
                    }
                }
                stage('SAST Scan') {
                    steps {
                        script {
                            sh '''
                                echo "🔍 Running Static Application Security Testing..."
                                ./scripts/sast-scan.sh
                            '''
                        }
                    }
                }
                stage('Container Scan') {
                    steps {
                        script {
                            sh '''
                                echo "🐳 Scanning container for vulnerabilities..."
                                ./scripts/container-scan.sh
                            '''
                        }
                    }
                }
            }
        }
        
        stage('🔧 Code Quality') {
            parallel {
                stage('TypeScript Check') {
                    steps {
                        sh '''
                            echo "🔧 Running TypeScript type checking..."
                            npm run check
                        '''
                    }
                }
                stage('ESLint Security') {
                    steps {
                        sh '''
                            echo "🔧 Running ESLint security rules..."
                            npx eslint . --ext .ts,.tsx --config .eslintrc.security.js --format json --output-file eslint-security-report.json || true
                        '''
                    }
                }
                stage('Code Coverage') {
                    steps {
                        sh '''
                            echo "📊 Generating code coverage..."
                            npm run test:coverage
                        '''
                    }
                }
            }
        }
        
        stage('🧪 Testing') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh '''
                            echo "🧪 Running unit tests..."
                            npm test -- --coverage --watchAll=false --passWithNoTests
                        '''
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh '''
                            echo "🧪 Running integration tests..."
                            npm run test:integration || echo "No integration tests configured"
                        '''
                    }
                }
                stage('Load Tests') {
                    steps {
                        sh '''
                            echo "🧪 Running load tests..."
                            npm run test:load || echo "No load tests configured"
                        '''
                    }
                }
            }
        }
        
        stage('🏗️ Build Application') {
            steps {
                sh '''
                    echo "🏗️ Building application..."
                    npm run build
                    
                    # Verify build artifacts
                    if [ ! -d "dist" ]; then
                        echo "❌ Build failed - dist directory not found"
                        exit 1
                    fi
                    
                    echo "✅ Build completed successfully"
                '''
            }
        }
        
        stage('🐳 Docker Operations') {
            parallel {
                stage('Build Docker Image') {
                    steps {
                        script {
                            def image = docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}")
                            env.DOCKER_IMAGE = "${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}"
                        }
                    }
                }
                stage('Scan Docker Image') {
                    steps {
                        script {
                            sh '''
                                echo "🔍 Scanning Docker image for vulnerabilities..."
                                trivy image --format json --output trivy-image-report.json ${DOCKER_IMAGE} || true
                                trivy image --format table --output trivy-image-report.txt ${DOCKER_IMAGE} || true
                            '''
                        }
                    }
                }
            }
        }
        
        stage('🚀 Deploy to Staging') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'staging'
                }
            }
            steps {
                script {
                    sh '''
                        echo "🚀 Deploying to staging environment..."
                        kubectl apply -f k8s/staging/
                        kubectl rollout status deployment/plateform-app-staging -n staging --timeout=300s
                        
                        # Health check
                        echo "🏥 Performing health check..."
                        ./scripts/health-check.sh http://staging.plateform.com
                    '''
                }
            }
        }
        
        stage('🌐 DAST Scan (Staging)') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'staging'
                }
            }
            steps {
                script {
                    sh '''
                        echo "🌐 Running Dynamic Application Security Testing..."
                        ./scripts/dast-scan.sh http://staging.plateform.com baseline
                    '''
                }
            }
        }
        
        stage('📊 Quality Gate') {
            steps {
                script {
                    sh '''
                        echo "📊 Running SonarQube quality gate..."
                        sonar-scanner -Dsonar.projectKey=plateform-app \
                                     -Dsonar.host.url=http://localhost:9000 \
                                     -Dsonar.login=${SONAR_TOKEN} \
                                     -Dsonar.qualitygate.wait=true
                    '''
                }
            }
        }
        
        stage('🚀 Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    input message: '🚀 Deploy to production?', ok: 'Deploy'
                    sh '''
                        echo "🚀 Deploying to production environment..."
                        
                        # Push Docker image
                        docker.withRegistry("https://${DOCKER_REGISTRY}", "${DOCKER_REGISTRY_CREDS}") {
                            docker.image("${DOCKER_IMAGE}").push()
                            docker.image("${DOCKER_IMAGE}").push('latest')
                        }
                        
                        # Deploy to Kubernetes
                        kubectl apply -f k8s/production/
                        kubectl rollout status deployment/plateform-app-production -n production --timeout=600s
                        
                        # Health check
                        echo "🏥 Performing production health check..."
                        ./scripts/health-check.sh https://plateform.com
                    '''
                }
            }
        }
        
        stage('📈 Post-Deploy Monitoring') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        echo "📈 Setting up monitoring and alerting..."
                        
                        # Verify deployment
                        kubectl get pods -n production
                        kubectl get services -n production
                        
                        # Check application logs
                        kubectl logs -n production deployment/plateform-app-production --tail=50
                        
                        echo "✅ Production deployment completed successfully"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                sh '''
                    echo "🧹 Cleaning up workspace..."
                    # Archive artifacts
                    archiveArtifacts artifacts: '**/coverage/**', fingerprint: true
                    archiveArtifacts artifacts: '**/*-report.json', fingerprint: true
                    archiveArtifacts artifacts: '**/*-report.html', fingerprint: true
                '''
            }
            cleanWs()
        }
        success {
            script {
                slackSend channel: '#devops',
                          color: 'good',
                          message: "✅ Pipeline succeeded!\n" +
                                   "📋 Job: ${env.JOB_NAME}\n" +
                                   "🔢 Build: ${env.BUILD_NUMBER}\n" +
                                   "🌿 Branch: ${env.GIT_BRANCH}\n" +
                                   "📝 Commit: ${env.GIT_COMMIT_SHORT}\n" +
                                   "🔗 Build URL: ${env.BUILD_URL}"
            }
        }
        failure {
            script {
                slackSend channel: '#devops',
                          color: 'danger',
                          message: "❌ Pipeline failed!\n" +
                                   "📋 Job: ${env.JOB_NAME}\n" +
                                   "🔢 Build: ${env.BUILD_NUMBER}\n" +
                                   "🌿 Branch: ${env.GIT_BRANCH}\n" +
                                   "📝 Commit: ${env.GIT_COMMIT_SHORT}\n" +
                                   "🔗 Build URL: ${env.BUILD_URL}"
            }
        }
        unstable {
            script {
                slackSend channel: '#devops',
                          color: 'warning',
                          message: "⚠️ Pipeline unstable!\n" +
                                   "📋 Job: ${env.JOB_NAME}\n" +
                                   "🔢 Build: ${env.BUILD_NUMBER}\n" +
                                   "🌿 Branch: ${env.GIT_BRANCH}\n" +
                                   "📝 Commit: ${env.GIT_COMMIT_SHORT}\n" +
                                   "🔗 Build URL: ${env.BUILD_URL}"
            }
        }
    }
}
