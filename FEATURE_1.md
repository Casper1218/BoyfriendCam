# Feature 1: Reference Photo Gallery

**Status**: ✅ Core Development Complete
**Branch**: `feature/reference-gallery`
**Next**: Additional sub-features or move to Feature 2

---

## Objective

Provide visual reference examples without switching apps. Serves as baseline solution and learning tool for Feature 2.

---

## Core Implementation Status

### Phase 1: Component Foundation ✅
- [x] Create branch: `git checkout -b feature/reference-gallery`
- [x] Create `components/ReferenceGallery.tsx` file
- [x] Define TypeScript interfaces (props, state)
- [x] Set up basic component structure
- [x] Test: Component renders without errors

### Phase 2: Photo Loading System ✅
- [x] Create photo loading utility function
- [x] Implement dynamic require for subdirectories
- [x] Handle missing categories gracefully (portrait-full-indoors)
- [x] Handle empty categories
- [x] Store loaded references in state
- [x] Test: Photos load correctly for all 12 categories

### Phase 3: Thumbnail Display ✅
- [x] Position thumbnail bottom-right (100x150px - increased for better usability)
- [x] Add 16px margins from edges
- [x] Style: 2px white border with shadow
- [x] Display current reference image
- [x] Add swipe indicator UI (photo counter)
- [x] Test: Thumbnail visible and doesn't block subject (verified on device)

### Phase 4: Swipe Gesture Implementation ✅
- [x] Set up PanResponder for touch handling
- [x] Implement horizontal swipe detection (50px threshold)
- [x] Navigate between references on swipe
- [x] Add smooth fade animation (100ms fade out/in)
- [x] Show image counter (e.g., "2/4")
- [x] Prevent accidental vertical scrolling
- [x] Fix closure bug - use refs for PanResponder to access current state
- [x] Test: Smooth swiping between all references (verified on device)

### Phase 5: Tap-to-Expand Feature ✅
- [x] Detect tap on thumbnail
- [x] Create overlay component (dark background rgba(0,0,0,0.85))
- [x] Display image at 50% screen width, centered
- [x] Maintain aspect ratio
- [x] Implement tap-to-dismiss anywhere
- [x] Add close button as backup
- [x] Test: Expand/collapse works smoothly

### Phase 6: Camera Integration ✅
- [x] Import ReferenceGallery in `app/camera.tsx`
- [x] Pass scenario and location from route params
- [x] Position overlay correctly on camera preview
- [x] Add performance optimization comments to code
- [x] Verify functionality on iOS device

---

## Potential Sub-Features / Enhancements

Ideas for extending Feature 1 before moving to Feature 2:
- [ ] Add grid overlay toggle (rule of thirds) - controlled via dev panel
- [ ] Save favorite references for quick access
- [ ] Add photo metadata display (camera settings used)
- [ ] Implement double-tap to cycle through photos quickly
- [ ] Add haptic feedback on swipe
- [ ] Customize thumbnail size via settings

---

## Future Testing & Polish

*To be conducted when prioritizing completeness and production readiness*

### Performance Testing
- [ ] Test camera maintains 30fps on Android device
- [ ] Verify no lag during all interactions on both platforms
- [ ] Camera FPS with thumbnail visible
- [ ] Camera FPS during swipe
- [ ] Camera FPS with expanded view
- [ ] Memory usage check
- [ ] Stress testing: rapid interactions

### Edge Case Handling
- [ ] Handle missing category directories gracefully
- [ ] Handle empty categories (show helpful message)
- [ ] Handle image loading errors
- [ ] Add fallback UI for all error states
- [ ] Test: App doesn't crash with missing data

### Comprehensive Testing
- [ ] Test all 12 category combinations
- [ ] Verify animations are smooth across devices
- [ ] Check performance metrics (30fps maintained)
- [ ] Test on physical Android device (mid-range)
- [ ] Test on various iOS devices
- [ ] Navigation between scenario/location selections
- [ ] Camera permissions + reference gallery interaction

### Real-World User Testing
- [ ] Take baseline photos WITHOUT references
- [ ] Take photos WITH references visible
- [ ] Document what was unclear when matching reference
- [ ] Document what adjustments were hard to judge
- [ ] Document what instructions would have helped
- [ ] Get subject feedback on usefulness
- [ ] Validate Feature 1 helps improve photo quality

