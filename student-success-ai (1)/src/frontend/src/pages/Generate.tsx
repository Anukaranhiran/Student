import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  LogIn,
  Map as MapIcon,
  RefreshCw,
  Save,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveRoadmap } from "../hooks/useQueries";
import {
  generateCareerAdvice,
  generateRoadmap,
  generateStudyPlan,
} from "../lib/gemini";

function ContentSkeleton() {
  return (
    <div className="space-y-3" data-ocid="generate.loading_state">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
        <Skeleton
          key={`skel-${n}`}
          className="h-4 rounded"
          style={{ width: `${85 + (n % 3) * 5}%` }}
        />
      ))}
    </div>
  );
}

export default function Generate() {
  const search: any = useSearch({ strict: false });
  const navigate = useNavigate();
  const goal: string = search?.goal ?? "";
  const field: string = search?.field ?? "";

  const [roadmap, setRoadmap] = useState("");
  const [studyPlan, setStudyPlan] = useState("");
  const [careerAdvice, setCareerAdvice] = useState("");
  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("roadmap");
  const [saved, setSaved] = useState(false);

  const { mutateAsync: saveRoadmap, isPending: isSaving } = useSaveRoadmap();
  const { identity, loginStatus } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const handleGenerate = useCallback(
    async (tab: string) => {
      if (!goal) return;
      setLoadingTab(tab);
      setSaved(false);
      try {
        if (tab === "roadmap") {
          const result = await generateRoadmap(goal, field);
          setRoadmap(result);
        } else if (tab === "studyplan") {
          const result = await generateStudyPlan(goal);
          setStudyPlan(result);
        } else if (tab === "career") {
          const result = await generateCareerAdvice(goal);
          setCareerAdvice(result);
        }
      } catch (err: any) {
        toast.error(err?.message ?? "Failed to generate content");
      } finally {
        setLoadingTab(null);
      }
    },
    [goal, field],
  );

  useEffect(() => {
    if (goal && field && !roadmap) {
      handleGenerate("roadmap");
    }
  }, [goal, field, handleGenerate, roadmap]);

  async function handleSave() {
    if (!roadmap) {
      toast.error("Generate a roadmap first before saving.");
      return;
    }
    try {
      await saveRoadmap({
        title: `${goal} — ${field}`,
        content: roadmap,
        studyPlan: studyPlan || undefined,
        careerAdvice: careerAdvice || undefined,
        createdAt: BigInt(Date.now()),
      });
      setSaved(true);
      toast.success("Roadmap saved successfully!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save roadmap");
    }
  }

  if (!goal) {
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="generate.empty_state"
      >
        <p className="text-muted-foreground mb-4">
          No goal specified. Go back and fill in the form.
        </p>
        <Button
          onClick={() => navigate({ to: "/" })}
          data-ocid="generate.back.button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            data-ocid="generate.back.button"
            className="text-muted-foreground mb-3 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {goal}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="secondary"
              className="text-xs bg-primary/10 text-primary border-primary/20"
            >
              {field}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isLoggedIn ? (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <LogIn className="w-4 h-4" /> Login to save
            </p>
          ) : (
            <Button
              onClick={handleSave}
              disabled={isSaving || saved || !roadmap}
              data-ocid="generate.save.primary_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : saved ? "Saved ✓" : "Save Roadmap"}
            </Button>
          )}
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className="bg-card/50 border border-border/50 mb-6"
          data-ocid="generate.tabs"
        >
          <TabsTrigger
            value="roadmap"
            data-ocid="generate.roadmap.tab"
            className="flex items-center gap-1.5"
          >
            <MapIcon className="w-3.5 h-3.5" /> Roadmap
          </TabsTrigger>
          <TabsTrigger
            value="studyplan"
            data-ocid="generate.studyplan.tab"
            className="flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" /> Study Plan
          </TabsTrigger>
          <TabsTrigger
            value="career"
            data-ocid="generate.career.tab"
            className="flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" /> Career Advice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap">
          <AnimatePresence mode="wait">
            <motion.div
              key="roadmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-primary" /> Career Roadmap
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerate("roadmap")}
                    disabled={loadingTab === "roadmap"}
                    data-ocid="generate.roadmap.button"
                    className="border-border/60"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 mr-1.5 ${loadingTab === "roadmap" ? "animate-spin" : ""}`}
                    />
                    {roadmap ? "Regenerate" : "Generate"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingTab === "roadmap" ? (
                    <ContentSkeleton />
                  ) : roadmap ? (
                    <MarkdownRenderer content={roadmap} />
                  ) : (
                    <div
                      className="text-center py-12"
                      data-ocid="generate.roadmap.empty_state"
                    >
                      <MapIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        Click Generate to create your roadmap
                      </p>
                      <Button
                        className="mt-4 bg-primary text-primary-foreground"
                        onClick={() => handleGenerate("roadmap")}
                        data-ocid="generate.roadmap.primary_button"
                      >
                        <Sparkles className="w-4 h-4 mr-2" /> Generate Roadmap
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="studyplan">
          <AnimatePresence mode="wait">
            <motion.div
              key="studyplan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" /> 12-Week Study
                    Plan
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerate("studyplan")}
                    disabled={loadingTab === "studyplan"}
                    data-ocid="generate.studyplan.button"
                    className="border-border/60"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 mr-1.5 ${loadingTab === "studyplan" ? "animate-spin" : ""}`}
                    />
                    {studyPlan ? "Regenerate" : "Generate"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingTab === "studyplan" ? (
                    <ContentSkeleton />
                  ) : studyPlan ? (
                    <MarkdownRenderer content={studyPlan} />
                  ) : (
                    <div
                      className="text-center py-12"
                      data-ocid="generate.studyplan.empty_state"
                    >
                      <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        Click Generate to create your study plan
                      </p>
                      <Button
                        className="mt-4 bg-accent text-accent-foreground"
                        onClick={() => handleGenerate("studyplan")}
                        data-ocid="generate.studyplan.primary_button"
                      >
                        <Sparkles className="w-4 h-4 mr-2" /> Generate Study
                        Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="career">
          <AnimatePresence mode="wait">
            <motion.div
              key="career"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" /> Career
                    Advice
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGenerate("career")}
                    disabled={loadingTab === "career"}
                    data-ocid="generate.career.button"
                    className="border-border/60"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 mr-1.5 ${loadingTab === "career" ? "animate-spin" : ""}`}
                    />
                    {careerAdvice ? "Regenerate" : "Generate"}
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingTab === "career" ? (
                    <ContentSkeleton />
                  ) : careerAdvice ? (
                    <MarkdownRenderer content={careerAdvice} />
                  ) : (
                    <div
                      className="text-center py-12"
                      data-ocid="generate.career.empty_state"
                    >
                      <TrendingUp className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        Click Generate to get career advice
                      </p>
                      <Button
                        className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => handleGenerate("career")}
                        data-ocid="generate.career.primary_button"
                      >
                        <Sparkles className="w-4 h-4 mr-2" /> Get Career Advice
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
