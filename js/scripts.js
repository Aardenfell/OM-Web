// Timer data
const timers = [
    {
        name: 'Daily Reset',
        interval: 'daily', // Daily timer
        resetTime: '00:00' // Reset time in 24-hour format
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

// Function to calculate the remaining time until the next reset
function calculateRemainingTime(resetTime, resetDay = null) {
    const now = new Date(); // Current date and time
    let resetDate = new Date(); // Reset date and time

    if (resetDay !== null) {
        // Weekly timer
        resetDate.setDate(now.getDate() + ((resetDay + 7 - now.getDay()) % 7));
    } else {
        // Daily timer
        resetDate.setDate(now.getDate());
    }

    const [hours, minutes] = resetTime.split(':').map(Number); // Parse reset time
    resetDate.setHours(hours, minutes, 0, 0);

    if (resetDate <= now) {
        // If the reset time has already passed for today, set it for the next interval
        if (resetDay !== null) {
            resetDate.setDate(resetDate.getDate() + 7);
        } else {
            resetDate.setDate(resetDate.getDate() + 1);
        }
    }

    const remainingTime = resetDate - now; // Calculate remaining time
    const daysLeft = Math.floor(remainingTime / (1000 * 60 * 60 * 24)); // Calculate remaining days
    const hoursLeft = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Calculate remaining hours
    const minutesLeft = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)); // Calculate remaining minutes
    const secondsLeft = Math.floor((remainingTime % (1000 * 60)) / 1000); // Calculate remaining seconds

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
            resetText = `Resets daily at ${timer.resetTime}`; // Set reset text
        } else if (timer.interval === 'weekly') { // Weekly timer
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; // Days of the week
            resetText = `Resets every ${daysOfWeek[timer.resetDay]} at ${timer.resetTime}`; // Set reset text
        }
        timerDetails.textContent = resetText; // Set timer details text
        timerDiv.appendChild(timerDetails); // Append timer details to timer div

        const timerRemaining = document.createElement('p'); // Create timer remaining element
        const remainingTime = calculateRemainingTime(timer.resetTime, timer.resetDay); // Calculate remaining time
        timerRemaining.textContent = `Time remaining: ${remainingTime}`; // Set timer remaining text
        timerRemaining.className = 'text-muted'; // Add Bootstrap class for muted text
        timerDiv.appendChild(timerRemaining); // Append timer remaining to timer div

        container.appendChild(timerDiv); // Append timer div to container
    });
}

// Function to update timers every second
function updateTimers() {
    displayTimers(); // Display timers
    setTimeout(updateTimers, 1000); // Update every second
}

// Function to initialize the page
function init() {
    updateTimers(); // Update timers on page load
}

window.onload = init; // Run init function on page load
