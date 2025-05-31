import { ActivityStorage } from "./classes/ActivityStorage.js";
import { Calendar } from "./classes/Calendar.js";
import { ActivityForm } from "./classes/ActivityForm.js";
import { ActivityList } from "./classes/ActivityList.js";
import { ActivityChart } from "./classes/ActivityChart.js";

let activities = ActivityStorage.load();
let currentDate = new Date();

// INDEX pagina
if (document.getElementById("calendar")) {
  const calendar = new Calendar("calendar", currentDate, activities, (date) => {
    window.location.href = `toevoegen.html?date=${date}`;
  });
  const chart = new ActivityChart("activityChart", activities, currentDate);

  calendar.render();
  chart.render();

  window.changeMonth = function (delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    calendar.render();
    chart.render();
  };
}

// TOEVOEGEN pagina
if (document.getElementById("activityDate")) {
  const form = new ActivityForm(activities);
  const dateInput = document.getElementById("activityDate");
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("date")) {
    dateInput.value = urlParams.get("date");
  }

  window.saveActivity = function () {
    const date = dateInput.value;
    const type = document.getElementById("activityType").value;
    const duration = parseInt(
      document.getElementById("activityDuration").value
    );

    if (!type) return alert("Kies een geldig activiteitstype!");
    if (!date) return alert("Selecteer een datum!");
    if (!duration || duration <= 0) return alert("Voer een geldige duur in!");

    form.save(date, type, duration);
    alert("Activiteit opgeslagen!");
    window.location.href = "activiteiten.html";
  };
}

// ACTIVITEITEN pagina
if (document.getElementById("activityList")) {
  const list = new ActivityList("activityList", activities);
  list.render();
}
