import { useState, useEffect, useCallback } from "react";
import { useCV } from "@/contexts/CVContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SuggestionItem } from "@/data/suggestions";

interface ContentCoachProps {
  pageKey: string;
  fieldValue: string;
  onInsert: (content: string) => void;
  onReplace?: (content: string) => void;
  getSuggestions: (key: "full" | "role" | "none") => SuggestionItem[] | string[];
  hideImprove?: boolean;
  onNudge?: () => void;
}

export function ContentCoach({
  pageKey,
  fieldValue,
  onInsert,
  onReplace,
  getSuggestions,
  hideImprove = false,
  onNudge,
}: ContentCoachProps) {
  const {
    coachRole,
    setCoachRole,
    officialJD,
    officialLocked,
    genKey,
    markPageVisited,
  } = useCV();

  const [suggestions, setSuggestions] = useState<(SuggestionItem | string)[]>([]);
  const [loading, setLoading] = useState(false);
  const [improvedText, setImprovedText] = useState("");
  const [showContext, setShowContext] = useState(false);

  const isOfficial =
    officialLocked && coachRole.trim().toLowerCase() === officialJD.role.trim().toLowerCase();
  const hasContext = coachRole.trim() !== "";

  const doGenerate = useCallback(() => {
    setLoading(true);
    setSuggestions([]);
    setImprovedText("");
    setTimeout(() => {
      const key = genKey();
      const results = getSuggestions(key);
      setSuggestions(results);
      setLoading(false);
    }, 600);
  }, [genKey, getSuggestions]);

  // Auto-generate on first visit
  useEffect(() => {
    const isFirst = markPageVisited(pageKey);
    if (isFirst && (coachRole.trim() || officialJD.role.trim())) {
      const timer = setTimeout(() => {
        setShowContext(true);
        doGenerate();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerate = () => {
    setShowContext(true);
    doGenerate();
  };

  const handleInsert = (content: string) => {
    onInsert(content);
    if (!officialLocked && onNudge) {
      onNudge();
    }
  };

  const handleImprove = () => {
    if (!fieldValue.trim()) return;
    setShowContext(true);
    setLoading(true);
    setTimeout(() => {
      const cleaned = fieldValue.replace(/<[^>]+>/g, "").trim();
      setImprovedText(
        `Refined and enhanced: ${cleaned} — with a focus on measurable outcomes and strategic impact.`
      );
      setLoading(false);
    }, 600);
  };

  return (
    <div className="mt-3 space-y-3">
      {/* Action Buttons — close to the field */}
      <div className="flex gap-2">
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-ai-purple text-ai-purple-foreground hover:bg-ai-purple/90 gap-1.5"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate
        </Button>
        {!hideImprove && fieldValue.trim() && onReplace && (
          <Button onClick={handleImprove} disabled={loading} variant="outline" className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Improve
          </Button>
        )}
      </div>

      {/* Context Block — hidden until Generate is clicked */}
      {showContext && (
        <div className="rounded-lg border border-coach-border bg-coach-bg p-3">
          <div className="flex items-center gap-2 text-xs">
            {isOfficial ? (
              <span className="flex items-center gap-1 text-success">
                <Check className="h-3 w-3" /> Using official job details
              </span>
            ) : hasContext ? (
              <span className="flex items-center gap-1 text-ai-purple">
                <Sparkles className="h-3 w-3" /> Using custom context
                {officialLocked && (
                  <button
                    onClick={() => setCoachRole(officialJD.role)}
                    className="ml-1 underline text-ai-purple hover:text-ai-purple/80"
                  >
                    Restore official
                  </button>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">No context — results will be generic</span>
            )}
          </div>
          <Input
            value={coachRole}
            onChange={(e) => setCoachRole(e.target.value)}
            placeholder="Target role (e.g. Product Manager)"
            className="mt-2 text-sm"
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating suggestions…
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && !loading && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Suggestions</p>
          {suggestions.map((item, i) => {
            const isString = typeof item === "string";
            const title = isString ? undefined : (item as SuggestionItem).title;
            const content = isString ? (item as string) : (item as SuggestionItem).content;

            // Skill-style flat row for string items
            if (isString) {
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border bg-background px-3 py-2"
                >
                  <span className="text-sm text-foreground">{content}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleInsert(content)}
                    className="text-xs text-ai-purple hover:text-ai-purple/80 shrink-0"
                  >
                    Use this
                  </Button>
                </div>
              );
            }

            // Card-style for SuggestionItem
            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg border bg-background p-3 transition-colors hover:border-ai-purple/40"
                )}
              >
                {title && (
                  <p className="mb-1 text-xs font-semibold text-foreground">{title}</p>
                )}
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {content.length > 200 ? content.slice(0, 200) + "…" : content}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleInsert(content)}
                  className="mt-2 text-xs text-ai-purple hover:text-ai-purple/80"
                >
                  Use this
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Improved text */}
      {improvedText && !loading && (
        <div className="rounded-lg border border-success/30 bg-success/5 p-3">
          <p className="text-xs font-medium text-success mb-1">Improved version</p>
          <p className="text-sm text-foreground">{improvedText}</p>
          <Button
            size="sm"
            onClick={() => {
              onReplace?.(improvedText);
              setImprovedText("");
            }}
            className="mt-2 bg-success text-success-foreground hover:bg-success/90 text-xs"
          >
            Apply to CV
          </Button>
        </div>
      )}
    </div>
  );
}
