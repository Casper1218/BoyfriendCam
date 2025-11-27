# Feature 2 Phase 1: Photo Recreation with Tuner Interface

**Status**: Ready for Development  
**Timeline**: 3-4 weeks for MVP  
**Target**: User testing and validation

---

## Objective

Enable users to recreate ANY reference photo (database or user-uploaded) through continuous visual feedback using a tuner-style interface. Guide photographers to match reference metrics without judging photo quality.

---

## Implementation Checklist

### Phase 1: Reference Photo Processing Pipeline

**Goal:** Extract target metrics from reference photos and cache for performance

- [ ] Create `utils/referencePhotoAnalysis.ts` file
- [ ] Implement face detection on static images
- [ ] Extract metrics function:
  - [ ] Face bounding box (x, y, width, height)
  - [ ] Face size ratio (face height / frame height)
  - [ ] Face center position (normalized x, y)
  - [ ] Derived device tilt (optional, from face angle)
- [ ] Create caching system:
  - [ ] Check if metrics already computed for photo
  - [ ] Store computed metrics (in-memory for MVP, persistent later)
  - [ ] Lazy computation: compute on first selection, cache for subsequent
- [ ] Pre-compute metrics for all database photos
- [ ] Test: Metrics extraction accurate across photo variations
- [ ] Test: Caching working correctly (no redundant computation)

**Acceptance Criteria:**
- [ ] Can extract face metrics from any single-face portrait
- [ ] Computation completes in <200ms
- [ ] Database photos pre-computed, user uploads computed on selection
- [ ] Cache prevents redundant processing

---

### Phase 2: Tuner UI Components

**Goal:** Build visual tuner interface showing 4-parameter feedback

- [ ] Create `components/TunerDisplay.tsx` file
- [ ] Design tuner visual representation:
  - [ ] Single parameter tuner component
  - [ ] Slider/bar showing target position
  - [ ] Color-coded zones (red/yellow/green)
  - [ ] Current position indicator
  - [ ] Parameter label
- [ ] Build 4-parameter layout:
  - [ ] Distance tuner
  - [ ] Tilt tuner  
  - [ ] Height tuner
  - [ ] Horizontal tuner
  - [ ] Stack vertically or arrange in grid (UX decision)
- [ ] Implement zone thresholds:
  - [ ] Define normalized threshold values
  - [ ] Red zone: > threshold deviation
  - [ ] Yellow zone: within threshold but not perfect
  - [ ] Green zone: within tolerance
  - [ ] Make thresholds configurable for testing
- [ ] Add smooth transitions:
  - [ ] Debounce updates (500ms)
  - [ ] Animated zone transitions
  - [ ] Prevent flickering
- [ ] Test: Tuner displays correctly for all zone states
- [ ] Test: Smooth updates without jitter
- [ ] Test: Readable and intuitive at a glance

**Acceptance Criteria:**
- [ ] All 4 tuners visible simultaneously
- [ ] Clear visual distinction between red/yellow/green zones
- [ ] Updates smoothly as values change
- [ ] No performance impact on camera preview (30 FPS maintained)

---

### Phase 3: Live Camera Analysis

**Goal:** Detect face in real-time and extract same metrics as reference processing

- [ ] Create `utils/liveFrameAnalysis.ts` file
- [ ] Integrate expo-camera face detection:
  - [ ] Enable face detection mode
  - [ ] Handle detection callbacks
  - [ ] Extract face bounds from detection results
- [ ] Implement metric extraction from live frame:
  - [ ] Face size ratio calculation
  - [ ] Face center position calculation
  - [ ] Phone orientation from expo-sensors
- [ ] Throttle analysis:
  - [ ] Limit to 10 FPS (every 100ms)
  - [ ] Use requestAnimationFrame for smooth updates
  - [ ] Cancel pending analysis if new frame available
- [ ] Handle detection failures:
  - [ ] Graceful fallback when no face detected
  - [ ] Clear error messaging to user
  - [ ] Don't show tuner feedback when face unavailable
- [ ] Test: Face detection works in typical conditions
- [ ] Test: Metrics match reference photo extraction format
- [ ] Test: Throttling prevents performance degradation

**Acceptance Criteria:**
- [ ] Face detected reliably in frontal/near-frontal poses
- [ ] Metrics updated at 10 FPS max
- [ ] Camera preview maintains 30 FPS
- [ ] Clear feedback when face not detected

