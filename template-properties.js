// JavaScript object containing all properties used by the template variable
// Based on analysis of template-rendering.js

const template = {
  // Core template identification
  id: "template-id-string", // Used for iframe src, modal id, tracking, and CSS class generation
  
  // Asset type classification
  assetType: "Webpage_Template", // Special handling for webpage templates (sets empty pages array)
  
  // Licensing and access control
  licensingCategory: "free", // Values: "free" | "premium" - determines plan icon display
  
  // Title information (multiple sources)
  "dc:title": {
    "i-default": "Template Title String" // Primary title source
  },
  
  // Content categorization
  moods: ["mood1", "mood2"], // Array of mood strings for title generation
  task: {
    name: "task-name" // Task name combined with moods for title
  },
  
  // API endpoints for rendering
  _links: {
    "http://ns.adobe.com/adobecloud/rel/rendition": {
      href: "https://rendition-url-template{&page,size,type,fragment}" // Template URL for image/video renditions
    },
    "http://ns.adobe.com/adobecloud/rel/component": {
      href: "https://component-url-template{&revision,component_id}" // Template URL for component access
    }
  },
  
  // User interaction URLs
  customLinks: {
    branchUrl: "https://branch-url" // Used for edit buttons and sharing functionality
  },
  
  // Template content pages
  pages: [
    {
      rendition: {
        // Image content
        image: {
          thumbnail: {
            mediaType: "image/webp", // Format: "image/webp" | "image/jpeg" | etc.
            componentId: "component-uuid", // Unique identifier for the component
            width: 1080, // Image width in pixels
            height: 1920, // Image height in pixels
            hzRevision: 0 // Revision number for component versioning
          }
        },
        // Video content (optional)
        video: {
          thumbnail: {
            componentId: "video-component-uuid" // Unique identifier for video component
          }
        }
      }
    }
    // Additional pages for multi-page templates...
  ]
};

export default template;
