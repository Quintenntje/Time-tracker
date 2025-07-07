export interface TimeData {
  date: string;
  totalTimeUsed: number;
  sessions: {
    startTime: string;
    endTime: string;
    duration: number;
  }[];
}
