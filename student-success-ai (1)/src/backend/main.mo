import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let roadmapIdCounter = Map.empty<Principal, Nat>();

  module RoadmapId {
    public func compare(id1 : RoadmapId, id2 : RoadmapId) : Order.Order {
      switch (id1.userId.compare(id2.userId)) {
        case (#equal) { Nat.compare(id1.roadmapId, id2.roadmapId) };
        case (order) { order };
      };
    };
  };

  type RoadmapId = {
    userId : Principal;
    roadmapId : Nat;
  };

  type Roadmap = {
    title : Text;
    content : Text;
    studyPlan : ?Text;
    careerAdvice : ?Text;
    createdAt : Int;
  };

  let roadmaps = Map.empty<RoadmapId, Roadmap>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func saveRoadmap(roadmap : Roadmap) : async RoadmapId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be at least a user to save a roadmap.");
    };

    let nextId = switch (roadmapIdCounter.get(caller)) {
      case (null) { 0 };
      case (?id) { id + 1 };
    };

    roadmapIdCounter.add(caller, nextId);

    let roadmapId = {
      userId = caller;
      roadmapId = nextId;
    };

    roadmaps.add(roadmapId, roadmap);
    roadmapId;
  };

  public query ({ caller }) func getUserRoadmaps(userId : Principal) : async [Roadmap] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view roadmaps");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own roadmaps");
    };

    let userRoadmaps = roadmaps.filter(
      func(roadmapId, _) {
        roadmapId.userId == userId;
      }
    );
    userRoadmaps.values().toArray();
  };

  public query ({ caller }) func getAllUserRoadmapIds(userId : Principal) : async [RoadmapId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view roadmap IDs");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own roadmap IDs");
    };

    let userRoadmaps = roadmaps.filter(
      func(roadmapId, _) {
        roadmapId.userId == userId;
      }
    );
    userRoadmaps.keys().toArray().sort();
  };

  public query ({ caller }) func getRoadmap(roadmapId : RoadmapId) : async Roadmap {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view roadmaps");
    };
    if (caller != roadmapId.userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own roadmaps");
    };

    switch (roadmaps.get(roadmapId)) {
      case (null) { Runtime.trap("Roadmap not found") };
      case (?roadmap) { roadmap };
    };
  };

  public shared ({ caller }) func deleteRoadmap(roadmapId : RoadmapId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete roadmaps");
    };

    switch (roadmaps.get(roadmapId)) {
      case (null) {
        Runtime.trap("Roadmap not found");
      };
      case (?_) {
        if (roadmapId.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You do not own this roadmap.");
        };
        roadmaps.remove(roadmapId);
      };
    };
  };
};
