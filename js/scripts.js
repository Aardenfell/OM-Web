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
        if (timer.interval === 'daily') {
            timerDetails.textContent = `Resets daily at ${timer.resetTime}`;
        } else if (timer.interval === 'weekly') {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            timerDetails.textContent = `Resets every ${daysOfWeek[timer.resetDay]} at ${timer.resetTime}`;
        }

        timerDiv.appendChild(timerDetails);
        container.appendChild(timerDiv);
    });
}

// Function to initialize the page
function init() {
    displayTimers();
}

window.onload = init;
