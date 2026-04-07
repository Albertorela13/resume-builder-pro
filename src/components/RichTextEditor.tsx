import { useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onGenerateClick?: () => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  onGenerateClick,
  placeholder = "Start typing…",
  className,
  minHeight = 120,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const toolbarBtns = [
    { icon: Bold, cmd: "bold", label: "Bold" },
    { icon: Italic, cmd: "italic", label: "Italic" },
    { icon: Underline, cmd: "underline", label: "Underline" },
    { icon: List, cmd: "insertUnorderedList", label: "Bullet list" },
    { icon: ListOrdered, cmd: "insertOrderedList", label: "Numbered list" },
    { icon: AlignLeft, cmd: "justifyLeft", label: "Align left" },
    { icon: AlignCenter, cmd: "justifyCenter", label: "Align center" },
    { icon: AlignRight, cmd: "justifyRight", label: "Align right" },
  ];

  return (
    <div className={cn("rich-editor rounded-lg border border-input", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-input bg-secondary/30 px-2 py-1">
        {toolbarBtns.map(({ icon: Icon, cmd, label }) => (
          <button
            key={cmd}
            type="button"
            title={label}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(cmd);
            }}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        {onGenerateClick && (
          <>
            <div className="mx-1 h-5 w-px bg-border" />
            <Button
              type="button"
              size="sm"
              onClick={onGenerateClick}
              className="bg-ai-purple text-ai-purple-foreground hover:bg-ai-purple/90 gap-1.5 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate with AI
            </Button>
          </>
        )}
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleInput}
          className="w-full bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
        {!value && (
          <p className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
            {placeholder}
          </p>
        )}
      </div>
    </div>
  );
}
