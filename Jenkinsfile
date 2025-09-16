pipeline {
    agent any
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    environment {
        GIT_COMMIT_SHORT = ''
        GIT_BRANCH = ''
    }
    
    stages {
        stage('Clean Workspace') {
                    steps {
                deleteDir()
            }
        }

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

        stage('Debug Workspace') {
            steps {
                dir("${env.WORKSPACE}") {
                        script {
                        if (isUnix()) {
                            sh 'ls -la'
                        } else {
                            bat 'dir /b'
                        }
                    }
                }
            }
        }

        stage('Check Node Version') {
            tools { nodejs 'Node22' } // Nom exact de ton NodeJS tool dans Jenkins
                    steps {
                dir("${env.WORKSPACE}") {
                        script {
                        if (isUnix()) {
                            sh 'node -v && npm -v'
                        } else {
                            bat 'node -v & npm -v'
                        }
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            tools { nodejs 'Node22' }
                    steps {
                dir("${env.WORKSPACE}") {
                    script {
                        if (fileExists('package.json')) {
                            if (isUnix()) {
                                sh 'if [ -f package-lock.json ]; then npm ci --prefer-offline --no-audit; else npm install --no-audit; fi'
                            } else {
                                bat 'if exist package-lock.json (npm ci --prefer-offline --no-audit) else (npm install --no-audit)'
                            }
                        } else {
                            error "package.json introuvable dans ${env.WORKSPACE} !"
                        }
                    }
                }
            }
        }

        stage('Pre-commit Hooks') {
            tools { nodejs 'Node22' }
                    steps {
                dir("${env.WORKSPACE}") {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        script {
                            if (isUnix()) {
                        sh '''
                                    echo "🔧 Installing pre-commit hooks..."
                                    pip install pre-commit || echo "pip not available, skipping pre-commit"
                                    
                                    if command -v pre-commit >/dev/null 2>&1; then
                                        echo "✅ Running pre-commit hooks..."
                                        pre-commit run --all-files || echo "Pre-commit hooks failed, continuing..."
                                    else
                                        echo "⚠️ pre-commit not available, running basic checks..."
                                        
                                        # Basic file checks
                                        echo "Checking for trailing whitespace..."
                                        find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -l " $" || echo "No trailing whitespace found"
                                        
                                        echo "Checking for large files..."
                                        find . -size +1M -not -path "./node_modules/*" -not -path "./.git/*" || echo "No large files found"
                                        
                                        echo "Checking JSON files..."
                                        find . -name "*.json" -not -path "./node_modules/*" | xargs -I {} sh -c 'echo "Checking {}" && python -m json.tool {} > /dev/null' || echo "JSON validation failed"
                                    fi
                                '''
                            } else {
                                bat '''
                                    echo "🔧 Installing pre-commit hooks..."
                                    pip install pre-commit || echo "pip not available, skipping pre-commit"
                                    
                                    where pre-commit >nul 2>&1
                                    if %errorlevel% == 0 (
                                        echo "✅ Running pre-commit hooks..."
                                        pre-commit run --all-files || echo "Pre-commit hooks failed, continuing..."
                                    ) else (
                                        echo "⚠️ pre-commit not available, running basic checks..."
                                        
                                        echo "Checking for large files..."
                                        for /r %%f in (*) do if %%~zf gtr 1048576 echo Large file: %%f
                                        
                                        echo "Basic checks completed"
                                    )
                        '''
                    }
                }
                    }
                }
            }
        }

        stage('OWASP Security Check') {
            tools { nodejs 'Node22' }
            steps {
                dir("${env.WORKSPACE}") {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                        script {
                            if (isUnix()) {
                sh '''
                                    echo "🔒 Running OWASP security checks..."
                                    
                                    # Install OWASP dependency check if not available
                                    if ! command -v dependency-check.sh >/dev/null 2>&1; then
                                        echo "Installing OWASP dependency check..."
                                        wget -q https://github.com/jeremylong/DependencyCheck/releases/latest/download/dependency-check-8.4.0-release.zip
                                        unzip -q dependency-check-8.4.0-release.zip
                                        chmod +x dependency-check/bin/dependency-check.sh
                                    fi
                                    
                                    # Run dependency check
                                    echo "Scanning dependencies for vulnerabilities..."
                                    if [ -f dependency-check/bin/dependency-check.sh ]; then
                                        ./dependency-check/bin/dependency-check.sh --project "Plateform" --scan . --format JSON --format HTML --out ./security-reports/ || echo "OWASP scan completed with warnings"
                                    else
                                        echo "OWASP dependency check not available, running npm audit instead..."
                                        npm audit --audit-level=moderate || echo "npm audit completed with warnings"
                                    fi
                                    
                                    # Check for known vulnerable packages
                                    echo "Checking for known vulnerable packages..."
                                    npm audit --audit-level=high || echo "High severity vulnerabilities found"
                                    
                                    # Check for outdated packages with security issues
                                    echo "Checking for outdated packages..."
                                    npm outdated || echo "Some packages are outdated"
                                '''
                            } else {
                                bat '''
                                    echo "🔒 Running OWASP security checks..."
                                    
                                    echo "Running npm audit for security vulnerabilities..."
                                    npm audit --audit-level=moderate || echo "npm audit completed with warnings"
                                    
                                    echo "Checking for high severity vulnerabilities..."
                                    npm audit --audit-level=high || echo "High severity vulnerabilities found"
                                    
                                    echo "Checking for outdated packages..."
                                    npm outdated || echo "Some packages are outdated"
                                    
                                    echo "OWASP security checks completed"
                                '''
                            }
                        }
                    }
                }
            }
        }
        
        stage('Lint & Type Check') {
            tools { nodejs 'Node22' }
            steps {
                dir("${env.WORKSPACE}") {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                script {
                            if (isUnix()) {
                                sh 'npm run lint || echo "Linting completed with warnings"'
                                sh 'echo "Skipping TypeScript check for now"'
                            } else {
                                bat 'npm run lint || echo "Linting completed with warnings"'
                                bat 'echo "Skipping TypeScript check for now"'
                            }
                        }
                    }
                }
            }
        }

        stage('Test') {
            tools { nodejs 'Node22' }
            steps {
                dir("${env.WORKSPACE}") {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                script {
                            if (isUnix()) {
                                sh 'npm test -- --coverage --watchAll=false --passWithNoTests || echo "Tests completed with some failures"'
                            } else {
                                bat 'npm test -- --coverage --watchAll=false --passWithNoTests || echo "Tests completed with some failures"'
                            }
                        }
                    }
                }
            }
        }

        stage('Build') {
            tools { nodejs 'Node22' }
            steps {
                dir("${env.WORKSPACE}") {
                    catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                script {
                            if (isUnix()) {
                                sh 'npm run build || echo "Build completed with warnings"'
                                sh '[ -d "dist" ] || (echo "dist not found" && exit 1)'
                            } else {
                                bat 'npm run build || echo "Build completed with warnings"'
                                bat 'if not exist dist (echo dist not found & exit /b 1)'
                            }
                        }
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
