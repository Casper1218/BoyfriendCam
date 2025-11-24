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
  _layout.tsx          # Root layout with Stack navigator
  index.tsx            # Scenario selection screen
  location.tsx         # Location selection screen
  camera.tsx           # Camera interface with tips
components/
  ui/                  # Reusable UI components
  GridOverlay.tsx      # [TO BUILD] Rule of thirds grid
  ReferenceGallery.tsx # [TO BUILD] Swipeable reference photos
  LiveInstructions.tsx # [TO BUILD] Real-time guidance overlay
  CompositionTips.tsx  # Dynamic tips display
constants/             # App-wide constants
  scenarios.ts         # Scenario definitions
  locations.ts         # Location definitions
hooks/                 # Custom React hooks
utils/                 # Utility functions
  compositionAnalysis.ts # [TO BUILD] Rule-based composition rules
  instructionEngine.ts   # [TO BUILD] Generate instructions
  referenceComparison.ts # [TO BUILD] Compare live feed to reference
assets/                # Images, fonts, icons
  images/
    photos/            # Reference photos organized by category
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

### 2024-11-24 15:00 - Photo Library Organization & Quality Control
- Added 37 new reference photos, manually categorized and corrected AI miscategorizations
- Iteratively refined photo organization with multiple user corrections for accurate scenario/location classification
- Removed duplicates, renumbered all 135 images sequentially across 12 categories
- Final distribution: Portrait-Full (59), Portrait-Half (41), Close-Up (35) - excellent balance
- Created automated renumbering script for future photo management
- Updated /journal command to prompt for wrap-up tasks before writing entries
- Decisions: Manual review essential for photo categorization accuracy; user knows content best
