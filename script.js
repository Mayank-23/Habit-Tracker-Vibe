// Habit Tracker App
class HabitTracker {
    constructor() {
        this.habits = this.loadData();
        this.darkMode = this.loadTheme();
        this.appTitle = this.loadTitle();
        this.init();
    }

    init() {
        this.updateDate();
        this.setupEventListeners();
        this.applyTheme();
        this.applyTitle();
        this.render();
    }

    loadTitle() {
        const savedTitle = localStorage.getItem('habitTrackerTitle');
        return savedTitle || '🎯 Daily Habit Tracker';
    }

    saveTitle() {
        const titleElement = document.getElementById('appTitle');
        const title = titleElement.textContent.trim();
        if (title) {
            localStorage.setItem('habitTrackerTitle', title);
        }
    }

    applyTitle() {
        const titleElement = document.getElementById('appTitle');
        titleElement.textContent = this.appTitle;
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('habitTrackerTheme');
        return savedTheme === 'dark';
    }

    saveTheme() {
        localStorage.setItem('habitTrackerTheme', this.darkMode ? 'dark' : 'light');
    }

    applyTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');
        
        if (this.darkMode) {
            body.classList.add('dark-mode');
            themeIcon.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeIcon.textContent = '🌙';
        }
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        this.saveTheme();
        this.applyTheme();
    }

    updateDate() {
        const dateElement = document.getElementById('currentDate');
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    setupEventListeners() {
        const addBtn = document.getElementById('addHabitBtn');
        const input = document.getElementById('habitInput');
        const themeToggle = document.getElementById('themeToggle');
        const titleElement = document.getElementById('appTitle');

        addBtn.addEventListener('click', () => this.addHabit());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addHabit();
        });
        themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Save title when user finishes editing
        titleElement.addEventListener('blur', () => this.saveTitle());
        titleElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                titleElement.blur();
            }
        });
    }

    loadData() {
        const data = localStorage.getItem('habitTrackerData');
        return data ? JSON.parse(data) : {};
    }

    saveData() {
        localStorage.setItem('habitTrackerData', JSON.stringify(this.habits));
    }

    getTodayString() {
        return new Date().toISOString().split('T')[0];
    }

    addHabit() {
        const input = document.getElementById('habitInput');
        const habitName = input.value.trim();

        if (!habitName) {
            alert('Please enter a habit name!');
            return;
        }

        if (this.habits[habitName]) {
            alert('This habit already exists!');
            return;
        }

        this.habits[habitName] = {
            createdDate: this.getTodayString(),
            completedDates: [],
            notes: ''
        };

        this.saveData();
        input.value = '';
        this.render();
    }

    markComplete(habitName) {
        const today = this.getTodayString();
        const completedDates = this.habits[habitName].completedDates;
        
        if (completedDates.includes(today)) {
            // Toggle off - remove today's completion
            const index = completedDates.indexOf(today);
            completedDates.splice(index, 1);
        } else {
            // Toggle on - add today's completion
            completedDates.push(today);
        }
        
        this.saveData();
        this.render();
    }

    deleteHabit(habitName) {
        if (confirm(`Delete habit "${habitName}"?`)) {
            delete this.habits[habitName];
            this.saveData();
            this.render();
        }
    }

    saveNotes(habitName) {
        const notesTextarea = document.getElementById(`notes-${habitName}`);
        if (notesTextarea) {
            this.habits[habitName].notes = notesTextarea.value;
            this.saveData();
        }
    }

    toggleNotes(habitName) {
        const notesSection = document.getElementById(`notes-section-${habitName}`);
        if (notesSection) {
            notesSection.classList.toggle('show');
        }
    }

    calculateStreak(completedDates) {
        if (completedDates.length === 0) return 0;

        const sortedDates = completedDates
            .map(d => new Date(d))
            .sort((a, b) => b - a);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let streak = 0;
        let checkDate;

        // Check if completed today or yesterday
        const lastCompleted = sortedDates[0];
        lastCompleted.setHours(0, 0, 0, 0);

        if (lastCompleted.getTime() === today.getTime()) {
            streak = 1;
            checkDate = new Date(today);
        } else if (lastCompleted.getTime() === yesterday.getTime()) {
            streak = 1;
            checkDate = new Date(yesterday);
        } else {
            return 0;
        }

        // Count consecutive days
        for (let i = 1; i < sortedDates.length; i++) {
            const expectedDate = new Date(checkDate);
            expectedDate.setDate(expectedDate.getDate() - 1);
            
            const currentDate = sortedDates[i];
            currentDate.setHours(0, 0, 0, 0);

            if (currentDate.getTime() === expectedDate.getTime()) {
                streak++;
                checkDate = new Date(currentDate);
            } else {
                break;
            }
        }

        return streak;
    }

    render() {
        const container = document.getElementById('habitsContainer');
        const emptyState = document.getElementById('emptyState');
        
        container.innerHTML = '';

        const habitNames = Object.keys(this.habits);

        if (habitNames.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        const today = this.getTodayString();

        habitNames.forEach(habitName => {
            const habit = this.habits[habitName];
            const streak = this.calculateStreak(habit.completedDates);
            const total = habit.completedDates.length;
            const completedToday = habit.completedDates.includes(today);
            const notes = habit.notes || '';

            const card = document.createElement('div');
            card.className = `habit-card ${completedToday ? 'completed' : ''}`;

            const createdDate = new Date(habit.createdDate);
            const formattedDate = createdDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });

            card.innerHTML = `
                <div class="habit-info">
                    <div class="habit-name">${habitName}</div>
                    <div class="habit-created">📅 Added on ${formattedDate}</div>
                    <div class="habit-stats">
                        <span class="total">✅ Total: ${total}</span>
                    </div>
                    <div class="status ${completedToday ? 'completed-today' : 'not-completed'}">
                        ${completedToday ? '✓ Completed today!' : '○ Not completed today'}
                    </div>
                    <div class="notes-section" id="notes-section-${habitName}">
                        <textarea 
                            id="notes-${habitName}" 
                            class="notes-textarea" 
                            placeholder="Add notes about this habit..."
                            onblur="app.saveNotes('${habitName}')"
                        >${notes}</textarea>
                    </div>
                </div>
                <div class="habit-actions">
                    <div class="streak-display" title="Current streak">
                        <span class="streak-emoji">🔥</span>
                        <span class="streak-number">${streak}</span>
                    </div>
                    <div class="notes-icon" 
                         onclick="app.toggleNotes('${habitName}')"
                         title="Toggle notes">
                        📝
                    </div>
                    <div class="check-icon ${completedToday ? 'completed' : 'not-completed'}" 
                         onclick="app.markComplete('${habitName}')"
                         title="${completedToday ? 'Mark as incomplete' : 'Mark as complete'}">
                        ${completedToday ? '✓' : '○'}
                    </div>
                    <div class="delete-icon" 
                         onclick="app.deleteHabit('${habitName}')"
                         title="Delete habit">
                        ✕
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    }
}

// Initialize the app
const app = new HabitTracker();