---

### Phase 4: Comparison & Tuner Updates

**Goal:** Compare live metrics to reference targets and update tuner display

- [ ] Create `utils/metricComparison.ts` file
- [ ] Implement comparison functions:
  - [ ] Calculate deviation for each parameter
  - [ ] Normalize deviations (different parameters have different scales)
  - [ ] Map deviation to zone (red/yellow/green)
- [ ] Define threshold values:
  - [ ] Distance threshold (e.g., ±15% of target)
  - [ ] Tilt threshold (e.g., ±10°)
  - [ ] Height threshold (e.g., ±10% of frame)
  - [ ] Horizontal threshold (e.g., ±10% of frame)
  - [ ] Make configurable for tuning
- [ ] Connect to tuner display:
  - [ ] Pass zone states to TunerDisplay component
  - [ ] Debounce updates (500ms minimum)
  - [ ] Smooth transitions between zones
- [ ] Test: Thresholds feel appropriate (not too strict or too loose)
- [ ] Test: Zone transitions happen at right moments
- [ ] Test: All 4 parameters update independently

**Acceptance Criteria:**
- [ ] Tuner accurately reflects deviation from target
- [ ] Thresholds are normalized and feel consistent across parameters
- [ ] Updates debounced to prevent flickering
- [ ] User can achieve green state by following tuner feedback

---

### Phase 5: Camera Integration

**Goal:** Integrate tuner overlay into camera view

- [ ] Modify `app/camera.tsx` to include tuner mode
- [ ] Add mode toggle:
  - [ ] "Reference View" (Feature 1) vs "Tuner Mode" (Feature 2)
  - [ ] User can switch modes easily
  - [ ] Persist mode preference
- [ ] Position tuner overlay:
  - [ ] Doesn't block camera preview
  - [ ] Visible but not intrusive
  - [ ] Test different positions (side, bottom, semi-transparent)
- [ ] Connect reference selection to tuner:
  - [ ] When reference photo selected → extract/load metrics
  - [ ] Pass metrics as targets to tuner
  - [ ] Show loading state during metric extraction
- [ ] Handle camera permissions and setup:
  - [ ] Face detection enabled
  - [ ] Orientation sensors enabled
  - [ ] Error handling for permission denials
- [ ] Test: Tuner overlay doesn't impact camera performance
- [ ] Test: Mode switching smooth and intuitive
- [ ] Test: Reference selection triggers metric loading

**Acceptance Criteria:**
- [ ] Tuner integrated into camera view without blocking subject
- [ ] Mode toggle works reliably
- [ ] Reference selection connects to tuner targets
- [ ] Camera maintains 30 FPS with tuner active

---

### Phase 6: User Upload Support

**Goal:** Allow users to upload their own reference photos

- [ ] Add photo upload button in reference selection
- [ ] Implement upload validation:
  - [ ] Check if face detectable
  - [ ] Show clear error if validation fails
  - [ ] Message: "Could not detect face in photo. Please choose a portrait photo with clear frontal face."
- [ ] Process uploaded photo:
  - [ ] Run metric extraction pipeline
  - [ ] Cache results same as database photos
  - [ ] Store photo reference (in-memory for MVP)
- [ ] Add uploaded photo to reference gallery:
  - [ ] Show in carousel with database photos
  - [ ] Allow deletion of uploaded photos
  - [ ] Persist uploads across sessions (Phase 1.1 enhancement)
- [ ] Test: Upload flow smooth and intuitive
- [ ] Test: Validation catches problematic photos
- [ ] Test: Uploaded photos work same as database photos

**Acceptance Criteria:**
- [ ] Users can upload any photo with detectable face
- [ ] Clear error messaging for invalid uploads
- [ ] Uploaded photos function identically to database photos
- [ ] No significant delay in processing uploaded photos

---

### Phase 7: Edge Case Handling

**Goal:** Handle failures and edge cases gracefully

- [ ] Face detection failures:
  - [ ] Hide tuner when face not detected
  - [ ] Show clear message: "Face not detected - please face camera"
  - [ ] Re-enable tuner when face detected again
- [ ] Multiple faces detected:
  - [ ] Use largest face as primary
  - [ ] Or show warning: "Multiple faces detected - focus on one subject"
  - [ ] Decide based on testing
