---
description: Summarize today's session and append to development journal
---

Please review our conversation from this session and create a concise journal entry summarizing what was accomplished today.

**IMPORTANT SAFEGUARDS:**
1. **Multiple entries per day**: Use timestamps (HH:MM format) to allow multiple session entries on the same day
2. **Duplicate check**: Before appending, read the existing Development Journal and check if very similar content was already added in the last 2 hours
3. **User confirmation**: If a similar entry exists, ask me if I want to append anyway before proceeding

**Requirements:**
1. Focus on concrete achievements and changes made
2. Include technical details (files modified, features added, issues resolved)
3. Note any important decisions or learnings
4. Keep it concise but informative (3-5 bullet points)
5. Include timestamp for multiple sessions per day

**Entry Format:**
```markdown
### [YYYY-MM-DD HH:MM] - Brief Session Title
- Achievement 1: Description
- Achievement 2: Description
- Achievement 3: Description
- Decisions/learnings: Key insights
```

**Process:**
1. **FIRST**: Ask user: "Any final wrap-up tasks before I write the journal entry?"
   - Wait for user response
   - If user has tasks: Complete them first, then proceed with journal
   - If user says no/ready: Continue to step 2
2. Read existing CLAUDE.md file completely
3. Find Development Journal section (create at end if missing)
4. Check for entries from today with similar timestamps (within 2 hours)
5. Compare content: If very similar entry exists, ASK me for confirmation
6. If no duplicate OR user confirms: Append new entry to journal
7. Commit with message: "Update development journal - [date] [time]"

**Example Entry:**
```markdown
### 2024-11-24 14:30 - Photo Organization & Documentation
- Reorganized 85 reference photos into 11 category subdirectories
- Updated README.md and CLAUDE.md with feature specifications
- Created /journal command for session summaries
- Decisions: Use subdirectories for cleaner photo loading, feature branches for development
```
