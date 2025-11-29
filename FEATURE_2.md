# Feature 2: Live Instruction System

**Status**: Stage 1 in Development
**Last Updated**: 2025-11-26

---

## Overview

Transform the app from a passive reference viewer into an active photography assistant through real-time visual guidance. Feature 2 uses a "tuner-style" interface to guide photographers toward recreating reference photos or achieving optimal composition.

---

## Core Concept

**Current Problem (Feature 1):**  
User has reference photo visible but still struggles to match it. No clear feedback on how far off they are or what specific adjustments to make. Trial-and-error takes many attempts.

**Feature 2 Solution:**  
Continuous visual feedback (like a music tuner) showing how close the live camera view matches the target:
- Distance indicator: 🔴 Too close → 🟡 Getting there → 🟢 Perfect match
- Tilt indicator: 🟢 Correct angle
- Height indicator: 🟡 Raise phone slightly  
- Horizontal positioning: 🔴 Move left

**Key Principle:** *Visual Feedback over Text Instructions* - Show users exactly how close they are to the target, let them self-correct intuitively.

---

## Design Principles

1. **Visual > Verbal**: Show proximity to target through tuner interface, not text instructions
2. **Continuous > Discrete**: Real-time feedback as user adjusts, not step-by-step commands
3. **Simple > Precise**: Clear red/yellow/green zones, not technical measurements shown to user
4. **Normalized > Absolute**: All parameters use consistent sensitivity thresholds, even if underlying metrics differ
5. **Forgiving > Strict**: User chooses reference photo, system guides toward it without judging quality

---

---

## Stage 1: Photo Recreation with Tuner Interface

**Status:** In Development  
**Target:** MVP for user testing

### Objective

Enable users to recreate ANY reference photo (database or user-uploaded) through continuous visual feedback. No judgment on photo quality - if user chooses it as reference, guide them to match it.

---

### Scope Definition

**Reference Source:**
- Database photos (curated collection)
- User-uploaded photos (validated for face detection only)
- NO difference in processing - same general system for both

**Supported Photo Types:**
- Single-face portraits ONLY (MVP constraint)
- Frontal or near-frontal faces (face detection requirement)
- Defer: Landscapes, objects, groups, side profiles → Stage 2 or beyond

**Optimization Target:**
- Extract measurable metrics from reference photo (face size, position, angle)
- Guide live camera view to match those metrics
- No judgment on whether reference is "good" - user's choice is target

---

### Tuner Interface Design

**Core Concept:** Like a music tuner - visual feedback shows proximity to target state.

**Four Parameters Tracked:**

1. **Distance** - How close/far photographer is from subject
   - Measured by: Face size relative to frame
   - Feedback: 🔴 Too close/far → 🟡 Getting there → 🟢 Perfect match

2. **Tilt** - Phone angle (forward/backward)
   - Measured by: Device orientation sensors + face angle
   - Feedback: 🔴 Wrong angle → 🟡 Close → 🟢 Correct

3. **Height** - Vertical phone position  
   - Measured by: Face Y-position in frame
   - Feedback: 🔴 Too high/low → 🟡 Almost → 🟢 Right height

4. **Horizontal** - Left/right positioning
   - Measured by: Face X-position in frame
   - Feedback: 🔴 Off-center → 🟡 Nearly centered → 🟢 Centered

**Visual Representation (Conceptual):**
```
Distance:     🔴 ←——•————→ (Too close, step back)
Tilt:         🟢 ←——————•→ (Perfect angle)
Height:       🟡 ←———•———→ (Slightly low, raise a bit)
Horizontal:   🟢 ←——————•→ (Centered)
```

**Feedback Zones:**
- **Red Zone:** Significantly off target (>threshold)
- **Yellow Zone:** Getting close (within threshold but not perfect)
- **Green Zone:** Target achieved (within tolerance)

**Zone Thresholds:**
- Normalized across all parameters for consistency
- Different absolute ranges per parameter (e.g., tilt more sensitive than distance)
- Exact values TBD through testing

