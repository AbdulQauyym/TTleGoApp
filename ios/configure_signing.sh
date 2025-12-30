#!/bin/bash

# Script to configure automatic code signing in Xcode project
# This enables automatic code signing so Codemagic can handle it

PROJECT_FILE="MyApp.xcodeproj/project.pbxproj"

# Check if project file exists
if [ ! -f "$PROJECT_FILE" ]; then
    echo "Error: Project file not found at $PROJECT_FILE"
    exit 1
fi

# Create backup
cp "$PROJECT_FILE" "${PROJECT_FILE}.backup"

# Add CODE_SIGN_STYLE = Automatic to Debug configuration if not present
if ! grep -q "CODE_SIGN_STYLE" "$PROJECT_FILE"; then
    # Add after PRODUCT_BUNDLE_IDENTIFIER in Debug section
    sed -i.bak '/13B07F941A680F5B00A75B9A \/\* Debug \*\//,/name = Debug;/ {
        /PRODUCT_BUNDLE_IDENTIFIER = "org.reactjs.native.example.$(PRODUCT_NAME:rfc1034identifier)";/a\
				CODE_SIGN_STYLE = Automatic;
    }' "$PROJECT_FILE"
    
    # Add after PRODUCT_BUNDLE_IDENTIFIER in Release section
    sed -i.bak '/13B07F951A680F5B00A75B9A \/\* Release \*\//,/name = Release;/ {
        /PRODUCT_BUNDLE_IDENTIFIER = "org.reactjs.native.example.$(PRODUCT_NAME:rfc1034identifier)";/a\
				CODE_SIGN_STYLE = Automatic;
    }' "$PROJECT_FILE"
    
    echo "Added CODE_SIGN_STYLE = Automatic to project"
else
    # Replace Manual with Automatic if it exists
    sed -i.bak 's/CODE_SIGN_STYLE = Manual/CODE_SIGN_STYLE = Automatic/g' "$PROJECT_FILE"
    echo "Updated CODE_SIGN_STYLE to Automatic"
fi

# Clean up backup files
rm -f "${PROJECT_FILE}.bak"

echo "Code signing configuration complete"







