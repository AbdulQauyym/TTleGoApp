# Automatic IPA Generation from GitHub

## How It Works

Codemagic automatically builds IPA files from your GitHub repository when you push code. Here's how to set it up:

## Step 1: Connect Repository to Codemagic

1. Go to https://codemagic.io/
2. Sign in with your GitHub account
3. Click **"Add application"**
4. Select **GitHub** as your Git provider
5. Find and select: **AbdulQauyym/TTleGoApp**
6. Click **"Add application"**

## Step 2: Configure Automatic Builds

The `codemagic.yaml` file is already configured with automatic triggers. It will build when you push to:
- `main` branch
- `develop` branch  
- `release/*` branches

## Step 3: Set Up Code Signing (One-Time Setup)

1. In Codemagic, go to your app settings
2. Navigate to **Code signing** section
3. Add your App Store Connect API key (see CODEMAGIC_SETUP.md)
4. Or use automatic code signing with your Apple ID

## Step 4: Push Code to Trigger Build

Simply push your code to GitHub:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**That's it!** Codemagic will automatically:
1. Detect the push
2. Start a build
3. Install dependencies
4. Build the IPA file
5. Make it available for download

## Step 5: Download Your IPA

After the build completes (usually 10-20 minutes):

1. Go to https://codemagic.io/
2. Click on your **TTleGoApp** project
3. Click on the latest build
4. Scroll to **Artifacts** section
5. Download the `.ipa` file

## Automatic Build Notifications

You'll receive an email when:
- Build starts
- Build succeeds (with download link)
- Build fails (with error details)

Update your email in `codemagic.yaml`:
```yaml
publishing:
  email:
    recipients:
      - your-email@example.com  # Change this!
```

## Manual Build Trigger

You can also trigger builds manually:

1. Go to your app in Codemagic
2. Click **"Start new build"**
3. Select branch and workflow
4. Click **"Start new build"**

## Build Status Badge

Add a build status badge to your README:

```markdown
[![Codemagic build status](https://api.codemagic.io/apps/YOUR_APP_ID/ios-workflow/status_badge.svg)](https://codemagic.io/apps/YOUR_APP_ID/builds)
```

Replace `YOUR_APP_ID` with your Codemagic app ID (found in app settings).

## Troubleshooting

### Builds Not Starting Automatically
- Check that `codemagic.yaml` is in the root of your repository
- Verify the branch pattern matches your branch name
- Check Codemagic app settings → Build triggers

### Build Fails
- Check build logs in Codemagic dashboard
- Verify code signing is set up correctly
- Ensure all dependencies are in `package.json`

### Can't Download IPA
- Check that build completed successfully
- Verify artifacts section shows the `.ipa` file
- Try downloading from build details page

## Cost

- **Free tier**: 500 build minutes/month
- **Paid plans**: Start at $75/month for more minutes
- Each iOS build typically takes 10-20 minutes

## Next Steps

1. ✅ Push your code to GitHub
2. ✅ Connect repository to Codemagic
3. ✅ Set up code signing
4. ✅ Push to trigger first build
5. ✅ Download your IPA file!

Your IPA will be automatically generated every time you push to GitHub! 🚀














