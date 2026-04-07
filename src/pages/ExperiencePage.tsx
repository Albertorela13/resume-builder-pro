import { useCallback } from "react";
import { useCV, type ExpEntry } from "@/contexts/CVContext";
import { EditorLayout } from "@/components/EditorLayout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ContentCoach } from "@/components/ContentCoach";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { experienceSuggestions } from "@/data/suggestions";
import { CheckCircle2, Calendar, Plus } from "lucide-react";
import type { GenKey } from "@/data/suggestions";

export default function ExperiencePage() {
  const { expData, setExpData } = useCV();

  const updateEntry = useCallback(
    (index: number, field: keyof ExpEntry, value: string | boolean) => {
      setExpData((prev: ExpEntry[]) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: value };
        if (field === "current" && value === true) {
          next[index].endDate = "";
        }
        return next;
      });
    },
    [setExpData]
  );

  const addEntry = useCallback(() => {
    setExpData((prev: ExpEntry[]) => [
      ...prev,
      { title: "", company: "", functions: "", location: "", startDate: "", endDate: "", current: false },
    ]);
  }, [setExpData]);

  // Coach operates on the first entry's functions field
  const activeIndex = 0;
  const activeEntry = expData[activeIndex];

  const handleInsert = useCallback(
    (content: string) => {
      setExpData((prev: ExpEntry[]) => {
        const next = [...prev];
        const current = next[activeIndex].functions;
        next[activeIndex] = {
          ...next[activeIndex],
          functions: current.trim() ? current + "\n" + content : content,
        };
        return next;
      });
    },
    [setExpData]
  );

  const handleReplace = useCallback(
    (content: string) => {
      setExpData((prev: ExpEntry[]) => {
        const next = [...prev];
        next[activeIndex] = { ...next[activeIndex], functions: content };
        return next;
      });
    },
    [setExpData]
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
                  onClick={() =>
                    setExpData((prev: ExpEntry[]) => prev.filter((_, idx) => idx !== i))
                  }
                  className="text-destructive text-xs"
                >
                  Remove
                </Button>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                Title / Position
                {entry.title.trim() && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
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

            {/* Functions */}
            <div>
              <label className="text-sm font-medium text-foreground">Functions and achievements</label>
              <div className="mt-1">
                <RichTextEditor
                  value={entry.functions}
                  onChange={(html) => updateEntry(i, "functions", html)}
                  onGenerateClick={i === activeIndex ? undefined : undefined}
                  placeholder="Describe your key responsibilities and achievements…"
                  minHeight={100}
                />
              </div>
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
          </div>
        ))}

        <Button variant="outline" onClick={addEntry} className="w-full gap-1.5">
          <Plus className="h-4 w-4" />
          Add another
        </Button>
      </div>

      <ContentCoach
        pageKey="experience"
        fieldValue={activeEntry?.functions || ""}
        onInsert={handleInsert}
        onReplace={handleReplace}
        getSuggestions={getSuggestions}
      />
    </EditorLayout>
  );
}
