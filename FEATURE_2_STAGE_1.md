# Feature 2 Stage 1: Photo Recreation with Tuner Interface

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

**UPDATED: Use react-native-vision-camera for ALL face detection**

**IMPORTANT:** expo-face-detector is deprecated and removed in Expo SDK 52. The new approach uses react-native-vision-camera for both static image analysis (Phase 1) and live camera frames (Phase 3).

**Installation:**
```bash
# Core vision camera package
npm install react-native-vision-camera

# Face detection plugin
npm install react-native-vision-camera-face-detector

# Required for frame processors
npm install react-native-worklets-core

# Must use development build (NOT Expo Go)
npx expo prebuild
npx expo run:ios  # or run:android
```

**Implementation Tasks:**

- [ ] Install react-native-vision-camera packages (see Installation above)
- [ ] Create `utils/referencePhotoAnalysis.ts` file
- [ ] Implement `extractFaceMetrics(imageUri)` function using react-native-vision-camera:
  ```typescript
  import { detectFaces } from 'react-native-vision-camera-face-detector';

  interface FaceMetrics {
    faceRatio: number;        // Face height / image height
    faceCenterX: number;      // 0-1 normalized
    faceCenterY: number;      // 0-1 normalized
    rollAngle: number | null; // Head tilt in degrees
    pitchAngle: number | null; // Up/down angle
    yawAngle: number | null;   // Left/right angle
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }

  export async function extractFaceMetrics(
    imageUri: string
  ): Promise<FaceMetrics> {
    const faces = await detectFaces({
      image: imageUri,
      options: {
        performanceMode: 'accurate',    // Accurate mode for static images
        landmarkMode: 'all',            // Get eye positions
        classificationMode: 'all'       // Get smile/eyes open probabilities
      }
    });

    if (faces.length === 0) {
      throw new Error('No face detected');
    }

    if (faces.length > 1) {
      console.warn('Multiple faces detected, using largest');
    }

    // Use largest face if multiple detected
    const face = faces.reduce((largest, current) =>
      current.bounds.width > largest.bounds.width ? current : largest
    );

    // Get image dimensions from bounds
    // Note: bounds are in pixels, need to know image size for normalization
    const imageWidth = face.bounds.x + face.bounds.width + 100; // Approximation
    const imageHeight = face.bounds.y + face.bounds.height + 100; // Approximation

    return {
      faceRatio: face.bounds.height / imageHeight,
      faceCenterX: (face.bounds.x + face.bounds.width / 2) / imageWidth,
      faceCenterY: (face.bounds.y + face.bounds.height / 2) / imageHeight,
      rollAngle: face.rollAngle ?? null,
      pitchAngle: face.pitchAngle ?? null,
      yawAngle: face.yawAngle ?? null,
      bounds: {
        x: face.bounds.x,
        y: face.bounds.y,
        width: face.bounds.width,
        height: face.bounds.height,
      },
    };
  }
  ```

- [ ] Create caching system:
  - [ ] Define cache structure: `Map<photoId, FaceMetrics>`
  - [ ] Implement `getCachedMetrics(photoId)` - check cache first
  - [ ] Implement `cacheMetrics(photoId, metrics)` - store after extraction
  - [ ] Cache stored in-memory for MVP (AsyncStorage for persistence later)

- [ ] Create `getReferencePhotoMetrics(photoId)` helper:
  ```typescript
  import { Image } from 'react-native';

  const metricsCache = new Map<string, FaceMetrics>();

  export async function getReferencePhotoMetrics(
    photoId: string,
    photoSource: any  // require('@/assets/...')
  ): Promise<FaceMetrics> {
    // Check cache first
    if (metricsCache.has(photoId)) {
      return metricsCache.get(photoId)!;
    }

    // Get the URI from the image source
    const resolvedSource = Image.resolveAssetSource(photoSource);

    // Extract metrics (expensive operation)
    const metrics = await extractFaceMetrics(resolvedSource.uri);

    // Cache for future use
    metricsCache.set(photoId, metrics);

    return metrics;
  }
  ```

- [ ] **Optional: Pre-compute all 135 database photos on app startup**
  - Run in background after app loads
  - Store in AsyncStorage for persistence across sessions
  - Shows loading indicator first time only