- [ ] Reference photo issues:
  - [ ] No face in reference → prevent selection, clear error
  - [ ] Multiple faces in reference → extract primary face metrics
  - [ ] Very small faces → warn that matching may be difficult
- [ ] Performance degradation:
  - [ ] Monitor frame rate
  - [ ] If drops below 25 FPS → disable tuner, show warning
  - [ ] Allow manual re-enable
- [ ] Orientation changes:
  - [ ] Handle phone rotation gracefully
  - [ ] Recalculate metrics if needed
  - [ ] Maintain tuner state across rotation
- [ ] Test: All error states have clear user messaging
- [ ] Test: App doesn't crash on edge cases
- [ ] Test: Recovery from errors is smooth

**Acceptance Criteria:**
- [ ] Clear error messages for all failure modes
- [ ] App never crashes from edge cases
- [ ] User can recover from errors without restarting
- [ ] Performance monitoring prevents bad experiences

---

### Phase 8: Polish & Optimization

**Goal:** Refine UX and optimize performance

- [ ] Tuner visual refinement:
  - [ ] Color choices (accessible, clear in bright light)
  - [ ] Typography (readable at glance)
  - [ ] Spacing and sizing
  - [ ] Animation timing
- [ ] First-time user experience:
  - [ ] Brief tutorial on first tuner use
  - [ ] Explain what zones mean
  - [ ] Show example of adjusting to green
  - [ ] Skip tutorial option
- [ ] Performance profiling:
  - [ ] Profile on mid-range Android device
  - [ ] Identify bottlenecks
  - [ ] Optimize hot paths
  - [ ] Verify 30 FPS maintained
- [ ] Threshold tuning:
  - [ ] Test with real users
  - [ ] Adjust threshold values based on feedback
  - [ ] Balance: too strict vs too forgiving
- [ ] Battery optimization:
  - [ ] Monitor battery drain with tuner active
  - [ ] Optimize sensor polling
  - [ ] Ensure face detection efficient
- [ ] Test: Tuner feels polished and professional
- [ ] Test: Performance excellent on target devices
- [ ] Test: Battery drain acceptable

**Acceptance Criteria:**
- [ ] Visual design polished and professional
- [ ] First-time users understand tuner without extensive explanation
- [ ] Performance optimized (30 FPS camera, <500ms tuner update)
- [ ] Battery drain acceptable for photography sessions

---

### Phase 9: User Testing & Iteration

**Goal:** Validate with real users and iterate

- [ ] Recruit test users (photographers + subjects)
- [ ] Test protocol:
  - [ ] 5 photos with Feature 1 (reference gallery)
  - [ ] 5 photos with Feature 2 (tuner mode)
  - [ ] Measure: time to good photo, number of attempts
  - [ ] Survey: ease of use, clarity, preference
- [ ] Collect feedback:
  - [ ] What was confusing?
  - [ ] Which parameters were most helpful?
  - [ ] Did tuner actually improve photos?
  - [ ] Would you use this over static reference?
- [ ] Metrics analysis:
  - [ ] Compare photo quality (objective + subjective)
  - [ ] Compare efficiency (time, attempts)
  - [ ] User preference data
- [ ] Iterate based on feedback:
  - [ ] Adjust thresholds
  - [ ] Refine UI based on confusion points
  - [ ] Fix usability issues
  - [ ] Re-test after changes
- [ ] Document learnings for Phase 2

**Success Criteria:**
- [ ] Users can use tuner without extensive training
- [ ] Photos demonstrably better than Feature 1 results
- [ ] Users prefer tuner mode (or clear use cases where they do)
- [ ] Clear feedback on what to improve

---

### Phase 10: Launch Preparation

**Goal:** Prepare for production release

- [ ] Code review and cleanup:
  - [ ] Remove debug logging
  - [ ] Clean up commented code
  - [ ] Ensure consistent code style
  - [ ] Document complex logic
- [ ] Error tracking:
  - [ ] Add analytics for feature usage
  - [ ] Track tuner mode adoption
  - [ ] Monitor error rates
  - [ ] Log performance metrics
- [ ] Feature flag:
  - [ ] Allow enabling/disabling tuner mode
  - [ ] Gradual rollout capability
  - [ ] A/B testing infrastructure
- [ ] Documentation:
  - [ ] Update README with Phase 1 complete
  - [ ] Document API for reference photo analysis
  - [ ] Create user guide/help content
