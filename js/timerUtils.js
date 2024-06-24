// // Function to create a card for each timer/event
// function createTimerCard(timer) {
//     const cardContainer = document.createElement("div");
//     cardContainer.className = "col-md-4 col-lg-3 mb-4";

//     const card = document.createElement("div");
//     card.className = "card border-dark mb-3";
//     card.classList.add("bg-dark"); // Default to dark mode
//     card.style = "max-width: 20rem;";

//     const cardHeader = document.createElement("div");
//     cardHeader.className = "card-header";
//     cardHeader.textContent = timer.name;
//     card.appendChild(cardHeader);

//     const cardBody = document.createElement("div");
//     cardBody.className = "card-body";

//     const cardTitle = document.createElement("h4");
//     cardTitle.className = "card-title";
//     cardTitle.textContent = "Event Details";
//     cardBody.appendChild(cardTitle);

//     const cardText = document.createElement("p");
//     cardText.className = "card-text";
//     cardText.textContent = `Interval: ${timer.interval}`;
//     cardBody.appendChild(cardText);

//     card.appendChild(cardBody);
//     cardContainer.appendChild(card);

//     return cardContainer;
// }

// Function to display timers
function displayTimers() {
    // Get the container element where timers will be displayed
    const container = document.getElementById("timers");
    // Clear any existing content in the container
    container.innerHTML = "";

    // Iterate through each timer object in the timers array
    timers.forEach((timer) => {
        // Create a container for each timer card, using Bootstrap classes for styling
        const cardContainer = document.createElement("div");
        cardContainer.className = "col-md-4 mb-4";

        // Create the main card element for the timer
        const card = document.createElement("div");
        card.className = "card border-dark";
        card.classList.add("bg-dark"); // Default to dark mode
        card.style = "max-width: 20rem;";

        // Create card header to display the timer name
        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header h4";
        cardHeader.textContent = timer.name;
        card.appendChild(cardHeader);

        // Create card body to display timer details
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        // Logic to determine and display timer details based on interval type
        if (timer.interval === "daily") {
            // Handle daily interval timers
            if (Array.isArray(timer.resetTime)) {
                // If resetTime is an array, display multiple reset times
                timer.resetTime.forEach((time) => {
                    const resetTimeInUserTimezone = convertUTCToUserTimezone(time);
                    const resetText = `Resets daily at ${resetTimeInUserTimezone}`;
                    const timerDetails = createCardTextElement(resetText);
                    cardBody.appendChild(timerDetails);

                    const remainingTime = calculateRemainingTime(new Date(), time);
                    const timerRemaining = createCardTextElement(
                        `Time until: ${remainingTime}`,
                        "text-muted"
                    );
                    cardBody.appendChild(timerRemaining);
                });
            } else {
                // If resetTime is a single time, display once
                const resetTimeInUserTimezone = convertUTCToUserTimezone(timer.resetTime);
                const resetText = `Resets daily at ${resetTimeInUserTimezone}`;
                const timerDetails = createCardTextElement(resetText);
                cardBody.appendChild(timerDetails);

                const remainingTime = calculateRemainingTime(new Date(), timer.resetTime);
                const timerRemaining = createCardTextElement(
                    `Time until: ${remainingTime}`,
                    "text-muted"
                );
                cardBody.appendChild(timerRemaining);
            }
        } else if (timer.interval === "custom") {
            // Handle custom interval timers
            const today = new Date();
            const dayOfWeek = today.getDay();

            if (timer.activeDays.includes(dayOfWeek)) {
                // Timer is active today
                const startTimeInUserTimezone = convertUTCToUserTimezone(timer.startTime);
                const endTimeInUserTimezone = convertUTCToUserTimezone(timer.endTime);
                const resetText = `Active today from ${startTimeInUserTimezone} to ${endTimeInUserTimezone}`;
                const timerDetails = createCardTextElement(resetText);
                cardBody.appendChild(timerDetails);

                const remainingTime = calculateRemainingTime(new Date(), timer.endTime);
                const timerRemaining = createCardTextElement(
                    `Time until next: ${remainingTime}`,
                    "text-muted"
                );
                cardBody.appendChild(timerRemaining);
            } else {
                // Timer is not active today, find the next active day
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

                const resetText = `Next active on ${nextResetDateString} from ${startTimeInUserTimezone} to ${endTimeInUserTimezone}`;
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
                    `Time until next: ${remainingTime}`,
                    "text-muted"
                );
                cardBody.appendChild(timerRemaining);
            }
        } else if (timer.interval === "weekly") {
            // Handle weekly interval timers
            const resetTimeInUserTimezone = convertUTCToUserTimezone(timer.resetTime);
            const resetDayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(1970, 0, timer.resetDay + 4));
            const resetText = `Resets every ${resetDayName} at ${resetTimeInUserTimezone}`;
            const timerDetails = createCardTextElement(resetText);
            cardBody.appendChild(timerDetails);

            const remainingTime = calculateRemainingTime(new Date(), timer.resetTime, timer.resetDay);
            const timerRemaining = createCardTextElement(
                `Time remaining: ${remainingTime}`,
                "text-muted"
            );
            cardBody.appendChild(timerRemaining);
        } else if (timer.interval === "hourly") {
            // Handle hourly interval timers
            const firstTime = new Date();
            firstTime.setHours(parseInt(convertUTCToUserTimezone(timer.resetTime).split(":")[0]), parseInt(convertUTCToUserTimezone(timer.resetTime).split(":")[1]), 0, 0); // Initialize with the specified reset time

            const intervalHours = parseInt(timer.intervalHours) || 1; // Convert intervalHours to integer, default to 1 if not set
            const now = new Date();

            nextResetTime = new Date(firstTime); // Start with the initial reset time
            while (nextResetTime <= now) {
                nextResetTime.setHours(nextResetTime.getHours() + intervalHours); // Increment by intervalHours
            }

            resetText = `Next reset at ${convertUTCToUserTimezone(nextResetTime.toISOString().substr(11, 5))}`;
            const timerDetails = createCardTextElement(resetText);
            cardBody.appendChild(timerDetails);

            remainingTime = calculateRemainingTime(now, nextResetTime);
            const timerRemaining = createCardTextElement(
                `Time until next: ${remainingTime}`,
                "text-muted"
            );
            cardBody.appendChild(timerRemaining);
        }

        // Append card body to the main card element
        card.appendChild(cardBody);
        // Append the main card element to its container
        cardContainer.appendChild(card);
        // Append the container to the main timers display container
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

