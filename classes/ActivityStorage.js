export class ActivityStorage {
  static load() {
    const data = JSON.parse(localStorage.getItem("activities")) || {};
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);

    Object.keys(data).forEach((date) => {
      if (new Date(date) < cutoff) {
        delete data[date];
      }
    });

    localStorage.setItem("activities", JSON.stringify(data));
    return data;
  }

  static save(activities) {
    localStorage.setItem("activities", JSON.stringify(activities));
  }
}
