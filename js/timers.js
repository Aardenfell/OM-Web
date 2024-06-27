// Timer data
const timers = [
  // {
  //     name: "", // Give it a name
  //     interval: "daily, custom, weekly, hourly", // Choose between "daily", "weekly", "hourly", or "custom"
  //     intervalHours: 1, // Only used if interval is "hourly". Can be any increment of hours.
  //     resetDay: 0, // 0 = Sunday, 1 = Monday, etc. Only used if interval is 'weekly'.
  //     activeDays: [1, 3, 5], // 0 = Sunday, 1 = Monday, etc. Only used if interval is 'custom'. Must be an array.
  //     resetTime: "00:00", // Reset time in 24-hour format. Use an array if multiple times
  //     startTime: "09:00", // Start time in 24-hour format. Use if an event has a duration
  //     endTime: "22:00" // End time in 24-hour format. use if an event has a duration
  //     eventDesc: "Lorem Ipsum", // Event description
  //     image: "", // Image URL
  //     listGroup: "Lorem Ipsum, Test1, Test2", // still broken
  //     cardLink1Text: "Lorem Ipsum", // Link text
  //     cardLink1Url: "https://www.google.com", // Link URL
  //     cardLink2Text: "Lorem Ipsum",  // Link text
  //     cardLink2Url: "https://www.google.com", // Link URL
  // },
  {
    name: "Daily Reset",
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
    name: "Placeholder Test",
    interval: "weekly", // Weekly timer
    resetDay: 1, // Monday
    resetTime: "12:00", // Reset time in 24-hour format
    eventDesc: "Lorem Ipsum Lorem Ipsum   Lorem Ipsum", 
    image: "",
    listGroup: "Lorem Ipsum, Test1, Test2",
    cardLink1Text: "Lorem Ipsum",
    cardLink1: "https://www.google.com",
    cardLink2Text: "Lorem Ipsum pt 2T",
    cardLink2: "https://www.google.com",
    
  },
  {
    name: "World Apex",
    interval: "weekly",
    resetDay: 0, // Sunday
    resetTime: "15:00",
  },
  {
    name: "Market Reset Test",
    interval: "hourly",
    intervalHours: "3",
    resetTime: "12:58",
  },
  {
      name: "Sect Duel", // Give it a name
      interval: "custom", // Choose between "daily", "weekly", "hourly", or "custom"
      activeDays: [1], // 0 = Sunday, 1 = Monday, etc. Only used if interval is 'weekly' or 'custom'. Use an array if multiple days
      startTime: "13:00", // Start time in 24-hour format. Use if an event has a duration
      endTime: "03:00" // End time in 24-hour format. use if an event has a duration
  },
  // Add more timers as needed
];
