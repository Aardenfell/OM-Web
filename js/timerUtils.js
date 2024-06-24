// Function to create a card for each timer/event
function createTimerCard(timer) {
    const cardContainer = document.createElement("div");
    cardContainer.className = "col-md-4 mb-4";
  
    const card = document.createElement("div");
    card.className = "card border-dark mb-3";
    card.classList.add("bg-light"); // Default to light mode
    card.style = "max-width: 20rem;";
  
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.textContent = timer.name;
    card.appendChild(cardHeader);
  
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
  
    const cardTitle = document.createElement("h4");
    cardTitle.className = "card-title";
    cardTitle.textContent = "Event Details";
    cardBody.appendChild(cardTitle);
  
    const cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.textContent = `Interval: ${timer.interval}`;
    cardBody.appendChild(cardText);

    card.appendChild(cardBody);
    cardContainer.appendChild(card);
  
    return cardContainer;
}

// Function to display timers
function displayTimers() {
    const container = document.getElementById("timers");
    container.innerHTML = "";
  
    timers.forEach((timer) => {
      const cardContainer = document.createElement("div");
      cardContainer.className = "col-md-4 mb-4";
  
      const card = document.createElement("div");
      card.className = "card border-dark";
      card.classList.add("bg-dark"); // Default to light mode
      card.style = "max-width: 20rem;";
  
      const cardHeader = document.createElement("div");
      cardHeader.className = "card-header h4";
      cardHeader.textContent = timer.name;
      card.appendChild(cardHeader);
  
      const cardBody = document.createElement("div");
      cardBody.className = "card-body";
  
      const cardText = document.createElement("p");
      let resetText;
  
      if (timer.interval === "daily") {
        if (Array.isArray(timer.resetTime)) {
          timer.resetTime.forEach((time) => {
            const resetTimeInUserTimezone = convertUTCToUserTimezone(time);
            resetText = `Resets daily at ${resetTimeInUserTimezone}`;
            const timerDetails = createCardTextElement(resetText);
            cardBody.appendChild(timerDetails);
  
            const remainingTime = calculateRemainingTime(new Date(), time);
            const timerRemaining = createCardTextElement(
              `Time remaining: ${remainingTime}`,
              "text-muted"
            );
            cardBody.appendChild(timerRemaining);
          });
        } else {
          const resetTimeInUserTimezone = convertUTCToUserTimezone(timer.resetTime);
          resetText = `Resets daily at ${resetTimeInUserTimezone}`;
          const timerDetails = createCardTextElement(resetText);
          cardBody.appendChild(timerDetails);
  
          const remainingTime = calculateRemainingTime(new Date(), timer.resetTime);
          const timerRemaining = createCardTextElement(
            `Time remaining: ${remainingTime}`,
            "text-muted"
          );
          cardBody.appendChild(timerRemaining);
        }
      } else if (timer.interval === "custom") {
        const today = new Date();
        const dayOfWeek = today.getDay();
  
        if (timer.activeDays.includes(dayOfWeek)) {
          const startTimeInUserTimezone = convertUTCToUserTimezone(timer.startTime);
          const endTimeInUserTimezone = convertUTCToUserTimezone(timer.endTime);
          resetText = `Active today from ${startTimeInUserTimezone} to ${endTimeInUserTimezone}`;
          const timerDetails = createCardTextElement(resetText);
          cardBody.appendChild(timerDetails);
  
          const remainingTime = calculateRemainingTime(new Date(), timer.endTime);
          const timerRemaining = createCardTextElement(
            `Time remaining: ${remainingTime}`,
            "text-muted"
          );
          cardBody.appendChild(timerRemaining);
        } else {
          const nextActiveDay = timer.activeDays.find(day => day > dayOfWeek) || timer.activeDays[0];
          const nextResetDate = new Date();
          nextResetDate.setDate(
            nextResetDate.getDate() + ((nextActiveDay + 7 - nextResetDate.getDay()) % 7)
          );
  
          const nextResetDateString = nextResetDate.toLocaleDateString([], {
            weekday: "long"
          });
          const startTimeInUserTimezone = convertUTCToUserTimezone(timer.startTime);
          const endTimeInUserTimezone = convertUTCToUserTimezone(timer.endTime);
  
          resetText = `Next active on ${nextResetDateString} from ${startTimeInUserTimezone} to ${endTimeInUserTimezone}`;
          const timerDetails = createCardTextElement(resetText);
          cardBody.appendChild(timerDetails);
  
          const nextResetDateTime = new Date(
            nextResetDate.getFullYear(),
            nextResetDate.getMonth(),
            nextResetDate.getDate(),
            parseInt(timer.startTime.split(":")[0]),
            parseInt(timer.startTime.split(":")[1])
          );
          const remainingTime = calculateRemainingTime(new Date(), nextResetDateTime);
          const timerRemaining = createCardTextElement(
            `Time remaining: ${remainingTime}`,
            "text-muted"
          );
          cardBody.appendChild(timerRemaining);
        }
      } else if (timer.interval === "weekly") {
        const resetTimeInUserTimezone = convertUTCToUserTimezone(timer.resetTime);
        const resetDayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(1970, 0, timer.resetDay + 4));
        resetText = `Resets every ${resetDayName} at ${resetTimeInUserTimezone}`;
        const timerDetails = createCardTextElement(resetText);
        cardBody.appendChild(timerDetails);
  
        const remainingTime = calculateRemainingTime(new Date(), timer.resetTime, timer.resetDay);
        const timerRemaining = createCardTextElement(
          `Time remaining: ${remainingTime}`,
          "text-muted"
        );
        cardBody.appendChild(timerRemaining);
      }
  
      card.appendChild(cardBody);
      cardContainer.appendChild(card);
      container.appendChild(cardContainer);
    });
  }
  
  // Helper function to create text elements for cards
  function createCardTextElement(text, className) {
    const element = document.createElement("p");
    element.textContent = text;
    if (className) {
      element.className = className;
    }
    return element;
  }
  
