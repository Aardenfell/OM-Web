// Timer data
const timers = [
    {
        name: 'Daily Reset',
        interval: 'daily',
        resetTime: '00:00'
    },
    {
        name: 'Weekly Event A',
        interval: 'weekly',
        resetDay: 1, // Monday
        resetTime: '12:00'
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
    const now = new Date();
    let resetDate = new Date();

    if (resetDay !== null) {
        // Weekly timer
        resetDate.setDate(now.getDate() + ((resetDay + 7 - now.getDay()) % 7));
    } else {
        // Daily timer
        resetDate.setDate(now.getDate());
    }

    const [hours, minutes] = resetTime.split(':').map(Number);
    resetDate.setHours(hours, minutes, 0, 0);

    if (resetDate <= now) {
        // If the reset time has already passed for today, set it for the next interval
        if (resetDay !== null) {
            resetDate.setDate(resetDate.getDate() + 7);
        } else {
            resetDate.setDate(resetDate.getDate() + 1);
        }
    }

    const remainingTime = resetDate - now;
    const daysLeft = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
}

// Function to display timers
function displayTimers() {
    const container = document.getElementById('timers');
    container.innerHTML = '';

    timers.forEach(timer => {
        const timerDiv = document.createElement('div');
        timerDiv.className = 'timer';
        
        const timerName = document.createElement('h2');
        timerName.textContent = timer.name;
        timerDiv.appendChild(timerName);

        const timerDetails = document.createElement('p');
        let remainingTime;
        if (timer.interval === 'daily') {
            remainingTime = calculateRemainingTime(timer.resetTime);
            timerDetails.textContent = `Resets daily at ${timer.resetTime} (${remainingTime})`;
        } else if (timer.interval === 'weekly') {
            remainingTime = calculateRemainingTime(timer.resetTime, timer.resetDay);
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            timerDetails.textContent = `Resets every ${daysOfWeek[timer.resetDay]} at ${timer.resetTime} (${remainingTime})`;
        }

        timerDiv.appendChild(timerDetails);
        container.appendChild(timerDiv);
    });
}

// Function to update timers every second
function updateTimers() {
    displayTimers();
    setTimeout(updateTimers, 1000); // Update every second
}

// Function to initialize the page
function init() {
    updateTimers();
}

window.onload = init;
