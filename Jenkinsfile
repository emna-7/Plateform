pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        // Keep env minimal to avoid missing credentials/tools
        GIT_COMMIT_SHORT = ''
        GIT_BRANCH = ''
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    if (isUnix()) {
                        GIT_COMMIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                        GIT_BRANCH = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    } else {
                        GIT_COMMIT_SHORT = bat(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                        GIT_BRANCH = bat(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    }
                    echo "Branch: ${GIT_BRANCH} | Commit: ${GIT_COMMIT_SHORT} | Build: ${env.BUILD_NUMBER}"
                }
            }
        }

        stage('Check Node Version') {
                    tools { nodejs 'Node18' }
                    steps {
                script {
                    if (isUnix()) {
                        sh 'node -v'
                        sh 'npm -v'
                    } else {
                        bat 'node -v'
                        bat 'npm -v'
                    }
                }
            }
        }

        stage('Install') {
                    tools { nodejs 'Node18' }
                    steps {
                        script {
                    if (isUnix()) {
                        sh 'node -v && npm -v'
                        sh 'if [ -f package-lock.json ]; then npm ci --prefer-offline --no-audit; else npm install --no-audit; fi'
                    } else {
                        bat 'node -v & npm -v'
                        bat 'if exist package-lock.json (npm ci --prefer-offline --no-audit) else (npm install --no-audit)'
                    }
                }
            }
        }

        stage('Lint & Type Check') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run lint || true'
                        sh 'npm run check'
                    } else {
                        bat 'npm run lint || exit /b 0'
                        bat 'npm run check'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm test -- --coverage --watchAll=false --passWithNoTests'
                    } else {
                        bat 'npm test -- --coverage --watchAll=false --passWithNoTests'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                        sh '[ -d "dist" ] || (echo "dist not found" && exit 1)'
                    } else {
                        bat 'npm run build'
                        bat 'if not exist dist (echo dist not found & exit /b 1)'
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**, client/dist/**, coverage/**', fingerprint: true, allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
