// // Timer data
// const timers = [
//   // {
//   //     name: '', // Give it a name
//   //     interval: 'daily, specificDays, weekly', // Choose between 'daily', 'weekly', or 'custom'
//   //     resetDay: 0, // 0 = Sunday, 1 = Monday, etc. Only used if interval is 'weekly' or 'custom'. Use an array if multiple days
//   //     resetTime: '00:00' // Reset time in 24-hour format. Use an array if multiple times
//   //     startTime: '09:00', // Start time in 24-hour format. Use if an event has a duration
//   //     endTime: '22:00' // End time in 24-hour format. use if an event has a duration
//   // },
//   {
//     name: "Pills Reset",
//     interval: "daily", // Daily timer
//     resetTime: "13:00", // Reset time in 24-hour format
//   },
//   {
//     name: "Demondbend Abyss",
//     interval: "custom", // Specific days timer
//     activeDays: [1, 3, 5], // Monday, Wednesday, Friday
//     startTime: "14:00", // Start time in 24-hour format
//     endTime: "03:00", // End time in 24-hour format
//   },
//   {
//     name: "Beast Invasion",
//     interval: "daily", // Daily timer
//     resetTime: ["17:00", "23:00"], // Reset time in 24-hour format
//   },
//   {
//     name: "Weekly Event A",
//     interval: "weekly", // Weekly timer
//     resetDay: 1, // Monday
//     resetTime: "12:00", // Reset time in 24-hour format
//   },
//   {
//     name: "World Apex",
//     interval: "weekly",
//     resetDay: 0, // Sunday
//     resetTime: "15:00",
//   },
//   // Add more timers as needed
// ];

// // Function to update and display current time
// function updateCurrentTime() {
//   const now = new Date();
//   const currentTimeElement = document.getElementById("current-time");
//   currentTimeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`;
// }

// // Function to convert UTC reset time to user's local time
// function convertUTCToUserTimezone(resetTime) {
//   const now = new Date(); // Current date and time in user's timezone

//   // Get user's current timezone offset in minutes (including DST offset if applicable)
//   // const timezoneOffset = now.getTimezoneOffset();

//   // Parse reset time in UTC
//   const [hoursUTC, minutesUTC] = resetTime.split(":").map(Number);

//   // Create a new date object for the reset time in UTC
//   const resetDateUTC = new Date(
//     Date.UTC(
//       now.getUTCFullYear(),
//       now.getUTCMonth(),
//       now.getUTCDate(),
//       hoursUTC,
//       minutesUTC
//     )
//   );

//   // Convert UTC time to user's local time
//   const resetTimeLocal = resetDateUTC.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });

//   return resetTimeLocal;
// }

// // Prototype function to check if DST (Daylight Saving Time) is in effect
// Date.prototype.dst = function () {
//   const january = new Date(this.getFullYear(), 0, 1);
//   const july = new Date(this.getFullYear(), 6, 1);
//   return (
//     this.getTimezoneOffset() <
//     Math.max(january.getTimezoneOffset(), july.getTimezoneOffset())
//   );
// };

// // Function to calculate the remaining time until the next reset in the user's timezone
// function calculateRemainingTime(currentTime, resetTimes, resetDay = null) {
//   const now = currentTime;

//   if (!Array.isArray(resetTimes)) {
//     resetTimes = [resetTimes];
//   }

//   let closestResetTime = null;
//   let closestResetDate = null;

//   resetTimes.forEach((resetTime) => {
//     let resetTimeLocal;
//     if (typeof resetTime === "string") {
//       const [hoursLocal, minutesLocal] = resetTime.split(":").map(Number);
//       resetTimeLocal = new Date(
//         now.getFullYear(),
//         now.getMonth(),
//         now.getDate(),
//         hoursLocal,
//         minutesLocal
//       );
//     } else if (resetTime instanceof Date) {
//       resetTimeLocal = new Date(resetTime);
//     }

//     if (resetDay !== null) {
//       resetTimeLocal.setDate(
//         resetTimeLocal.getDate() +
//           ((resetDay + 7 - resetTimeLocal.getDay()) % 7)
//       );
//     }

//     let remainingTime = resetTimeLocal - now;
//     if (remainingTime <= 0) {
//       if (resetDay !== null) {
//         resetTimeLocal.setDate(resetTimeLocal.getDate() + 7);
//       } else {
//         resetTimeLocal.setDate(resetTimeLocal.getDate() + 1);
//       }
//       remainingTime = resetTimeLocal - now;
//     }

//     if (closestResetTime === null || remainingTime < closestResetTime) {
//       closestResetTime = remainingTime;
//       closestResetDate = resetTimeLocal;
//     }
//   });

//   if (closestResetTime === null) {
//     return "Timer is not set correctly";
//   }

//   const daysLeft = Math.floor(closestResetTime / (1000 * 60 * 60 * 24));
//   closestResetTime %= 1000 * 60 * 60 * 24;
//   const hoursLeft = Math.floor(closestResetTime / (1000 * 60 * 60));
//   closestResetTime %= 1000 * 60 * 60;
//   const minutesLeft = Math.floor(closestResetTime / (1000 * 60));
//   closestResetTime %= 1000 * 60;
//   const secondsLeft = Math.floor(closestResetTime / 1000);

//   return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
// }

// // Function to display timers
// function displayTimers() {
//   const container = document.getElementById("timers");
//   container.innerHTML = "";

