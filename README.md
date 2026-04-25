# Daily Habit Tracker

A simple web application to track your daily habits and view your streaks.

## Features

- ✅ Add and track multiple habits
- 🔥 View current streak for each habit
- 📊 See total completions
- 💾 Data stored in browser's localStorage
- 🎨 Beautiful gradient UI with smooth animations
- 📱 Responsive design for mobile and desktop

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)

## How to Run

Simply open `index.html` in your web browser:

1. Double-click `index.html`, or
2. Right-click and select "Open with" your preferred browser

## How to Use

1. **Add a Habit**: Type the habit name in the input field and click "Add Habit" (or press Enter)
2. **Mark Complete**: Click the "✓ Complete" button to mark a habit as done for today
3. **View Streaks**: Your current streak is displayed with a 🔥 icon
4. **Delete Habit**: Click "Delete" to remove a habit

## Data Storage

All habit data is stored in your browser's localStorage. The data persists between sessions as long as you use the same browser.

## Streak Calculation

- A streak counts consecutive days where you completed the habit
- The streak continues if you completed the habit today or yesterday
- Missing a day breaks the streak

Enjoy building your habits! 🎯
