let activities = JSON.parse(localStorage.getItem("activities")) || {};

// Verwijder oude activiteiten (> 6 maanden)
let now = new Date();
let cutoff = new Date();
cutoff.setMonth(cutoff.getMonth() - 6);

Object.keys(activities).forEach((date) => {
  let activityDate = new Date(date);
  if (activityDate < cutoff) {
    delete activities[date];
  }
});
localStorage.setItem("activities", JSON.stringify(activities));

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
    dayElement.addEventListener("click", () => {
      window.location.href = `toevoegen.html?date=${date}`;
    });
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
  let typeSelect = document.getElementById("activityType");
  let type = typeSelect.value;
  if (!type || typeSelect.selectedIndex === 0) {
    return alert("Kies een geldig activiteitstype!");
  }

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

  if (!Object.keys(activities).length) {
    activityList.innerText = "Geen activiteiten gevonden.";
    return;
  }

  // Sorteer datums aflopend
  let sortedDates = Object.keys(activities).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  sortedDates.forEach((date) => {
    let dateHeader = document.createElement("h3");
    dateHeader.innerText = `📅 ${new Date(date).toLocaleDateString("nl-NL")}`;
    activityList.appendChild(dateHeader);

    activities[date].forEach((activity, index) => {
      let item = document.createElement("div");
      item.style.marginBottom = "10px";
      item.innerHTML = `
        <div style="padding: 10px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
          🧤 Type: <strong>${activity.type}</strong><br>
          ⏱️ Duur: <strong>${activity.duration} minuten</strong>
        </div>
      `;
      activityList.appendChild(item);
    });
  });
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
        counts[activity.type] = (counts[activity.type] || 0) + 1;
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

// Alleen uitvoeren op index.html
if (document.getElementById("calendar")) {
  renderCalendar();
  updateChart();
}

// Alleen uitvoeren op activiteiten.html
if (document.getElementById("activityList")) {
  loadActivities();
}
