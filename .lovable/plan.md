

## CV Editor Web App — Complete Implementation Plan

### 1. Global State (CVContext)

Create `src/contexts/CVContext.tsx` with React Context providing:

| State | Type | Default |
|---|---|---|
| `officialJD` | `{ role: string, jd: string }` | `{ role: "", jd: "" }` |
| `officialLocked` | `boolean` | `false` — once true, never reverts |
| `coachRole` | `string` | `""` |
| `coachIsOfficial` | `boolean` | `false` |
| `summaryText` | `string` | `""` |
| `skillTags` | `string[]` | `["Product strategy", "Roadmap planning", "Agile/Scrum", "Data analysis", "Stakeholder management", "User research"]` |
| `expData` | `ExpEntry[]` | One empty entry: `{ title: "", company: "", functions: "", location: "", startDate: "", endDate: "", current: false }` |

Plus a `genKey()` helper:
- **"full"**: `officialLocked && officialJD.jd !== "" && coachRole === officialJD.role`
- **"role"**: `coachRole !== ""` (but not full)
- **"none"**: `coachRole === ""`

Wrap the app in `<CVProvider>` in `App.tsx`.

---

### 2. Routing (App.tsx)

| Path | Component | Behavior |
|---|---|---|
| `/` | Redirect | → `/job-details` |
| `/job-details` | `JobDetailsPage` | If `officialLocked === true` on load → redirect to `/summary` |
| `/summary` | `SummaryPage` inside `EditorLayout` | Always accessible |
| `/experience` | `ExperiencePage` inside `EditorLayout` | Always accessible |
| `/skills` | `SkillsPage` inside `EditorLayout` | Always accessible |
| `*` | `NotFound` | Catch-all |

---

### 3. Layout Components

#### EditorLayout (`src/components/EditorLayout.tsx`)
- **Desktop** (lg+): Two columns — left ~60% (editor), right ~40% (LivePreview).
- **Mobile**: Single column. "Preview your resume" sticky button at bottom toggles preview overlay.
- Wraps children (the page editor) and renders header + preview.

#### EditorHeader (`src/components/EditorHeader.tsx`)
- Top row: section name (left) + PersistentChip (right).
- Second row: horizontal nav links — **Summary** · **Experience** · **Skills**. Current page highlighted. Uses `NavLink` from react-router.

#### PersistentChip (`src/components/PersistentChip.tsx`)
- Shown on `/summary`, `/experience`, `/skills` only. NOT on `/job-details`.
- Never clickable. Pure status indicator.
- Three states:
  1. `officialLocked === false` → grey chip, text: "No application context", no lock icon.
  2. `officialLocked === true && officialJD.jd === ""` → green chip, lock icon, text: `"{officialJD.role} · No JD"`.
  3. `officialLocked === true && officialJD.jd !== ""` → green chip, lock icon, text: `"{officialJD.role} · With JD"`.
- Updates reactively whenever context changes.

#### LivePreview (`src/components/LivePreview.tsx`)
- Renders a resume-style document preview using all context data (summary, experience, skills).
- Updates in real time as user edits.

---

### 4. Page 1 — /job-details (`src/pages/JobDetailsPage.tsx`)

**Standalone page. No EditorLayout, no preview, no chip, no nav.**

- **Fields**: Target Role (text input, required), Job Description (textarea, optional).
- **"Continue" button**:
  - Validate: role not empty → inline error if empty.
  - On valid: set `officialJD = { role: trimmed, jd: trimmed }`, `officialLocked = true`, `coachRole = trimmed role`, `coachIsOfficial = (jd !== "")`. Navigate to `/summary`.
- **Skip link**: "Skip for now — I'll add this later" → navigate to `/summary` without changes. `officialLocked` stays false.
- **Redirect rule**: If `officialLocked` already true on mount → redirect to `/summary` immediately.

---

### 5. Content Coach (`src/components/ContentCoach.tsx`)

Rendered below the editable content area on summary/experience/skills. Structure top-to-bottom:

1. **Context block**: Editable text input showing `coachRole`. Always editable. Real-time status indicator:
   - "Using official job details" — when `coachRole.trim() === officialJD.role.trim() && officialLocked`
   - "Using custom context" — `coachRole` not empty but above not met. If `officialLocked`, show "Restore official" link → resets `coachRole` to `officialJD.role`.
   - "No context — results will be generic" — `coachRole` empty.
   - **CRITICAL**: Editing `coachRole` never modifies `officialJD` or the chip.

2. **Action buttons**: Generate (always visible) + Improve (only when field has content).

3. **opts-area**: Suggestion cards from hardcoded data based on `genKey()`. Each card has a title, content preview, and "Use this" / insert button.

4. **imp-area**: After Improve is clicked, shows improved text + "Apply to CV" button. "Apply to CV" **replaces** field content (the only action that replaces).

5. **nudge-area**: Post-insert nudge (see Nudge section below).

#### Auto-generation (first visit only)
- Track visited pages in context (e.g. `visitedPages: Set<string>`).
- On first visit to each page, if `coachRole` or `officialJD.role` is not empty: after a short delay (~500ms), auto-trigger generation with loading state, then show suggestion cards.
- On return visits: do NOT auto-generate.

#### Generate button
- Always visible. Uses `genKey()` to select suggestion set. Unlimited uses. Shows loading state briefly, then displays suggestion cards.

#### Improve button
- Visible only when the primary editable field has content.
- Calls `improveText()` (hardcoded improved version of the content).
- Shows result in imp-area with "Apply to CV" button.
- "Apply to CV" replaces (not appends) field content. Unlimited uses.

