# Task Completion Checklist

When completing any task in the Buddhist Sutra App project, follow this checklist to ensure quality and consistency:

## Code Quality Checks
- [ ] TypeScript types are properly implemented for new code
- [ ] No TypeScript errors or warnings (run `npx tsc --noEmit`)
- [ ] ESLint shows no new errors or warnings (run `pnpm lint`)
- [ ] Code follows the project's style conventions
- [ ] No console.log statements left in production code (except for error logging)

## Testing and Verification
- [ ] Manual testing performed in development mode
- [ ] Feature works as expected in both light and dark modes
- [ ] Responsive layout verified on mobile, tablet, and desktop viewports
- [ ] No regressions in existing functionality
- [ ] Memory usage monitored for potential leaks (especially for ModelViewer changes)

## Performance Considerations
- [ ] No unnecessary re-renders in React components
- [ ] Large assets (images, models) optimized for size
- [ ] Server Components used where appropriate for better initial load
- [ ] Client Components marked with "use client" directive only when needed
- [ ] No blocking operations that would freeze the UI

## Developer Experience
- [ ] Code is well-commented for complex logic
- [ ] Functions and components have descriptive names
- [ ] Clear separation of concerns between files and components
- [ ] Reusable patterns extracted to shared components or hooks

## User Experience
- [ ] Loading states provided for asynchronous operations
- [ ] Error states handled gracefully with user-friendly messages
- [ ] UI is accessible (keyboard navigation, screen reader support)
- [ ] Smooth transitions between states

## Final Actions Before Marking Complete
- [ ] Run development server to verify changes (`pnpm dev`)
- [ ] Check browser console for any errors or warnings
- [ ] Test in both light and dark mode
- [ ] Verify all acceptance criteria are met
- [ ] Document any new components or major changes