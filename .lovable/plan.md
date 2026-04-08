

## Plan: UX Improvements — Generate Proximity, Context Reveal, Nudge Modal, Persistent Chip, Skills Suggestions

### Summary of Changes

Four distinct UX changes across multiple components:

1. **Generate button close to inputs** — Move the Generate button right next to each field (inside toolbar for rich text, next to input for skills). The Context block (role input + status) is hidden by default and only revealed after clicking Generate.

2. **Nudge becomes a modal** — Replace the inline NudgeArea with a modal dialog that appears immediately when a user inserts a suggestion (if not locked). More prominent, impossible to miss.

3. **Persistent Chip redesign** — New label "Application 1" with three sub-states:
   - No role, no JD → "Tailor your CV to one job" (neutral/subtle)
   - Has role, no JD → "[role]" + red "Add job description" link
   - Has role + JD → "[role]" + "Job description included" (green)
   - Visually present but not dominant — user should focus on section fields first.

4. **Skills suggestions simplified** — Each suggestion is just the skill text + "Use this" button, no title/description card wrapper. Flat, compact rows.

---

### File Changes

#### 1. `src/components/ContentCoach.tsx`
- Add state `showContext` (boolean, default `false`).
- On Generate click: set `showContext = true`, then run `doGenerate()`.
- Wrap the Context block in `{showContext && ...}` so it's hidden until first Generate.
- Move Generate + Improve buttons up, right after the component mounts (close to the field). They render at the top of the coach area, directly below the editor/input.
- Remove `<NudgeArea>` from here — nudge is now a modal triggered from `handleInsert`.
- `handleInsert` now calls a new `onNudge` callback prop (passed from page) instead of managing nudge state internally.

#### 2. `src/components/NudgeArea.tsx` → Rename/refactor to `src/components/NudgeModal.tsx`
- Convert from inline panel to a `Dialog` modal.
- Same fields (role input, JD textarea) but inside a modal with clear prominence.
- Title: "Save as official job details"
- Triggered by parent page when user clicks "Use this" on a suggestion and `officialLocked === false`.

#### 3. `src/components/PersistentChip.tsx`
- Redesign with three states:
  - **No role/JD** (`officialLocked === false`): Label "Application 1" + subtext "Tailor your CV to one job". Neutral grey, subtle.
  - **Role only** (`officialLocked === true && jd === ""`): Label "Application 1" + role name + red badge "Add job description".
  - **Role + JD** (`officialLocked === true && jd !== ""`): Label "Application 1" + role name + green "Job description included".
- Styled to be informative but not attention-grabbing — subdued colors, small text.

#### 4. `src/pages/SkillsPage.tsx`
- Change `getSuggestions` to return plain strings (not `SuggestionItem` objects with title/content).
- Skills suggestions render as simple flat rows: skill name + "Use this" button. No card wrapper, no title, no description.

#### 5. `src/components/ContentCoach.tsx` — Skills rendering path
- When rendering suggestions and the item is a string, render a compact row layout (flex between skill name and "Use this" button) instead of a card.

#### 6. `src/pages/SummaryPage.tsx` and `src/pages/ExperiencePage.tsx`
- Pass nudge trigger logic: when `handleInsert` is called and `officialLocked === false`, open the NudgeModal.
- Add state for `nudgeOpen` and render `<NudgeModal>` at page level.

#### 7. `src/components/EditorHeader.tsx`
- Adjust chip placement to keep it subtle — smaller, right-aligned, not bold.

---

### Technical Notes

- The `NudgeConfirmModal` (the second confirmation step) remains unchanged — it's triggered from within the new `NudgeModal` when user clicks "Save as official".
- `ContentCoach` props get a new optional `onNudge?: () => void` callback and a `skillsMode?: boolean` flag to control rendering style.
- No new dependencies needed.

