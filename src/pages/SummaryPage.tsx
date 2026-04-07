import { useCallback } from "react";
import { useCV } from "@/contexts/CVContext";
import { EditorLayout } from "@/components/EditorLayout";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ContentCoach } from "@/components/ContentCoach";
import { summarySuggestions } from "@/data/suggestions";
import type { GenKey } from "@/data/suggestions";

export default function SummaryPage() {
  const { summaryText, setSummaryText } = useCV();

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
      </div>

      <ContentCoach
        pageKey="summary"
        fieldValue={summaryText}
        onInsert={handleInsert}
        onReplace={handleReplace}
        getSuggestions={getSuggestions}
      />
    </EditorLayout>
  );
}
