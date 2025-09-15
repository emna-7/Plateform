pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        DOCKER_REGISTRY = 'your-registry.com'
        IMAGE_NAME = 'plateform-app'
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        GIT_COMMIT_SHORT = "${env.GIT_COMMIT.take(7)}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Installing Node.js dependencies..."
                    npm ci
                '''
            }
        }
        
        stage('Security Scan - Dependencies') {
            steps {
                sh '''
                    echo "Scanning dependencies for vulnerabilities..."
                    npm audit --audit-level=moderate
                '''
            }
        }
        
        stage('Code Quality & SAST') {
            parallel {
                stage('TypeScript Check') {
                    steps {
                        sh 'npm run check'
                    }
                }
                stage('ESLint') {
                    steps {
                        sh 'npx eslint . --ext .ts,.tsx --format json --output-file eslint-report.json || true'
                    }
                }
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh '''
                    echo "Running unit tests..."
                    npm test -- --coverage --watchAll=false
                '''
            }
        }
        
        stage('Build Application') {
            steps {
                sh '''
                    echo "Building application..."
                    npm run build
                '''
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    def image = docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}-${GIT_COMMIT_SHORT}")
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh '''
                    echo "Deploying to staging environment..."
                    kubectl apply -f k8s/staging/
                    kubectl rollout status deployment/plateform-app-staging
                '''
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                sh '''
                    echo "Deploying to production..."
                    kubectl apply -f k8s/production/
                    kubectl rollout status deployment/plateform-app-production
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            slackSend channel: '#devops',
                      color: 'good',
                      message: "✅ Pipeline succeeded for ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
        }
        failure {
            slackSend channel: '#devops',
                      color: 'danger',
                      message: "❌ Pipeline failed for ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
        }
    }
}
