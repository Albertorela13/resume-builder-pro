import { useState, useCallback, useMemo } from "react";
import { useCV, type ExpEntry } from "@/contexts/CVContext";
import { EditorLayout } from "@/components/EditorLayout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ContentCoach } from "@/components/ContentCoach";
import { ApplicationModal } from "@/components/ApplicationModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { experienceSuggestions } from "@/data/suggestions";
import { CheckCircle2, Calendar, Plus } from "lucide-react";
import type { GenKey } from "@/data/suggestions";

export default function ExperiencePage() {
  const { expData, setExpData, officialJD } = useCV();
  const [nudgeOpen, setNudgeOpen] = useState(false);

  const updateEntry = useCallback(
    (index: number, field: keyof ExpEntry, value: string | boolean) => {
      const next = [...expData];
      next[index] = { ...next[index], [field]: value };
      if (field === "current" && value === true) {
        next[index].endDate = "";
      }
      setExpData(next);
    },
    [expData, setExpData]
  );

  const addEntry = useCallback(() => {
    setExpData([
      ...expData,
      { title: "", company: "", functions: "", location: "", startDate: "", endDate: "", current: false },
    ]);
  }, [expData, setExpData]);

  const activeIndex = 0;
  const activeEntry = expData[activeIndex];

  // Context priority: 1) entry title, 2) officialJD.role, 3) empty
  const contextRole = useMemo(() => {
    const entryTitle = activeEntry?.title?.trim() || "";
    if (entryTitle) return entryTitle;
    const official = officialJD.role?.trim() || "";
    if (official) return official;
    return "";
  }, [activeEntry?.title, officialJD.role]);

  const handleInsert = useCallback(
    (content: string) => {
      const next = [...expData];
      const current = next[activeIndex].functions;
      next[activeIndex] = {
        ...next[activeIndex],
        functions: current.trim() ? current + "\n" + content : content,
      };
      setExpData(next);
    },
    [expData, setExpData]
  );

  const handleReplace = useCallback(
    (content: string) => {
      const next = [...expData];
      next[activeIndex] = { ...next[activeIndex], functions: content };
      setExpData(next);
    },
    [expData, setExpData]
  );

  const getSuggestions = useCallback((key: GenKey) => experienceSuggestions[key], []);

  return (
    <EditorLayout>
      <div className="space-y-6">
        {expData.map((entry, i) => (
          <div key={i} className="space-y-4 rounded-lg border bg-background p-4">
            {i > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Experience {i + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpData(expData.filter((_, idx) => idx !== i))}
                  className="text-xs text-destructive"
                >
                  Remove
                </Button>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                Title / Position
                {entry.title.trim() && <CheckCircle2 className="h-4 w-4 text-ai-purple" />}
              </label>
              <Input
                value={entry.title}
                onChange={(e) => updateEntry(i, "title", e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="mt-1"
              />
            </div>

            {/* Company */}
            <div>
              <label className="text-sm font-medium text-foreground">Company</label>
              <Input
                value={entry.company}
                onChange={(e) => updateEntry(i, "company", e.target.value)}
                placeholder="e.g. Acme Inc."
                className="mt-1"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-foreground">Location</label>
              <Input
                value={entry.location}
                onChange={(e) => updateEntry(i, "location", e.target.value)}
                placeholder="Location (City, State)"
                className="mt-1"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Start Date</label>
                <div className="relative mt-1">
                  <Input
                    value={entry.startDate}
                    onChange={(e) => updateEntry(i, "startDate", e.target.value)}
                    placeholder="MM/YYYY"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">End Date</label>
                <div className="relative mt-1">
                  <Input
                    value={entry.current ? "" : entry.endDate}
                    onChange={(e) => updateEntry(i, "endDate", e.target.value)}
                    placeholder="MM/YYYY"
                    disabled={entry.current}
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Current job */}
            <div className="flex items-center gap-2">
              <Checkbox
                id={`current-${i}`}
                checked={entry.current}
                onCheckedChange={(checked) => updateEntry(i, "current", !!checked)}
              />
              <label htmlFor={`current-${i}`} className="text-sm text-foreground cursor-pointer">
                I'm in this job right now
              </label>
            </div>

            {/* Functions and achievements */}
            <div>
              <label className="text-sm font-medium text-foreground">Functions and achievements</label>
              <div className="mt-1">
                <RichTextEditor
                  value={entry.functions}
                  onChange={(html) => updateEntry(i, "functions", html)}
                  placeholder="Describe your key responsibilities and achievements…"
                  minHeight={100}
                />
              </div>
            </div>

            {i === activeIndex && (
              <ContentCoach
                pageKey="experience"
                fieldValue={activeEntry?.functions || ""}
                onInsert={handleInsert}
                onReplace={handleReplace}
                getSuggestions={getSuggestions}
                onNudge={() => setNudgeOpen(true)}
                overrideRole={activeEntry?.title?.trim() || ""}
              />
            )}
          </div>
        ))}

        <Button variant="outline" onClick={addEntry} className="w-full gap-1.5">
          <Plus className="h-4 w-4" />
          Add another
        </Button>
      </div>

      <div />

      <ApplicationModal open={nudgeOpen} onClose={() => setNudgeOpen(false)} nudge />
    </EditorLayout>
  );
}
