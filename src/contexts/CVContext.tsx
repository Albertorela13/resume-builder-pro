import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export interface ExpEntry {
  title: string;
  company: string;
  functions: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface CVState {
  officialJD: { role: string; jd: string };
  roleLocked: boolean;
  officialLocked: boolean;
  coachRole: string;
  coachIsOfficial: boolean;
  summaryText: string;
  skillTags: string[];
  expData: ExpEntry[];
  visitedPages: Set<string>;
}

interface CVContextType extends CVState {
  setOfficialJD: (jd: { role: string; jd: string }) => void;
  lockRole: (role: string) => void;
  lockOfficial: (role: string, jd: string) => void;
  setCoachRole: (role: string) => void;
  setSummaryText: (text: string) => void;
  setSkillTags: (tags: string[]) => void;
  setExpData: (data: ExpEntry[]) => void;
  markPageVisited: (page: string) => boolean;
  genKey: () => "full" | "role" | "none";
}

const CVContext = createContext<CVContextType | null>(null);

const DEFAULT_SKILLS = [
  "Product strategy",
  "Roadmap planning",
  "Agile/Scrum",
  "Data analysis",
  "Stakeholder management",
  "User research",
];

const EMPTY_EXP: ExpEntry = {
  title: "",
  company: "",
  functions: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
};

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [officialJD, setOfficialJD] = useState({ role: "", jd: "" });
  const [roleLocked, setRoleLocked] = useState(false);
  const [officialLocked, setOfficialLocked] = useState(false);
  const [coachRole, setCoachRole] = useState("");
  const [coachIsOfficial, setCoachIsOfficial] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [skillTags, setSkillTags] = useState<string[]>(DEFAULT_SKILLS);
  const [expData, setExpData] = useState<ExpEntry[]>([{ ...EMPTY_EXP }]);
  const [visitedPages] = useState<Set<string>>(new Set());

  const lockRole = useCallback((role: string) => {
    setOfficialJD(prev => ({ ...prev, role }));
    setRoleLocked(true);
    setCoachRole(role);
  }, []);

  const lockOfficial = useCallback((role: string, jd: string) => {
    setOfficialJD({ role, jd });
    setRoleLocked(true);
    setOfficialLocked(true);
    setCoachRole(role);
    setCoachIsOfficial(jd.trim() !== "");
  }, []);

  const genKey = useCallback((): "full" | "role" | "none" => {
    if (officialLocked && officialJD.jd.trim() !== "" && coachRole.trim() === officialJD.role.trim()) {
      return "full";
    }
    if (coachRole.trim() !== "") return "role";
    return "none";
  }, [officialLocked, officialJD, coachRole]);

  const markPageVisited = useCallback(
    (page: string) => {
      if (visitedPages.has(page)) return false;
      visitedPages.add(page);
      return true;
    },
    [visitedPages]
  );

  const value = useMemo(
    () => ({
      officialJD,
      roleLocked,
      officialLocked,
      coachRole,
      coachIsOfficial,
      summaryText,
      skillTags,
      expData,
      visitedPages,
      setOfficialJD,
      lockRole,
      lockOfficial,
      setCoachRole,
      setCoachIsOfficial,
      setSummaryText,
      setSkillTags,
      setExpData,
      markPageVisited,
      genKey,
    }),
    [officialJD, roleLocked, officialLocked, coachRole, coachIsOfficial, summaryText, skillTags, expData, visitedPages, lockRole, lockOfficial, markPageVisited, genKey]
  );

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
}

export function useCV() {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error("useCV must be used within CVProvider");
  return ctx;
}
