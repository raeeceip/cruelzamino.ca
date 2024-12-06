#!/bin/bash

# Configuration
LINODE_IP="139.177.197.52"
DOMAIN="zamonwa.com"
PROJECT_DIR="/var/www/zamonwa"
REPO_URL="https://github.com/raeeceip/cruelzamino.ca"
LOG_FILE="deployment.log"
PUBLIC_DIR="$PROJECT_DIR/public"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Error handling
set -e
trap 'echo -e "${RED}Error: Command failed at line $LINENO${NC}" | tee -a $LOG_FILE' ERR

# Logging function
log() {
    echo -e "${GREEN}$(date '+%Y-%m-%d %H:%M:%S'): $1${NC}" | tee -a $LOG_FILE
}

# Start deployment
echo "=== Deployment Started $(date) ===" > $LOG_FILE
log "🚀 Starting deployment to Linode..."

# Remove the quotes around ENDSSH to allow variable expansion
ssh root@$LINODE_IP << ENDSSH
    set -e
    
    # Export variables for use in the SSH session
    export PROJECT_DIR="$PROJECT_DIR"
    export PUBLIC_DIR="$PUBLIC_DIR"
    export REPO_URL="$REPO_URL"
    export DOMAIN="$DOMAIN"
    
    # Stop all web servers to free up ports
    echo "Stopping web servers..."
    systemctl stop apache2 || true
    systemctl disable apache2 || true
    systemctl stop nginx || true
    systemctl disable nginx || true
    systemctl stop caddy || true
    
    # Kill any remaining processes on ports 80 and 443
    echo "Freeing ports 80 and 443..."
    lsof -t -i:80 | xargs kill -9 2>/dev/null || true
    lsof -t -i:443 | xargs kill -9 2>/dev/null || true
    
    # Install Certbot if not already installed
    if ! command -v certbot &> /dev/null; then
        echo "Installing Certbot..."
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    fi

    # Setup or update project
    echo "Updating project..."
    mkdir -p \${PROJECT_DIR}
    
    if [ -d "\${PROJECT_DIR}/.git" ]; then
        echo "Repository exists, pulling updates..."
        cd \${PROJECT_DIR}
        git fetch origin
        git reset --hard origin/main
    else
        echo "Fresh clone required..."
        rm -rf \${PROJECT_DIR}
        git clone \${REPO_URL} \${PROJECT_DIR}
        cd \${PROJECT_DIR}
    fi

    # Create necessary directories
    mkdir -p \${PUBLIC_DIR}/assets/artwork
    mkdir -p \${PUBLIC_DIR}/assets/collections
    mkdir -p \${PUBLIC_DIR}/assets/icons
    
    # Copy assets to public directory
    echo "Copying assets..."
    cp -r src/assets/images/artwork/* \${PUBLIC_DIR}/assets/artwork/ || true
    cp -r src/assets/icons/* \${PUBLIC_DIR}/assets/icons/ || true
    cp src/favicon.ico \${PUBLIC_DIR}/ || true
    cp src/manifest.json \${PUBLIC_DIR}/ || true
    
    # Install dependencies and build
    echo "Installing dependencies..."
    export NODE_OPTIONS="--max-old-space-size=4096"
    npm install --legacy-peer-deps
    
    echo "Building application..."
    npm run build
    
    # Move build assets to public directory
    echo "Moving build assets..."
    cp -r dist/* \${PUBLIC_DIR}/

    # Obtain SSL certificate
    echo "Obtaining SSL certificate..."
    certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email admin@zamonwa.com \
        --domains \${DOMAIN},www.\${DOMAIN} \
        --keep-until-expiring
    
    # Configure Caddy
    echo "Configuring Caddy..."
    cat > /etc/caddy/Caddyfile << EOF
{
    admin off
    email admin@zamonwa.com
}

\${DOMAIN} {
    root * \${PUBLIC_DIR}
    
    # Enable compression
    encode gzip
    
    # Log all requests
    log {
        output file /var/log/caddy/access.log
        format console
    }
    
    # Handle all requests
    handle {
        try_files {path} /index.html
        file_server
    }
    
    # Handle errors
    handle_errors {
        respond "404 - Page not found" 404
    }

    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; connect-src 'self' https:;"
    }
}

# Redirect www to non-www
www.\${DOMAIN} {
    redir https://\${DOMAIN}{uri} permanent
}
EOF

    # Create log directory for Caddy
    mkdir -p /var/log/caddy
    
    # Set permissions
    echo "Setting permissions..."
    chown -R caddy:caddy \${PROJECT_DIR}
    chown -R caddy:caddy \${PUBLIC_DIR}
    chown -R caddy:caddy /var/log/caddy
    chmod -R 755 \${PROJECT_DIR}
    chmod -R 755 \${PUBLIC_DIR}
    chown caddy:caddy /etc/caddy/Caddyfile
    
    # Validate Caddy configuration
    echo "Validating Caddy configuration..."
    caddy validate --config /etc/caddy/Caddyfile
    
    # Restart Caddy
    echo "Restarting Caddy..."
    systemctl restart caddy
    sleep 5
    
    # Check Caddy status
    if systemctl is-active --quiet caddy; then
        echo "✅ Caddy service started successfully"
        systemctl status caddy --no-pager
        
        # List files in public directory for verification
        echo "Verifying files in public directory:"
        ls -la \${PUBLIC_DIR}
        ls -la \${PUBLIC_DIR}/assets
    else
        echo "❌ Caddy failed to start. Checking logs..."
        journalctl -xe --unit=caddy --no-pager
        exit 1
    fi
    
    # Test local access
    echo "Testing local access..."
    curl -I http://localhost || echo "Unable to reach localhost"

    # Setup auto-renewal for SSL certificate
    echo "Setting up SSL auto-renewal..."
    echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null

ENDSSH

log "Deployment completed! Check $LOG_FILE for details."

echo "
Next steps:
1. Verify the site is accessible at https://zamonwa.com
2. Check that all assets are loading correctly
3. Check the Caddy logs if there are any issues:
   ssh root@$LINODE_IP 'tail -f /var/log/caddy/access.log'
4. Verify SSL certificate is working: 
   ssh