---

### 6. Insert Behaviour (all pages)

When a suggestion card is inserted:
- If field has content → **append** to end (never replace).
- If field is empty → set as new content.
- If `officialLocked === false` → call `showNudge()`.
- Ensure Improve button becomes visible (field now has content).

---

### 7. Nudge System

#### showNudge() (`src/components/NudgeArea.tsx`)
Appears in nudge-area after any insert, **only if** `officialLocked === false` AND nudge-area is currently empty.

Content:
- Title: "Save as official job details"
- Explanation: saving unlocks Interview Practice, Cover Letter, and more.
- Pre-filled role input (editable, from `coachRole`).
- Empty textarea for job description.
- **"Save as official"** → validate role not empty → open confirmation modal.
- **"Not now"** → clear nudge.

#### Confirmation Modal (`src/components/NudgeConfirmModal.tsx`)
- Warning text: "Once saved, you won't be able to edit these details. To change them, you'll need to create a new application."
- Preview of role and JD to be saved.
- **"Save and lock"**: sets `officialJD = { role, jd }`, `officialLocked = true`, `coachRole = role`, `coachIsOfficial = (jd !== "")`. Close modal, update chip, clear nudge.
- **"Cancel"**: close modal, no changes.

---

### 8. Page 2 — /summary (`src/pages/SummaryPage.tsx`)

- **Rich text editor** bound to `summaryText`. Toolbar: Bold, Italic, Underline, unordered list, ordered list, alignment. "Generate with AI" purple button in toolbar (triggers Coach Generate).
- **ContentCoach** rendered below editor, operating on `summaryText`.
- **Hardcoded suggestions** — 3 paragraph options per genKey, exact text from spec:
  - **full**: "Growth & retention focus", "Leadership & strategy focus", "Execution & delivery focus"
  - **role**: "Generalist PM profile", "Growth specialist", "Strategic & commercial angle"
  - **none**: "Core PM profile", "User-centered approach", "Team & delivery focus"
  - Each suggestion is one paragraph, no bullets.

---

### 9. Page 3 — /experience (`src/pages/ExperiencePage.tsx`)

- **Form fields per entry**:
  1. Title / Position — text input. Blue checkmark icon when non-empty.
  2. Company — text input.
  3. Functions and achievements — rich text textarea with toolbar (B, I, U, lists) + "Generate with AI" purple button.
  4. Location — text input, placeholder "Location (City, State)".
  5. Start Date — text input with calendar icon.
  6. End Date — text input with calendar icon. Disabled and cleared when `current === true`.
  7. Checkbox "I'm in this job right now" — sets `expData[i].current`. Disables End Date.
  8. **"+ Add another"** button — adds new empty experience entry.

- **Multiple experience entries** supported (array in context).
- Coach's **Improve** button acts on the Functions and achievements field.
- **Hardcoded suggestions** — 3 options of 4 bullet points each per genKey, exact text from spec:
  - **full**: "Retention & growth impact", "Platform & technical depth", "Stakeholder & strategy alignment"
  - **role**: "Delivery & ownership", "Discovery & user insight", "Cross-functional collaboration"
  - **none**: "Core responsibilities", "Achievements & impact", "Growth & learning"

---

### 10. Page 4 — /skills (`src/pages/SkillsPage.tsx`)

- **Input area**: Text input + "Add" button. Enter key also adds. Input clears after adding.
- **Skill chips**: Each skill as a tag/chip with:
  - Drag handle (reorderable via drag-and-drop).
  - Text (click to inline edit).
  - X button to delete.
- **"Generate with AI"** purple button at top.
- **ContentCoach** with Generate only (no Improve button on Skills page).
- **Suggestions**: Flat list of 10 individual skills per genKey. Each shown as a row with name + "+ Add" button. If already in `skillTags`: button shows "Added" (disabled). On add: push to `skillTags`, re-render, call `showNudge()` if `officialLocked === false`.
- **Hardcoded skill lists** from spec:
  - **full**: Retention optimization, Data-driven roadmapping, SaaS growth metrics, A/B testing, Amplitude, OKR frameworks, Cross-functional leadership, Stakeholder management, Funnel analysis, Agile/Scrum
  - **role**: Product strategy, Roadmap planning, Agile/Scrum, Stakeholder management, User research, Data analysis, KPI definition, Cross-functional collaboration, Sprint planning, Go-to-market
  - **none**: Product management, Roadmap planning, User research, Stakeholder communication, Agile/Scrum, Data analysis, Design thinking, Problem-solving, Team collaboration, Communication

---

### 11. Rich Text Editor Component (`src/components/RichTextEditor.tsx`)

Reusable component with:
- Toolbar buttons: Bold, Italic, Underline, Unordered list, Ordered list, Alignment.
- "Generate with AI" purple button positioned inline in toolbar.
- Textarea/contenteditable area.
- Uses `document.execCommand` or a lightweight approach for formatting.
- Used by both Summary and Experience pages.

---

### 12. Suggestion Data (`src/data/suggestions.ts`)

Single file containing all hardcoded suggestion text organized by page and genKey, exactly as specified in the prompt.

---

### Technical Details

- **Files created**: ~15 new files (context, 4 pages, ~8 components, 1 data file).
- **Dependencies**: No new npm packages needed. Drag-and-drop for skills uses HTML5 drag API or a simple custom implementation.
- **State persistence**: In-memory only (React Context). No localStorage unless explicitly requested later.
- **Responsive breakpoints**: `lg:` (1024px) for two-column layout switch.

