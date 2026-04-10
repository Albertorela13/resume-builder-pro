

## Plan: Fix nudge modal condition

### Problem
The nudge modal triggers whenever `officialLocked` is false. But if the user already saved a role in Step 1 (Job Details), and the generation context matches that role, the modal shouldn't appear — the role is already aligned.

### Fix

**`src/components/ContentCoach.tsx`** — Change the nudge condition at line 80 from:

```ts
if (!officialLocked && onNudge) {
```

to:

```ts
if (!officialLocked && onNudge && effectiveRole.trim().toLowerCase() !== officialJD.role.trim().toLowerCase()) {
```

This ensures the nudge only fires when the role being used for generation differs from the officially saved role. If the user already saved "Senior Product Manager" in Job Details, and the experience title or coach role matches it, no nudge appears.

### Files changed
| File | Change |
|---|---|
| `src/components/ContentCoach.tsx` | Update nudge condition to compare `effectiveRole` vs `officialJD.role` |

