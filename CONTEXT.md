# Resume Builder Pro — Project Context

> **Purpose**: This document fully describes the architecture, components, logic, behaviors, and design decisions of the Resume Builder Pro application. Any AI assistant reading this at the start of a conversation should have complete understanding of the project.

---

## 1. Overview

Resume Builder Pro is a **client-side React SPA** that helps users build a professional CV/resume. It provides a structured multi-page editor with an AI Content Coach that generates contextual suggestions based on the user's target job. There is **no backend** — all state lives in React context (in-memory, not persisted).

**Tech stack**: React 18 · Vite 5 · TypeScript 5 · Tailwind CSS v3 · shadcn/ui · React Router v6 · TanStack Query (present but unused for now)

---

## 2. Application Flow & Navigation

### Page Order (strict)

```
Job Details → Experience → Skills → Summary
```

**Routing** (`src/App.tsx`):
- `/` → redirects to `/job-details`
- `/job-details` → `JobDetailsPage`
- `/experience` → `ExperiencePage`
- `/skills` → `SkillsPage`
- `/summary` → `SummaryPage`
- `*` → `NotFound`

Navigation is rendered by `EditorHeader` as horizontal tab-style links in this exact order. The `NavLink` component wraps React Router's `NavLink` with `className`/`activeClassName` support.

---

## 3. Global State — `CVContext`

**File**: `src/contexts/CVContext.tsx`

The `CVProvider` wraps the entire app (inside `BrowserRouter`) and holds all resume data.

### State Shape

| Field | Type | Default | Purpose |
|---|---|---|---|
| `officialJD` | `{ role: string; jd: string }` | `{ role: "", jd: "" }` | The locked target job details |
| `officialLocked` | `boolean` | `false` | Whether job details have been saved/locked |
| `coachRole` | `string` | `""` | The role used by ContentCoach for generating suggestions |
| `coachIsOfficial` | `boolean` | `false` | Whether coachRole matches the official JD |
| `summaryText` | `string` | `""` | HTML content of the Summary section |
| `skillTags` | `string[]` | 6 default PM skills | Ordered list of skill tags |
| `expData` | `ExpEntry[]` | 1 empty entry | Array of experience entries |
| `visitedPages` | `Set<string>` | empty | Tracks which pages have been visited (for auto-generation) |

### `ExpEntry` Interface

```ts
{
  title: string;       // Job title / position
  company: string;     // Company name
  functions: string;   // HTML content — responsibilities & achievements
  location: string;    // City, State
  startDate: string;   // Free text (MM/YYYY)
  endDate: string;     // Free text (MM/YYYY)
  current: boolean;    // If true, endDate is ignored
}
```

### Key Methods

| Method | Behavior |
|---|---|
| `lockOfficial(role, jd)` | Sets `officialJD`, sets `officialLocked = true`, syncs `coachRole` to the role, sets `coachIsOfficial` based on whether JD text is non-empty |
| `genKey()` | Returns `"full"` if locked + JD exists + coachRole matches official role; `"role"` if coachRole is non-empty; `"none"` otherwise |
| `markPageVisited(page)` | Returns `true` on first visit (triggers auto-generation), `false` on subsequent visits |

### Default Skills

```
Product strategy, Roadmap planning, Agile/Scrum, Data analysis, Stakeholder management, User research
```

---

## 4. Pages — Detailed Behavior

### 4.1 Job Details Page (`/job-details`)

**File**: `src/pages/JobDetailsPage.tsx`

- On mount, if `officialLocked` is `false`, the `ApplicationModal` auto-opens.
- If locked, shows a "View job details" button that re-opens the modal in read-only mode.
- If not locked, shows a "Set target job" CTA button.
- This is the **landing page** — users start here.

### 4.2 Experience Page (`/experience`)

**File**: `src/pages/ExperiencePage.tsx`

- Renders all entries in `expData` as stacked cards.
- Each card has: Title/Position, Company, Location, Start Date, End Date, "I'm in this job right now" checkbox, and a RichTextEditor for "Functions and achievements".
- The first entry (index 0) is the **active entry** and has the `ContentCoach` attached below its Functions editor.
- Additional entries can be added via "Add another" button. Non-first entries show a "Remove" button.

**Context priority logic for AI Coach** (determines `overrideRole`):
1. **Step 1**: Use the `title` field from the active experience entry (Title/Position).
2. **Step 2**: If Step 1 is empty, use `officialJD.role` from the Application.
3. **Step 3**: If both are empty, context is empty → generic suggestions.

