# Feature 2: Live Instruction System

> **⚠️ DRAFT - SCOPING PHASE**
> This document is a work-in-progress. Scope, priorities, and implementation approach are still being defined through PM discussions and user research from Feature 1 testing.

**Status**: 📋 Planning / Scoping
**Dependencies**: Feature 1 user testing results
**Target Timeline**: TBD (Post Feature 1 validation)

---

## Objective

Provide real-time, GPS-like guidance that makes taking great photos effortless. Transform the app from a reference viewer into an active photography assistant.

---

## Core Concept

**Current Problem (Feature 1):**
User has reference photo visible but still struggles to match it. Verbal instructions from subject are unclear. Trial-and-error takes many attempts.

**Feature 2 Solution:**
App analyzes live camera feed in real-time and gives specific, actionable instructions:
- "Step back 2 feet"
- "Tilt phone 10° left"
- "Raise phone higher"
- "Center subject more"

**Key Principle:** *Effortless over Educational* - Don't teach photography theory, just guide users to the right shot in the moment.

---

## Design Principles

1. **Specific > Vague**: "Step back 2 feet" not "adjust distance"
2. **Prioritized > Complete**: Show most important guidance only, not everything wrong
3. **Fast > Perfect**: Approximate guidance quickly rather than perfect analysis slowly
4. **Clear > Technical**: "Too much headroom" not "subject violates rule of thirds upper bound"

---

## Scope Questions (Awaiting PM + User Research)

> **Note:** These decisions will be informed by Feature 1 user testing. What specific instructions did users need most?

### **Instruction Types - What Should the App Guide?**

**Category: Camera Movement**
- [ ] Phone tilt corrections? ("Tilt phone 10° left", "Level your phone")
- [ ] Phone height adjustments? ("Raise phone 6 inches", "Lower phone slightly")
- [ ] Phone horizontal movement? ("Move camera right")

**Category: Photographer Movement**
- [ ] Distance instructions? ("Step back 2 feet", "Move closer")
- [ ] Horizontal positioning? ("Move left a bit", "Shift right")

**Category: Subject Positioning**
- [ ] Subject framing in viewfinder? ("Center subject more", "Subject too far left")
- [ ] Subject body pose? ("Have them turn shoulders", "Ask them to lean forward")
  - *Note: Requires ML models - more complex implementation*

**Category: Environment**
- [ ] Lighting feedback? ("Too dark - move to brighter area", "Subject in shadow")
- [ ] Background guidance? ("Busy background - reposition")

**Decision Needed:** Which instruction types are must-have for MVP vs nice-to-have for v2?

---

### **Reference Source - What to Optimize Against?**

**Option A: Category Reference Photos (Current Approach)**
- User selects scenario + location → app loads curated references
- App compares live feed to selected reference photo
- Guides user to match composition, framing, distance
- **Pros:** Already have 135 curated photos, clear target
- **Cons:** Limited to pre-defined scenarios

**Option B: User-Uploaded Reference Photos**
- User uploads any photo they want to recreate
- App analyzes it and guides photographer to match
- **Pros:** Unlimited scenarios, highly personalized
- **Cons:** More complex analysis, reference quality varies
- **Use Case:** Recreating milestone photos, matching specific aesthetic

**Option C: No Reference - General Guidance**
- App uses composition rules without comparing to specific photo
- Provides guidance based on photography best practices (rule of thirds, framing, etc.)
- **Pros:** Works for any scenario, no reference needed
- **Cons:** No clear target, harder to know when "done"

**Decision Needed:** Which mode(s) to build? Priority order? Can we combine approaches?

---

### **User Experience Design**

> **Pending:** User testing feedback on what makes instructions helpful vs overwhelming

**Instruction Display:**
- **Count:** Show 1 instruction? 2 instructions? All relevant instructions?
- **Position:** Top of screen? Bottom? Side overlay? Corner?
- **Color Coding:** Red (critical) / Yellow (improvement) / Green (good)?
  - Or single color for simplicity?
- **Positive Feedback:** Show confirmations like "Perfect distance!" when things are right?

**Instruction Style:**
- **Direct:** "Step back 2 feet"
- **Friendly:** "Try stepping back a bit!"
- **Explanatory:** "Subject is too close for this framing. Step back 2 feet."

**Specificity:**
- **Precise measurements:** "Step back 2.5 feet", "Tilt 12° left"
- **Relative guidance:** "Step back a bit", "Tilt slightly left"
- **Hybrid:** Specific for some (distance), relative for others (framing)

