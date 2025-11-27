# Feature 2: Live Instruction System

**Status**: Phase 1 in Development
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

## Phase 1: Photo Recreation with Tuner Interface

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
- Defer: Landscapes, objects, groups, side profiles → Phase 2 or beyond

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

1. **Target Extraction:**
   - When photo selected: Check if metrics already computed
   - If not cached: Run face detection + metric extraction
   - Cache results: Database photos pre-computed, user uploads computed on first selection
   
2. **Metrics Extracted:**
   - Face bounding box (x, y, width, height)
   - Face size ratio (face height / frame height)
   - Face center position (normalized x, y coordinates)
   - Approximate device tilt (if derivable from face angle)

3. **No Quality Judgment:**
   - Accept any photo with detectable face
   - User's choice = target, regardless of composition quality
   - Quality assessment is Phase 2 capability

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
   - No approximations - Phase 1 requires face detection

**Performance Requirements:**
- Camera preview: 30 FPS (non-negotiable)
- Face detection: 10 FPS (every 100ms)
- Tuner update: 500ms debounce minimum
- Metric extraction from reference: <200ms

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

**Not Included in Phase 1:**
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

## Phase 2: General Composition Guidance

**Status:** Future / Research Phase  
**Trigger:** Casper's decision after Phase 1 testing + foundation work

### Objective

Enable users to get good photo guidance WITHOUT requiring a specific matching reference photo. System provides composition guidance based on learned photographic principles and scenario context.

---

### Core Concept Difference from Phase 1

**Phase 1:** "Here's a photo, help me recreate it exactly"  
**Phase 2:** "I want to take a standing full-body shot in a restaurant, help me compose a good photo"

**Key Innovation:** Target values come from model's learned understanding, not from analyzing a specific reference photo.

---

### User Experience (Conceptual)

**User Flow:**
1. User selects scenario type: "Full Body + Restaurant"
2. NO specific reference photo selected
3. Tuner interface still shows (same UI as Phase 1)
4. Target values generated from learned composition rules for this scenario
5. User adjusts until all tuners are green

**Example Target Generation:**
- Scenario: "Full body + Restaurant"
- Model knowledge: "Good full-body restaurant photos typically have:"
  - Face at 20% from top (based on thousands of examples)
  - Subject occupies 70% of frame height
  - Slight downward tilt (-5°)
  - Subject centered horizontally
