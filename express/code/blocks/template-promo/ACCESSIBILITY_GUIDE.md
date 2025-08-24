# Template Promo Block - Accessibility Guide

## Overview

This guide documents the comprehensive accessibility improvements implemented in the Template Promo block, covering screen readers, keyboard navigation, mobile accessibility, and visual accessibility features.

## 🎯 Accessibility Improvements Implemented

### 1. Screen Reader Support

#### ARIA Landmarks and Roles
- **Main landmark**: Added `role="main"` for single template view
- **Region landmark**: Added `role="region"` for multi-template gallery
- **Article roles**: Each template container has `role="article"`
- **Group roles**: Button containers have `role="group"`
- **Status roles**: Template type indicators have `role="status"`

#### Live Regions
- **Dynamic content announcements**: Live regions announce template loading states
- **Navigation instructions**: Screen readers receive context about available actions
- **Template count information**: Users know how many templates are available

#### Enhanced Descriptions
- **Aria-describedby**: Buttons link to detailed template descriptions
- **Template context**: Screen readers understand template type and purpose
- **Action guidance**: Clear instructions for what each button does

### 2. Keyboard Navigation

#### Skip Links
- **Template-specific skip links**: Jump directly to any template
- **Keyboard-only visibility**: Skip links appear only on focus
- **Logical tab order**: Consistent navigation flow

#### Enhanced Keyboard Controls
- **Arrow key navigation**: Navigate between templates with arrow keys
- **Home/End keys**: Jump to first/last template
- **Enter/Space activation**: Activate templates with keyboard
- **Focus management**: Clear focus indicators and logical flow

#### Focus Indicators
- **High contrast outlines**: 2-3px focus rings with offset
- **Color-coded focus**: Different focus styles for different element types
- **Focus-visible**: Focus only shows when using keyboard

### 3. Mobile Accessibility

#### Touch Target Sizes
- **44px minimum**: All interactive elements meet WCAG touch target requirements
- **Enhanced padding**: Larger touch areas on mobile devices
- **Gesture support**: Touch-friendly interactions

#### Mobile-First Design
- **Responsive breakpoints**: Optimized for all screen sizes
- **Touch-friendly spacing**: Adequate spacing between interactive elements
- **Mobile navigation**: Optimized keyboard navigation for mobile devices

### 4. Visual Accessibility

#### Color and Contrast
- **Enhanced contrast**: Improved color ratios for better visibility
- **High contrast mode**: Support for system high contrast preferences
- **Dark theme support**: Automatic adaptation to dark color schemes

#### Focus Visibility
- **Clear focus indicators**: High contrast outlines for keyboard users
- **Focus offset**: Focus rings don't overlap with content
- **Multiple focus styles**: Different styles for different element types

#### Reduced Motion
- **Motion preferences**: Respects `prefers-reduced-motion` setting
- **Animation alternatives**: Static alternatives for motion-sensitive users
- **Performance optimization**: Reduced motion improves performance

## 🧪 Testing Guidelines

### Automated Testing

#### Axe Core Testing
```bash
# Install axe-core
npm install axe-core

# Run accessibility tests
npx axe test/blocks/template-promo/mocks/body.html
```

#### Lighthouse Accessibility Audit
```bash
# Run Lighthouse audit
npx lighthouse test/blocks/template-promo/mocks/body.html --only-categories=accessibility
```

### Manual Testing Checklist

#### Screen Reader Testing
- [ ] **NVDA (Windows)**: Test with NVDA screen reader
- [ ] **JAWS (Windows)**: Test with JAWS screen reader
- [ ] **VoiceOver (macOS)**: Test with VoiceOver
- [ ] **TalkBack (Android)**: Test with TalkBack
- [ ] **Voice Control (iOS)**: Test with Voice Control

#### Keyboard Navigation Testing
- [ ] **Tab navigation**: All elements reachable via Tab
- [ ] **Arrow key navigation**: Arrow keys work as expected
- [ ] **Enter/Space activation**: Interactive elements activate properly
- [ ] **Focus indicators**: Clear focus visibility
- [ ] **Skip links**: Skip links function correctly

#### Mobile Testing
- [ ] **Touch targets**: All interactive elements ≥44px
- [ ] **Gesture support**: Touch interactions work smoothly
- [ ] **Orientation**: Works in portrait and landscape
- [ ] **Zoom support**: Functions at 200% zoom
- [ ] **Mobile screen readers**: Test with mobile assistive technology

