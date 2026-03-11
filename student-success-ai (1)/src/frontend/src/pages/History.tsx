import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Eye,
  FolderOpen,
  LogIn,
  Map as MapIcon,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Roadmap, RoadmapId } from "../backend.d";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useDeleteRoadmap, useGetUserRoadmaps } from "../hooks/useQueries";

function RoadmapCard({
  roadmap,
  index,
  onView,
  onDelete,
  isDeleting,
}: {
  roadmap: Roadmap;
  index: number;
  onView: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const date = new Date(Number(roadmap.createdAt)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const preview = `${roadmap.content.slice(0, 150).replace(/[#*]/g, "")}...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      data-ocid={`history.item.${index + 1}`}
    >
      <Card className="glass-card border-border/40 hover:border-border/70 transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex-1 min-w-0 mb-3">
            <h3 className="font-display font-semibold text-foreground text-base mb-1 truncate">
              {roadmap.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{date}</span>
              <div className="flex gap-1">
                {roadmap.studyPlan && (
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 h-4 border-accent/30 text-accent"
                  >
                    Study Plan
                  </Badge>
                )}
                {roadmap.careerAdvice && (
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 h-4 border-emerald-500/30 text-emerald-400"
                  >
                    Career Advice
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {preview}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onView}
              data-ocid={`history.view.button.${index + 1}`}
              className="border-border/50 text-xs"
            >
              <Eye className="w-3.5 h-3.5 mr-1" /> View
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`history.delete_button.${index + 1}`}
                  className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                data-ocid="history.delete.dialog"
                className="glass-card border-border/50"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Roadmap</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{roadmap.title}"? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="history.delete.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    disabled={isDeleting}
                    data-ocid="history.delete.confirm_button"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function History() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { data: roadmaps, isLoading } = useGetUserRoadmaps();
  const { mutateAsync: deleteRoadmap, isPending: isDeleting } =
    useDeleteRoadmap();
  const [viewRoadmap, setViewRoadmap] = useState<Roadmap | null>(null);
  const [viewTab, setViewTab] = useState("roadmap");

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">
          Login to View History
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Your saved roadmaps will appear here once you log in.
        </p>
        <Button
          onClick={login}
          data-ocid="history.login.primary_button"
          className="bg-primary text-primary-foreground"
        >
          <LogIn className="w-4 h-4 mr-2" /> Login
        </Button>
      </div>
    );
  }

  async function handleDelete(roadmapId: RoadmapId) {
    try {
      await deleteRoadmap(roadmapId);
      toast.success("Roadmap deleted");
    } catch {
      toast.error("Failed to delete roadmap");
    }
  }

  const roadmapList = roadmaps ?? [];

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
          My Roadmaps
        </h1>
        <p className="text-muted-foreground text-sm">
          {roadmapList.length} saved roadmap
          {roadmapList.length !== 1 ? "s" : ""}
        </p>
      </motion.div>

      {isLoading ? (
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="history.loading_state"
        >
          {[0, 1, 2].map((n) => (
            <Card key={`skel-${n}`} className="glass-card border-border/40">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-12 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : roadmapList.length === 0 ? (
        <div className="text-center py-20" data-ocid="history.empty_state">
          <FolderOpen className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No Roadmaps Yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Generate and save your first roadmap to see it here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmapList.map((roadmap, rmIdx) => {
            const rmKey = `roadmap-card-${rmIdx}`;
            return (
              <RoadmapCard
                key={rmKey}
                roadmap={roadmap}
                index={rmIdx}
                onView={() => {
                  setViewRoadmap(roadmap);
                  setViewTab("roadmap");
                }}
                onDelete={() => {
                  if (identity) {
                    handleDelete({
                      userId: identity.getPrincipal(),
                      roadmapId: BigInt(rmIdx),
                    });
                  }
                }}
                isDeleting={isDeleting}
              />
            );
          })}
        </div>
      )}

      <Dialog
        open={!!viewRoadmap}
        onOpenChange={(o) => !o && setViewRoadmap(null)}
      >
        <DialogContent
          data-ocid="history.view.dialog"
          className="glass-card border-border/50 max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        >
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="font-display text-xl">
              {viewRoadmap?.title}
            </DialogTitle>
          </DialogHeader>

          {viewRoadmap && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <Tabs
                value={viewTab}
                onValueChange={setViewTab}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <TabsList className="bg-card/50 border border-border/50 flex-shrink-0">
                  <TabsTrigger
                    value="roadmap"
                    data-ocid="history.view.roadmap.tab"
                    className="flex items-center gap-1"
                  >
                    <MapIcon className="w-3.5 h-3.5" /> Roadmap
                  </TabsTrigger>
                  {viewRoadmap.studyPlan && (
                    <TabsTrigger
                      value="studyplan"
                      data-ocid="history.view.studyplan.tab"
                      className="flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Study Plan
                    </TabsTrigger>
                  )}
                  {viewRoadmap.careerAdvice && (
                    <TabsTrigger
                      value="career"
                      data-ocid="history.view.career.tab"
                      className="flex items-center gap-1"
                    >
                      <TrendingUp className="w-3.5 h-3.5" /> Career
                    </TabsTrigger>
                  )}
                </TabsList>
                <div className="flex-1 overflow-y-auto mt-4 pr-2">
                  <TabsContent value="roadmap" className="mt-0">
                    <MarkdownRenderer content={viewRoadmap.content} />
                  </TabsContent>
                  {viewRoadmap.studyPlan && (
                    <TabsContent value="studyplan" className="mt-0">
                      <MarkdownRenderer content={viewRoadmap.studyPlan} />
                    </TabsContent>
                  )}
                  {viewRoadmap.careerAdvice && (
                    <TabsContent value="career" className="mt-0">
                      <MarkdownRenderer content={viewRoadmap.careerAdvice} />
                    </TabsContent>
                  )}
                </div>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
