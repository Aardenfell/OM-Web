document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const cards = document.getElementsByClassName('card');

    // Load and apply the saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('bg-dark-subtle', savedTheme === 'dark');
        body.classList.toggle('bg-light', savedTheme === 'light');
        body.setAttribute('data-bs-theme', savedTheme);
        for (let card of cards) {
            // card.classList.toggle('bg-dark', savedTheme === 'dark');
            // card.classList.toggle('bg-light', savedTheme === 'light');
        }
        themeToggle.checked = savedTheme === 'dark';
    } else {
        // Default to dark mode
        body.classList.add('bg-dark-subtle');
        body.setAttribute('data-bs-theme', 'dark');
        for (let card of cards) {
            // card.classList.add('bg-dark');
        }
    }

    themeToggle.addEventListener('change', function () {
        const isDarkMode = themeToggle.checked;
        body.classList.toggle('bg-dark-subtle', isDarkMode);
        body.classList.toggle('bg-light', !isDarkMode);
        body.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
        for (let card of cards) {
            // card.classList.toggle('bg-dark', isDarkMode);
            // card.classList.toggle('bg-light', !isDarkMode);
        }

        // Save the theme preference
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
});
