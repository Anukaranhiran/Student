import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RoadmapId {
    userId: Principal;
    roadmapId: bigint;
}
export interface Roadmap {
    title: string;
    careerAdvice?: string;
    content: string;
    createdAt: bigint;
    studyPlan?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteRoadmap(roadmapId: RoadmapId): Promise<void>;
    getAllUserRoadmapIds(userId: Principal): Promise<Array<RoadmapId>>;
    getCallerUserRole(): Promise<UserRole>;
    getRoadmap(roadmapId: RoadmapId): Promise<Roadmap>;
    getUserRoadmaps(userId: Principal): Promise<Array<Roadmap>>;
    isCallerAdmin(): Promise<boolean>;
    saveRoadmap(roadmap: Roadmap): Promise<RoadmapId>;
}
