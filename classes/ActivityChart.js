export class ActivityChart {
  constructor(canvasId, activities, currentDate) {
    this.ctx = document.getElementById(canvasId).getContext("2d");
    this.activities = activities;
    this.currentDate = currentDate;
    this.chart = null;
  }

  render() {
    const counts = {};

    Object.keys(this.activities).forEach((date) => {
      const d = new Date(date);
      if (
        d.getMonth() === this.currentDate.getMonth() &&
        d.getFullYear() === this.currentDate.getFullYear()
      ) {
        this.activities[date].forEach((act) => {
          counts[act.type] = (counts[act.type] || 0) + 1;
        });
      }
    });

    if (Object.keys(counts).length === 0) {
      counts["Geen Activiteiten"] = 1;
    }

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(counts),
        datasets: [
          {
            data: Object.values(counts),
            backgroundColor: [
              "#007BFF", // Blauw
              "#FF5733", // Oranje-rood
              "#28A745", // Groen
              "#FFC107", // Geel
              "#6F42C1", // Paars
              "#17A2B8", // Cyan
              "#E83E8C", // Roze
              "#FD7E14", // Oranje
            ],
          },
        ],
      },
    });
  }
}
