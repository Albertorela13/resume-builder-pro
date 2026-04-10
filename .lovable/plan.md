

## Plan: Apply draw-outline animation to PersistentChip

Replace the current hover style on the PersistentChip button with the sequential border-draw animation from the provided example.

### Changes

**`src/components/PersistentChip.tsx`**

- Replace the `<button>` with a styled button that includes the four `<span>` elements for the animated border effect (top → right → bottom → left).
- Swap `hover:border-ai-purple/30 hover:bg-muted/70 hover:shadow-sm` for `hover:text-ai-purple` transition and the four absolute-positioned spans using `bg-ai-purple` instead of `bg-indigo-300`.
- Keep `rounded-full` removed (the draw-outline effect works with sharp corners). Alternatively, keep a slight `rounded-md` if preferred — the animation still works.
- Keep all existing content (icons, text, status indicators) unchanged inside the button.

The four spans create a sequential clockwise border animation on hover using staggered Tailwind `delay-` classes.

