export class ActivityList {
  constructor(containerId, activities) {
    this.container = document.getElementById(containerId);
    this.activities = activities;
  }

  render() {
    this.container.innerHTML = "";

    if (!Object.keys(this.activities).length) {
      this.container.innerText = "Geen activiteiten gevonden.";
      return;
    }

    const dates = Object.keys(this.activities).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    dates.forEach((date) => {
      const header = document.createElement("h3");
      header.innerText = `📅 ${new Date(date).toLocaleDateString("nl-NL")}`;
      this.container.appendChild(header);

      this.activities[date].forEach((activity) => {
        const item = document.createElement("div");
        item.innerHTML = `
                    <div style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
                      🧤 Type: <strong>${activity.type}</strong><br>
                      ⏱️ Duur: <strong>${activity.duration} minuten</strong>
                    </div>
                `;
        item.style.marginBottom = "10px";
        this.container.appendChild(item);
      });
    });
  }
}
