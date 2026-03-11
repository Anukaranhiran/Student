import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Roadmap, RoadmapId } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetUserRoadmaps() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Roadmap[]>({
    queryKey: ["userRoadmaps", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserRoadmaps(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSaveRoadmap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (roadmap: Roadmap) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveRoadmap(roadmap);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userRoadmaps", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useDeleteRoadmap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (roadmapId: RoadmapId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteRoadmap(roadmapId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userRoadmaps", identity?.getPrincipal().toString()],
      });
    },
  });
}
