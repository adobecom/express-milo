# Testing Slack Notifications Before Merge

This guide shows you how to test the Slack notification workflows before merging to main.

## 🚀 **Quick Test Steps**

### **Step 1: Set Up Secrets (Required)**
1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   SLACK_CHANNEL=#your-test-channel  # Optional, defaults to #express-releases
   ```

### **Step 2: Test the Integration**
1. Go to **Actions** tab in your repository
2. Find **"Test Slack Notification"** workflow
3. Click **"Run workflow"**
4. Enter a test message like: `"Testing Express Milo Slack integration"`
5. Click **"Run workflow"**
6. Check your Slack channel for the notification

## 🧪 **Testing Methods**

### **Method 1: Manual Test Workflow (Safest)**
```bash
# This workflow is already created and ready to use
# Go to Actions → Test Slack Notification → Run workflow
```
**Pros**: Safe, doesn't affect main branch, immediate feedback
**Cons**: Requires manual trigger

### **Method 2: Test Branch Push**
```bash
# Create a test branch
git checkout -b test-slack-notifications
git push origin test-slack-notifications

# Make a test commit
git commit --allow-empty -m "test: trigger slack notification"
git push origin test-slack-notifications
```
**Note**: This won't trigger the release notification (only triggers on main), but you can test the PR merge notification.

### **Method 3: Test PR Merge**
```bash
# Create a test PR to main
git checkout -b test-pr-slack
git commit --allow-empty -m "test: PR for slack notification testing"
git push origin test-pr-slack

# Create PR on GitHub, then merge it
# This will trigger the PR merge notification
```

### **Method 4: Local Webhook Testing**
```bash
# Test your webhook URL directly
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🧪 Test message from Express Milo","attachments":[{"color":"good","fields":[{"title":"Test","value":"This is a test notification","short":false}]}]}' \
  YOUR_WEBHOOK_URL
```

## 🔍 **What to Test**

### **Test Workflow Features:**
- [ ] Webhook URL is valid
- [ ] Message appears in correct channel
- [ ] Formatting looks good (colors, fields, icons)
- [ ] Links work correctly
- [ ] Timestamps are accurate

### **Release Notification Features:**
- [ ] Triggers on main branch pushes
- [ ] Shows commit details
- [ ] Displays recent changes
- [ ] Extracts PR numbers
- [ ] Excludes documentation changes

### **PR Merge Notification Features:**
- [ ] Triggers on PR merges to main
- [ ] Analyzes PR type correctly
- [ ] Shows PR statistics
- [ ] Displays deployment status
- [ ] Color coding works

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **"SLACK_WEBHOOK_URL secret is not set"**
   - Add the webhook URL as a repository secret
   - Make sure it's named exactly `SLACK_WEBHOOK_URL`

2. **"No notification received"**
   - Check the webhook URL is correct
   - Verify the channel exists in Slack
   - Check the Actions tab for error logs

3. **"Wrong channel"**
   - Update the `SLACK_CHANNEL` secret
   - Or modify the workflow file

4. **"Workflow not running"**
   - Check if you're on the right branch
   - Verify the workflow file is committed
   - Check repository permissions

### **Debug Steps:**

1. **Check workflow runs:**
   - Go to Actions tab
   - Look for your workflow runs
   - Click on failed runs to see logs

2. **Test webhook manually:**
   ```bash
   curl -X POST -H 'Content-type: application/json' \
     --data '{"text":"Test"}' \
     YOUR_WEBHOOK_URL
   ```

3. **Check secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Verify secrets are set correctly

## 📋 **Test Checklist**

Before merging to main:

- [ ] Test workflow runs successfully
- [ ] Slack notification appears in correct channel
- [ ] Message formatting looks good
- [ ] All links work correctly
- [ ] No error messages in workflow logs
- [ ] Webhook URL is valid and accessible
- [ ] Channel permissions are correct

## 🎯 **Recommended Testing Sequence**

1. **Start with test workflow** (safest)
2. **Test webhook URL manually** (quick validation)
3. **Create test PR and merge** (full PR workflow test)
4. **Make test commit to main** (full release workflow test)
5. **Verify all notifications work** (final validation)

## 🚨 **Safety Notes**

- The test workflow is safe and won't affect production
- Test PRs can be deleted after testing
- Test commits to main should be minimal and can be reverted
- Always test in a development channel first

## 📞 **Need Help?**

If you encounter issues:
1. Check the Actions tab for detailed error logs
2. Verify your Slack webhook configuration
3. Test with the manual curl command
4. Check repository secrets are set correctly

The workflows are designed to be robust and provide clear error messages to help with debugging.