### Code Quality & Deployment
- [ ] Self code review
- [ ] Final testing on both platforms
- [ ] Merge to main: `git checkout main && git merge feature/reference-gallery`
- [ ] Push: `git push origin main`
- [ ] Mark Feature 1 as complete in README
- [ ] Update documentation with learnings

---

## Technical Notes

### Photo Loading Pattern
```typescript
// Dynamic loading from subdirectories
const loadReferences = (scenario: string, location: string) => {
  const category = `${scenario}-${location}`;
  const references = [];

  try {
    let i = 1;
    while (true) {
      try {
        const img = require(`@/assets/images/photos/${category}/${i}.jpg`);
        references.push(img);
        i++;
      } catch {
        break; // No more images
      }
    }
  } catch (error) {
    console.warn(`Category ${category} not found`);
  }

  return references;
};
```

### Performance Targets
- Camera preview: 30 FPS (non-negotiable)
- Reference switch: <100ms
- Swipe response: <50ms
- Expand animation: 200ms smooth

### Missing Categories to Handle
- `portrait-full-indoors` (0 images) - show placeholder message

---

## Testing Checklist

### Unit Testing
- [ ] Photo loading with valid category
- [ ] Photo loading with missing category
- [ ] Photo loading with empty category
- [ ] Swipe detection with various speeds
- [ ] Tap detection vs swipe detection

### Integration Testing
- [ ] All 11 categories load correctly
- [ ] Navigation between scenario/location selections
- [ ] Camera permissions + reference gallery
- [ ] Reference gallery + taking photos

### Performance Testing
- [ ] Camera FPS with thumbnail visible
- [ ] Camera FPS during swipe
- [ ] Camera FPS with expanded view
- [ ] Memory usage check

### Real-World Testing (Saturday)
- [ ] Take 10 baseline photos without references
- [ ] Take 10 photos with references
- [ ] Document what was unclear
- [ ] Document what adjustments were hard
- [ ] Document what instructions would help
- [ ] Get subject feedback

---

## Known Issues / Decisions

### Phase 1 (2024-11-24)
- **Decision**: Component positioned inside CameraView for proper overlay layering
- **Decision**: Used placeholder text for Phase 1 to verify rendering without photo loading
- **Success**: TypeScript interfaces cleanly separate props and internal state
- **Success**: Component integrates smoothly with existing camera.tsx structure

### Phase 2 (2024-11-24)
- **Decision**: Created explicit asset mapping in utils/referencePhotos.ts due to Metro bundler static requirements
- **Discovery**: All 12 categories have photos (portrait-full-indoors has 19 images, contrary to earlier note)
- **Implementation**: 135 total images mapped across all categories
- **Success**: Error handling for missing categories via getReferencePhotos() utility
- **Success**: Photo counter overlay shows current position (e.g., "1/19")

### Phase 3 (2024-11-24)
- **Implementation**: Thumbnail displays actual reference photo with counter overlay
- **Styling**: 80x120px with 2px white border, shadow, and 16px margins (via absolute positioning)
- **Note**: Swipe gesture not yet implemented - counter shows 1/N for now

### Phase 4 (2024-11-25)
- **Implementation**: PanResponder for touch gesture handling with 50px swipe threshold
- **Swipe Logic**: Horizontal swipes change photos, vertical movements ignored to preserve camera controls
- **Animation**: 100ms fade out/in transition between photos (200ms total)
- **Navigation**: Circular wrapping - swiping past last photo returns to first
- **UI Enhancement**: "← swipe →" indicator shown when multiple photos available
- **Performance**: Uses native driver for smooth 60fps animations without impacting camera
- **Bug Fix #1**: Added capture handlers (onStartShouldSetPanResponderCapture, onMoveShouldSetPanResponderCapture) for proper touch event handling
- **Bug Fix #2**: Fixed React closure bug - PanResponder created with useRef captured stale state. Solution: Use refs (referencesRef, currentIndexRef) instead of state in navigation logic
- **CameraView Issue**: Moved ReferenceGallery outside CameraView component (was blocking gestures and causing warnings)
- **Final Positioning**: Bottom-right corner, 100x150px (increased from 80x120px for better swipe usability)
- **Status**: ✅ Swipe gestures working smoothly on both simulator and physical device

