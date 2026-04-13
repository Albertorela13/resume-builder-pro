

## Plan: Auto-generate suggestions on first page visit (even without job details)

### Problem
Currently, `ContentCoach` only auto-triggers suggestions on first visit when `effectiveRole` or `officialJD.role` exists (line 66). If neither is set, the user sees nothing on first visit to Experience, Skills, or Summary.

### Fix

**`src/components/ContentCoach.tsx`** — Line 66: Remove the role check from the auto-generate condition.

Change:
```ts
if (isFirst && (effectiveRole.trim() || officialJD.role.trim())) {
```
To:
```ts
if (isFirst) {
```

This way, on first visit to any page, suggestions auto-generate using whichever `genKey()` applies — `"full"`, `"role"`, or `"none"` (generic). The `genKey()` and `getSuggestions()` logic already handles all three cases correctly.

### Files changed
| File | Change |
|---|---|
| `src/components/ContentCoach.tsx` | Remove role guard from auto-generate condition (line 66) |