- [ ] **Add debug visualization in album (RECOMMENDED)**:
  - [ ] Add toggle button in album photo detail view: "Show Face Detection"
  - [ ] When enabled, overlay face bounding box on photo
  - [ ] Display detected metrics as text overlay
  - [ ] Helps validate Phase 1 is working correctly before building tuner
  - Implementation in `app/album.tsx`:
    ```typescript
    const [showFaceBox, setShowFaceBox] = useState(false);
    const [faceMetrics, setFaceMetrics] = useState<FaceMetrics | null>(null);

    // When photo selected, extract metrics
    useEffect(() => {
      if (selectedPhoto) {
        extractFaceMetrics(selectedPhoto.source, imageSize)
          .then(setFaceMetrics)
          .catch(err => console.log('No face detected'));
      }
    }, [selectedPhoto]);

    // Render debug overlay
    {showFaceBox && faceMetrics && (
      <View style={{
        position: 'absolute',
        left: faceMetrics.bounds.x,
        top: faceMetrics.bounds.y,
        width: faceMetrics.bounds.width,
        height: faceMetrics.bounds.height,
        borderWidth: 2,
        borderColor: 'lime',
      }} />
    )}
    ```

**Testing Tasks:**
- [ ] Test on all 135 database photos - verify all have detectable faces
- [ ] Test face detection accuracy (are bounding boxes correct?)
- [ ] Test caching - second access should be instant
- [ ] Test error handling - what if photo has no face?
- [ ] Test multiple faces - does it pick the largest?
- [ ] Measure performance - metrics extraction should complete <200ms per photo

**Acceptance Criteria:**
- [ ] Can extract face metrics from any single-face portrait using expo-face-detector
- [ ] Metrics extraction completes in <200ms per photo
- [ ] Cache prevents redundant processing (instant on second access)
- [ ] Database photos can be pre-computed and cached
- [ ] User uploads validated on selection (face detection runs once)
- [ ] Debug visualization in album confirms face detection working

**Key Distinction:**
- **Phase 1 (this phase)**: Uses `react-native-vision-camera-face-detector`'s `detectFaces()` for STATIC reference photos
- **Phase 3 (later)**: Uses `react-native-vision-camera`'s frame processors for LIVE camera frames
- Both use same underlying ML Kit (Android) / Vision API (iOS), unified through one library!

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

**Goal:** Detect face in real-time using react-native-vision-camera frame processors

- [ ] Replace expo-camera with react-native-vision-camera Camera component
- [ ] Create `utils/liveFrameAnalysis.ts` file
- [ ] Implement frame processor with face detection:
  ```typescript
  import { Camera, useFrameProcessor } from 'react-native-vision-camera';
  import { useFaceDetector } from 'react-native-vision-camera-face-detector';
  import { useSharedValue } from 'react-native-worklets-core';

  const CameraWithFaceTracking = ({ targetMetrics }) => {
    const { detectFaces } = useFaceDetector({
      performanceMode: 'fast',    // Fast mode for real-time
      landmarkMode: 'none',        // Skip landmarks for speed
      contourMode: 'none',
      classificationMode: 'none'
    });

    const currentFaceData = useSharedValue(null);

    const frameProcessor = useFrameProcessor((frame) => {
      'worklet'
      const faces = detectFaces(frame);
      if (faces.length > 0) {
        const face = faces[0];
        currentFaceData.value = {
          faceRatio: face.bounds.height / frame.height,
          faceCenterX: (face.bounds.x + face.bounds.width / 2) / frame.width,
          faceCenterY: (face.bounds.y + face.bounds.height / 2) / frame.height,
          rollAngle: face.rollAngle ?? null,
          pitchAngle: face.pitchAngle ?? null,
          yawAngle: face.yawAngle ?? null,
        };
      }
    }, [detectFaces]);

    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />
    );
  };
  ```
- [ ] Throttle frame processing:
  - [ ] Process every 100ms (10 FPS max)
  - [ ] Skip frames if processing is behind
  - [ ] Use worklet threading for performance
- [ ] Handle detection failures:
  - [ ] Graceful fallback when no face detected
  - [ ] Clear error messaging to user
  - [ ] Don't show tuner feedback when face unavailable
- [ ] Test: Face detection works in typical conditions
- [ ] Test: Metrics match reference photo extraction format
- [ ] Test: Frame processing doesn't block UI thread

**Acceptance Criteria:**
- [ ] Face detected reliably in frontal/near-frontal poses
- [ ] Frame processing at 10 FPS max
- [ ] Camera preview maintains 30 FPS (UI thread not blocked)
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

### Face Detection Implementation

**react-native-vision-camera with face-detector plugin:**

