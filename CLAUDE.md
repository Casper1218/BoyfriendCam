# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BoyfriendCam is an Expo-based React Native mobile application that provides GPS-like real-time photography guidance. The app transforms anyone into a capable photographer through active instructions rather than passive education. Users select a scenario (portrait-full, portrait-half, close-up) and location (outdoors, indoors, restaurant, beach), then receive contextual photography tips and real-time guidance while taking photos.

### Product Vision

Transform anyone into a capable photographer through real-time, actionable instructions. The app actively guides users to better compositions, angles, and framing - not through education, but through immediate feedback similar to GPS navigation.

### Key Design Principles

1. **Effortless > Educational:** Don't teach photography, just guide in real-time
2. **Specific > Vague:** "Step back 2 feet" not "adjust distance"
3. **Prioritized > Complete:** Show top 2 instructions, not everything wrong
4. **Fast > Perfect:** Approximate guidance quickly > perfect analysis slowly
5. **Privacy-First:** All processing on-device, no cloud uploads

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
# Start development server
npm start
# or
npx expo start

# Run on specific platform
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser
```

### Code Quality
```bash
npm run lint       # Run ESLint
```

### Reset Project
```bash
npm run reset-project  # Moves starter code to app-example, creates blank app directory
```

## Architecture

### Technology Stack
- **Framework**: Expo SDK 54
- **React**: 19.1.0
- **React Native**: 0.81.5
- **Router**: expo-router v6 (file-based routing)
- **TypeScript**: Strict mode enabled
- **Expo Features**: Camera, Media Library, Haptics, Status Bar

### Navigation Flow
The app uses a wizard-style navigation pattern powered by expo-router:
1. `app/index.tsx` - Scenario selection (portrait-full, portrait-half, close-up)
2. `app/location.tsx` - Location selection (outdoors, indoors, restaurant, beach)
3. `app/camera.tsx` - Camera view with contextual photography tips

Navigation is handled via `expo-router` with URL params passed between screens:
- `scenario` param flows from index → location → camera
- `location` param flows from location → camera

### Camera Tips System
The `camera.tsx` file contains a nested object structure mapping scenarios and locations to specific photography tips:
```typescript
tips[scenario][location]  // e.g., tips['portrait-full']['outdoors']
```
When adding or modifying tips, ensure both scenario and location keys exist in the tips object.

### Project Structure
```
app/                    # File-based routing (expo-router)
  _layout.tsx          # Root layout with Stack navigator + DevProvider
  index.tsx            # Scenario selection screen
  location.tsx         # Location selection screen
  camera.tsx           # Camera interface with tips
components/
  ui/                  # Reusable UI components
  ReferenceGallery.tsx # ✅ Swipeable reference photos (Phase 4 complete)
  TestSwipe.tsx        # Test component for gesture debugging
  DevControlPanel.tsx  # Development settings modal
  LiveInstructions.tsx # [TO BUILD] Real-time guidance overlay
  CompositionTips.tsx  # Dynamic tips display
contexts/
  DevContext.tsx       # Global dev settings context
constants/             # App-wide constants
  scenarios.ts         # Scenario definitions
  locations.ts         # Location definitions
hooks/                 # Custom React hooks
utils/                 # Utility functions
  referencePhotos.ts   # ✅ Static asset mapping for Metro bundler
  compositionAnalysis.ts # [TO BUILD] Rule-based composition rules
  instructionEngine.ts   # [TO BUILD] Generate instructions
  referenceComparison.ts # [TO BUILD] Compare live feed to reference
assets/                # Images, fonts, icons
  images/
    photos/            # Reference photos organized by category (135 total)
      portrait-full-beach/
      portrait-full-outdoors/
      portrait-full-restaurant/
      portrait-half-beach/
      portrait-half-indoors/
      portrait-half-outdoors/
      portrait-half-restaurant/
      close-up-beach/
      close-up-indoors/
      close-up-outdoors/
      close-up-restaurant/
