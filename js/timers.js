// Timer data
const timers = [
  // {
  //     name: '', // Give it a name
  //     interval: 'daily, specificDays, weekly', // Choose between 'daily', 'weekly', or 'custom'
  //     resetDay: 0, // 0 = Sunday, 1 = Monday, etc. Only used if interval is 'weekly' or 'custom'. Use an array if multiple days
  //     resetTime: '00:00' // Reset time in 24-hour format. Use an array if multiple times
  //     startTime: '09:00', // Start time in 24-hour format. Use if an event has a duration
  //     endTime: '22:00' // End time in 24-hour format. use if an event has a duration
  // },
  {
    name: "Pills Reset",
    interval: "daily", // Daily timer
    resetTime: "13:00", // Reset time in 24-hour format
  },
  {
    name: "Demondbend Abyss",
    interval: "custom", // Specific days timer
    activeDays: [1, 3, 5], // Monday, Wednesday, Friday
    startTime: "14:00", // Start time in 24-hour format
    endTime: "03:00", // End time in 24-hour format
  },
  {
    name: "Beast Invasion",
    interval: "daily", // Daily timer
    resetTime: ["17:00", "23:00"], // Reset time in 24-hour format
  },
  {
    name: "Weekly Event A",
    interval: "weekly", // Weekly timer
    resetDay: 1, // Monday
    resetTime: "12:00", // Reset time in 24-hour format
  },
  {
    name: "World Apex",
    interval: "weekly",
    resetDay: 0, // Sunday
    resetTime: "15:00",
  },
  // Add more timers as needed
];
