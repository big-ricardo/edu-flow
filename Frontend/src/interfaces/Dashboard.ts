import IActivity from "./Activitiy";

export default interface Dashboard {
  activities: IActivity[];
  statusCounts: { _id: string; count: number }[];
  formTypeCounts: { _id: string; count: number }[];
  openActivitiesCount: number;
  closedActivitiesCount: number;
  countByMastermind: {
    count: number;
    mastermindId: string;
    mastermindName: string;
    status: string;
  }[];
}
