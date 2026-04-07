import { useState } from "react";
import { EditorHeader } from "./EditorHeader";
import { LivePreview } from "./LivePreview";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";

export function EditorLayout({ children }: { children: React.ReactNode }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <EditorHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Editor column */}
        <div className="flex-1 overflow-auto lg:w-[60%] lg:flex-none">
          <div className="mx-auto max-w-2xl p-4 lg:p-6">{children}</div>
        </div>

        {/* Desktop preview */}
        <div className="hidden lg:block lg:w-[40%] border-l overflow-auto">
          <LivePreview />
        </div>
      </div>

      {/* Mobile preview toggle */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <Button
          onClick={() => setShowPreview(true)}
          className="w-full bg-ai-purple text-ai-purple-foreground hover:bg-ai-purple/90 shadow-lg gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview your resume
        </Button>
      </div>

      {/* Mobile preview overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-50 lg:hidden bg-background flex flex-col">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="font-semibold text-foreground">CV Preview</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            <LivePreview />
          </div>
        </div>
      )}
    </div>
  );
}
