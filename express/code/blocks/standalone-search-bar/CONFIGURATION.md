# Standalone Search Bar - Word Document Configuration Example

Content authors can configure the standalone search bar by creating a Word document with a table like this:

| Configuration Key | Value |
|------------------|-------|
| search-placeholder | Search for over 50,000 templates |
| search-enter-hint | Search |
| search-trends-title | Popular searches |
| search-suggestions-title | Suggestions |
| search-trends | {"Business Cards": "/express/templates/business-card", "Flyers": "/express/templates/flyer", "Logos": "/express/templates/logo"} |
| task-name-mapping | {"business": ["business", "corporate", "professional"], "social": ["social media", "instagram", "facebook"]} |
| x-task-name-mapping | {"design": ["design", "creative", "art"], "marketing": ["marketing", "promotion", "advertising"]} |
| show-free-plan | branded |

## Key Descriptions:

- **search-placeholder**: The placeholder text shown in the search input
- **search-enter-hint**: The hint text for the enter key (accessibility)
- **search-trends-title**: Title for the popular searches section
- **search-suggestions-title**: Title for the suggestions section  
- **search-trends**: JSON object mapping trend names to their URLs
- **task-name-mapping**: JSON object for task categorization
- **x-task-name-mapping**: JSON object for extended task categorization
- **show-free-plan**: Controls the free plan widget display
  - `branded` or `yes` or `true` or `on` → Shows branded free plan widget
  - `features` → Shows features free plan widget
  - `entitled` → Shows entitled free plan widget
  - `no` or `false` or `off` → No free plan widget (default)

## Usage:

1. Create a Word document with the table above
2. Publish it to SharePoint/AEM
3. Add the standalone-search-bar block to your page
4. The search bar will use your custom configuration

This approach allows content authors to directly modify search bar behavior without requiring developer changes!