The `overrideRole` prop is passed to `ContentCoach`, which makes the context input **read-only** (the user cannot type in it on this page — it's derived from the title field or the official JD).

**Context label displayed**:
- If `overrideRole` is set and has a value: **"Using title/position for this experience"**
- If the role matches the official locked JD: **"Using official job details"**
- If empty: **"No context — results will be generic"**

### 4.3 Skills Page (`/skills`)

**File**: `src/pages/SkillsPage.tsx`

- Shows an input + "Add" button to add skills.
- Skills are displayed as draggable chips (pill-shaped badges) with:
  - Drag handle (`GripVertical` icon)
  - Click-to-edit inline (text becomes an input on click)
  - Remove button (X icon)
- Drag-and-drop reordering is implemented via native HTML drag events.
- `ContentCoach` is attached with `hideImprove` (no "Improve" button since skills are tags, not prose).
- "Use this" buttons from suggestions call `addSkill()` which checks for duplicates (case-insensitive) before adding.
- Enter key in the input also adds a skill.

### 4.4 Summary Page (`/summary`)

**File**: `src/pages/SummaryPage.tsx`

- A `RichTextEditor` for writing a professional summary (HTML content).
- `ContentCoach` is attached with both `onInsert` (appends with double newline) and `onReplace` (replaces entirely).
- The "Improve" button is available here (not hidden) — it generates a refined version of the existing text.

---

## 5. Component Architecture

### 5.1 `EditorLayout`

**File**: `src/components/EditorLayout.tsx`

The main layout wrapper used by all pages. Structure:
- Full-height flex column
- `EditorHeader` at the top (nav + persistent chip)
- Below: two-column layout
  - **Left (60%)**: Editor content area (`children`), scrollable, max-width 2xl
  - **Right (40%)**: `LivePreview`, visible only on `lg+` screens, separated by a left border
- **Mobile**: A fixed bottom button "Preview your resume" opens a full-screen overlay with `LivePreview`

### 5.2 `EditorHeader`

**File**: `src/components/EditorHeader.tsx`

- Top bar with page title (left) and `PersistentChip` (right)
- Below: horizontal nav links in order: Job Details → Experience → Skills → Summary
- Active link gets `bg-secondary text-foreground` styling

### 5.3 `PersistentChip`

**File**: `src/components/PersistentChip.tsx`

A clickable pill/button visible on every page (top-right of header). Opens the `ApplicationModal` on click.

**States**:
- **Not locked**: Shows `Briefcase` icon + "Application 1" + "· Set target job"
- **Locked, with JD**: Shows `Lock` icon + role name + green "✓ JD included"
- **Locked, without JD**: Shows `Lock` icon + role name + red "⚠ Add JD"

### 5.4 `ApplicationModal`

**File**: `src/components/ApplicationModal.tsx`

A `Dialog` for setting/viewing the target job details.

**Props**:
- `open: boolean` — controls visibility
- `onClose: () => void` — close handler
- `nudge?: boolean` — when `true` and not locked, shows alternate title

**Title logic**:
- `nudge && !officialLocked` → **"Do you want to save your target job details?"**
- Otherwise → **"Tailor your CV to one job"**
- Always shows a purple "Recommended" badge next to the title.

**Fields**:
- **Target Role** (required, marked with red asterisk)
- **Job Description** (optional, textarea)

**When locked** (`officialLocked === true`):
- Both fields are `readOnly`
- A "locked" banner appears at the top
- The "Save" button is hidden; only a "Close" button remains
- The "Why is this recommended?" section is hidden

**When not locked**:
- Shows a "Why is this recommended?" section with 3 benefits (AI content, ATS keywords, closer match)
- "Not yet" (ghost) and "Save & tailor my CV" (purple) buttons
- On save: calls `lockOfficial(role, jd)` which locks the details permanently for this session

**Pre-fill logic on open**:
- If locked: pre-fills with saved `officialJD` values
- If not locked: pre-fills role from `coachRole` (if any), JD empty

### 5.5 `ContentCoach`

**File**: `src/components/ContentCoach.tsx`

The AI suggestion engine component, used on Experience, Skills, and Summary pages.

**Props**:
| Prop | Type | Description |
|---|---|---|
| `pageKey` | `string` | Unique page identifier for visit tracking |
| `fieldValue` | `string` | Current field content (for "Improve" feature) |
| `onInsert` | `(content: string) => void` | Appends suggestion to field |
| `onReplace` | `(content: string) => void` | Replaces field content entirely |
| `getSuggestions` | `(key: GenKey) => SuggestionItem[] \| string[]` | Returns suggestions for a generation key |
| `hideImprove` | `boolean` | Hides the "Improve" button (used on Skills) |
| `onNudge` | `() => void` | Called after inserting a suggestion when `officialLocked` is false |
| `overrideRole` | `string` | If provided, overrides `coachRole` and makes the context input read-only |

**Behavior**:

1. **Auto-generation on first visit**: When a page is visited for the first time AND there's a role context (either `effectiveRole` or `officialJD.role`), suggestions auto-generate after 500ms.

2. **Generate button**: Triggers `doGenerate()` which:
   - Shows loading state (600ms simulated delay)
   - Calls `genKey()` to determine suggestion tier
   - Calls `getSuggestions(key)` to get the suggestions array
   - Displays results

3. **Improve button** (visible when `!hideImprove && fieldValue.trim() && onReplace`):
   - Takes current content, strips HTML tags
   - Generates a "refined and enhanced" version (currently a simple string transform — placeholder for real AI)
   - Shows result in a green-bordered card with "Apply to CV" button

4. **Context block** (shown after first Generate click):
   - Read-only input showing the current role context
   - Status label varies:
     - ✅ "Using official job details" (green) — when `officialLocked` and role matches
     - ✨ "Using title/position for this experience" (purple) — when `overrideRole` is set
     - ✨ "Using custom context" (purple) — when coachRole is set manually
     - "No context — results will be generic" (muted) — when no role
   - "Restore official" link appears when locked but using custom context

5. **Nudge system**: When a user clicks "Use this" on a suggestion and `officialLocked` is `false`, the `onNudge` callback fires, which opens the `ApplicationModal` with `nudge={true}`. This encourages the user to save their job details.

6. **Suggestion rendering**:
   - **String items** (Skills): Horizontal row with text + "Use this" button
   - **SuggestionItem objects** (Experience, Summary): Card with optional title, content (truncated at 200 chars), and "Use this" button

### 5.6 `RichTextEditor`

**File**: `src/components/RichTextEditor.tsx`

A `contentEditable`-based rich text editor with a toolbar.

**Toolbar buttons**: Bold, Italic, Underline, Bullet List, Numbered List, Align Left/Center/Right

**Optional**: `onGenerateClick` prop adds a purple "Generate with AI" button in the toolbar (currently not used by any page — generation is handled by ContentCoach below the editor).

Uses `document.execCommand` for formatting. Outputs raw HTML via `innerHTML`.

### 5.7 `LivePreview`

**File**: `src/components/LivePreview.tsx`

Real-time CV preview that reads from `CVContext` and renders a formatted resume document.

**Sections displayed** (in order):
1. **Header**: Role (or "Your Name") + placeholder contact info
2. **Professional Summary**: Rendered HTML from `summaryText`
3. **Experience**: Each entry with title, dates, company/location, functions (HTML)
4. **Skills**: Wrapped pill badges
5. **Empty state**: "Start editing to see your CV preview here" when all sections are empty

Styled as a white card on a muted background, max-width 600px, min-height 800px (simulating an A4-ish document).

### 5.8 `NavLink`

**File**: `src/components/NavLink.tsx`

A wrapper around React Router's `NavLink` that accepts `className`, `activeClassName`, and `pendingClassName` as simple strings (instead of render functions).

---

## 6. Suggestion Data System

**File**: `src/data/suggestions.ts`

### Types

```ts
type GenKey = "full" | "role" | "none";

interface SuggestionItem {
  title: string;
  content: string;
}
```

### Generation Key Logic

| Key | Condition | Quality |
|---|---|---|
| `"full"` | Job locked + JD text exists + coachRole matches official role | Best — tailored to specific JD |
| `"role"` | coachRole is non-empty (but not full match) | Good — role-aware |
| `"none"` | No role context at all | Generic — universal suggestions |

### Suggestion Sets

| Section | Type | Count per tier |
|---|---|---|
| `summarySuggestions` | `SuggestionItem[]` | 3 per tier |
| `experienceSuggestions` | `SuggestionItem[]` | 3 per tier |
| `skillsSuggestions` | `string[]` | 10 per tier |

All suggestions are currently **static/hardcoded** (Product Manager domain). There is no real AI integration — the system simulates generation with a 600ms `setTimeout`.

---

## 7. Design System & Theming

**File**: `src/index.css` + `tailwind.config.ts`

### Custom Design Tokens (CSS Variables)

| Token | Light Value | Purpose |
|---|---|---|
| `--ai-purple` | `262 83% 58%` | Primary AI/brand accent (buttons, badges, highlights) |
| `--ai-purple-foreground` | `0 0% 100%` | Text on AI purple backgrounds |
| `--success` | `142 71% 45%` | Success states, "official" indicators |
| `--success-foreground` | `0 0% 100%` | Text on success backgrounds |
| `--chip-neutral` | `220 13% 91%` | Neutral chip/badge background |
| `--chip-neutral-foreground` | `215.4 16.3% 46.9%` | Text on neutral chips |
| `--preview-bg` | `220 14% 96%` | Background of the CV preview area |
| `--coach-bg` | `250 50% 98%` | Background of the ContentCoach context block |
| `--coach-border` | `250 30% 90%` | Border of the ContentCoach context block |

All tokens have dark mode variants defined in `.dark` class.

### Font

Body font: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Key Tailwind Classes Used

- `bg-ai-purple text-ai-purple-foreground` — primary action buttons (Generate, Save)
- `bg-coach-bg border-coach-border` — ContentCoach context block
- `bg-preview-bg` — LivePreview background
- `bg-secondary` — skill chips, nav active state
- `text-success` — official status indicators
- `text-destructive` — error states, remove buttons

### Rich Editor Styles

```css
.rich-editor [contenteditable] { /* base styles */ }
.rich-editor [contenteditable] ul { list-disc pl-5 }
.rich-editor [contenteditable] ol { list-decimal pl-5 }
```

---

## 8. Interaction Patterns & UX Decisions

### 8.1 Locking Mechanism

Once the user saves job details via the `ApplicationModal`, the details are **permanently locked for the session**. The modal becomes read-only. This simulates a "one application = one CV version" paradigm. The note in the modal says: *"If you want to tailor your CV to a different job, you'll create a new version."*

### 8.2 Nudge Flow

When a user is on Experience/Skills/Summary and uses an AI suggestion ("Use this") **without having locked job details**, the app nudges them to save their target job by opening the `ApplicationModal` with the title "Do you want to save your target job details?". The user can dismiss with "Not yet".

### 8.3 Context Override on Experience

The Experience page uses `overrideRole` to derive the AI context from the **Title/Position field** of the active experience entry, not from the global `coachRole`. This means:
- The context input in ContentCoach is **read-only** on the Experience page
- The label says "Using title/position for this experience" instead of "Using custom context"
- If the title field is empty, it falls back to `officialJD.role`, then to empty

### 8.4 Auto-Generation

On the **first visit** to any page (tracked by `visitedPages` Set), if there's role context available, the ContentCoach automatically generates suggestions after a 500ms delay. This only happens once per page per session.

### 8.5 Skill Chips

- **Drag-and-drop** reordering via native HTML5 drag API
- **Click-to-edit** inline editing (click text → becomes input → blur/Enter commits)
- **Duplicate prevention**: Case-insensitive check before adding
- **Default skills**: 6 PM-related skills pre-populated

### 8.6 Mobile Responsiveness

- Below `lg` breakpoint: Only the editor column is shown
- A fixed bottom button "Preview your resume" opens a full-screen overlay with the CV preview
- The overlay has a close button in a top bar
- The preview panel (right 40%) is `hidden` below `lg`

---

## 9. File Structure Summary

```
src/
├── App.tsx                      # Routes + providers
├── main.tsx                     # Entry point
├── index.css                    # Tailwind + design tokens
├── contexts/
│   └── CVContext.tsx             # Global state (all resume data)
├── pages/
│   ├── JobDetailsPage.tsx       # Landing page, auto-opens modal
│   ├── ExperiencePage.tsx       # Experience entries editor
│   ├── SkillsPage.tsx           # Skill tags manager
│   ├── SummaryPage.tsx          # Professional summary editor
│   └── NotFound.tsx             # 404 page
├── components/
│   ├── EditorLayout.tsx         # Two-column layout wrapper
│   ├── EditorHeader.tsx         # Nav bar + persistent chip
│   ├── LivePreview.tsx          # Real-time CV preview
│   ├── ContentCoach.tsx         # AI suggestion engine
│   ├── RichTextEditor.tsx       # contentEditable rich editor
│   ├── PersistentChip.tsx       # Clickable job status chip
│   ├── ApplicationModal.tsx     # Job details modal (set/view)
│   ├── NavLink.tsx              # Router NavLink wrapper
│   └── ui/                      # shadcn/ui components
├── data/
│   └── suggestions.ts           # Static suggestion data
├── hooks/
│   ├── use-mobile.tsx           # Mobile breakpoint hook
│   └── use-toast.ts             # Toast hook
└── lib/
    └── utils.ts                 # cn() utility
```

---

## 10. Known Limitations & Future Considerations

1. **No persistence**: All data is lost on page refresh (in-memory React state only).
2. **No real AI**: Suggestions are hardcoded static data with a simulated 600ms delay. The architecture is ready for API integration.
3. **Single experience coaching**: ContentCoach is only attached to the first experience entry (`activeIndex = 0`). Additional entries don't have AI assistance.
4. **No PDF export**: The LivePreview is display-only; there's no download/export functionality.
5. **Locking is permanent**: Once job details are locked, they cannot be unlocked or edited within the session.
6. **Product Manager domain only**: All suggestion content is PM-specific. Multi-domain support would require dynamic suggestion generation.
7. **`document.execCommand`**: The RichTextEditor uses the deprecated `execCommand` API. A migration to a proper editor library (Tiptap, Slate, etc.) may be needed.
