

## Plan: Fix 4 Issues — Job Details Page, Context Label, Skills Buttons, Nudge Modal Title

### 1. Restore Job Details page and route

The `/job-details` route was accidentally removed. Re-create `src/pages/JobDetailsPage.tsx` and restore the route.

**Files:**
- **Create `src/pages/JobDetailsPage.tsx`** — Simple page that opens the `ApplicationModal` automatically on mount. If `officialLocked` is true, redirects to `/experience`. Otherwise shows a centered prompt to set job details via the modal.
- **`src/App.tsx`** — Add route `/job-details`, restore `"/" → redirect to /job-details`.
- **`src/components/EditorHeader.tsx`** — Add "Job Details" as the first nav item: `{ to: "/job-details", label: "Job Details" }`. Add to `PAGE_TITLES`.

### 2. Context label: "Using title/position for this experience"

**`src/components/ContentCoach.tsx`** — When `overrideRole` is provided and has a value, change the context status text from "Using custom context" to "Using title/position for this experience".

Line ~128: Change the label conditionally based on whether `overrideRole` was passed.

### 3. Fix Skills "Use this" buttons

The issue is that `SkillsPage` passes `handleInsert` as `onInsert` but the `ContentCoach` wraps it via its own `handleInsert` which calls `onInsert(content)`. The skills suggestions are strings, so `content` should be correct. Let me check — the `addSkill` callback depends on `skillTags` via closure but `useCallback` has `[skillTags, setSkillTags]` deps... The `handleInsert` in SkillsPage also uses `useCallback` with `[addSkill]`. This should work.

Actually, looking more carefully: `SkillsPage.handleInsert` calls `addSkill(content)` which checks for duplicates and calls `setSkillTags([...skillTags, trimmed])`. The `addSkill` is wrapped in `useCallback` with `[skillTags, setSkillTags]` — this is correct. But `handleInsert` depends on `[addSkill]` which changes every time `skillTags` changes. The `ContentCoach` receives `onInsert` as a prop — this should still work since React re-renders with the new prop.

Wait — the real issue might be that `getSuggestions` for skills returns `string[]` but the type signature expects `SuggestionItem[] | string[]`. Let me check the suggestions data.

**`src/data/suggestions.ts`** — Need to verify `skillsSuggestions` returns `string[]`. If it returns `SuggestionItem[]` instead, the string check in ContentCoach won't match and the "Use this" button click path might differ.

Actually the rendering works (items show up), so the data type is fine. The click handler `handleInsert(content)` should work. Let me look at whether there's an event propagation issue — the skill items are rendered in a `<div>` with a `<Button>` inside. This looks correct.

Most likely issue: the `content` variable for string items is set correctly at line 185. The `handleInsert` at line 197 passes `content` which is the string. This calls `ContentCoach.handleInsert` → `onInsert(content)` → `SkillsPage.handleInsert` → `addSkill(content)`.

I suspect the problem is stale closure — `addSkill` captures `skillTags` at creation time but after adding one skill, `skillTags` changes, `addSkill` is recreated, but `handleInsert` in SkillsPage may not update in ContentCoach if suggestions were generated before the state changed. The suggestions array holds closures from render time.

**Fix in `src/pages/SkillsPage.tsx`**: Remove `useCallback` from `handleInsert` so it always uses fresh `addSkill`. Or better — use a ref-based approach. Simplest fix: just don't memoize `handleInsert`.

### 4. Nudge modal title change

**`src/components/ApplicationModal.tsx`** — Accept an optional `variant` prop. When triggered as a nudge (after using a suggestion), show title "Do you want to save your target job details?" instead of "Tailor your CV to one job". The rest of the modal stays the same.

**Files:**
- **`src/components/ApplicationModal.tsx`** — Add prop `nudge?: boolean`. When `nudge && !officialLocked`, title = "Do you want to save your target job details?".
- **`src/pages/SummaryPage.tsx`, `ExperiencePage.tsx`, `SkillsPage.tsx`** — Pass `nudge` prop when opening the modal from the suggestion insert flow.

### Summary of file changes

| File | Action |
|---|---|
| `src/pages/JobDetailsPage.tsx` | **Create** — auto-opens ApplicationModal, redirects if locked |
| `src/App.tsx` | Add `/job-details` route, redirect `/` to it |
| `src/components/EditorHeader.tsx` | Add "Job Details" as first nav item |
| `src/components/ContentCoach.tsx` | Change "Using custom context" → "Using title/position for this experience" when `overrideRole` is set |
| `src/components/ApplicationModal.tsx` | Add `nudge` prop for alternate title |
| `src/pages/SkillsPage.tsx` | Fix stale closure on handleInsert; pass `nudge` to modal |
| `src/pages/SummaryPage.tsx` | Pass `nudge` to ApplicationModal |
| `src/pages/ExperiencePage.tsx` | Pass `nudge` to ApplicationModal |