- [ ] Performance validation:
  - [ ] Final profiling on all target devices
  - [ ] Battery drain assessment
  - [ ] Memory leak check
- [ ] Merge to main:
  - [ ] Final code review
  - [ ] Merge Phase 1 foundation
  - [ ] Tag release
  - [ ] Deploy to production

**Acceptance Criteria:**
- [ ] Code is production-ready (reviewed, tested, documented)
- [ ] Analytics and monitoring in place
- [ ] Can enable for subset of users (feature flag)
- [ ] Performance validated on all target devices

---

## Technical Specifications

### Tuner Threshold Values (Starting Points)

**Distance (Face Size Ratio):**
- Green: Target ±10% (e.g., target 0.45 → 0.405-0.495 is green)
- Yellow: Target ±10-25% 
- Red: >25% deviation

**Tilt (Device Orientation):**
- Green: Target ±5°
- Yellow: Target ±5-15°
- Red: >15° deviation

**Height (Face Y Position):**
- Green: Target ±8% of frame
- Yellow: Target ±8-15% of frame
- Red: >15% deviation

**Horizontal (Face X Position):**
- Green: Target ±8% of frame
- Yellow: Target ±8-15% of frame
- Red: >15% deviation

*Note: These are starting values, adjust based on user testing*

---

### Performance Targets

- **Camera Preview:** 30 FPS (non-negotiable)
- **Face Detection:** 10 FPS (every 100ms)
- **Tuner Update:** 500ms debounce minimum
- **Reference Metric Extraction:** <200ms
- **Memory:** <50MB additional RAM for tuner system
- **Battery:** <5% additional drain vs Feature 1

---

### Component Architecture

```
app/camera.tsx
├── Mode Toggle (Reference View / Tuner Mode)
├── Camera Preview
├── Reference Selection
└── TunerDisplay (when in Tuner Mode)
    ├── DistanceTuner
    ├── TiltTuner
    ├── HeightTuner
    └── HorizontalTuner

utils/
├── referencePhotoAnalysis.ts
│   ├── extractFaceMetrics()
│   ├── cacheMetrics()
│   └── loadCachedMetrics()
├── liveFrameAnalysis.ts
│   ├── detectFace()
│   ├── extractLiveMetrics()
│   └── throttleAnalysis()
└── metricComparison.ts
    ├── compareMetrics()
    ├── calculateDeviation()
    └── mapToZone()

components/
└── TunerDisplay.tsx
    ├── TunerParameter (reusable single tuner)
    └── TunerContainer (4-parameter layout)
```

---

## Testing Checklist

### Unit Testing
- [ ] Reference photo metric extraction accuracy
- [ ] Live frame metric extraction matches reference format
- [ ] Metric comparison logic correct
- [ ] Zone mapping accurate
- [ ] Threshold calculations correct

### Integration Testing
- [ ] Reference selection triggers metric loading
- [ ] Live face detection updates tuner
- [ ] All 4 parameters update independently
- [ ] Mode switching preserves state
- [ ] User upload flow end-to-end

### Performance Testing
- [ ] Camera preview maintains 30 FPS with tuner active
- [ ] Face detection at 10 FPS
- [ ] Tuner updates debounced correctly
- [ ] Memory usage acceptable
- [ ] Battery drain acceptable
- [ ] Performance on mid-range Android devices

### User Acceptance Testing
- [ ] Users understand tuner interface
- [ ] Can achieve green state by following feedback
- [ ] Photos match reference when all green
- [ ] Prefer tuner over static reference (or clear use cases)
- [ ] No significant confusion or friction

---

## Known Issues / Decisions

*Document issues and design decisions as they arise during development*

---

## User Testing Results

*Fill in after testing sessions*

### What Worked Well:
-

### What Needs Improvement:
-

### Threshold Adjustments Needed:
-

### UX Refinements:
-

### Phase 2 Implications:
-

---

## Next Steps After Phase 1

1. **Decision Point:** Continue Phase 1 iteration vs start Phase 2 research
2. **Phase 1 Enhancements:** Based on user feedback (persistent uploads, additional parameters, refined thresholds)
3. **Phase 2 Research:** If triggered, begin model selection and RAG architecture exploration
4. **Parallel Development:** Possible to iterate Phase 1 while researching Phase 2

---

**Last Updated:** 2025-11-26
**Status:** Ready for development - all decisions made, scope locked
