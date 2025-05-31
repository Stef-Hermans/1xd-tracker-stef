import { ActivityStorage } from "./ActivityStorage.js";

export class ActivityForm {
  constructor(activities) {
    this.activities = activities;
  }

  save(date, type, duration) {
    if (!this.activities[date]) this.activities[date] = [];
    this.activities[date].push({ type, duration });
    ActivityStorage.save(this.activities);
  }
}
