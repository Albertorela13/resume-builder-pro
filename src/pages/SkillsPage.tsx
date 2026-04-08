import { useState, useCallback, useRef } from "react";
import { useCV } from "@/contexts/CVContext";
import { EditorLayout } from "@/components/EditorLayout";
import { ContentCoach } from "@/components/ContentCoach";
import { NudgeModal } from "@/components/NudgeModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { skillsSuggestions } from "@/data/suggestions";
import { GripVertical, X, Plus } from "lucide-react";
import type { GenKey } from "@/data/suggestions";

export default function SkillsPage() {
  const { skillTags, setSkillTags } = useCV();
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [nudgeOpen, setNudgeOpen] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  const addSkill = useCallback(
    (skill: string) => {
      const trimmed = skill.trim();
      if (!trimmed) return;
      if (!skillTags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
        setSkillTags([...skillTags, trimmed]);
      }
    },
    [skillTags, setSkillTags]
  );

  const handleAdd = () => {
    addSkill(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const removeSkill = (index: number) => {
    setSkillTags(skillTags.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(skillTags[index]);
    setTimeout(() => editRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    if (editIndex !== null && editValue.trim()) {
      const next = [...skillTags];
      next[editIndex] = editValue.trim();
      setSkillTags(next);
    }
    setEditIndex(null);
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const next = [...skillTags];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setSkillTags(next);
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  const handleInsert = useCallback(
    (content: string) => {
      addSkill(content);
    },
    [addSkill]
  );

  // Return plain strings for flat row rendering
  const getSuggestions = useCallback((key: GenKey) => skillsSuggestions[key], []);

  return (
    <EditorLayout>
      <div className="space-y-4">
        {/* Add input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a skill…"
            className="flex-1"
          />
          <Button onClick={handleAdd} variant="outline" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Skill chips */}
        <div className="flex flex-wrap gap-2">
          {skillTags.map((skill, i) => (
            <div
              key={`${skill}-${i}`}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className="flex items-center gap-1 rounded-full border bg-secondary px-3 py-1.5 text-sm transition-colors hover:border-ai-purple/30 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
              {editIndex === i ? (
                <input
                  ref={editRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                  className="w-20 bg-transparent text-sm outline-none"
                />
              ) : (
                <span
                  onClick={() => startEdit(i)}
                  className="cursor-text text-secondary-foreground"
                >
                  {skill}
                </span>
              )}
              <button
                onClick={() => removeSkill(i)}
                className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <ContentCoach
          pageKey="skills"
          fieldValue={skillTags.join(", ")}
          onInsert={handleInsert}
          getSuggestions={getSuggestions}
          hideImprove
          onNudge={() => setNudgeOpen(true)}
        />
      </div>

      <div />

      <NudgeModal open={nudgeOpen} onClose={() => setNudgeOpen(false)} />
    </EditorLayout>
  );
}
