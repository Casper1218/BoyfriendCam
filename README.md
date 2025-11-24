# BoyfriendCam

An active instruction camera app that makes taking great photos effortless through real-time guidance, not just education.

## Problem Statement

Taking photos of a partner/friend is difficult without photography experience. Verbal instructions ("tilt left", "step back") are unclear, switching between camera and reference photos is clunky, and learning by trial-and-error is frustrating. Existing camera apps provide composition grids but no active guidance.

## Product Vision

Transform anyone into a capable photographer through GPS-like real-time instructions. The app actively guides users to better compositions, angles, and framing - not through education, but through immediate, actionable feedback.

---

## Tech Stack

**Framework:**
- Expo SDK 54
- React 19.1.0
- React Native 0.81.5
- expo-router v6 (file-based routing)
- TypeScript (strict mode enabled)

**Current Dependencies:**
- expo-camera (camera access and controls)
- expo-media-library (saving photos)
- expo-status-bar
- expo-haptics

**Future Dependencies (Feature 2+):**
- expo-image-picker (photo syncing)
- @tensorflow/tfjs / expo-gl (ML-powered analysis)
- expo-av (voice instructions)
- expo-sensors (device orientation)
- react-native-reanimated (smooth animations)

---

## Project Structure

```
BoyfriendCam/
├── app/                          # File-based routing (expo-router)
│   ├── _layout.tsx              # Root layout with Stack navigator
│   ├── index.tsx                # Scenario selection screen
│   ├── location.tsx             # Location selection screen
│   └── camera.tsx               # Camera interface with tips
├── components/
│   ├── ui/                      # Reusable UI components
│   ├── GridOverlay.tsx          # [TO BUILD] Rule of thirds grid
│   ├── ReferenceGallery.tsx     # [TO BUILD] Swipeable reference photos
│   ├── LiveInstructions.tsx     # [TO BUILD] Real-time guidance
│   └── CompositionTips.tsx      # Dynamic tips display
├── assets/
│   └── images/
│       └── photos/              # Curated reference images (organized by category)
│           ├── portrait-full-outdoors/
│           ├── portrait-half-beach/
│           ├── close-up-restaurant/
│           └── ... (11 categories total)
├── utils/
│   ├── compositionAnalysis.ts   # [TO BUILD] Rule-based composition rules
│   ├── instructionEngine.ts     # [TO BUILD] Generate instructions
│   └── referenceComparison.ts   # [TO BUILD] Compare live feed to reference
├── constants/
│   ├── scenarios.ts             # Scenario definitions
│   └── locations.ts             # Location definitions
├── hooks/                       # Custom React hooks
├── app.json                     # Expo configuration
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies and scripts
```

### Current Photo Organization

Reference photos are organized in subdirectories by scenario and location:
- **Format:** `assets/images/photos/{scenario}-{location}/{number}.jpg`
- **Example:** `assets/images/photos/portrait-half-beach/1.jpg`

**Available Categories (85 total images):**
- Portrait-full: 7 images (beach: 2, outdoors: 4, restaurant: 1)
- Portrait-half: 47 images (beach: 14, indoors: 3, outdoors: 10, restaurant: 20)
- Close-up: 31 images (beach: 11, indoors: 9, outdoors: 7, restaurant: 4)

---

## Feature Specifications

### Feature 1: Reference Photo Gallery [IN PROGRESS]

**Purpose:** Provide visual examples without switching apps. Serves as baseline solution and learning tool for Feature 2.

**User Flow:**
1. User selects scenario (portrait-full, portrait-half, close-up)
2. User selects location (outdoors, indoors, restaurant, beach)
3. Camera view loads with:
   - Main camera feed
   - Rule of thirds grid
   - Small reference thumbnail (bottom-right corner, 80x120px)
   - Swipe indicator on thumbnail
4. User can swipe left/right on thumbnail to cycle through references
5. Tap thumbnail to expand reference photo (50% screen size, semi-transparent overlay)
6. Tap anywhere to dismiss expanded view

**Technical Specifications:**

Component: `ReferenceGallery.tsx`
```typescript
Props:
- scenario: string          // Current scenario selection
- location: string          // Current location selection
- onReferenceChange: func   // Callback when reference switches

State:
- currentIndex: number      // Active reference photo index
- references: array         // Filtered photos for scenario/location
- isExpanded: boolean       // Whether reference is in fullscreen mode

Methods:
- loadReferences()          // Load photos from subdirectory
- handleSwipe(direction)    // Navigate between references
- toggleExpanded()          // Show/hide fullscreen reference
```