**Display Strategy:**
- Show all 4 tuners simultaneously
- User sees holistic view of all adjustments needed
- No prioritization - let user decide what to adjust first
- UX refinement based on testing feedback

---

### Technical Approach

**Reference Photo Processing:**

**Uses expo-face-detector for static image analysis** (NOT expo-camera - that's for live frames only)

1. **Target Extraction:**
   - Install: `npx expo install expo-face-detector`
   - When photo selected: Check if metrics already computed
   - If not cached: Run `FaceDetector.detectFacesAsync(imageUri, options)`
   - Cache results: Database photos pre-computed, user uploads computed on first selection

2. **Metrics Extracted:**
   - Face bounding box (x, y, width, height)
   - Face size ratio (face height / frame height)
   - Face center position (normalized x, y coordinates)
   - Roll angle (head tilt) from face detection
   - Eye positions (if available) for composition

3. **No Quality Judgment:**
   - Accept any photo with detectable face
   - User's choice = target, regardless of composition quality
   - Quality assessment is Stage 2 capability

**Key Tool Distinction:**
- **expo-face-detector**: Analyzes STATIC reference photos (files/assets)
- **expo-camera's onFacesDetected**: Analyzes LIVE camera frames
- Both use same ML Kit/Vision API, different entry points

**Live Camera Analysis:**

1. **Real-time Detection:**
   - Use expo-camera built-in face detection
   - Extract same metrics from live frame
   - Update at 10 FPS (throttled for performance)

2. **Comparison:**
   - Calculate deviation for each parameter
   - Map deviation to zone (red/yellow/green)
   - Update tuner display with 500ms debounce (prevent flickering)

3. **Fallback Handling:**
   - If face detection fails: Show "Face not detected" message
   - Disable tuner feedback until face visible
   - No approximations - Stage 1 requires face detection

**Performance Requirements:**
- Camera preview: 30 FPS (non-negotiable)
- Face detection: 10 FPS (every 100ms)
- Tuner update: 500ms debounce minimum
- Metric extraction from reference: <200ms

---

### Technical Implementation Details

**expo-camera Face Detection Integration:**

Stage 1 leverages expo-camera's built-in face detection via the `onFacesDetected` callback, which provides real-time face analysis without requiring additional ML libraries. The underlying implementation uses ML Kit (Android) and Vision API (iOS), giving us production-ready face detection with no extra dependencies.

**Face Detection Capabilities We'll Leverage:**

1. **Bounding Box Coordinates**
   - `bounds: { origin: { x, y }, size: { width, height } }`
   - Used for: Face positioning feedback (horizontal/vertical placement)
   - Enables: "Move left/right" and "Raise/lower camera" instructions
   - Normalized coordinates allow comparison across different photo sizes

2. **Face Size Estimation**
   - Derived from bounding box dimensions relative to frame size
   - Used for: Distance feedback
   - Calculation: `faceRatio = bounds.size.height / frameHeight`
   - Enables: "Step closer/further" instructions based on target face size

3. **Face Landmarks** (if available)
   - Key facial points: eyes, nose, mouth corners
   - Used for: Enhanced composition rules
   - Enables: Rule-of-thirds alignment (e.g., eyes at upper third line)
   - Fallback: Use bounding box center if landmarks unavailable

4. **Head Pose/Roll Angle** (if available)
   - `rollAngle`, `yawAngle`, `pitchAngle` in degrees
   - Used for: Angle matching and tilt feedback
   - Enables: "Tilt phone forward/backward" instructions
   - Fallback: Use device orientation sensors if pose data unavailable

**onFacesDetected Callback Data Structure:**

```typescript
interface FaceDetectionResult {
  faces: Array<{
    faceID: number;
    bounds: {
      origin: { x: number; y: number };
      size: { width: number; height: number };
    };
    rollAngle?: number;    // Head rotation (side tilt)
    yawAngle?: number;     // Left/right turn
    pitchAngle?: number;   // Up/down tilt
    leftEyePosition?: { x: number; y: number };
    rightEyePosition?: { x: number; y: number };
    // Additional landmarks may be available platform-dependent
  }>;
}
```

**Real-Time Instruction Generation Flow:**

1. **Capture**: `onFacesDetected` fires at camera frame rate
2. **Throttle**: Limit processing to 10 FPS (every 100ms) for performance
3. **Extract Metrics**:
   - Face center: `{ x: bounds.origin.x + bounds.size.width/2, y: bounds.origin.y + bounds.size.height/2 }`
   - Face ratio: `bounds.size.height / frameHeight`
   - Tilt angle: Use `rollAngle` or fallback to device orientation
4. **Compare**: Calculate deviation from reference photo metrics
5. **Map to Zones**: Determine red/yellow/green state for each parameter
6. **Debounce**: Update UI with 500ms minimum delay to prevent flickering
7. **Render**: Update tuner display with current zone states

**Platform Differences:**

- **iOS (Vision API)**: Typically provides full landmark and pose data
- **Android (ML Kit)**: Landmark availability depends on detection mode
- **Fallback Strategy**: Code defensively - use available data, degrade gracefully
- **Testing**: Validate on both platforms with varying lighting conditions

**Why No Additional ML Libraries Needed:**

expo-camera's built-in face detection provides all the data needed for Stage 1's tuner interface. We don't need TensorFlow.js, MediaPipe, or custom ML models because:
- Bounding boxes give us positioning (x, y coordinates)
- Face size gives us distance estimation
- Pose angles give us tilt feedback
- All data available at 30+ FPS through native APIs
- Stage 1 focuses on matching reference photos, not assessing quality

**Performance Optimization Strategy:**

- Use `requestAnimationFrame` for UI updates
- Debounce tuner zone calculations (500ms)
- Cache reference photo metrics (compute once, reuse)
- Throttle face detection processing to 10 FPS max
- Skip frames if previous analysis still processing
- Profile on mid-range Android device (performance bottleneck)

---

### User Upload Validation

**Minimum Requirements:**
- Photo must have detectable face (single face)
- Face must be frontal or near-frontal (face detection API limitation)
- No other quality checks (resolution, blur, composition)

**User Communication:**
- If upload fails validation: "Could not detect face in photo. Please choose a portrait photo with clear frontal face."
- No warnings about photo quality - user's choice is respected

**Development Approach:**
- Start with database photos only (controlled testing)
- Architecture supports user uploads from day 1
- Enable user uploads after database testing validates system

---

### Deferred to Later Phases

**Not Included in Stage 1:**
- Lighting guidance
- Background analysis
- Body pose instructions
- Voice/audio feedback
- Multiple faces or group photos
- Non-portrait photos (landscapes, objects)
- Quality assessment of reference photos
- Compositional suggestions beyond matching reference

---

### Success Metrics

**Functional Success:**
- Tuner feedback updates smoothly without lag
- Zone transitions (red→yellow→green) feel responsive and accurate
- Users can achieve green state across all 4 parameters
- Face detection works reliably in typical photo conditions

**User Experience Success:**
- Photos taken with tuner guidance visibly match reference photos
- Users understand tuner interface without extensive tutorial
- Time to achieve all-green state is reasonable (<30 seconds of adjustment)
- Users prefer tuner interface over Feature 1's static reference view

**Validation Approach:**
- A/B test: Tuner vs static reference gallery
- Measure: Time to acceptable photo, number of attempts, user preference
- Photo comparison: How closely do results match reference (objective metrics)
- User surveys: Ease of use, clarity of feedback, would you use this?

---

## Stage 2: General Composition Guidance

**Status:** Future / Research Phase  
**Trigger:** Casper's decision after Stage 1 testing + foundation work

### Objective

Enable users to get good photo guidance WITHOUT requiring a specific matching reference photo. System provides composition guidance based on learned photographic principles and scenario context.

---

### Core Concept Difference from Stage 1

**Stage 1:** "Here's a photo, help me recreate it exactly"  
**Stage 2:** "I want to take a standing full-body shot in a restaurant, help me compose a good photo"

**Key Innovation:** Target values come from model's learned understanding, not from analyzing a specific reference photo.

---

### User Experience (Conceptual)

**User Flow:**
1. User selects scenario type: "Full Body + Restaurant"
2. NO specific reference photo selected
3. Tuner interface still shows (same UI as Stage 1)
4. Target values generated from learned composition rules for this scenario
5. User adjusts until all tuners are green

**Example Target Generation:**
- Scenario: "Full body + Restaurant"
- Model knowledge: "Good full-body restaurant photos typically have:"
  - Face at 20% from top (based on thousands of examples)
  - Subject occupies 70% of frame height
  - Slight downward tilt (-5°)
  - Subject centered horizontally
- These become tuner targets, same interface as Stage 1

---

### Technical Approach (Preliminary)

**Disclaimer:** This is highly exploratory. Exact approach TBD through research.

**Potential Components:**

1. **Pre-trained Aesthetic Models**
   - Use existing models like NIMA (Neural Image Assessment)
   - Fine-tune for portrait photography specifically
   - Model learns "good composition" from large datasets

2. **RAG System for Compositional Rules**
   - Database of high-quality reference photos per scenario type
   - Extract common patterns/metrics from each scenario
   - Retrieve relevant compositional principles when user selects scenario

3. **Hybrid Approach (Most Likely)**
   - Learned aesthetic model provides general guidance
   - RAG retrieves scenario-specific best practices
   - Combine to generate target metrics for tuner
   - May include some hand-crafted rules as fallback

**Target Metric Generation:**
```
Input: Scenario type ("Full Body + Restaurant")
Process: 
  1. Query RAG for similar high-quality photos
  2. Extract average metrics from retrieved photos
  3. Apply aesthetic model adjustments
  4. Generate target: {distance: 45%, tilt: -5°, height: 20%, horizontal: 50%}
Output: Same 4-parameter targets as Stage 1
```

---

### Scope Constraints

**Still Portrait-Focused:**
- Stage 2 does NOT expand to landscapes, objects, food photography
- Focus remains on human portraits (full-body, half-body, close-up)
- Just removes requirement for specific matching reference photo

**Still Same Tuner UI:**
- No additional instruction types
- Same 4 parameters (distance, tilt, height, horizontal)
- Same red/yellow/green feedback zones
- Innovation is in target generation, not interface

**Built on Stage 1:**
- Stage 1 architecture is foundation
- Stage 2 adds different "target source" module
- User can still choose Stage 1 mode (specific reference) OR Stage 2 mode (general guidance)

---

### Why Stage 2 is Necessary

**Limitation of Stage 1:**
- Impossible to provide exact reference photo for every situation
- Infinite combinations of: poses, locations, lighting, subject characteristics
- User may want guidance but not have/find perfect reference

**Stage 2 Value:**
- Handles edge cases and uncommon scenarios
- Provides "good enough" guidance when specific reference unavailable
- More flexible, adapts to user's actual situation
- Still maintains same simple tuner interface users learned in Stage 1

---

### Research Questions

**Before Stage 2 Development:**

1. **Model Selection:**
   - Which pre-trained models exist for aesthetic quality?
   - How much fine-tuning needed for portrait-specific scenarios?
   - Can we use lightweight models for on-device inference?

2. **RAG Architecture:**
   - What's optimal number of reference photos per scenario?
   - How to balance variety vs consistency in retrieved examples?
   - Should RAG include compositional rules text, or just example photos?

3. **Target Generation:**
   - How to combine model output + RAG results into specific metrics?
   - How much variability to allow? (Not all "good" photos match exact metrics)
   - Fallback strategy if model/RAG fails to generate targets?

4. **Validation:**
   - How to measure if Stage 2 targets are "good"?
   - User testing: Do Stage 2 results feel helpful or arbitrary?
   - Comparison: Stage 2 general guidance vs Stage 1 specific matching

---

### Timeline & Development Approach

**Trigger for Starting Stage 2:**
- Casper's decision based on:
  - Stage 1 user testing results
  - Feature requests for scenarios not in database
  - Strategic product direction

**Parallel Development Possible:**
- After Stage 1 foundation is stable
- Merge Stage 1 foundation to main
- Branch 1: Continue iterating Stage 1 UX
- Branch 2: Research and build Stage 2 target generation
- Both use same core tuner architecture

**Research-Heavy Phase:**
- More unknowns than Stage 1
- May require experimentation with multiple approaches
- Expect iterative development, not linear progression

---

### Success Criteria (Tentative)

**Stage 2 is successful if:**
- Users can get helpful guidance without specific reference photo
- Generated targets lead to aesthetically pleasing photos
- Works across variety of portrait scenarios (not just scenarios in database)
- Guidance doesn't feel arbitrary or confusing
- Adoption: Users actually choose Stage 2 mode for appropriate situations

**Measurement:**
- Photo quality assessment (objective metrics + human evaluation)
- User surveys: Helpfulness, trust in guidance, preference vs Stage 1
- Usage patterns: When do users choose Stage 2 vs Stage 1?

---

## Overall Success Metrics

### Stage 1 Metrics
See Stage 1 section above for detailed metrics.

### Stage 2 Metrics  
See Stage 2 section above for detailed metrics.

### Product-Level Metrics (Both Phases)

**Feature Adoption:**
- % of users who try tuner interface vs staying with Feature 1
- Session duration with tuner active
- Photos taken per session (fewer = more efficient)

**Photo Quality:**
- Objective metrics: Composition scores, rule-of-thirds compliance
- Subjective: User satisfaction with results
- Comparison: Before/after tuner usage

**User Retention:**
- Return usage of tuner feature
- Feature perceived value (survey data)
- Net Promoter Score for app

---

## Development Status & Next Steps

### Stage 1: Ready for Development

**Decisions Made:**
- ✅ Tuner interface with 4 parameters (distance, tilt, height, horizontal)
- ✅ 3-zone feedback (red/yellow/green) with normalized thresholds
- ✅ Show all 4 tuners simultaneously
- ✅ Single-face portrait scope for MVP
- ✅ Reference photo processing: lazy computation with caching
- ✅ Start with database photos, support user uploads
- ✅ User upload validation: face detection only

**Immediate Next Steps:**
1. Create FEATURE_2_STAGE_1.md with detailed implementation checklist
2. Design tuner UI mockups (visual representation of 4-parameter interface)
3. Implement reference photo metric extraction pipeline
4. Build tuner display components
5. Integrate face detection and real-time comparison
6. Test with database photos
7. Enable user uploads after validation
8. User testing with real photographers

**Timeline Estimate:** 3-4 weeks for MVP

---

### Stage 2: Research & Planning Phase

**Not Ready for Development:**
- Need more research on model selection (NIMA, alternatives)
- RAG architecture undefined
- Target generation approach exploratory
- Success criteria need refinement

**Pre-Development Work Needed:**
1. Research aesthetic quality models
2. Evaluate RAG approaches for compositional rules
3. Prototype target generation from scenario types
4. Define success metrics for "good" targets
5. Create detailed Stage 2 technical spec

**Trigger:** Casper's decision after Stage 1 testing

**Potential Timeline:** Start research after Stage 1 foundation stable, development 4-6 weeks (highly uncertain)

---

## Risks & Mitigation Strategies

### Stage 1 Risks

**Risk: Face detection fails in common scenarios**
- **Scenarios:** Low light, side angles, subject turned away, glasses/masks
- **Mitigation:** Clear error messaging, encourage frontal face positioning
- **Fallback:** Disable tuner, show "Face not detected - please face camera directly"
- **Future:** Stage 2 could add non-face-based approximations

**Risk: Tuner interface confusing for users**
- **Scenarios:** Don't understand zones, ignore feedback, overwhelming with 4 parameters
- **Mitigation:** User testing early, simple tutorial on first use
- **Fallback:** A/B test different UI variations (number of tuners shown, visual design)
- **Iteration:** Refine based on user feedback

**Risk: Performance degradation with real-time processing**
- **Scenarios:** Camera preview lags, tuner updates stutter, battery drain
- **Mitigation:** Throttle analysis to 10 FPS, debounce UI updates to 500ms
- **Monitoring:** Profile performance on mid-range devices
- **Optimization:** Fail gracefully if performance drops below threshold

**Risk: Reference photo quality varies (user uploads)**
- **Scenarios:** Blurry photos, poor composition, unusual crops
- **Mitigation:** Accept user's choice without judgment (Stage 1 principle)
- **Communication:** Set expectation that target is "match this photo" not "take good photo"
- **Future:** Stage 2 can address quality through learned models

**Risk: Normalized thresholds don't feel right**
- **Scenarios:** Some parameters too sensitive, others not sensitive enough
- **Mitigation:** Make thresholds configurable, test multiple settings
- **Iteration:** Adjust based on user testing feedback
- **Flexibility:** Per-parameter tuning if needed

---

### Stage 2 Risks

**Risk: Model-generated targets feel arbitrary**
- **Scenarios:** Users don't understand why target is where it is, don't trust guidance
- **Mitigation:** Extensive validation that targets align with good composition
- **Fallback:** Allow manual adjustment of targets if user disagrees
- **Communication:** Explain that targets based on thousands of example photos

**Risk: RAG retrieval produces inconsistent targets**
- **Scenarios:** Different similar photos have very different metrics
- **Mitigation:** Use averaging/statistical approaches, not single example
- **Testing:** Validate consistency across multiple retrievals for same scenario
- **Refinement:** Manual curation of RAG database for consistency

**Risk: Stage 2 research takes longer than expected**
- **Scenarios:** Model selection challenging, integration complex, results poor
- **Mitigation:** Parallel development with Stage 1 iteration
- **Flexibility:** Stage 1 can continue improving while Stage 2 researched
- **Checkpoint:** Re-evaluate Stage 2 necessity after Stage 1 success

**Risk: Users don't need/want Stage 2**
- **Scenarios:** Stage 1 database coverage sufficient, users prefer specific references
- **Mitigation:** Validate demand through Stage 1 user feedback
- **Decision:** Don't build Stage 2 if Stage 1 solves the problem
- **Alternative:** Expand Stage 1 database instead

---

## Key Principles to Remember

**Stage 1 Core Tenets:**
1. User's choice of reference photo is the target - no quality judgment
2. Visual feedback (tuner) is more intuitive than text instructions
3. Single-face portraits only - stay focused on this constraint
4. Simple is better - 3 zones, 4 parameters, clear feedback
5. Performance is non-negotiable - 30 FPS camera preview always

**Stage 2 Core Tenets:**
1. Built on Stage 1 foundation - same UI, different target source
2. Research-heavy - don't commit to approach without validation
3. Portrait-focused indefinitely - no scope creep to other photo types
4. Necessity driven by Stage 1 limitations, not speculation
5. User needs validate the direction - build if users ask for it

---

## Related Documentation

- **FEATURE_2_STAGE_1.md** - Detailed Stage 1 implementation checklist (to be created)
- **PM_DECISIONS_RESOLVED.md** - Captured decisions from PM discussions (to be created)
- **Project.md** - Overall product vision and feature roadmap
- **FEATURE_1.md** - Reference gallery (predecessor feature)
- **README.md** - Technical architecture and design principles

---

**Last Updated:** 2025-11-26
**Stage 1 Status:** Scoping complete, ready for detailed spec
**Stage 2 Status:** Conceptual, research phase, no development timeline