#### Visual Accessibility Testing
- [ ] **Color contrast**: Meets WCAG AA standards
- [ ] **High contrast mode**: Functions in high contrast
- [ ] **Reduced motion**: Respects motion preferences
- [ ] **Focus visibility**: Clear focus indicators
- [ ] **Print styles**: Accessible when printed

### Testing Tools

#### Browser Developer Tools
- **Chrome DevTools**: Accessibility panel and audits
- **Firefox DevTools**: Accessibility inspector
- **Safari Web Inspector**: Accessibility features
- **Edge DevTools**: Accessibility testing tools

#### Accessibility Extensions
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Color Contrast Analyzer**: Color contrast testing
- **Focus Indicator**: Focus visibility testing

## 🚨 Common Accessibility Issues

### 1. Missing Alt Text
**Issue**: Images without descriptive alt text
**Solution**: Ensure all images have meaningful alt attributes
**Test**: Use screen reader to verify image descriptions

### 2. Insufficient Color Contrast
**Issue**: Text doesn't meet contrast requirements
**Solution**: Use color contrast tools to verify ratios
**Test**: Check in high contrast mode

### 3. Missing Focus Indicators
**Issue**: No visible focus for keyboard users
**Solution**: Implement clear focus styles
**Test**: Navigate with Tab key

### 4. Touch Target Too Small
**Issue**: Interactive elements <44px
**Solution**: Increase touch target sizes
**Test**: Verify on mobile devices

### 5. Missing ARIA Labels
**Issue**: Screen readers lack context
**Solution**: Add appropriate ARIA attributes
**Test**: Use screen reader to verify

## 📱 Mobile-Specific Considerations

### Touch Interactions
- **Minimum 44px touch targets**
- **Adequate spacing between elements**
- **Gesture-friendly interactions**
- **Mobile-optimized navigation**

### Mobile Screen Readers
- **VoiceOver (iOS) compatibility**
- **TalkBack (Android) compatibility**
- **Mobile navigation patterns**
- **Touch gesture announcements**

### Responsive Design
- **Breakpoint optimization**
- **Mobile-first approach**
- **Touch-friendly layouts**
- **Performance optimization**

## 🎨 Visual Design Accessibility

### Color Usage
- **High contrast ratios**
- **Color-independent information**
- **Dark theme support**
- **High contrast mode compatibility**

### Typography
- **Readable font sizes**
- **Adequate line spacing**
- **Clear font hierarchy**
- **Legible font choices**

### Layout
- **Logical content flow**
- **Consistent spacing**
- **Clear visual hierarchy**
- **Predictable layouts**

## 🔧 Implementation Notes

### ARIA Best Practices
- **Use semantic HTML first**
- **Add ARIA only when necessary**
- **Test with screen readers**
- **Validate ARIA usage**

### Performance Considerations
- **Minimize DOM manipulation**
- **Efficient event handling**
- **Optimized animations**
- **Reduced motion support**

### Browser Compatibility
- **Modern browser support**
- **Progressive enhancement**
- **Feature detection**
- **Fallback strategies**

## 📋 Compliance Standards

### WCAG 2.1 AA Compliance
- **Perceivable**: Content accessible to all users
- **Operable**: Functionality available via multiple input methods
- **Understandable**: Clear and predictable interface
- **Robust**: Works with current and future technologies

### Section 508 Compliance
- **Federal accessibility requirements**
- **Government website standards**
- **Accessibility guidelines**
- **Compliance testing**

### International Standards
- **EN 301 549 (Europe)**
- **JIS X 8341 (Japan)**
- **AS EN 301 549 (Australia)**
- **Local accessibility laws**

## 🚀 Future Enhancements

### Planned Improvements
- **Advanced keyboard shortcuts**
- **Voice command support**
- **Haptic feedback integration**
- **AI-powered accessibility**

### Research Areas
- **Emerging assistive technologies**
- **New accessibility standards**
- **User experience research**
- **Performance optimization**

## 📞 Support and Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)

### Testing Resources
- [axe-core](https://github.com/dequelabs/axe-core)
- [WAVE Web Accessibility Tool](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### Community
- [Web Accessibility Slack](https://web-a11y.slack.com/)
- [A11y Project](https://www.a11yproject.com/)
- [Accessibility Developer Guide](https://www.accessibility-developer-guide.com/)

---

**Last Updated**: [Current Date]
**Version**: 1.0
**Maintainer**: Accessibility Team
