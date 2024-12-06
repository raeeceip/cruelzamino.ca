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

# SSH into the Linode and perform deployment
ssh root@$LINODE_IP << ENDSSH
    set -e
    
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
    
    # Setup project directories
    echo "Setting up project directories..."
    rm -rf $PROJECT_DIR
    mkdir -p $PROJECT_DIR
    mkdir -p $PUBLIC_DIR/assets/artwork
    mkdir -p $PUBLIC_DIR/assets/collections
    
    # Clone the repository
    echo "Cloning repository..."
    git clone $REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
    
    # Copy assets to public directory
    echo "Setting up assets..."
    cp -r src/assets/images/artwork/* $PUBLIC_DIR/assets/artwork/
    cp -r src/assets/images/collections/* $PUBLIC_DIR/assets/collections/
    
    # Update data.js to use new asset paths
    echo "Updating data.js configuration..."
    sed -i 's|/src/assets/images/|/assets/|g' src/data.js
    
    # Install dependencies and build
    echo "Installing dependencies..."
    export NODE_OPTIONS="--max-old-space-size=4096"
    npm install --legacy-peer-deps
    
    echo "Building application..."
    npm run build
    
    # Configure Caddy
    echo "Configuring Caddy..."
    cat > /etc/caddy/Caddyfile << EOF
{
    admin off
    auto_https off  # Temporarily disable HTTPS to test basic connectivity
}

:80 {
    root * $PROJECT_DIR/dist
    
    # Serve static assets from public directory
    handle /assets/* {
        root * $PUBLIC_DIR
        file_server
    }
    
    # Serve application
    handle {
        try_files {path} /index.html
        file_server
    }
}
EOF

    # Set permissions
    echo "Setting permissions..."
    chown -R caddy:caddy $PROJECT_DIR
    chmod -R 755 $PROJECT_DIR
    chown caddy:caddy /etc/caddy/Caddyfile
    
    # Make sure Caddy service is completely stopped
    echo "Ensuring Caddy is stopped..."
    systemctl stop caddy || true
    pkill caddy || true
    sleep 2
    
    # Verify ports are free
    echo "Checking port availability..."
    netstat -tulpn | grep -E ':80|:443' || echo "Ports are free"
    
    # Start Caddy service
    echo "Starting Caddy service..."
    systemctl restart caddy
    sleep 5
    
    # Check Caddy status
    if systemctl is-active --quiet caddy; then
        echo "✅ Caddy service started successfully"
        systemctl status caddy --no-pager
    else
        echo "❌ Caddy failed to start. Checking logs..."
        journalctl -xe --unit=caddy --no-pager
        exit 1
    fi
    
    # Test local access
    echo "Testing local access..."
    curl -I http://localhost || echo "Unable to reach localhost"
    
    # Verify assets are accessible
    echo "Testing asset accessibility..."
    curl -I http://localhost/assets/artwork/for-your-mind.jpg || echo "Unable to access test asset"
    
    # Print port usage for debugging
    echo "Current port usage:"
    netstat -tulpn | grep -E ':80|:443' || echo "No processes on ports 80/443"
ENDSSH

# Final checks
log "🔍 Performing final checks..."

echo "Testing HTTP access..."
curl -I -s http://$DOMAIN || echo "HTTP not yet accessible"

log "Deployment completed! Check $LOG_FILE for details."

echo "
Next steps:
1. Verify the site is accessible via HTTP at http://$DOMAIN
2. Check that assets are loading correctly
3. If everything works, we can enable HTTPS by updating the Caddy configuration
4. Make sure these DNS records are set:
   - A record for $DOMAIN points to $LINODE_IP
   - A record for www.$DOMAIN points to $LINODE_IP
"