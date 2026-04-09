

## Plan: UI Refactoring & Flow Logic Changes

### 1. Reorder nav sections

**EditorHeader.tsx** — Change `NAV_ITEMS` order to: Experience → Skills → Summary. Update `PAGE_TITLES` accordingly.

### 2. Clickable PersistentChip → opens Application Modal

**PersistentChip.tsx** — Make the chip a `<button>` that opens a new `ApplicationModal`. Redesign with a modern pill shape, subtle gradient/border. Keep three states (no context, role only, role+JD) but more polished.

**New file: `src/components/ApplicationModal.tsx`** — A `Dialog` modal matching the uploaded screenshot:
- Title: "Tailor your CV to one job" + "Recommended" badge
- Fields: Target Role (input), Job Description (textarea)
- If `officialLocked`: fields are read-only with a "Locked" badge; user can view but not edit
- If not locked: editable fields + "Save & tailor my CV" button (calls `lockOfficial` directly) + "Not yet" button
- Info block: "Why is this recommended?" with bullet points (More relevant AI content, Better ATS keywords, Closer match to the job)
- Note: "If you want to tailor your CV to a different job, you'll create a new version."
- **No second confirmation modal** — clicking "Save & tailor my CV" locks immediately

### 3. Remove NudgeConfirmModal

**Delete `src/components/NudgeConfirmModal.tsx`**. Update `NudgeModal.tsx` to call `lockOfficial` directly on save instead of opening a confirmation step. Or better: replace `NudgeModal` usage with `ApplicationModal` since they serve the same purpose now. The nudge trigger (after inserting a suggestion when unlocked) will open `ApplicationModal` instead.

### 4. Improved Version renders above suggestions

**ContentCoach.tsx** — Move the `improvedText` block to render immediately after the context block and before the suggestions list. Current order: buttons → context → suggestions → improved. New order: buttons → context → **improved** → suggestions.

### 5. Experience page context priority logic

**ExperiencePage.tsx** — Change how `coachRole` is initialized/used for the Experience page:
- Priority 1: `expData[activeIndex].title` (the Title/Position field of the active entry)
- Priority 2: `officialJD.role` (from Application 1)
- Priority 3: empty → generic results

This requires passing a custom `contextRole` prop to `ContentCoach` or computing it in ExperiencePage and passing it down. **ContentCoach.tsx** will accept an optional `overrideRole` prop that, when provided, is used instead of `coachRole` from context for display and generation logic.

### Files changed

| File | Action |
|---|---|
| `src/components/EditorHeader.tsx` | Reorder nav items |
| `src/components/PersistentChip.tsx` | Make clickable, open modal, redesign |
| `src/components/ApplicationModal.tsx` | **Create** — central modal for job details |
| `src/components/NudgeConfirmModal.tsx` | **Delete** |
| `src/components/NudgeModal.tsx` | Replace with ApplicationModal usage or delete |
| `src/components/ContentCoach.tsx` | Move improved block above suggestions; add `overrideRole` prop |
| `src/pages/ExperiencePage.tsx` | Compute context role from title → officialJD → empty; pass to coach |
| `src/pages/SummaryPage.tsx` | Use ApplicationModal instead of NudgeModal |
| `src/pages/SkillsPage.tsx` | Use ApplicationModal instead of NudgeModal |

