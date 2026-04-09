import { useState, useCallback } from "react";
import { useCV } from "@/contexts/CVContext";
import { EditorLayout } from "@/components/EditorLayout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ContentCoach } from "@/components/ContentCoach";
import { ApplicationModal } from "@/components/ApplicationModal";
import { summarySuggestions } from "@/data/suggestions";
import type { GenKey } from "@/data/suggestions";

export default function SummaryPage() {
  const { summaryText, setSummaryText } = useCV();
  const [nudgeOpen, setNudgeOpen] = useState(false);

  const handleInsert = useCallback(
    (content: string) => {
      setSummaryText(summaryText.trim() ? summaryText + "\n\n" + content : content);
    },
    [setSummaryText, summaryText]
  );

  const handleReplace = useCallback(
    (content: string) => {
      setSummaryText(content);
    },
    [setSummaryText]
  );

  const getSuggestions = useCallback((key: GenKey) => summarySuggestions[key], []);

  return (
    <EditorLayout>
      <div className="space-y-2">
        <RichTextEditor
          value={summaryText}
          onChange={setSummaryText}
          placeholder="Write your professional summary…"
          minHeight={180}
        />
        <ContentCoach
          pageKey="summary"
          fieldValue={summaryText}
          onInsert={handleInsert}
          onReplace={handleReplace}
          getSuggestions={getSuggestions}
          onNudge={() => setNudgeOpen(true)}
        />
      </div>

      <div />

      <ApplicationModal open={nudgeOpen} onClose={() => setNudgeOpen(false)} />
    </EditorLayout>
  );
}