```

### Key Configuration Files
- `app.json` - Expo configuration including app name, icons, splash screen, plugins
- `tsconfig.json` - TypeScript config with strict mode and path aliases (`@/*`)
- `eslint.config.js` - ESLint configuration
- `package.json` - Dependencies and scripts

### Path Aliases
TypeScript is configured with the `@/*` path alias mapping to the project root:
```typescript
import { Something } from '@/components/Something';
```

### Expo Features
- **New Architecture**: Enabled via `newArchEnabled: true`
- **React Compiler**: Experimental feature enabled
- **Typed Routes**: Experimental feature for type-safe routing
- **Edge-to-Edge**: Android edge-to-edge enabled
- **Platform Support**: iOS, Android, and Web

### Permissions
The app requires runtime permissions for:
- Camera access (expo-camera)
- Media library access (expo-media-library)

These are requested on-demand in the camera screen.

### Styling Approach
All screens use StyleSheet.create() with inline styles. The app uses a dark theme:
- Background: `#000` (black)
- Secondary background: `#1a1a1a`
- Borders: `#333`
- Text: `#fff` (white)

### Development Control Panel

**Purpose:** Toggle debug features and test components during development without cluttering production UI.

**Access:** Small "DEV" button in bottom-left corner of first screen (index.tsx)

**Architecture:**
- `contexts/DevContext.tsx` - Global context providing dev settings state
- `components/DevControlPanel.tsx` - Modal with checkboxes to toggle features
- Settings persist during app session (in-memory, resets on app restart)

**Available Toggles:**
1. **Test Swipe Component** - Shows TestSwipe component on first screen for gesture debugging
2. **Test Button (Camera)** - Shows interactive test button on camera screen
3. **Debug Info (Gallery)** - Enables all console logs and debug UI in ReferenceGallery
4. **Grid Overlay** - Shows rule of thirds grid on camera (defaults ON)

**Usage Pattern:**
```typescript
// In any component wrapped by DevProvider:
import { useDevSettings } from '@/contexts/DevContext';

function MyComponent() {
  const { settings } = useDevSettings();

  // Conditional rendering based on dev settings
  if (settings.showDebugInfo) {
    console.log('[DEBUG] Some diagnostic info');
  }

  return (
    <>
      {settings.showTestButton && <TestButton />}
    </>
  );
}
```

**Integration:**
- Root layout (`app/_layout.tsx`) wraps app with `<DevProvider>`
- Components check `settings.showX` to conditionally render debug features
- ReferenceGallery accepts `showDebugInfo` prop to control all logging

**Design Philosophy:**
- Keep production UI clean - hide all debug elements by default
- Make debugging easy - one tap to enable extensive logging
- Organize test components - centralized panel vs scattered debug code

## Feature Development Guidelines

### Current Phase: Feature 1 - Reference Photo Gallery

**Objective:** Provide visual examples without switching apps. Serves as baseline and learning tool for Feature 2.

**Implementation Tasks:**
1. Build `ReferenceGallery.tsx` component
2. Load photos from subdirectories based on scenario + location
3. Implement thumbnail display (bottom-right, 80x120px)
4. Add swipe gestures for cycling through references
5. Implement tap-to-expand functionality (50% screen, semi-transparent overlay)
6. Ensure no performance lag in camera preview (maintain 30fps)

**Reference Photo Organization:**
- Photos stored in: `assets/images/photos/{scenario}-{location}/{number}.jpg`
- Example: `assets/images/photos/portrait-half-beach/1.jpg`
- Total: 85 curated reference photos across 11 categories
- Access via: Dynamically load based on user's scenario and location selection

**Component Structure:**
```typescript
// components/ReferenceGallery.tsx
interface ReferenceGalleryProps {
  scenario: string;          // 'portrait-full', 'portrait-half', 'close-up'
  location: string;          // 'outdoors', 'indoors', 'restaurant', 'beach'
  onReferenceChange?: (index: number) => void;
}

// Load references from: require(`@/assets/images/photos/${scenario}-${location}/${number}.jpg`)
```

### Next Phase: Feature 2A - Rule-Based Instructions

**Objective:** Provide real-time, GPS-like guidance for better photos.

**Key Components to Build:**
1. **LiveInstructions.tsx** - Overlay displaying prioritized instructions
2. **utils/compositionAnalysis.ts** - Frame analysis and rule-based evaluation
3. **utils/instructionEngine.ts** - Generate instructions from analysis results

**Instruction Categories:**
1. Device Orientation (expo-sensors)
2. Composition - Rule of Thirds (expo-camera face detection)
3. Distance/Framing (face size analysis)
4. Lighting Quality (brightness/contrast analysis)
5. Basic Pose Guidance

**Performance Requirements:**
- Camera preview: 30 FPS (non-negotiable)
- Frame analysis: Max 10 FPS (analyze every 100ms)
- Instruction updates: Debounce 500ms to avoid flickering
- Use throttling and requestAnimationFrame for smooth UI
- Fail gracefully if face detection unavailable

**Instruction Priority System:**
- Max 2 instructions displayed simultaneously
- Color-coded: Red (critical), Yellow (improvement), Green (confirmation)
- Priority order: Critical errors > Improvements > Confirmations

### Future Phase: Feature 2B - ML-Powered Guidance

**Technologies to Research:**
- TensorFlow Lite or Core ML for on-device inference
- PoseNet or MediaPipe for pose detection
- Face landmark detection for detailed analysis
- Background segmentation for framing

**Performance Considerations:**
- Models add ~10-20MB to app size
- Requires optimization for real-time on-device processing
- Battery impact from camera + ML processing
- All processing must remain on-device (privacy)

## Testing Notes

### Camera Functionality Testing
- iOS Simulator does not support camera hardware; test on physical device or use Expo Go
- Android Emulator can simulate camera; enable virtual camera in AVD settings
- Media library permissions must be granted to save photos

### Feature 1 Testing Protocol
1. Take baseline photos WITHOUT references
2. Take photos WITH references visible
3. Document:
   - What was unclear when matching reference?
   - What adjustments were hard to judge?
   - What instructions would have helped?
4. Success metric: Photos with references are noticeably better

### Performance Monitoring
- Use React Native Performance Monitor
- Profile frame analysis with console.time()
- Test on mid-range Android device (performance bottleneck)
- Target: Camera preview maintains 30 FPS at all times

## Implementation Guidelines

### When Building New Features:

1. **Maintain 30fps camera preview** - This is non-negotiable
2. **Test on both iOS and Android** - Camera APIs differ between platforms
3. **Throttle heavy computations** - Use requestAnimationFrame for smooth UI
4. **Debounce instruction updates** - Avoid flickering text overlays
5. **Fail gracefully** - If face detection fails, fall back to simpler methods
6. **Comment performance-critical code** - Explain optimization choices
7. **Keep components modular** - Each feature should be independently toggle-able

### Code Organization:

- Use TypeScript strict mode throughout
- Leverage path aliases (`@/*`) for cleaner imports
- Keep business logic in `utils/` separate from UI components
- Use StyleSheet.create() for all styles (performance)
- Follow existing dark theme color scheme

### Performance Optimization:

- Throttle camera frame analysis to 10 FPS max
- Debounce UI updates by 500ms minimum
- Use memoization for expensive computations
- Avoid re-renders during camera preview
- Profile and optimize any code path affecting frame rate

### Error Handling:

- Camera permissions: Handle denial gracefully
- Face detection: Fall back to basic region detection
- Photo loading: Handle missing files
- Instruction generation: Default to simpler guidance if analysis fails

## Development Roadmap Context

### Current Status
- ✅ Project structure and navigation complete
- ✅ Scenario and location selection screens complete
- ✅ Camera screen with basic tips system complete
- ✅ 85 reference photos organized into subdirectories
- 🚧 Feature 1 (Reference Gallery) in progress
- ⏳ Feature 2A (Rule-Based Instructions) next priority
- ⏳ Feature 2B (ML-Powered Guidance) long-term goal

### Immediate Next Steps
1. Build ReferenceGallery component with swipe gestures
2. Add grid overlay to camera view
3. Test Feature 1 with real subjects
4. Document learnings for Feature 2 instruction design

## Additional Context

### Why This Architecture?
- expo-router chosen for type-safe, file-based routing
- Subdirectory organization enables efficient dynamic loading
- On-device processing ensures privacy and low latency
- Rule-based approach (Phase 2A) validates concept before ML investment

### Key Trade-offs:
- Simplicity vs Feature Completeness: Start with rule-based, add ML later
- Performance vs Accuracy: Approximate quickly rather than perfect slowly
- Education vs Guidance: Focus on actionable instructions, not teaching theory

### Privacy & Performance:
- All photo analysis happens on-device
- No network requests for core functionality
- No photos uploaded to cloud
- Battery optimization crucial for extended photo sessions

---

## Development Journal

### 2024-11-24 15:30 - Photo Library Organization & Development Workflow Setup
- Reorganized 85 existing photos into 11 subdirectories by scenario-location (e.g., portrait-half-beach/)
- Added 37 new reference photos across multiple rounds, manually categorizing and correcting AI miscategorizations
- Iteratively refined organization through multiple user correction cycles - emphasized manual review for accuracy
- Implemented automated duplicate detection and sequential renumbering scripts
- Final distribution: 135 images - Portrait-Full (59), Portrait-Half (41), Close-Up (35) - excellent scenario balance
- Created FEATURE_1.md implementation guide with 9-phase checklist for Reference Gallery development
- Created /journal command for session summaries with duplicate detection and wrap-up task prompts
- Updated README.md and CLAUDE.md with comprehensive feature specs and development guidelines
- All changes committed and pushed to remote repository
- Decisions: Manual review essential for photo accuracy; subdirectory structure enables clean dynamic loading; feature branches recommended for development

### 2024-11-24 16:00 - Feature 1 Phases 1-4: Foundation Through Swipe Gestures Complete
- Created feature branch: feature/reference-gallery
- Phase 1: Built ReferenceGallery.tsx component with TypeScript interfaces (ReferenceGalleryProps, ReferenceGalleryState)
- Phase 1: Integrated component into app/camera.tsx as overlay within CameraView
- Phase 2: Created utils/referencePhotos.ts with explicit asset mapping for all 135 photos across 12 categories
- Phase 2: Implemented getReferencePhotos() utility with error handling for missing/empty categories
- Phase 2: Discovery - All 12 categories have photos (portrait-full-indoors has 19 images)
- Phase 3: Thumbnail displays actual reference photos with counter overlay (e.g., "1/19")
- Phase 3: Implemented loading states and empty category fallbacks
- Phase 4: Implemented PanResponder for horizontal swipe gestures (50px threshold)
- Phase 4: Added fade animation transitions (100ms out/in) using native driver for 60fps performance
- Phase 4: Circular navigation with wrapping (swipe past last → first photo)
- Phase 4: "← swipe →" indicator shown when multiple photos available
- Phase 4: Vertical camera movements preserved, only horizontal swipes trigger photo changes
- Committed Phases 1-4 to feature branch
- Status: Phases 1-4 complete, Phase 5 (Tap-to-Expand) next
- Decisions: Static asset mapping required for Metro bundler; native animations for performance; horizontal-only swipe detection to preserve camera controls

### 2024-11-25 21:00 - Critical Bug Fix & Development Tools System
- **Critical Bug Fix**: Resolved React closure bug in ReferenceGallery - PanResponder created with useRef captured stale empty state, preventing photo navigation
  - Root cause: navigateReference function had closure over initial empty references array even after photos loaded
  - Solution: Introduced referencesRef and currentIndexRef to provide current values to PanResponder handlers
  - Verified fix on both iOS simulator and physical device - swipe gestures now work correctly
- **Development Control Panel**: Created centralized dev settings system to organize debug features
  - New architecture: contexts/DevContext.tsx + components/DevControlPanel.tsx
  - Small "DEV" button on first screen opens modal with feature toggles
  - Four toggles: Test Swipe Component, Test Button (Camera), Debug Info (Gallery), Grid Overlay
  - Benefits: Clean production UI, easy debugging access, organized test components vs scattered debug code
- **Gallery Refinements**: Increased size to 100x150px (from 80x120px) for better swipe usability, repositioned to bottom-right corner
- **Documentation**: Updated CLAUDE.md with dev panel architecture and usage patterns, marked Phase 4 complete in FEATURE_1.md
- **Git Workflow**: Created 3 logical commits (bug fix, dev tools, docs) and pushed to feature/reference-gallery branch
- **Status**: Phase 4 fully complete and verified, Phase 5 (Tap-to-Expand) ready to start
- **Key Learning**: PanResponder + useRef creates persistent closures - always use refs for values that handlers need to access after component updates

### 2025-11-26 01:45 - Phase 5-6 Complete & Critical X Button Fix
- **Phase 5 Complete**: Tap-to-expand functionality fully implemented with full-screen overlay
  - Image container displays at 85% screen width, centered with dark background
  - Proper gesture detection: taps (< 10px movement) vs swipes (> 50px movement)
  - Swipe gestures work in expanded view for changing photos
- **Phase 6 Complete**: Camera integration finalized with performance optimization comments
  - Native driver animations for 60fps transitions
  - Conditional rendering to minimize camera impact
- **Critical X Button Fixes**: Resolved two major issues preventing close button from working
  - Issue 1: Button positioned relative to screen edge (overlapping status bar) instead of image container
  - Issue 2: Aggressive PanResponder blocking all touch events to child components
  - Solution: Moved button inside expandedImageContainer, disabled PanResponder capture phase, allowed termination requests
  - Increased button size to 44x44px (Apple's recommended touch target) with better margins (12px)
  - Fixed TypeScript errors by removing invalid pointerEvents prop from TouchableOpacity
- **Created /onboard command**: Session context loading for future Claude Code sessions
- **Status**: Phases 5-6 complete and verified on device, X button now works correctly
- **Key Learning**: PanResponder capture phase blocks all descendant touch events - use `onStartShouldSetPanResponderCapture: false` and `onPanResponderTerminationRequest: true` to allow child components like buttons to respond