**Voice Mode:**
- Text-to-speech option for hands-free operation?
- Auto-speak most important instruction?
- Tap to hear instruction again?

**Decision Needed:** What UX approach best fits your users and brand? Test with prototypes?

---

## Implementation Approaches

### **Phase 2A: Rule-Based Instructions** (Recommended MVP)
*Foundation - Buildable with current technology, faster to market*

**How it works:**
- Detect measurable features (face position, face size, phone angle)
- Apply mathematical rules ("if face takes up <30% of frame → too far")
- Generate instructions from rule violations

**What's possible:**
- Distance estimation (based on face/body size relative to frame)
- Phone orientation (built-in accelerometer/gyroscope sensors)
- Basic composition (rule of thirds, centering, headroom)
- Face positioning in frame
- Basic lighting (brightness/contrast analysis)

**Limitations:**
- Only works for frontal faces (expo-camera face detection)
- Can't understand body pose or multiple people
- No scene/context understanding
- Approximate, not precise

**Required Dependencies:**
- expo-sensors (device orientation)
- expo-camera face detection API
- Basic image analysis utilities

**Estimated Timeline:** 2-3 weeks for core functionality

**Open Technical Questions:**
- How reliable is face detection in various lighting?
- What's the fallback when face detection fails?
- Can we maintain 30fps camera preview with analysis running?

---

### **Phase 2B: ML-Powered Instructions** (Future Enhancement)
*Advanced - Requires ML models and additional optimization*

**How it works:**
- Run computer vision models on camera frames
- Detect poses, landmarks, scene elements
- Compare to reference using learned features
- Generate nuanced instructions

**What ML adds:**
- Body pose detection → "Turn shoulders slightly right"
- Multiple person handling → "Step closer to bring both in frame"
- Scene understanding → "Move subject away from cluttered background"
- Aesthetic scoring → "Composition looks awkward - try a lower angle"
- Reference photo analysis → Extract composition from any uploaded photo

**Requirements:**
- TensorFlow Lite or Core ML integration
- Pre-trained or fine-tuned models (~5-20MB app size increase)
- Additional processing time (~50-100ms per frame)
- Battery optimization considerations
- On-device inference (privacy requirement)

**Estimated Timeline:** 2-4 weeks after Phase 2A, depending on scope

**Open Technical Questions:**
- Which ML framework? (TensorFlow Lite, Core ML, MediaPipe)
- Which models? (PoseNet, MobileNet, custom trained?)
- Can we maintain performance with ML inference?
- How do we handle model updates/versioning?

---

## Success Metrics

### **Functional Success:**
- [ ] Instructions update in real-time without lag (<500ms debounce)
- [ ] Camera preview maintains smooth performance (30 FPS minimum)
- [ ] Instructions are accurate (lead to measurably better photos)
- [ ] Instruction priority makes sense (most important shown first)
- [ ] Feature works in 90%+ of real-world scenarios

### **User Experience Success:**
- [ ] Photos taken with instructions are noticeably better than Feature 1 alone
- [ ] Users can follow instructions without confusion
- [ ] Takes fewer attempts to get a good shot (quantifiable reduction)
- [ ] Instructions feel helpful, not annoying or overwhelming
- [ ] Users feel more confident while shooting

### **Product Success:**
- [ ] Feature differentiates app from standard camera apps
- [ ] Users prefer this over just viewing reference photos
- [ ] Net Promoter Score increases vs Feature 1
- [ ] Users share/recommend based on this feature
- [ ] Retention increases (users come back for this feature)

### **Measurement Approach:**
- A/B testing: With instructions vs without
- Time-to-good-photo: Number of shots needed to get acceptable result
- User surveys: Helpfulness rating (1-5), confusion points, feature requests
- Photo quality assessment: Composition improvement (measurable metrics)
- Session length: Do users spend more/less time per photo?

---

## Risks & Mitigation Strategies

**Risk: Instructions feel annoying rather than helpful**
- Mitigation: Strict instruction limit (max 2 at once), smart priority system
- Mitigation: User testing early and often with real scenarios
- Mitigation: Allow quick disable/enable toggle in dev panel and settings

**Risk: Face detection fails in low light or side angles**
- Mitigation: Build fallback mode with center-of-frame approximation
- Mitigation: Clear messaging when detection unavailable ("Turn to face camera")
- Mitigation: Test in various lighting conditions during development

