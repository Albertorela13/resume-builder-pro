import { useCV } from "@/contexts/CVContext";

export function LivePreview() {
  const { summaryText, expData, skillTags, officialJD } = useCV();

  return (
    <div className="h-full overflow-auto bg-preview-bg p-6">
      <div className="mx-auto max-w-[600px] rounded-lg border bg-background p-8 shadow-sm" style={{ minHeight: 800 }}>
        {/* Header */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-foreground">
            {officialJD.role || "Your Name"}
          </h2>
          <p className="text-sm text-muted-foreground">your.email@example.com · (555) 123-4567</p>
        </div>

        {/* Summary */}
        {summaryText.trim() && (
          <section className="mb-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Professional Summary
            </h3>
            <div
              className="text-sm leading-relaxed text-foreground"
              dangerouslySetInnerHTML={{ __html: summaryText }}
            />
          </section>
        )}

        {/* Experience */}
        {expData.some((e) => e.title || e.company || e.functions) && (
          <section className="mb-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Experience
            </h3>
            {expData
              .filter((e) => e.title || e.company || e.functions)
              .map((exp, i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-baseline justify-between">
                    <p className="font-semibold text-sm text-foreground">{exp.title || "Position"}</p>
                    <span className="text-xs text-muted-foreground">
                      {exp.startDate}
                      {exp.startDate && (exp.current ? " – Present" : exp.endDate ? ` – ${exp.endDate}` : "")}
                    </span>
                  </div>
                  {exp.company && (
                    <p className="text-sm text-muted-foreground">
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                  )}
                  {exp.functions && (
                    <div
                      className="mt-1 text-sm leading-relaxed text-foreground"
                      dangerouslySetInnerHTML={{ __html: exp.functions }}
                    />
                  )}
                </div>
              ))}
          </section>
        )}

        {/* Skills */}
        {skillTags.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skillTags.map((skill, i) => (
                <span
                  key={i}
                  className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!summaryText.trim() &&
          !expData.some((e) => e.title || e.company || e.functions) &&
          skillTags.length === 0 && (
            <div className="flex h-60 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Start editing to see your CV preview here
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
