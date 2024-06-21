// Timer data
const timers = [
    {
        name: 'Pills Reset',
        interval: 'daily', // Daily timer
        resetTime: '13:00' // Reset time in 24-hour format
    },
    {
        name: 'Beast Invasion p1',
        interval: 'daily', // Daily timer
        resetTime: '17:00' // Reset time in 24-hour format
    },
    {
        name: 'Beast Invasion p2',
        interval: 'daily', // Daily timer
        resetTime: '23:00' // Reset time in 24-hour format
    },
    {
        name: 'Weekly Event A',
        interval: 'weekly', // Weekly timer
        resetDay: 1, // Monday
        resetTime: '12:00' // Reset time in 24-hour format
    },
    {
        name: 'Weekly Event B',
        interval: 'weekly',
        resetDay: 3, // Wednesday
        resetTime: '18:00'
    },
    // Add more timers as needed
];

// Function to update and display current time
function updateCurrentTime() {
    const now = new Date();
    const currentTimeElement = document.getElementById('current-time');
    currentTimeElement.textContent = `Current Time: ${now.toLocaleTimeString()}`;
}




// Function to convert UTC reset time to user's local time
function convertUTCToUserTimezone(resetTime) {
    const now = new Date(); // Current date and time in user's timezone

    // Get user's current timezone offset in minutes (including DST offset if applicable)
    // const timezoneOffset = now.getTimezoneOffset();

    // Parse reset time in UTC
    const [hoursUTC, minutesUTC] = resetTime.split(':').map(Number);

    // Create a new date object for the reset time in UTC
    const resetDateUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hoursUTC, minutesUTC));

    // Convert UTC time to user's local time
    const resetTimeLocal = resetDateUTC.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return resetTimeLocal;
}


// Prototype function to check if DST (Daylight Saving Time) is in effect
Date.prototype.dst = function() {
    const january = new Date(this.getFullYear(), 0, 1);
    const july = new Date(this.getFullYear(), 6, 1);
    return this.getTimezoneOffset() < Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
};




// Function to calculate the remaining time until the next reset in the user's timezone
function calculateRemainingTime(currentTime, resetTimeLocal, resetDay = null) {
    const now = currentTime; // Use the passed current time as the current time in the user's timezone

    // Parse reset time in local timezone
    const [hoursLocal, minutesLocal] = resetTimeLocal.split(':').map(Number);

    // Create a new date object for today's date with reset time in local timezone
    const resetDateLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hoursLocal, minutesLocal);

    // Adjust for weekly timer if resetDay is provided
    if (resetDay !== null) {
        resetDateLocal.setDate(resetDateLocal.getDate() + ((resetDay + 7 - resetDateLocal.getDay()) % 7));
    }

    // Calculate remaining time in milliseconds until the reset
    let remainingTime = resetDateLocal - now;
    if (remainingTime <= 0) {
        // If the reset time has already passed for today, set it for the next interval
        if (resetDay !== null) {
            resetDateLocal.setDate(resetDateLocal.getDate() + 7);
        } else {
            resetDateLocal.setDate(resetDateLocal.getDate() + 1);
        }
        // Recalculate remaining time
        remainingTime = resetDateLocal - now;
    }

    // Calculate days, hours, minutes, and seconds left until the reset
    const daysLeft = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    remainingTime %= (1000 * 60 * 60 * 24);
    const hoursLeft = Math.floor(remainingTime / (1000 * 60 * 60));
    remainingTime %= (1000 * 60 * 60);
    const minutesLeft = Math.floor(remainingTime / (1000 * 60));
    remainingTime %= (1000 * 60);
    const secondsLeft = Math.floor(remainingTime / 1000);

    return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`; // Format and return remaining time string
}









// Function to display timers
function displayTimers() {
    const container = document.getElementById('timers'); // Get container element
    container.innerHTML = ''; // Clear container

    timers.forEach(timer => { // Iterate over timers
        const timerDiv = document.createElement('div'); // Create timer div
        timerDiv.className = 'timer col-md-4 mb-4'; // Set class name
        
        const timerName = document.createElement('h2'); // Create timer name element
        timerName.textContent = timer.name; // Set timer name
        timerDiv.appendChild(timerName); // Append timer name to timer div

        const timerDetails = document.createElement('p'); // Create timer details element
        let resetText; // Initialize reset text variable
        if (timer.interval === 'daily') { // Daily timer
            const resetTimeInUserTimezone = convertUTCToUserTimezone(timer.resetTime); // Convert UTC reset time to user's timezone
            resetText = `Resets daily at ${resetTimeInUserTimezone}`; // Set reset text
            timerDetails.textContent = resetText; // Set timer details text
            timerDiv.appendChild(timerDetails); // Append timer details to timer div

            const remainingTime = calculateRemainingTime(new Date(), convertUTCToUserTimezone(timer.resetTime)); // Calculate remaining time in user's timezone
            const timerRemaining = document.createElement('p'); // Create timer remaining element
            timerRemaining.textContent = `Time remaining: ${remainingTime}`; // Set timer remaining text
            timerRemaining.className = 'text-muted'; // Add Bootstrap class for muted text
            timerDiv.appendChild(timerRemaining); // Append timer remaining to timer div
        } else if (timer.interval === 'weekly') { // Weekly timer
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; // Days of the week
            const resetTimeInUserTimezone = convertUTCToUserTimezone(timer.resetTime); // Convert UTC reset time to user's timezone
            resetText = `Resets every ${daysOfWeek[timer.resetDay]} at ${resetTimeInUserTimezone}`; // Set reset text
            timerDetails.textContent = resetText; // Set timer details text
            timerDiv.appendChild(timerDetails); // Append timer details to timer div

            const remainingTime = calculateRemainingTime(new Date(), convertUTCToUserTimezone(timer.resetTime), timer.resetDay); // Calculate remaining time in user's timezone
            const timerRemaining = document.createElement('p'); // Create timer remaining element
            timerRemaining.textContent = `Time remaining: ${remainingTime}`; // Set timer remaining text
            timerRemaining.className = 'text-muted'; // Add Bootstrap class for muted text
            timerDiv.appendChild(timerRemaining); // Append timer remaining to timer div
        }

        container.appendChild(timerDiv); // Append timer div to container
    });
}

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
