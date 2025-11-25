# Feature 1: Reference Photo Gallery

**Status**: In Progress
**Branch**: `feature/reference-gallery`
**Target**: Saturday testing

---

## Objective

Provide visual reference examples without switching apps. Serves as baseline solution and learning tool for Feature 2.

---

## Implementation Checklist

### Phase 1: Component Foundation
- [x] Create branch: `git checkout -b feature/reference-gallery`
- [x] Create `components/ReferenceGallery.tsx` file
- [x] Define TypeScript interfaces (props, state)
- [x] Set up basic component structure
- [x] Test: Component renders without errors

### Phase 2: Photo Loading System
- [x] Create photo loading utility function
- [x] Implement dynamic require for subdirectories
- [x] Handle missing categories gracefully (portrait-full-indoors)
- [x] Handle empty categories
- [x] Store loaded references in state
- [x] Test: Photos load correctly for all 12 categories

### Phase 3: Thumbnail Display
- [x] Position thumbnail bottom-right (80x120px)
- [x] Add 16px margins from edges
- [x] Style: 2px white border with shadow
- [x] Display current reference image
- [x] Add swipe indicator UI (photo counter)
- [x] Test: Thumbnail visible and doesn't block subject (ready for device testing)

### Phase 4: Swipe Gesture Implementation
- [x] Set up PanResponder for touch handling
- [x] Implement horizontal swipe detection (50px threshold)
- [x] Navigate between references on swipe
- [x] Add smooth fade animation (100ms fade out/in)
- [x] Show image counter (e.g., "2/4")
- [x] Prevent accidental vertical scrolling
- [ ] Test: Smooth swiping between all references

### Phase 5: Tap-to-Expand Feature
- [ ] Detect tap on thumbnail
- [ ] Create overlay component (dark background rgba(0,0,0,0.7))
- [ ] Display image at 50% screen width, centered
- [ ] Maintain aspect ratio
- [ ] Implement tap-to-dismiss anywhere
- [ ] Add close button as backup
- [ ] Test: Expand/collapse works smoothly

### Phase 6: Camera Integration
- [x] Import ReferenceGallery in `app/camera.tsx`
- [x] Pass scenario and location from route params
- [x] Position overlay correctly on camera preview
- [ ] Ensure camera maintains 30fps
- [ ] Test performance on both platforms
- [ ] Test: No lag in camera preview

### Phase 7: Edge Case Handling
- [ ] Handle missing category directories
- [ ] Handle empty categories (show message)
- [ ] Handle image loading errors
- [ ] Add fallback UI for errors
- [ ] Test: App doesn't crash with missing data

### Phase 8: Polish & Testing
- [ ] Test all 11 category combinations
- [ ] Verify animations are smooth
- [ ] Check performance metrics (30fps maintained)
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Saturday: Real-world testing with subjects
- [ ] Document learnings for Feature 2

### Phase 9: Merge & Deploy
- [ ] Code review (self-review)
- [ ] Final testing on both platforms
- [ ] Merge to main: `git checkout main && git merge feature/reference-gallery`
- [ ] Push: `git push origin main`
- [ ] Mark Feature 1 as complete in README

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

### Phase 4 (2024-11-24)
- **Implementation**: PanResponder for touch gesture handling with 50px swipe threshold
- **Swipe Logic**: Horizontal swipes change photos, vertical movements ignored to preserve camera controls
- **Animation**: 100ms fade out/in transition between photos (200ms total)
- **Navigation**: Circular wrapping - swiping past last photo returns to first
- **UI Enhancement**: "← swipe →" indicator shown when multiple photos available
- **Performance**: Uses native driver for smooth 60fps animations without impacting camera
- **Bug Fix**: Added capture handlers (onStartShouldSetPanResponderCapture, onMoveShouldSetPanResponderCapture) for proper touch event handling - swipe gestures now work on both simulator and physical device

---

## Saturday Testing Results

*Fill in after testing session*

### What Worked:
-

### What Didn't Work:
-

### Learnings for Feature 2:
-

---

Last Updated: 2024-11-24
