# How to Add Variables If "Select Group" Button Not Found

If you don't see the "Select group" button, here are alternative methods:

## Method 1: Add Variables First, Then Group Them

Some Codemagic interfaces let you add variables first:

### Step 1: Add Variables Directly

1. **On Environment Variables page**, you should see input fields:
   ```
   Variable name: [___________]
   Variable value: [___________]
   [Add] or [Save] button
   ```

2. **Add First Variable:**
   - **Variable name**: Type `APP_STORE_ISSUER_ID`
   - **Variable value**: Type `b79b1792-7bf3-4b25-b677-2161ea034aa8`
   - Click **Add** or **Save**
   - (Don't worry about group yet)

3. **Add Second Variable:**
   - **Variable name**: Type `APP_STORE_KEY_ID`
   - **Variable value**: Type `4GFW8YSP2G`
   - Click **Add** or **Save**

4. **Add Third Variable:**
   - **Variable name**: Type `APP_STORE_PRIVATE_KEY`
   - **Variable value**: Paste your entire `.p8` file content
   - Click **Add** or **Save**

### Step 2: Create Group and Move Variables

After adding variables, look for:
- A **"Groups"** section or tab
- A **"Manage groups"** button
- Or variables might have a **"Move to group"** option

---

## Method 2: Check for Different UI Layout

The page might look different. Look for:

### Option A: Group Dropdown in Variable Form
```
┌─────────────────────────────────┐
│ Variable name: [________]       │
│ Variable value: [________]     │
│ Group: [No group ▼]           │ ← Look for this dropdown
│ [Add variable]                 │
└─────────────────────────────────┘
```
- If you see a "Group" dropdown, click it
- Select "Create new group" or type `app_store_credentials`

### Option B: Separate Groups Section
Look for tabs or sections:
- **"Variables"** tab
- **"Groups"** tab ← Click this
- **"Environment groups"** section

### Option C: Settings Menu
- Look for a **gear icon** or **settings icon** next to variables
- Or a **"Manage groups"** link at the top

---

## Method 3: Add Variables Without Group (Temporary)

If you can't create a group, add variables directly:

1. **Add all 3 variables** (as shown in Method 1)
2. **Note the variable names** - they should be:
   - `APP_STORE_ISSUER_ID`
   - `APP_STORE_KEY_ID`
   - `APP_STORE_PRIVATE_KEY`

3. **Update codemagic.yaml** - We'll reference them directly

---

## Method 4: Check Page Structure

The Environment Variables page might have:

### Layout A: Simple Form
```
Application environment variables

Variable name: [___________]
= 
Variable value: [___________]
[Add variable]

Existing variables:
- (list appears here after adding)
```

### Layout B: With Groups Section
```
Application environment variables

[Variables] [Groups] ← Tabs

Variable name: [___________]
Variable value: [___________]
Group: [Select ▼] ← Dropdown here
[Add variable]
```

### Layout C: Advanced View
```
Application environment variables

[+ Add variable] [Manage groups] ← Buttons at top

Variable name: [___________]
Variable value: [___________]
[Add]
```

---

## What to Do Right Now

1. **Take a screenshot** of your Environment Variables page
   - This will help me see the exact UI you're seeing

2. **Or describe what you see:**
   - What buttons/fields are visible?
   - Is there a "Groups" section anywhere?
   - Are there any tabs (Variables, Groups, etc.)?

3. **Try adding a variable first:**
   - Just add one variable to see what happens
   - See if a group option appears after adding

---

## Alternative: Update codemagic.yaml to Use Individual Variables

If you can't create a group, we can update the YAML to reference variables directly. But first, let's see what your page looks like.

**Can you describe what you see on the Environment Variables page?** Or try adding one variable first and see what options appear.






