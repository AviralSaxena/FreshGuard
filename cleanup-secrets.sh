#!/bin/bash

# Script to clean secrets from git history
# Choose your preferred method

echo "==================================="
echo "FreshGuard - Secret Cleanup Script"
echo "==================================="
echo ""
echo "WARNING: This will rewrite git history!"
echo "Make sure you have a backup before proceeding."
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "Error: Not in a git repository"
    exit 1
fi

echo "Choose cleanup method:"
echo "1) git filter-repo (recommended)"
echo "2) BFG Repo-Cleaner"
echo "3) Start fresh (deletes all history)"
echo "4) Exit"
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo "Using git filter-repo..."
        
        # Check if git-filter-repo is installed
        if ! command -v git-filter-repo &> /dev/null; then
            echo "git-filter-repo is not installed."
            echo "Install it with: pip install git-filter-repo"
            exit 1
        fi
        
        # Create a replacements file
        cat > /tmp/secret-replacements.txt <<'EOF'
# Add your secrets in format: SECRET_TO_REPLACE==>REPLACEMENT
# Example:
# your-actual-secret-key==>***REMOVED_SECRET***
EOF
        
        echo "Replacing secrets in history..."
        git filter-repo --replace-text /tmp/secret-replacements.txt --force
        
        echo "Cleanup complete!"
        echo "Now run: git remote add origin https://github.com/AviralSaxena/FreshGuard.git"
        echo "Then: git push origin --force --all"
        
        rm /tmp/secret-replacements.txt
        ;;
        
    2)
        echo "Using BFG Repo-Cleaner..."
        
        # Download BFG if not present
        if [ ! -f bfg.jar ]; then
            echo "Downloading BFG..."
            wget -O bfg.jar https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
        fi
        
        # Create secrets file
        cat > secrets.txt <<'EOF'
# Add your actual secrets here, one per line
# Example:
# sk-proj-your-secret-key-here
# your-azure-storage-key-here
EOF
        
        echo "Running BFG..."
        java -jar bfg.jar --replace-text secrets.txt
        
        echo "Cleaning up repository..."
        git reflog expire --expire=now --all
        git gc --prune=now --aggressive
        
        echo "Cleanup complete!"
        echo "Now run: git push origin --force --all"
        
        rm secrets.txt
        ;;
        
    3)
        echo "Starting fresh (deleting all history)..."
        read -p "Are you absolutely sure? This cannot be undone! [yes/NO]: " confirm
        
        if [ "$confirm" != "yes" ]; then
            echo "Cancelled."
            exit 0
        fi
        
        # Save the remote URL
        REMOTE_URL=$(git remote get-url origin)
        
        # Remove .git directory
        rm -rf .git
        
        # Initialize new repository
        git init
        git add .
        git commit -m "Initial commit - cleaned history"
        
        # Add remote and push
        git remote add origin "$REMOTE_URL"
        
        echo "New repository initialized!"
        echo "Now run: git push -u --force origin main"
        ;;
        
    4)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "IMPORTANT NEXT STEPS:"
echo "1. Force push to GitHub (see commands above)"
echo "2. Rotate ALL exposed API keys immediately!"
echo "3. Set up environment variables with new keys"
echo "4. Verify secrets are removed: git log --all --full-history --source -- '*appsettings.json' '*server.js'"