//   timers.forEach((timer) => {
//     const timerDiv = document.createElement("div");
//     timerDiv.className = "timer col-md-4 mb-4";

//     const timerName = document.createElement("h2");
//     timerName.textContent = timer.name;
//     timerDiv.appendChild(timerName);

//     const timerDetails = document.createElement("p");
//     let resetText;

//     if (timer.interval === "daily") {
//       if (Array.isArray(timer.resetTime)) {
//         timer.resetTime.forEach((time) => {
//           const resetTimeInUserTimezone = convertUTCToUserTimezone(time);
//           resetText = `Resets daily at ${resetTimeInUserTimezone}`;
//           const timerDetailsInstance = document.createElement("p");
//           timerDetailsInstance.textContent = resetText;
//           timerDiv.appendChild(timerDetailsInstance);

//           const remainingTime = calculateRemainingTime(new Date(), time);
//           const timerRemaining = document.createElement("p");
//           timerRemaining.textContent = `Time remaining: ${remainingTime}`;
//           timerRemaining.className = "text-muted";
//           timerDiv.appendChild(timerRemaining);
//         });
//       } else {
//         const resetTimeInUserTimezone = convertUTCToUserTimezone(
//           timer.resetTime
//         );
//         resetText = `Resets daily at ${resetTimeInUserTimezone}`;
//         timerDetails.textContent = resetText;
//         timerDiv.appendChild(timerDetails);

//         const remainingTime = calculateRemainingTime(
//           new Date(),
//           timer.resetTime
//         );
//         const timerRemaining = document.createElement("p");
//         timerRemaining.textContent = `Time remaining: ${remainingTime}`;
//         timerRemaining.className = "text-muted";
//         timerDiv.appendChild(timerRemaining);
//       }
//     } else if (timer.interval === "custom") {
//       const today = new Date();
//       const dayOfWeek = today.getDay();

//       if (timer.activeDays.includes(dayOfWeek)) {
//         const startTimeInUserTimezone = convertUTCToUserTimezone(
//           timer.startTime
//         );
//         const endTimeInUserTimezone = convertUTCToUserTimezone(timer.endTime);
//         resetText = `Active today from ${startTimeInUserTimezone} to ${endTimeInUserTimezone}`;
//         timerDetails.textContent = resetText;
//         timerDiv.appendChild(timerDetails);

//         const remainingTime = calculateRemainingTime(new Date(), timer.endTime);
//         const timerRemaining = document.createElement("p");
//         timerRemaining.textContent = `Time remaining: ${remainingTime}`;
//         timerRemaining.className = "text-muted";
//         timerDiv.appendChild(timerRemaining);
//       } else {
//         const nextActiveDay =
//           timer.activeDays.find((day) => day > dayOfWeek) ||
//           timer.activeDays[0];
//         const nextResetDate = new Date();
//         nextResetDate.setDate(
//           nextResetDate.getDate() +
//             ((nextActiveDay + 7 - nextResetDate.getDay()) % 7)
//         );

//         const nextResetDateString = nextResetDate.toLocaleDateString([], {
//           weekday: "long",
//         });
//         const startTimeInUserTimezone = convertUTCToUserTimezone(
//           timer.startTime
//         );
//         const endTimeInUserTimezone = convertUTCToUserTimezone(timer.endTime);

//         resetText = `Next active on ${nextResetDateString} from ${startTimeInUserTimezone} to ${endTimeInUserTimezone}`;
//         timerDetails.textContent = resetText;
//         timerDiv.appendChild(timerDetails);

//         const nextResetDateTime = new Date(
//           nextResetDate.getFullYear(),
//           nextResetDate.getMonth(),
//           nextResetDate.getDate(),
//           parseInt(timer.startTime.split(":")[0]),
//           parseInt(timer.startTime.split(":")[1])
//         );
//         const remainingTime = calculateRemainingTime(
//           new Date(),
//           nextResetDateTime
//         );
//         const timerRemaining = document.createElement("p");
//         timerRemaining.textContent = `Time remaining: ${remainingTime}`;
//         timerRemaining.className = "text-muted";
//         timerDiv.appendChild(timerRemaining);
//       }
//     } else if (timer.interval === "weekly") {
//       const resetTimeInUserTimezone = convertUTCToUserTimezone(timer.resetTime);
//       const resetDayName = new Intl.DateTimeFormat("en-US", {
//         weekday: "long",
//       }).format(new Date(1970, 0, timer.resetDay + 4));
//       resetText = `Resets every ${resetDayName} at ${resetTimeInUserTimezone}`;
//       timerDetails.textContent = resetText;
//       timerDiv.appendChild(timerDetails);

//       const remainingTime = calculateRemainingTime(
//         new Date(),
//         timer.resetTime,
//         timer.resetDay
//       );
//       const timerRemaining = document.createElement("p");
//       timerRemaining.textContent = `Time remaining: ${remainingTime}`;
//       timerRemaining.className = "text-muted";
//       timerDiv.appendChild(timerRemaining);
//     }

//     container.appendChild(timerDiv);
//   });
// }

// Function to update timers every second
function updateTimers() {
  displayTimers(); // Display timers
  updateCurrentTime(); // Update current time with every timer update
  setTimeout(updateTimers, 1000); // Update every second
}

// Function to initialize the page
function init() {
  updateTimers(); // Update timers on page load
}

window.onload = init; // Run init function on page load
