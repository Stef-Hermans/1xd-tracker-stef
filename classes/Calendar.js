export class Calendar {
  constructor(containerId, currentDate, activities, onDateClick) {
    this.container = document.getElementById(containerId);
    this.currentDate = currentDate;
    this.activities = activities;
    this.onDateClick = onDateClick;
  }

  render() {
    this.container.innerHTML = "";
    const monthName = this.currentDate.toLocaleString("nl-NL", {
      month: "long",
      year: "numeric",
    });
    document.getElementById("currentMonth").innerText = monthName;

    const days = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0
    ).getDate();

    for (let day = 1; day <= days; day++) {
      const dateStr = `${this.currentDate.getFullYear()}-${(
        this.currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      const div = document.createElement("div");
      div.className = "day";
      div.innerText = day;
      if (this.activities[dateStr]) div.classList.add("has-activities");
      div.addEventListener("click", () => this.onDateClick(dateStr));
      this.container.appendChild(div);
    }
  }
}
