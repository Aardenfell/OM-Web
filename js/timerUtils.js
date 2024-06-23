// Function to display timers
function displayTimers() {
  const container = document.getElementById("timers");
  container.innerHTML = "";

  timers.forEach((timer) => {
    const timerDiv = document.createElement("div");
    timerDiv.className = "timer col-md-4 mb-4";

    const timerName = document.createElement("h2");
    timerName.textContent = timer.name;
    timerDiv.appendChild(timerName);

    const timerDetails = document.createElement("p");
    let resetText;

    if (timer.interval === "daily") {
      if (Array.isArray(timer.resetTime)) {
        timer.resetTime.forEach((time) => {
          const resetTimeInUserTimezone = convertUTCToUserTimezone(time);
          resetText = `Resets daily at ${resetTimeInUserTimezone}`;
          const timerDetailsInstance = document.createElement("p");
          timerDetailsInstance.textContent = resetText;
          timerDiv.appendChild(timerDetailsInstance);

          const remainingTime = calculateRemainingTime(new Date(), time);
          const timerRemaining = document.createElement("p");
          timerRemaining.textContent = `Time remaining: ${remainingTime}`;
          timerRemaining.className = "text-muted";
          timerDiv.appendChild(timerRemaining);
        });
      } else {
        const resetTimeInUserTimezone = convertUTCToUserTimezone(
          timer.resetTime
        );
        resetText = `Resets daily at ${resetTimeInUserTimezone}`;
        timerDetails.textContent = resetText;
        timerDiv.appendChild(timerDetails);

        const remainingTime = calculateRemainingTime(
          new Date(),
          timer.resetTime
        );
        const timerRemaining = document.createElement("p");
        timerRemaining.textContent = `Time remaining: ${remainingTime}`;
        timerRemaining.className = "text-muted";
        timerDiv.appendChild(timerRemaining);
      }
    } else if (timer.interval === "custom") {
      const today = new Date();
      const dayOfWeek = today.getDay();

      if (timer.activeDays.includes(dayOfWeek)) {
        const startTimeInUserTimezone = convertUTCToUserTimezone(
          timer.startTime
        );
        const endTimeInUserTimezone = convertUTCToUserTimezone(timer.endTime);
        resetText = `Active today from ${startTimeInUserTimezone} to ${endTimeInUserTimezone}`;
        timerDetails.textContent = resetText;
        timerDiv.appendChild(timerDetails);

        const remainingTime = calculateRemainingTime(new Date(), timer.endTime);
        const timerRemaining = document.createElement("p");
        timerRemaining.textContent = `Time remaining: ${remainingTime}`;
        timerRemaining.className = "text-muted";
        timerDiv.appendChild(timerRemaining);
      } else {
        const nextActiveDay =
          timer.activeDays.find((day) => day > dayOfWeek) ||
          timer.activeDays[0];
        const nextResetDate = new Date();
        nextResetDate.setDate(
          nextResetDate.getDate() +
            ((nextActiveDay + 7 - nextResetDate.getDay()) % 7)
        );

        const nextResetDateString = nextResetDate.toLocaleDateString([], {
          weekday: "long",
        });
        const startTimeInUserTimezone = convertUTCToUserTimezone(
          timer.startTime
        );
        const endTimeInUserTimezone = convertUTCToUserTimezone(timer.endTime);

        resetText = `Next active on ${nextResetDateString} from ${startTimeInUserTimezone} to ${endTimeInUserTimezone}`;
        timerDetails.textContent = resetText;
        timerDiv.appendChild(timerDetails);

        const nextResetDateTime = new Date(
          nextResetDate.getFullYear(),
          nextResetDate.getMonth(),
          nextResetDate.getDate(),
          parseInt(timer.startTime.split(":")[0]),
          parseInt(timer.startTime.split(":")[1])
        );
        const remainingTime = calculateRemainingTime(
          new Date(),
          nextResetDateTime
        );
        const timerRemaining = document.createElement("p");
        timerRemaining.textContent = `Time remaining: ${remainingTime}`;
        timerRemaining.className = "text-muted";
        timerDiv.appendChild(timerRemaining);
      }
    } else if (timer.interval === "weekly") {
      const resetTimeInUserTimezone = convertUTCToUserTimezone(timer.resetTime);
      const resetDayName = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(new Date(1970, 0, timer.resetDay + 4));
      resetText = `Resets every ${resetDayName} at ${resetTimeInUserTimezone}`;
      timerDetails.textContent = resetText;
      timerDiv.appendChild(timerDetails);

      const remainingTime = calculateRemainingTime(
        new Date(),
        timer.resetTime,
        timer.resetDay
      );
      const timerRemaining = document.createElement("p");
      timerRemaining.textContent = `Time remaining: ${remainingTime}`;
      timerRemaining.className = "text-muted";
      timerDiv.appendChild(timerRemaining);
    }

    container.appendChild(timerDiv);
  });
}