**Acceptance Criteria:**
- [ ] Reference photos load correctly from subdirectories based on scenario + location
- [ ] Thumbnail visible in camera view without blocking subject
- [ ] Swipe gesture switches between references smoothly
- [ ] Tap to expand shows larger preview
- [ ] No performance lag in camera preview

---

### Feature 2: Live Instruction System [NEXT PRIORITY]

**Purpose:** The killer feature - provide GPS-like real-time guidance for better photos.

#### Phase 2A: Rule-Based Instructions [Build This First]

**User Experience:**
- Instructions appear as text overlay (top of screen, semi-transparent background)
- Updates in real-time as user moves phone/subject moves
- Color-coded: Red (critical), Yellow (improvement needed), Green (good)
- Optional voice mode: Text-to-speech for hands-free guidance
- Instructions prioritized: only show most important guidance (max 2 at once)

**Instruction Categories:**

1. **Device Orientation**
   - Detect: expo-sensors accelerometer/gyroscope
   - Instructions: "Level your phone", "Rotate clockwise", "Hold phone steady"

2. **Composition (Rule of Thirds)**
   - Detect: Face/body detection (expo-camera face detection API)
   - Instructions: "Center the face higher", "Too much headroom", "Subject too far left/right"

3. **Distance/Framing**
   - Detect: Face size relative to frame
   - Instructions: "Step back 2 feet", "Move closer", "Good distance"

4. **Lighting Analysis**
   - Detect: Frame brightness, contrast, histogram
   - Instructions: "Subject in shadow - adjust position", "Too bright - avoid direct sunlight"

5. **Basic Pose Guidance**
   - Instructions: "Subject not centered", "Include more/less background"

**Technical Specifications:**

Component: `LiveInstructions.tsx`
```typescript
Props:
- cameraRef: ref           // Camera component reference
- scenario: string         // Current scenario type
- referencePhoto: image    // Optional - for comparison mode

State:
- activeInstructions: array   // Current instruction objects
- analysisData: object        // Latest frame analysis results
- instructionPriority: array  // Ordered by importance

Methods:
- analyzeFrame()              // Process camera frame (throttled to 10 FPS)
- generateInstructions()      // Create instruction objects from analysis
- prioritizeInstructions()    // Filter to top 2 most important
- speakInstruction()          // Optional TTS for voice mode
```

**Performance Requirements:**
- Frame analysis: Max 10 FPS (analyze every 100ms)
- Instruction updates: Debounce 500ms (avoid flickering)
- Face detection: Use expo-camera built-in
- Maintain 30fps camera preview

#### Phase 2B: ML-Powered Guidance [Long-term]

**Additional Capabilities:**
- Reference comparison mode
- Pose matching using TensorFlow Lite PoseNet or MediaPipe
- Advanced composition scoring
- Natural language processing for conversational instructions

**Technical Requirements:**
- TensorFlow Lite or Core ML integration
- On-device model inference (privacy + speed)
- Pose detection models (~10MB)
- Face landmark detection
- Background segmentation

---

### Feature 3: Translucent Overlay [EXPERIMENTAL]

**Purpose:** For specific use cases - recreating exact photos at fixed locations, matching previous couple shots.

**User Flow:**
1. User selects reference photo
2. Toggle "Overlay Mode" button appears
3. When enabled, reference photo displays at 30% opacity over entire camera view
4. User aligns subject with silhouette
5. Toggle off returns to normal view with thumbnail

**Implementation Notes:**
- Quick prototype: 2-3 hours maximum
- Test with real use case immediately
- If feels awkward or not useful → remove feature
- Likely useful only for couple photos at same spot or recreating milestone photos

---

## Development Roadmap

### Phase 1: Reference Gallery [CURRENT]
**Timeline:** Now → Saturday testing
- [x] Project structure and navigation
- [x] Camera screen with basic functionality
- [x] Scenario and location selection
- [x] Organize 85 reference photos into subdirectories
- [ ] Build ReferenceGallery component
- [ ] Implement swipe gestures
- [ ] Add grid overlay
- [ ] Test with real subjects Saturday
- [ ] Document learnings: What instructions would have helped?

