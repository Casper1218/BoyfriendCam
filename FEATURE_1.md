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
- [ ] Create photo loading utility function
- [ ] Implement dynamic require for subdirectories
- [ ] Handle missing categories gracefully (portrait-full-indoors)
- [ ] Handle empty categories
- [ ] Store loaded references in state
- [ ] Test: Photos load correctly for all 11 categories

### Phase 3: Thumbnail Display
- [ ] Position thumbnail bottom-right (80x120px)
- [ ] Add 16px margins from edges
- [ ] Style: 2px white border with shadow
- [ ] Display current reference image
- [ ] Add swipe indicator UI
- [ ] Test: Thumbnail visible and doesn't block subject

### Phase 4: Swipe Gesture Implementation
- [ ] Set up PanResponder for touch handling
- [ ] Implement horizontal swipe detection (50px threshold)
- [ ] Navigate between references on swipe
- [ ] Add smooth fade animation (200ms)
- [ ] Show image counter (e.g., "2/4")
- [ ] Prevent accidental vertical scrolling
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
- [ ] Import ReferenceGallery in `app/camera.tsx`
- [ ] Pass scenario and location from route params
- [ ] Position overlay correctly on camera preview
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

*Document any issues or decisions here as development progresses*

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
