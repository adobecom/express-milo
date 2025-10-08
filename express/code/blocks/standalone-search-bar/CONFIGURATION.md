# Standalone Search Bar - Hybrid Configuration Example

The standalone search bar uses a **hybrid configuration approach**:
- **Word Document**: Page-specific settings (placeholder text, widget display)
- **Centralized System**: Global data (trends, task mappings)

## Word Document Configuration

Content authors can configure page-specific settings by creating a Word document with a table like this:

| Configuration Key | Value |
|------------------|-------|
| search-placeholder | Search for over 50,000 templates |
| search-enter-hint | Search |
| show-free-plan | yes |

## Centralized Configuration Keys

These are managed through the centralized placeholder system (spreadsheet/CMS):

| Configuration Key | Source | Description |
|------------------|--------|-------------|
| search-trends-title | Centralized | Title for popular searches section |
| search-trends | Centralized | JSON object mapping trend names to URLs |
| search-suggestions-title | Centralized | Title for suggestions section |
| task-name-mapping | Centralized | JSON object for task categorization |
| x-task-name-mapping | Centralized | JSON object for extended task categorization |

## Key Descriptions:

### **Word Document Keys (Page-Specific):**
- **search-placeholder**: The placeholder text shown in the search input
- **search-enter-hint**: The hint text for the enter key (accessibility)
- **show-free-plan**: Controls the free plan widget display
  - `yes` or `on` → Shows branded free plan widget
  - `no` or `off` → No free plan widget (default)

### **Centralized Keys (Global):**
- **search-trends-title**: Title for the popular searches section
- **search-suggestions-title**: Title for the suggestions section  
- **search-trends**: JSON object mapping trend names to their URLs
  - Example: `{"Business Cards": "/express/templates/business-card", "Logos": "/express/templates/logo"}`
- **task-name-mapping**: JSON object for task categorization
  - Example: `{"business": ["business", "corporate", "professional"]}`
- **x-task-name-mapping**: JSON object for extended task categorization
  - Example: `{"design": ["design", "creative", "art"]}`

## Usage:

1. **For Page-Specific Settings**: Create a Word document with the table above
2. **For Global Settings**: Update values in the centralized placeholder system
3. Publish the Word document to SharePoint/AEM
4. Add the standalone-search-bar block to your page
5. The search bar will use both configuration sources

This hybrid approach gives content authors control over page-specific elements while maintaining consistency for global data!
