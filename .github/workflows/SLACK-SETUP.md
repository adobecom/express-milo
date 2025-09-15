# Slack Release Notifications Setup

This guide explains how to set up Slack notifications for Express Milo releases and PR merges.

## 🚀 Features

### Release Notification Workflow (`slack-release-notification.yml`)
- Triggers on pushes to `main` branch
- Sends detailed commit information
- Shows recent changes and file modifications
- Extracts PR numbers from commit messages
- Provides release summary

### PR Merge Notification Workflow (`slack-pr-merge-notification.yml`)
- Triggers when PRs are merged to `main`
- Analyzes PR type (Feature, Bug Fix, Improvement, etc.)
- Shows detailed PR statistics
- Provides deployment status

## 🔧 Setup Instructions

### 1. Create Slack Webhook

1. Go to your Slack workspace
2. Navigate to **Apps** → **Incoming Webhooks**
3. Click **Add to Slack**
4. Choose the channel where you want notifications (e.g., `#express-releases`)
5. Copy the webhook URL

### 2. Configure GitHub Secrets

Add these secrets to your repository:

```bash
# Required
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Optional (defaults to #express-releases)
SLACK_CHANNEL=#your-channel-name
```

**To add secrets:**
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret with the appropriate value

### 3. Test the Workflows

#### Test Release Notification:
```bash
# Make a test commit to main
git checkout main
git commit --allow-empty -m "test: trigger release notification"
git push origin main
```

#### Test PR Merge Notification:
1. Create a test PR to main
2. Merge the PR
3. Check Slack for notification

## 📋 Workflow Details

### Release Notification Triggers
- **When**: Push to `main` branch
- **Excludes**: Documentation-only changes (README.md, docs/, *.md)
- **Content**: Commit details, recent changes, file modifications

### PR Merge Notification Triggers
- **When**: PR closed and merged to `main`
- **Content**: PR details, statistics, deployment status

## 🎨 Customization

### Modify Notification Content

Edit the `custom_payload` sections in the workflow files to customize:
- Message format
- Colors
- Fields displayed
- Icons and emojis

### Change Trigger Conditions

Modify the `on:` sections to change when notifications are sent:
```yaml
on:
  push:
    branches: [main, develop]  # Add more branches
    paths-ignore:              # Exclude more paths
      - 'docs/**'
      - '*.md'
```

### Add More Channels

Create multiple workflows for different channels:
```yaml
env:
  SLACK_CHANNEL: '#dev-team'  # Different channel per workflow
```

## 🔍 Troubleshooting

### Common Issues

1. **No notifications received**
   - Check webhook URL is correct
   - Verify secrets are properly set
   - Check workflow runs in Actions tab

2. **Notifications in wrong channel**
   - Update `SLACK_CHANNEL` secret
   - Or modify the `channel` field in workflow

3. **Too many notifications**
   - Add more paths to `paths-ignore`
   - Modify trigger conditions

### Debug Steps

1. Check workflow runs: **Actions** tab
2. View logs for error messages
3. Test webhook manually with curl:
   ```bash
   curl -X POST -H 'Content-type: application/json' \
     --data '{"text":"Test message"}' \
     YOUR_WEBHOOK_URL
   ```

## 📊 Example Notifications

### Release Notification
```
🚀 Express Milo Release Deployed
Repository: adobecom/express-milo
Branch: main
Commit: abc123 (clickable link)
Author: developer@adobe.com
Commit Message: feat: add carousel navigation improvements

📋 Recent Changes:
Recent Commits:
- feat: add carousel navigation improvements
- fix: resolve focus management issues
- test: add comprehensive keyboard tests

Changed Files: template-x-promo.js, template-x-promo.css, test.js
```

### PR Merge Notification
```
🚀 Feature: PR #123 Merged
PR Title: Add carousel navigation improvements
Author: developer@adobe.com
Merged By: reviewer@adobe.com
Branch: feature/carousel-nav → main
Changes: 📊 5 commits, 3 files changed
➕ 150 additions, ➖ 25 deletions

🚀 Deployment Status
Status: ✅ Successfully merged to main branch
Next Steps: 🔄 Changes will be deployed to production automatically
```

## 🎯 Best Practices

1. **Use meaningful commit messages** - They appear in notifications
2. **Include PR numbers in commits** - Automatically extracted
3. **Keep notifications focused** - Use path filters to avoid noise
4. **Test thoroughly** - Verify notifications work before relying on them
5. **Monitor channel activity** - Adjust frequency if needed

## 🔒 Security

- Webhook URLs are stored as encrypted secrets
- Only repository maintainers can modify workflows
- Notifications don't expose sensitive information
- Consider using Slack apps for more secure integrations

## 📞 Support

For issues with these workflows:
1. Check the Actions tab for error logs
2. Verify Slack webhook configuration
3. Test with a simple commit first
4. Contact the Express Milo team for assistance
