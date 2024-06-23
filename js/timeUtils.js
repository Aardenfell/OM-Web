/**
 * Updates and displays the current time on the page.
 */
function updateCurrentTime() {
  const now = new Date(); // Get the current date and time
  const currentTimeElement = document.getElementById("current-time"); // Get the element to display the current time
  currentTimeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`; // Set the text content of the element to display the current time
}

/**
 * Converts a UTC reset time to the user's local time.
 * @param {string} resetTime - The UTC reset time in the format "HH:MM".
 * @returns {string} The reset time in the local timezone in the format "HH:MM".
 */
function convertUTCToUserTimezone(resetTime) {
  const now = new Date(); // Get the current date and time
  const [hoursUTC, minutesUTC] = resetTime.split(":").map(Number); // Get the hours and minutes from the UTC reset time
  const resetDateUTC = new Date( // Create a new Date object for the UTC reset time
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      hoursUTC,
      minutesUTC
    )
  );
  const resetTimeLocal = resetDateUTC.toLocaleTimeString([], { // Convert the UTC reset time to the local timezone
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Log the UTC reset time, the UTC reset date, and the local reset time
//   console.log(`UTC Reset Time: ${resetTime}`);
//   console.log(`Reset Date UTC: ${resetDateUTC}`);
//   console.log(`Local Reset Time: ${resetTimeLocal}(convertUTCToUserTimezone)`);

  return resetTimeLocal; // Return the local reset time
}

/**
 * Calculates the remaining time until the next reset in the user's timezone.
 * @param {Date} currentTime - The current date and time.
 * @param {Array|string|Date} resetTimes - An array of reset times, a single reset time as a string, or a single reset time as a Date.
 * @param {number} [resetDay=null] - The day of the week that the reset occurs on (0-6, Sunday-Saturday).
 * @returns {string} The remaining time until the next reset in the format "DDd HHh MMm SSs".
 */
function calculateRemainingTime(currentTime, resetTimes, resetDay = null) {
  const now = currentTime; // Get the current date and time

  if (!Array.isArray(resetTimes)) {
    resetTimes = [resetTimes]; // Convert the reset times to an array if it is not already
  }

  let closestResetTime = null; // Initialize the variable to store the closest reset time
  let closestResetDate = null; // Initialize the variable to store the date of the closest reset

  resetTimes.forEach((resetTime) => {
    let resetTimeLocal; // Initialize the variable to store the local reset time

    if (typeof resetTime === "string") {
      // Convert the reset time to the local timezone
      resetTimeLocal = convertUTCToUserTimezone(resetTime);
      const [hoursLocal, minutesLocal] = resetTimeLocal.split(":").map(Number); // Get the hours and minutes from the local reset time
      resetTimeLocal = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hoursLocal,
        minutesLocal
      );
    } else if (resetTime instanceof Date) {
      resetTimeLocal = new Date(resetTime); // Use the reset time as is if it is already a Date object
    }

    if (resetDay !== null) {
      resetTimeLocal.setDate(
        resetTimeLocal.getDate() +
          ((resetDay + 7 - resetTimeLocal.getDay()) % 7)
      ); // Set the date of the reset time to the next occurrence of the specified day of the week
    }

    let remainingTime = resetTimeLocal - now; // Calculate the time remaining until the reset time

    if (remainingTime <= 0) {
      if (resetDay !== null) {
        resetTimeLocal.setDate(resetTimeLocal.getDate() + 7); // Move the reset time to the next week if it has already occurred
      } else {
        resetTimeLocal.setDate(resetTimeLocal.getDate() + 1); // Move the reset time to the next day if it has already occurred
      }
      remainingTime = resetTimeLocal - now; // Recalculate the time remaining until the reset time
    }

    if (closestResetTime === null || remainingTime < closestResetTime) {
      closestResetTime = remainingTime; // Update the closest reset time if the current time is closer
      closestResetDate = resetTimeLocal; // Update the date of the closest reset time
    }
  });

//   console.log(`Local Reset Time: ${closestResetDate}(calculateRemainingTime)`); // Log the local reset time and the closest reset time
//   console.log(`Closest Reset Time: ${closestResetDate}`);

  if (closestResetTime === null) {
    return "Timer is not set correctly"; // Return an error message if there are no reset times specified
  }

  const daysLeft = Math.floor(closestResetTime / (1000 * 60 * 60 * 24)); // Calculate the number of days until the closest reset time
  closestResetTime %= 1000 * 60 * 60 * 24; // Calculate the remaining time until the closest reset time in milliseconds
  const hoursLeft = Math.floor(closestResetTime / (1000 * 60 * 60)); // Calculate the number of hours until the closest reset time
  closestResetTime %= 1000 * 60 * 60; // Calculate the remaining time until the closest reset time in milliseconds
  const minutesLeft = Math.floor(closestResetTime / (1000 * 60)); // Calculate the number of minutes until the closest reset time
  closestResetTime %= 1000 * 60; // Calculate the remaining time until the closest reset time in milliseconds
  const secondsLeft = Math.floor(closestResetTime / 1000); // Calculate the number of seconds until the closest reset time

  return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`; // Return the remaining time until the closest reset time in the format "DDd HHh MMm SSs"
}


