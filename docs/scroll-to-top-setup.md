# ScrollToTop System Setup Guide

This guide explains how to use the automatic scroll-to-top functionality that ensures users always start at the top when navigating between pages.

## 🎯 Overview

The ScrollToTop system automatically scrolls to the top of the page on every route change, solving the common UX issue where users remain at the bottom of the page after clicking navigation links.

## 🚀 Features

- **Automatic scrolling** on route changes
- **Smooth scrolling** by default (configurable)
- **Route-specific behavior** (smooth vs instant)
- **Performance optimized** with React hooks
- **Preserves in-page navigation** (hash links)
- **Global coverage** across all routes
- **Manual control** when needed

## 📱 How It Works

### 1. Automatic Behavior

The `ScrollToTop` component is integrated into your router and automatically:
- Detects route changes using `useLocation`
- Scrolls to the top of the page
- Uses smooth scrolling for better UX
- Preserves in-page anchor navigation

### 2. Configuration Options

```typescript
<ScrollToTop 
  smooth={true}                           // Enable smooth scrolling
  instantScrollRoutes={['/dashboard']}     // Routes that scroll instantly
  customScrollBehavior={{                  // Custom behavior per route
    '/profile': 'smooth',
    '/admin': 'instant'
  }}
  scrollOnHashChange={false}              // Don't scroll on hash changes
/>
```

## ⚙️ Configuration

### Basic Usage

```typescript
// In your router setup
import { ScrollToTop } from '../components/ScrollToTop';

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <RouterProvider router={router} />
    </>
  );
}
```

### Advanced Configuration

```typescript
<ScrollToTop 
  smooth={true}
  instantScrollRoutes={['/dashboard', '/admin', '/analytics']}
  customScrollBehavior={{
    '/profile': 'smooth',
    '/settings': 'smooth',
    '/admin/users': 'instant'
  }}
  scrollOnHashChange={false}
/>
```

### Route Behavior Examples

| Route Pattern | Behavior | Use Case |
|---------------|----------|----------|
| `/` | Smooth | Homepage - smooth transition |
| `/about` | Smooth | Content pages - smooth transition |
| `/dashboard` | Instant | Admin panels - immediate feedback |
| `/profile` | Smooth | User settings - smooth transition |
| `/admin/*` | Instant | Admin routes - instant navigation |

## 🎮 Manual Control

### Using the Hook

```typescript
import { useScrollToTop } from '../lib/hooks/useScrollToTop';

function MyComponent() {
  const { scrollToTop, scrollToElement } = useScrollToTop();

  const handleButtonClick = () => {
    // Scroll to top when button is clicked
    scrollToTop();
  };

  const handleSectionClick = () => {
    // Scroll to specific section
    scrollToElement('#contact-section');
  };

  return (
    <div>
      <button onClick={handleButtonClick}>
        Back to Top
      </button>
      <button onClick={handleSectionClick}>
        Go to Contact
      </button>
    </div>
  );
}
```

### Available Methods

- `scrollToTop(behavior?)` - Scroll to top with optional behavior
- `scrollToTopInstant()` - Instant scroll to top
- `scrollToElement(selector, behavior?)` - Scroll to element
- `scrollToElementInstant(selector)` - Instant scroll to element
- `scrollToPosition(top, left?, behavior?)` - Scroll to specific position

## 🔧 Customization

### Custom Scroll Behavior

```typescript
// Define custom behavior for specific routes
const customScrollBehavior = {
  '/landing': 'instant',      // Landing pages - instant
  '/blog': 'smooth',          // Blog posts - smooth
  '/admin': 'instant',        // Admin - instant
  '/profile': 'smooth'        // Profile - smooth
};

<ScrollToTop customScrollBehavior={customScrollBehavior} />
```

### Instant Scroll Routes

```typescript
// Routes that should scroll instantly (no animation)
const instantScrollRoutes = [
  '/dashboard',
  '/admin',
  '/analytics',
  '/reports'
];

<ScrollToTop instantScrollRoutes={instantScrollRoutes} />
```