**Risk: Instructions update too frequently (flickering/annoying)**
- Mitigation: Debounce updates (500ms minimum between changes)
- Mitigation: Smooth transitions between instructions
- Mitigation: Only update when change is significant (>10% threshold, not every frame)

**Risk: Performance degrades (camera preview lags)**
- Mitigation: Throttle analysis to 10 FPS max (analyze every 100ms, not every frame)
- Mitigation: Profile and optimize any slow code paths
- Mitigation: Fail gracefully - disable instructions if FPS drops below 25
- Mitigation: Use native driver animations where possible

**Risk: Users ignore instructions (too complex, unclear, or too technical)**
- Mitigation: User testing with real photographers and subjects (not just developers)
- Mitigation: Iterate on instruction phrasing based on feedback
- Mitigation: Consider tutorial/first-use explanation or onboarding
- Mitigation: A/B test different instruction styles

**Risk: MVP scope creep (trying to build everything at once)**
- Mitigation: Clear must-have vs nice-to-have prioritization before development
- Mitigation: Build minimal testable version first (Phase 2A only)
- Mitigation: Add features incrementally based on user feedback, not assumptions
- Mitigation: Use Feature 1 testing to validate which instructions users need most

---

## Open Questions & Required Decisions

> **Action Items:** These questions should be answered before starting development

### **Product Decisions (PM Required):**
1. ❓ Which instruction types are must-have for MVP? (See scope section)
2. ❓ Which reference mode is primary? (Category / User-upload / General)
3. ❓ How many instructions should display simultaneously? (1, 2, or dynamic?)
4. ❓ What instruction style best fits the brand? (Direct, friendly, or explanatory?)
5. ❓ Is ML required for MVP, or can we launch with rule-based and add ML later?
6. ❓ What's the success threshold to proceed from 2A to 2B?

### **User Research Needed (From Feature 1 Testing):**
1. ❓ What specific instructions would have helped most when matching references?
2. ❓ What adjustments were hardest to judge? (Distance? Angle? Framing?)
3. ❓ Do users prefer precise measurements ("2 feet") or relative guidance ("a bit back")?
4. ❓ Would users actually use voice instructions, or is it too awkward?
5. ❓ What makes instructions feel helpful vs annoying?
6. ❓ How many instructions can users process at once without feeling overwhelmed?

### **Technical Unknowns (Requires Prototyping):**
1. ❓ Can rule-based approach deliver enough value, or is ML required for MVP?
2. ❓ What's acceptable latency for instruction updates in real-world use?
3. ❓ How robust is expo-camera face detection across different scenarios?
4. ❓ What happens when face detection fails? What's the fallback UX?
5. ❓ How much battery drain is acceptable? What's our baseline?
6. ❓ Can we analyze frames at 10 FPS and maintain 30 FPS camera preview?

---

## Dependencies & Blockers

**Blocked By:**
- Feature 1 user testing completion (need learnings about instruction needs)
- PM decisions on scope and priority (see open questions above)
- Technical feasibility spike (face detection reliability, performance testing)

**Depends On:**
- expo-camera v15+ (face detection API)
- expo-sensors v15+ (device orientation)
- Stable camera preview performance from Feature 1

**Nice-to-Have (Not Blockers):**
- ML framework integration (for Phase 2B)
- Voice synthesis library (for voice mode)
- Advanced image processing utilities

---

## Next Steps

1. ✅ **Complete Feature 1 testing** - Gather specific learnings about needed instructions
2. ⏳ **Analyze Feature 1 feedback** - What did users struggle with most?
3. ⏳ **Finalize PM decisions** - Use decision list to lock MVP scope
4. ⏳ **Technical feasibility spike** - Test face detection reliability, performance
5. ⏳ **Create detailed technical spec** - Based on chosen scope and approach
6. ⏳ **Build Phase 2A MVP** - Rule-based instructions for core use cases
7. ⏳ **User test Phase 2A** - Validate approach before investing in ML
8. ⏳ **Decide on Phase 2B** - Add ML selectively based on testing feedback

---

## Related Documentation

- **README.md** - Overall product vision and feature roadmap
- **FEATURE_1.md** - Reference gallery (predecessor to this feature)
- **CLAUDE.md** - Implementation guidelines and performance requirements
- **Development Journal** - Session notes and decision history

---

**Last Updated:** 2025-11-26
**Status:** 📋 Draft - Awaiting scope confirmation from PM and Feature 1 user testing results
**Owner:** TBD
**Reviewers Needed:** PM, Engineering Lead, Design
