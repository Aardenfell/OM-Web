// Function to update and display current time
function updateCurrentTime() {
  const now = new Date();
  const currentTimeElement = document.getElementById("current-time");
  currentTimeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`;
}

// Function to convert UTC reset time to user's local time
function convertUTCToUserTimezone(resetTime) {
  const now = new Date(); // Current date and time in user's timezone

  // Get user's current timezone offset in minutes (including DST offset if applicable)
  // const timezoneOffset = now.getTimezoneOffset();

  // Parse reset time in UTC
  const [hoursUTC, minutesUTC] = resetTime.split(":").map(Number);

  // Create a new date object for the reset time in UTC
  const resetDateUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      hoursUTC,
      minutesUTC
    )
  );

  // Convert UTC time to user's local time
  const resetTimeLocal = resetDateUTC.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return resetTimeLocal;
}

// Prototype function to check if DST (Daylight Saving Time) is in effect
Date.prototype.dst = function () {
  const january = new Date(this.getFullYear(), 0, 1);
  const july = new Date(this.getFullYear(), 6, 1);
  return (
    this.getTimezoneOffset() <
    Math.max(january.getTimezoneOffset(), july.getTimezoneOffset())
  );
};

// Function to calculate the remaining time until the next reset in the user's timezone
function calculateRemainingTime(currentTime, resetTimes, resetDay = null) {
  const now = currentTime;

  if (!Array.isArray(resetTimes)) {
    resetTimes = [resetTimes];
  }

  let closestResetTime = null;
  let closestResetDate = null;

  resetTimes.forEach((resetTime) => {
    let resetTimeLocal;
    if (typeof resetTime === "string") {
      const [hoursLocal, minutesLocal] = resetTime.split(":").map(Number);
      resetTimeLocal = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hoursLocal,
        minutesLocal
      );
    } else if (resetTime instanceof Date) {
      resetTimeLocal = new Date(resetTime);
    }

    if (resetDay !== null) {
      resetTimeLocal.setDate(
        resetTimeLocal.getDate() +
          ((resetDay + 7 - resetTimeLocal.getDay()) % 7)
      );
    }

    let remainingTime = resetTimeLocal - now;
    if (remainingTime <= 0) {
      if (resetDay !== null) {
        resetTimeLocal.setDate(resetTimeLocal.getDate() + 7);
      } else {
        resetTimeLocal.setDate(resetTimeLocal.getDate() + 1);
      }
      remainingTime = resetTimeLocal - now;
    }

    if (closestResetTime === null || remainingTime < closestResetTime) {
      closestResetTime = remainingTime;
      closestResetDate = resetTimeLocal;
    }
  });

  if (closestResetTime === null) {
    return "Timer is not set correctly";
  }

  const daysLeft = Math.floor(closestResetTime / (1000 * 60 * 60 * 24));
  closestResetTime %= 1000 * 60 * 60 * 24;
  const hoursLeft = Math.floor(closestResetTime / (1000 * 60 * 60));
  closestResetTime %= 1000 * 60 * 60;
  const minutesLeft = Math.floor(closestResetTime / (1000 * 60));
  closestResetTime %= 1000 * 60;
  const secondsLeft = Math.floor(closestResetTime / 1000);

  return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
}