- These become tuner targets, same interface as Phase 1

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
Output: Same 4-parameter targets as Phase 1
```

---

### Scope Constraints

**Still Portrait-Focused:**
- Phase 2 does NOT expand to landscapes, objects, food photography
- Focus remains on human portraits (full-body, half-body, close-up)
- Just removes requirement for specific matching reference photo

**Still Same Tuner UI:**
- No additional instruction types
- Same 4 parameters (distance, tilt, height, horizontal)
- Same red/yellow/green feedback zones
- Innovation is in target generation, not interface

**Built on Phase 1:**
- Phase 1 architecture is foundation
- Phase 2 adds different "target source" module
- User can still choose Phase 1 mode (specific reference) OR Phase 2 mode (general guidance)

---

### Why Phase 2 is Necessary

**Limitation of Phase 1:**
- Impossible to provide exact reference photo for every situation
- Infinite combinations of: poses, locations, lighting, subject characteristics
- User may want guidance but not have/find perfect reference

**Phase 2 Value:**
- Handles edge cases and uncommon scenarios
- Provides "good enough" guidance when specific reference unavailable
- More flexible, adapts to user's actual situation
- Still maintains same simple tuner interface users learned in Phase 1

---

### Research Questions

**Before Phase 2 Development:**

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
   - How to measure if Phase 2 targets are "good"?
   - User testing: Do Phase 2 results feel helpful or arbitrary?
   - Comparison: Phase 2 general guidance vs Phase 1 specific matching

---

### Timeline & Development Approach

**Trigger for Starting Phase 2:**
- Casper's decision based on:
  - Phase 1 user testing results
  - Feature requests for scenarios not in database
  - Strategic product direction

**Parallel Development Possible:**
- After Phase 1 foundation is stable
- Merge Phase 1 foundation to main
- Branch 1: Continue iterating Phase 1 UX
- Branch 2: Research and build Phase 2 target generation
- Both use same core tuner architecture

**Research-Heavy Phase:**
- More unknowns than Phase 1
- May require experimentation with multiple approaches
- Expect iterative development, not linear progression

---

### Success Criteria (Tentative)

**Phase 2 is successful if:**
- Users can get helpful guidance without specific reference photo
- Generated targets lead to aesthetically pleasing photos
- Works across variety of portrait scenarios (not just scenarios in database)
- Guidance doesn't feel arbitrary or confusing
- Adoption: Users actually choose Phase 2 mode for appropriate situations

**Measurement:**
- Photo quality assessment (objective metrics + human evaluation)
- User surveys: Helpfulness, trust in guidance, preference vs Phase 1
- Usage patterns: When do users choose Phase 2 vs Phase 1?

---

## Overall Success Metrics

### Phase 1 Metrics
See Phase 1 section above for detailed metrics.

### Phase 2 Metrics  
See Phase 2 section above for detailed metrics.

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

### Phase 1: Ready for Development

**Decisions Made:**
- ✅ Tuner interface with 4 parameters (distance, tilt, height, horizontal)
- ✅ 3-zone feedback (red/yellow/green) with normalized thresholds
- ✅ Show all 4 tuners simultaneously
- ✅ Single-face portrait scope for MVP
- ✅ Reference photo processing: lazy computation with caching
- ✅ Start with database photos, support user uploads
- ✅ User upload validation: face detection only

**Immediate Next Steps:**
1. Create FEATURE_2_PHASE_1.md with detailed implementation checklist
2. Design tuner UI mockups (visual representation of 4-parameter interface)
3. Implement reference photo metric extraction pipeline
4. Build tuner display components
5. Integrate face detection and real-time comparison
6. Test with database photos
7. Enable user uploads after validation
8. User testing with real photographers

**Timeline Estimate:** 3-4 weeks for MVP

---

### Phase 2: Research & Planning Phase

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
5. Create detailed Phase 2 technical spec

**Trigger:** Casper's decision after Phase 1 testing

**Potential Timeline:** Start research after Phase 1 foundation stable, development 4-6 weeks (highly uncertain)

---

## Risks & Mitigation Strategies

### Phase 1 Risks

**Risk: Face detection fails in common scenarios**
- **Scenarios:** Low light, side angles, subject turned away, glasses/masks
- **Mitigation:** Clear error messaging, encourage frontal face positioning
- **Fallback:** Disable tuner, show "Face not detected - please face camera directly"
- **Future:** Phase 2 could add non-face-based approximations

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
- **Mitigation:** Accept user's choice without judgment (Phase 1 principle)
- **Communication:** Set expectation that target is "match this photo" not "take good photo"
- **Future:** Phase 2 can address quality through learned models

**Risk: Normalized thresholds don't feel right**
- **Scenarios:** Some parameters too sensitive, others not sensitive enough
- **Mitigation:** Make thresholds configurable, test multiple settings
- **Iteration:** Adjust based on user testing feedback
- **Flexibility:** Per-parameter tuning if needed

---

### Phase 2 Risks

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

**Risk: Phase 2 research takes longer than expected**
- **Scenarios:** Model selection challenging, integration complex, results poor
- **Mitigation:** Parallel development with Phase 1 iteration
- **Flexibility:** Phase 1 can continue improving while Phase 2 researched
- **Checkpoint:** Re-evaluate Phase 2 necessity after Phase 1 success

**Risk: Users don't need/want Phase 2**
- **Scenarios:** Phase 1 database coverage sufficient, users prefer specific references
- **Mitigation:** Validate demand through Phase 1 user feedback
- **Decision:** Don't build Phase 2 if Phase 1 solves the problem
- **Alternative:** Expand Phase 1 database instead

---

## Key Principles to Remember

**Phase 1 Core Tenets:**
1. User's choice of reference photo is the target - no quality judgment
2. Visual feedback (tuner) is more intuitive than text instructions
3. Single-face portraits only - stay focused on this constraint
4. Simple is better - 3 zones, 4 parameters, clear feedback
5. Performance is non-negotiable - 30 FPS camera preview always

**Phase 2 Core Tenets:**
1. Built on Phase 1 foundation - same UI, different target source
2. Research-heavy - don't commit to approach without validation
3. Portrait-focused indefinitely - no scope creep to other photo types
4. Necessity driven by Phase 1 limitations, not speculation
5. User needs validate the direction - build if users ask for it

---

## Related Documentation

- **FEATURE_2_PHASE_1.md** - Detailed Phase 1 implementation checklist (to be created)
- **PM_DECISIONS_RESOLVED.md** - Captured decisions from PM discussions (to be created)
- **Project.md** - Overall product vision and feature roadmap
- **FEATURE_1.md** - Reference gallery (predecessor feature)
- **README.md** - Technical architecture and design principles

---

**Last Updated:** 2025-11-26
**Phase 1 Status:** Scoping complete, ready for detailed spec
**Phase 2 Status:** Conceptual, research phase, no development timeline