### Phase 2A: Rule-Based Instructions [NEXT - 2 weeks]
**Timeline:** Post-testing → 2 weeks
- [ ] Implement LiveInstructions component
- [ ] Build compositionAnalysis utilities
- [ ] Device orientation detection
- [ ] Rule of thirds analysis
- [ ] Distance estimation (face size based)
- [ ] Basic lighting analysis
- [ ] Instruction priority system
- [ ] UI for instruction display
- [ ] Performance optimization (maintain 30fps)
- [ ] User testing: Are instructions helpful?

### Phase 3: Overlay Experiment [QUICK]
**Timeline:** 2-3 hours
- [ ] Build TranslucentOverlay component
- [ ] Implement opacity controls
- [ ] Quick user test
- [ ] Decision: Keep or kill

### Phase 2B: ML-Powered Guidance [LONG-TERM]
**Timeline:** 1-2 months
- [ ] Research TensorFlow Lite integration
- [ ] Implement reference photo analysis
- [ ] Build pose detection
- [ ] Reference comparison system
- [ ] Advanced composition scoring
- [ ] Natural language instruction generation
- [ ] Voice instruction mode

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Physical device recommended for camera testing

### Installation
```bash
git clone <repository-url>
cd BoyfriendCam
npm install
npx expo start
```

### Running on Device
```bash
# iOS
npm run ios

# Android
npm run android

# Scan QR code with Expo Go app for physical device testing
npx expo start
```

### Camera Permissions
App requests camera and media library permissions on first launch. Ensure these are granted in device settings if issues occur.

---

## Testing Strategy

### Feature 1 Testing (Saturday)
**Objective:** Validate reference photos help + learn what instructions are needed

**Test Protocol:**
1. Take 10 photos WITHOUT references (baseline)
2. Take 10 photos WITH references visible
3. Note specific difficulties:
   - What was unclear when trying to match reference?
   - What adjustments were hard to judge?
   - What instructions would have helped?
4. Get subject feedback:
   - Which photos improved?
   - What mistakes persisted?
   - What would make it effortless?

**Success Metrics:**
- Photos with references noticeably better than baseline
- Clear list of needed instructions identified
- Validation that real-time guidance would be valuable

### Feature 2A Testing
**Objective:** Validate instructions are helpful and not annoying

**Test Protocol:**
1. Use instruction mode with willing subjects
2. Measure: Do photos improve?
3. Assess: Are instructions clear and actionable?
4. Check: Is instruction priority working? (Not overwhelming)
5. Identify: Which instruction types most useful?

---

## Key Design Principles

1. **Effortless > Educational:** Don't teach photography, just guide in real-time
2. **Specific > Vague:** "Step back 2 feet" not "adjust distance"
3. **Prioritized > Complete:** Show top 2 instructions, not everything wrong
4. **Fast > Perfect:** Approximate guidance quickly > perfect analysis slowly
5. **Privacy-First:** All processing on-device, no cloud uploads

---

## Performance Benchmarks

**Target Metrics:**
- Camera preview: Stable 30 FPS
- Frame analysis: 10 FPS (100ms intervals)
- Instruction updates: 500ms debounce
- App launch to camera ready: <2 seconds
- Reference photo switch: <100ms

---

## Known Limitations

**Current:**
- Face detection API limited to frontal faces
- Lighting analysis basic (no HDR consideration)
- Distance estimation approximate (no depth sensor)
- Works best in good lighting conditions

**Future Considerations:**
- ML models increase app size (~10-20MB)
- On-device inference requires optimization
- Privacy: All processing on-device, no data uploaded
- Battery impact: Camera + ML can drain battery

---

## Contributing Notes

When implementing features:
1. **Maintain 30fps camera preview** - this is non-negotiable
2. **Test on both iOS and Android** - camera APIs differ
3. **Throttle heavy computations** - use requestAnimationFrame for smooth UI
4. **Debounce instruction updates** - avoid flickering text
5. **Fail gracefully** - if face detection fails, fall back to simpler methods
6. **Comment performance-critical code** - explain optimization choices
7. **Keep components modular** - each feature should be toggle-able

---

Last Updated: November 2024
Status: Feature 1 in progress, testing Saturday
