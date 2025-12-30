# Build iOS IPA File Locally (Mac Required)

If you have access to a Mac, you can build the IPA file locally. Here's how:

## Prerequisites

1. **Mac Computer** (macOS required)
2. **Xcode** installed from Mac App Store
3. **Apple Developer Account** ($99/year)
4. **Node.js** and **npm** installed
5. **CocoaPods** installed (`sudo gem install cocoapods`)

## Step 1: Clone Your Repository

```bash
git clone https://github.com/AbdulQauyym/TTleGoApp.git
cd TTleGoApp
```

## Step 2: Install Dependencies

```bash
# Install Node dependencies
npm install

# Install CocoaPods dependencies
cd ios
pod install
cd ..
```

## Step 3: Open in Xcode

```bash
open ios/MyApp.xcworkspace
```

## Step 4: Configure Code Signing in Xcode

1. Select your project in the navigator
2. Select the **MyApp** target
3. Go to **Signing & Capabilities** tab
4. Check **"Automatically manage signing"**
5. Select your **Team** (Apple Developer account)
6. Xcode will automatically create certificates and provisioning profiles

## Step 5: Update Bundle Identifier

1. In Xcode, go to **General** tab
2. Update **Bundle Identifier** to something unique (e.g., `com.yourcompany.ttelgo`)
3. Make sure it matches your Apple Developer account

## Step 6: Build Archive

1. In Xcode, select **Product** > **Scheme** > **MyApp**
2. Select **Any iOS Device** or your connected device
3. Go to **Product** > **Archive**
4. Wait for the archive to complete

## Step 7: Export IPA

1. After archiving, the **Organizer** window will open
2. Select your archive
3. Click **Distribute App**
4. Choose distribution method:
   - **App Store Connect** (for App Store)
   - **Ad Hoc** (for testing on specific devices)
   - **Enterprise** (if you have Enterprise account)
   - **Development** (for development builds)
5. Follow the wizard to export your IPA

## Alternative: Build via Command Line

If you prefer command line:

```bash
# Navigate to project root
cd /path/to/TTleGoApp

# Install dependencies
npm install
cd ios && pod install && cd ..

# Build archive
xcodebuild -workspace ios/MyApp.xcworkspace \
  -scheme MyApp \
  -configuration Release \
  -archivePath build/MyApp.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/MyApp.xcarchive \
  -exportPath build/ipa \
  -exportOptionsPlist ios/ExportOptions.plist
```

The IPA file will be in `build/ipa/` directory.

## Troubleshooting

- **Code Signing Errors**: Make sure your Apple Developer account is active and certificates are valid
- **Pod Install Errors**: Run `pod repo update` then `pod install` again
- **Build Errors**: Check Xcode build logs for specific error messages












