# Relawan Dashboard Development Guidelines

## 🎯 Project Overview
This is a **Waqf Software** project dedicated as Islamic endowment for charitable volunteer management. All development must align with Islamic principles and serve the Muslim Ummah.

## 🕌 Islamic Principles
- All code and features must comply with Shari'ah
- No commercial exploitation - this is perpetual Waqf
- Serve charitable and humanitarian purposes only
- Maintain integrity and transparency in all implementations

## 🛠️ Technical Guidelines

### Code Quality
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Implement proper error handling and user feedback
- Write clean, readable, and maintainable code
- Use meaningful variable and function names

### UI/UX Standards
- Mobile-first responsive design
- Use TailwindCSS for styling consistency
- Follow the established component patterns in `/src/components/ui/`
- Maintain accessibility standards (ARIA labels, semantic HTML)
- Test on both mobile and desktop viewports

### Backend Integration
- Use the established API patterns in `/src/lib/backendConfig.ts`
- Handle both Convex and Supabase backends based on `BACKEND_PROVIDER`
- Implement proper loading states and error handling
- Use snake_case field names for backend consistency
- Convert timestamps properly (milliseconds to Date objects)

### Data Handling
- Never commit sensitive data (API keys, credentials, personal info)
- Use environment variables for all configuration
- Implement proper data validation and sanitization
- Follow the snake_case naming convention for backend fields
- Handle date formatting consistently across the app

## 📱 Mobile Development
- Prioritize mobile user experience
- Touch-friendly interface elements
- Optimize for performance on mobile devices
- Test on various screen sizes
- Implement proper offline handling where needed

## 🔒 Security & Privacy
- Never expose API keys or sensitive configuration
- Implement proper authentication flows
- Validate all user inputs
- Use secure storage for sensitive data
- Follow OWASP security guidelines

## 🎨 Design System
- Use established color palette from TailwindCSS
- Maintain consistent spacing and typography
- Use shadcn/ui components when available
- Create reusable components for common patterns
- Follow the established icon and imagery guidelines

## 📝 Documentation
- Update README.md for major features
- Document API endpoints in BACKEND_CONFIG.md
- Include examples for complex components
- Maintain clear commit messages
- Update this guidelines file when standards change

## 🧪 Testing
- Test all major user flows
- Verify mobile responsiveness
- Test backend integrations thoroughly
- Check error handling scenarios
- Validate form inputs and edge cases

## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
