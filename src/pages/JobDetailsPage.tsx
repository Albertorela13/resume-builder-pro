import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCV } from "@/contexts/CVContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export default function JobDetailsPage() {
  const navigate = useNavigate();
  const { officialLocked, lockOfficial } = useCV();
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (officialLocked) {
      navigate("/summary", { replace: true });
    }
  }, [officialLocked, navigate]);

  const handleSubmit = () => {
    if (!role.trim()) {
      setError("Target role is required");
      return;
    }
    lockOfficial(role.trim(), jd.trim());
    navigate("/summary");
  };

  if (officialLocked) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ai-purple/10">
            <Briefcase className="h-6 w-6 text-ai-purple" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">What job are you applying to?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This helps us tailor your CV content to the specific role.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Target Role <span className="text-destructive">*</span>
            </label>
            <Input
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setError("");
              }}
              placeholder="e.g. Senior Product Manager"
              className="mt-1"
            />
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Job Description</label>
            <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here for better suggestions…"
              className="mt-1"
              rows={6}
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-ai-purple text-ai-purple-foreground hover:bg-ai-purple/90"
            size="lg"
          >
            Continue
          </Button>

          <div className="text-center">
            <button
              onClick={() => navigate("/summary")}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Skip for now — I'll add this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