### Hash Change Handling

```typescript
// Enable scrolling on hash changes (in-page navigation)
<ScrollToTop scrollOnHashChange={true} />
```

## 📱 Browser Compatibility

### Supported Features

- ✅ Smooth scrolling (`scroll-behavior: smooth`)
- ✅ `window.scrollTo()` with behavior option
- ✅ `Element.scrollIntoView()` with behavior option
- ✅ React Router v6 navigation events

### Fallback Behavior

For browsers that don't support smooth scrolling:
- Falls back to instant scrolling
- Maintains functionality
- Graceful degradation

## 🧪 Testing

### Test Scenarios

1. **Route Navigation**
   - Click navigation links
   - Verify page scrolls to top
   - Check smooth scrolling behavior

2. **Hash Navigation**
   - Click in-page anchor links
   - Verify no unwanted scrolling
   - Test with `scrollOnHashChange={true}`

3. **Performance**
   - Navigate between routes quickly
   - Check for smooth performance
   - Verify no memory leaks

4. **Mobile Testing**
   - Test on mobile devices
   - Verify touch navigation works
   - Check scroll behavior on small screens

### Debug Mode

```typescript
// Add console logs for debugging
<ScrollToTop 
  smooth={true}
  onScroll={(pathname) => console.log('Scrolling to top for:', pathname)}
/>
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Not Scrolling to Top

**Problem**: Page doesn't scroll to top on navigation
**Solution**: Check if `ScrollToTop` component is properly imported and placed in router

#### 2. Smooth Scrolling Not Working

**Problem**: Scrolling is instant instead of smooth
**Solution**: Verify browser supports `scroll-behavior: smooth`

#### 3. Conflicts with Other Scroll Libraries

**Problem**: ScrollToTop conflicts with other scroll libraries
**Solution**: Disable ScrollToTop for specific routes or use manual control

#### 4. Performance Issues

**Problem**: Scrolling feels sluggish
**Solution**: Use `instantScrollRoutes` for performance-critical routes

### Debug Steps

1. **Check Console**
   - Look for ScrollToTop logs
   - Verify route changes are detected

2. **Verify Component Placement**
   - Ensure ScrollToTop is in router setup
   - Check import paths

3. **Test Route Changes**
   - Navigate between different routes
   - Verify scroll behavior

4. **Check Browser Support**
   - Test in different browsers
   - Verify smooth scrolling support

## 🔒 Best Practices

### 1. Performance

- Use instant scrolling for admin/dashboard routes
- Avoid unnecessary re-renders
- Optimize for mobile devices

### 2. User Experience

- Smooth scrolling for content pages
- Instant scrolling for functional pages
- Consistent behavior across routes

### 3. Accessibility

- Maintain keyboard navigation
- Don't interfere with screen readers
- Respect user preferences

### 4. Mobile Optimization

- Test on various screen sizes
- Consider mobile scroll performance
- Optimize for touch navigation

## 🚀 Future Enhancements

### Planned Features

- **Scroll position memory** - Remember scroll position per route
- **Custom scroll animations** - Advanced easing functions
- **Scroll analytics** - Track user scroll behavior
- **A/B testing** - Test different scroll behaviors

### Scalability

- **Route groups** - Configure behavior for route patterns
- **Dynamic configuration** - Change behavior based on user preferences
- **Performance monitoring** - Track scroll performance metrics

## 📞 Support

If you encounter issues:

1. **Check this documentation** for common solutions
2. **Verify component placement** in router setup
3. **Test with minimal configuration** to isolate issues
4. **Check browser console** for error messages
5. **Contact the development team** with specific error information

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Automatic scroll to top on route changes
- ✅ Smooth scrolling with fallback
- ✅ Route-specific behavior configuration
- ✅ Performance optimization
- ✅ Comprehensive documentation

### Future Versions
- 🔄 Scroll position memory
- 🔄 Advanced animations
- 🔄 Analytics integration
- 🔄 Performance monitoring
