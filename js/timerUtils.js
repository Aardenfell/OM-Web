// Function to create a card for each timer/event
function createTimerCard(timer) {
    const cardContainer = document.createElement("div");
    cardContainer.className = "col-md-4 mb-4";

    const card = document.createElement("div");
    card.className = "card mb-3 border-dark";
    card.classList.add("bg-dark"); // Default to dark mode

    const cardHeader = document.createElement("h3");
    cardHeader.className = "card-header";
    cardHeader.textContent = timer.name;
    card.appendChild(cardHeader);

    // If an image is specified in the timer, add it as an img element
    if (timer.image) {
        const cardImage = document.createElement("img");
        cardImage.className = "card-img-top";
        cardImage.src = timer.image;
        card.appendChild(cardImage);
    } else {
        // Add default SVG if no image is specified
        const cardImage = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        cardImage.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        cardImage.setAttribute("class", "d-block user-select-none");
        cardImage.setAttribute("width", "100%");
        cardImage.setAttribute("height", "200");
        cardImage.setAttribute("aria-label", "Placeholder: Image cap");
        cardImage.setAttribute("focusable", "false");
        cardImage.setAttribute("role", "img");
        cardImage.setAttribute("preserveAspectRatio", "xMidYMid slice");
        cardImage.setAttribute("viewBox", "0 0 318 180");
        cardImage.setAttribute("style", "font-size:1.125rem;text-anchor:middle");
        const cardRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cardRect.setAttribute("width", "100%");
        cardRect.setAttribute("height", "100%");
        cardRect.setAttribute("fill", "#868e96");
        const cardText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        cardText.setAttribute("x", "50%");
        cardText.setAttribute("y", "50%");
        cardText.setAttribute("fill", "#dee2e6");
        cardText.setAttribute("dy", ".3em");
        cardText.textContent = "Image cap";
        cardImage.appendChild(cardRect);
        cardImage.appendChild(cardText);
        card.appendChild(cardImage);
    }

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = "Event Details";
    cardBody.appendChild(cardTitle);

    const cardSubtitle = document.createElement("h6");
    cardSubtitle.className = "card-subtitle mb-2 text-muted";
    cardSubtitle.textContent = `Interval: ${timer.interval}`;
    cardBody.appendChild(cardSubtitle);

    if (timer.eventDesc) {
    const cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.textContent = timer.eventDesc;
    cardBody.appendChild(cardText);
    } else {
        const cardText = document.createElement("p");
        cardText.className = "card-text";
        cardText.textContent = "Some quick example text to build on the card title and make up the bulk of the card's content.";
        cardBody.appendChild(cardText);
    }

    const listGroup = document.createElement("ul");
    listGroup.className = "list-group list-group-flush";
    card.appendChild(listGroup);
    

    // Add card links if specified
    if (timer.cardLink1) {
        const cardLink1 = document.createElement("a");
        cardLink1.className = "card-link";
        cardLink1.href = timer.cardLink1;
        cardLink1.textContent = timer.cardLink1Text;
        cardBody.appendChild(cardLink1);
    }
    if (timer.cardLink2) {
        const cardLink2 = document.createElement("a");
        cardLink2.className = "card-link";
        cardLink2.href = timer.cardLink2;
        cardLink2.textContent = timer.cardLink2Text;
        cardBody.appendChild(cardLink2);
    }

    card.appendChild(cardBody);

    const cardFooter = document.createElement("div");
    cardFooter.className = "card-footer text-muted";
    card.appendChild(cardFooter);

    cardContainer.appendChild(card);

    return { cardContainer, cardBody, listGroup, cardFooter };
}

// Function to display timers
function displayTimers() {
    const container = document.getElementById("timers");
    container.innerHTML = "";

    timers.forEach((timer) => {
        const { cardContainer, cardBody, listGroup, cardFooter } = createTimerCard(timer);

        if (timer.interval === "daily") {
            const resetTimes = Array.isArray(timer.resetTime) ? timer.resetTime : [timer.resetTime];
            resetTimes.forEach((time) => {
                const resetTimeInUserTimezone = convertUTCToUserTimezone(time);
                const resetText = `Resets daily at ${resetTimeInUserTimezone}`;
                const timerDetails = createCardTextElement(resetText);
                cardBody.appendChild(timerDetails);

                const remainingTime = calculateRemainingTime(new Date(), time);
                const timerRemaining = createCardTextElement(`Time until: ${remainingTime}`, "text-muted");
                cardFooter.textContent = `Time until next: ${remainingTime}`;
            });
        } else if (timer.interval === "custom") {
            const today = new Date();
            const dayOfWeek = today.getDay();

            if (timer.activeDays.includes(dayOfWeek)) {
                const startTimeInUserTimezone = convertUTCToUserTimezone(timer.startTime);
                const endTimeInUserTimezone = convertUTCToUserTimezone(timer.endTime);
                const resetText = `Active today from ${startTimeInUserTimezone} to ${endTimeInUserTimezone}`;
                const timerDetails = createCardTextElement(resetText);
                cardBody.appendChild(timerDetails);

                const remainingTime = calculateRemainingTime(new Date(), timer.endTime);
                cardFooter.textContent = `Time until next: ${remainingTime}`;
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
                cardFooter.textContent = `Time until next: ${remainingTime}`;
            }
        } else if (timer.interval === "weekly") {
            const resetTimeInUserTimezone = convertUTCToUserTimezone(timer.resetTime);
            const resetDayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date(1970, 0, timer.resetDay + 4));
            const resetText = `Resets every ${resetDayName} at ${resetTimeInUserTimezone}`;
            const timerDetails = createCardTextElement(resetText);
            cardBody.appendChild(timerDetails);

            const remainingTime = calculateRemainingTime(new Date(), timer.resetTime, timer.resetDay);
            cardFooter.textContent = `Time remaining: ${remainingTime}`;
        } else if (timer.interval === "hourly") {
            const firstTime = new Date();
            firstTime.setHours(parseInt(convertUTCToUserTimezone(timer.resetTime).split(":")[0]), parseInt(convertUTCToUserTimezone(timer.resetTime).split(":")[1]), 0, 0); // Initialize with the specified reset time

            const intervalHours = parseInt(timer.intervalHours) || 1; // Convert intervalHours to integer, default to 1 if not set
            const now = new Date();

            let nextResetTime = new Date(firstTime); // Start with the initial reset time
            while (nextResetTime <= now) {
                nextResetTime.setHours(nextResetTime.getHours() + intervalHours); // Increment by intervalHours
            }

            const resetText = `Next reset at ${convertUTCToUserTimezone(nextResetTime.toISOString().substr(11, 5))}`;
            const timerDetails = createCardTextElement(resetText);
            cardBody.appendChild(timerDetails);

            const remainingTime = calculateRemainingTime(now, nextResetTime);
            cardFooter.textContent = `Time until next: ${remainingTime}`;
        }

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

