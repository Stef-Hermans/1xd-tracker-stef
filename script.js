let activities = JSON.parse(localStorage.getItem("activities")) || {};

function renderCalendar() {
  let calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  let daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  document.getElementById("currentMonth").innerText =
    currentDate.toLocaleString("nl-NL", { month: "long", year: "numeric" });
  for (let day = 1; day <= daysInMonth; day++) {
    let date = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    let dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.innerText = day;
    if (activities[date]) dayElement.classList.add("has-activities");
    calendar.appendChild(dayElement);
  }
}

function changeMonth(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  renderCalendar(); // Herlaad de kalender na het veranderen van de maand
  updateChart(); // Werk de grafiek opnieuw bij met de gefilterde gegevens van de nieuwe maand
}

function saveActivity() {
  let date = document.getElementById("activityDate").value;
  let type = document.getElementById("activityType").value;
  let duration = parseInt(document.getElementById("activityDuration").value);

  if (!date) return alert("Selecteer een datum!");
  if (!duration || duration <= 0)
    return alert("Voer een geldige duur in minuten in!");

  if (!activities[date]) activities[date] = [];
  activities[date].push({ type, duration }); // Opslaan als object met type en duur

  localStorage.setItem("activities", JSON.stringify(activities));
  alert("Activiteit opgeslagen!");
  window.location.href = "activiteiten.html";
}

function loadActivities() {
  let activityList = document.getElementById("activityList");
  activityList.innerHTML = "";

  Object.keys(activities).forEach((date) => {
    activities[date].forEach((activity) => {
      let item = document.createElement("div");
      item.innerText = `Datum: ${date} - Type: ${activity.type} - Duur: ${activity.duration} min`;
      activityList.appendChild(item);
    });
  });

  if (!Object.keys(activities).length) {
    activityList.innerHTML = "Geen activiteiten";
  }
}

let activityChart = null; // Variabele om de grafiek op te slaan

function updateChart() {
  let counts = {};

  // Filter activiteiten voor de huidige maand
  Object.keys(activities).forEach((date) => {
    let activityDate = new Date(date);
    if (
      activityDate.getFullYear() === currentDate.getFullYear() &&
      activityDate.getMonth() === currentDate.getMonth()
    ) {
      activities[date].forEach((activity) => {
        counts[activity] = (counts[activity] || 0) + 1;
      });
    }
  });

  // Voeg een placeholder toe als er geen activiteiten zijn
  if (Object.keys(counts).length === 0) {
    counts["Geen Activiteiten"] = 1;
  }

  let ctx = document.getElementById("activityChart").getContext("2d");

  // Controleer of er al een bestaande grafiek is en vernietig deze
  if (activityChart) {
    activityChart.destroy();
  }

  // Maak een nieuwe grafiek en sla deze op in de variabele
  activityChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            "#007BFF",
            "#FF5733",
            "#28A745",
            "#FFC107",
            "#6F42C1",
          ],
        },
      ],
    },
  });
}

let currentDate = new Date();
renderCalendar();
updateChart();
