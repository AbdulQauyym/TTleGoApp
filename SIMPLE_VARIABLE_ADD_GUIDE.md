# Simple Guide: Add Variables to Codemagic

## What You Need to Do

Add 3 environment variables to Codemagic. Here's the simplest way:

## Step 1: Find the Input Fields

On the Environment Variables page, look for:
- A text box labeled **"Variable name"** or **"Name"**
- A text box labeled **"Variable value"** or **"Value"**
- A button labeled **"Add"**, **"Save"**, or **"Add variable"**

## Step 2: Add Each Variable

Add these 3 variables one by one:

### Variable 1:
```
Variable name: APP_STORE_ISSUER_ID
Variable value: b79b1792-7bf3-4b25-b677-2161ea034aa8
```
Click **Add** or **Save**

### Variable 2:
```
Variable name: APP_STORE_KEY_ID
Variable value: 4GFW8YSP2G
```
Click **Add** or **Save**

### Variable 3:
```
Variable name: APP_STORE_PRIVATE_KEY
Variable value: [paste entire .p8 file content here]
```
Click **Add** or **Save**

## Step 3: About Groups

**If you see a "Group" option:**
- Create or select group: `app_store_credentials`

**If you DON'T see a "Group" option:**
- That's okay! Just add the variables
- We can update the YAML to work without groups

## Step 4: Verify

After adding, you should see 3 variables listed:
- `APP_STORE_ISSUER_ID`
- `APP_STORE_KEY_ID`
- `APP_STORE_PRIVATE_KEY`

## If You Can't Find the Input Fields

Describe what you see:
- Are there any text boxes?
- Are there any buttons?
- Is there a "Add variable" or "New variable" button?
- What does the page look like?

## Quick Test

Try this:
1. Look for any button that says "Add", "New", "Create", or "+"
2. Click it
3. See if a form appears to add a variable

Let me know what you see and I'll help you from there!