### Phase 5 (2024-11-25)
- **Implementation**: Tap-to-expand functionality complete with full-screen overlay
- **Tap Detection**: Added TAP_THRESHOLD (10px) to distinguish taps from swipes using total movement distance
- **Gesture Logic**: If movement < 10px → tap (toggle expanded), if horizontal movement > 50px → swipe (change photo)
- **Overlay Structure**: Refactored to render expanded view outside container using Fragment (<>) for proper full-screen positioning
- **Expanded View**: Dark background (rgba 0,0,0,0.85), image at 50% screen width, centered with aspect ratio maintained
- **Dismiss Methods**: Tap anywhere on overlay OR tap close button (X) in top-right corner
- **UI Elements**: Photo counter shown in expanded view, close button for backup dismissal
- **Z-Index**: Expanded overlay set to zIndex: 1000 to ensure it appears above all camera elements
- **Status**: ✅ Phase 5 complete - tap-to-expand implemented with proper gesture detection and full-screen overlay

### Phase 6 (2024-11-25)
- **Integration**: Camera integration already complete from Phase 1 - ReferenceGallery positioned outside CameraView
- **Performance Comments**: Added inline documentation highlighting performance optimizations:
  * Native driver animations (60fps without blocking JS thread)
  * Fast transitions (200ms total) to minimize camera impact
  * Conditional rendering - expanded overlay only renders when needed
- **Testing Required**: Device testing needed to verify 30fps camera preview maintained
- **Status**: ⏳ Code complete, awaiting device performance testing

### Phase 6 Performance Testing Guide

**How to Test Camera Performance:**

1. **Visual FPS Test (Basic)**
   - Open camera screen with ReferenceGallery visible
   - Move the phone around smoothly
   - Camera preview should be fluid with no visible lag or stuttering
   - Test both with thumbnail collapsed and expanded

2. **Enable React Native Performance Monitor:**
   ```bash
   # In iOS Simulator: Cmd+D → "Perf Monitor"
   # On iOS Device: Shake device → "Perf Monitor"
   # In Android: Cmd+M → "Perf Monitor"
   # On Android Device: Shake device → "Perf Monitor"
   ```
   - **JS FPS**: Should stay at 60 (measures React Native UI thread)
   - **UI FPS**: Should stay near 60 (measures native UI rendering)
   - Camera preview runs on native side, so UI FPS most important

3. **Interaction Testing:**
   - **Swipe gestures**: Swipe between reference photos - should be smooth
   - **Tap-to-expand**: Tap thumbnail - expansion should be instant
   - **Dismiss overlay**: Tap to close - should be responsive
   - **During all above**: Monitor that camera preview doesn't stutter

4. **Stress Testing:**
   - Rapidly swipe between photos multiple times
   - Repeatedly tap to expand/collapse
   - Check memory usage doesn't continuously grow
   - Verify no memory leaks after 20+ interactions

5. **Platform-Specific Tests:**
   - **iOS**: Test on physical device (simulator has different performance)
   - **Android**: Test on mid-range device (e.g., Pixel 4a, Samsung A series)
   - **Both**: Test in different lighting conditions (camera processing varies)

**Performance Optimizations Already Implemented:**
- ✅ Native driver animations (useNativeDriver: true)
- ✅ Fast fade transitions (100ms each, 200ms total)
- ✅ Conditional rendering of expanded overlay
- ✅ Static image loading (no runtime network requests)
- ✅ Minimal re-renders (refs used for gesture handlers)
- ✅ StyleSheet.create() for optimized styles

**Expected Results:**
- Camera preview: Solid 30 FPS minimum (visible smoothness)
- JS thread: 60 FPS during interactions
- UI thread: 55-60 FPS (slight drops acceptable during transitions)
- No frame drops during normal swipe/tap interactions
- Brief dips (<1 second) acceptable during expand/collapse

**If Performance Issues Found:**
- Check if issue is iOS-only or Android-only
- Verify it's the gallery causing it (disable via dev panel)
- Consider reducing transition durations
- May need to debounce rapid interactions
- Profile using React DevTools if needed

---

## User Testing Results Template

*Fill in when conducting real-world testing*

### What Worked Well:
-

### What Didn't Work:
-

### Key Learnings for Feature 2:
-

### Improvement Ideas:
-

---

Last Updated: 2025-11-26