Stage 1 uses react-native-vision-camera for ALL face detection (both static images and live camera). This leverages ML Kit (Android) and Vision API (iOS) natively.

**Key Integration Points:**

1. **Static Image Detection (Reference Photos):**
```typescript
import { detectFaces } from 'react-native-vision-camera-face-detector';

const analyzeReferencePhoto = async (imageUri: string) => {
  const faces = await detectFaces({
    image: imageUri,
    options: {
      performanceMode: 'accurate',
      landmarkMode: 'all',
      classificationMode: 'all'
    }
  });

  if (faces.length > 0) {
    return faces[0]; // Use largest face
  }
  return null;
};
```

2. **Live Camera Detection (Frame Processor):**
```typescript
import { Camera, useFrameProcessor } from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';

const { detectFaces } = useFaceDetector({
  performanceMode: 'fast',  // Fast for real-time
  landmarkMode: 'none',     // Skip landmarks for speed
  contourMode: 'none',
  classificationMode: 'none'
});

const frameProcessor = useFrameProcessor((frame) => {
  'worklet'
  const faces = detectFaces(frame);
  // Process faces...
}, [detectFaces]);
```

3. **Face Detection Data Available:**

**Always Available:**
- `bounds.x`, `bounds.y` - Top-left corner of face bounding box
- `bounds.width`, `bounds.height` - Face bounding box dimensions
- `trackingId` - Unique identifier for tracking same face across frames

**Usually Available:**
- `rollAngle` - Head tilt angle (-180 to 180 degrees)
- `pitchAngle` - Up/down face angle
- `yawAngle` - Left/right face turn
- `landmarks` - Eyes, nose, mouth positions (if landmarkMode enabled)
- `smilingProbability`, `leftEyeOpenProbability`, `rightEyeOpenProbability` (if classificationMode enabled)

4. **Metric Extraction Functions:**

```typescript
// utils/liveFrameAnalysis.ts
export function extractLiveMetrics(face: Face, frameSize: { width: number; height: number }) {
  return {
    // Distance parameter - face size relative to frame
    faceRatio: face.bounds.height / frameSize.height,

    // Horizontal parameter - face center X position (0-1 normalized)
    faceCenterX: (face.bounds.x + face.bounds.width / 2) / frameSize.width,

    // Height parameter - face center Y position (0-1 normalized)
    faceCenterY: (face.bounds.y + face.bounds.height / 2) / frameSize.height,

    // Tilt parameter - face roll angle
    rollAngle: face.rollAngle ?? null,
    pitchAngle: face.pitchAngle ?? null,
    yawAngle: face.yawAngle ?? null,
  };
}
```

5. **Performance Optimization:**

```typescript
// Frame processor runs on worklet thread - doesn't block UI
// Built-in throttling through worklet scheduling
const frameProcessor = useFrameProcessor((frame) => {
  'worklet'
  const faces = detectFaces(frame);

  if (faces.length > 0) {
    const face = faces[0];
    // Update shared value - automatically synced to UI thread
    currentFaceData.value = extractLiveMetrics(face, {
      width: frame.width,
      height: frame.height
    });
  }
}, [detectFaces]);
```

**Platform Testing Checklist:**

- [ ] Test on iOS - verify all face data available
- [ ] Test on Android - check face detection accuracy
- [ ] Test in low light - validate detection reliability
- [ ] Test with glasses/masks - document limitations
- [ ] Test multiple face handling - ensure primary face selection works
- [ ] Profile performance - ensure 30 FPS camera preview maintained

**Fallback Strategies:**

- If angles unavailable: Use bounding box center only
- If face detection fails intermittently: Maintain last known good values
- If face lost completely: Show "Face not detected" message

**Required Dependencies:**

- `react-native-vision-camera` - Core camera with frame processors
- `react-native-vision-camera-face-detector` - Face detection plugin
- `react-native-worklets-core` - Worklet threading
- Requires development build (NOT Expo Go)

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

### Stage 2 Implications:
-

---

## Next Steps After Stage 1

1. **Decision Point:** Continue Stage 1 iteration vs start Stage 2 research
2. **Stage 1 Enhancements:** Based on user feedback (persistent uploads, additional parameters, refined thresholds)
3. **Stage 2 Research:** If triggered, begin model selection and RAG architecture exploration
4. **Parallel Development:** Possible to iterate Stage 1 while researching Stage 2

---

**Last Updated:** 2025-11-26
**Status:** Ready for development - all decisions made, scope locked
