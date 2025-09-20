// Helper function for formatting currency
function formatKsh(amount) {
    return 'Ksh ' + parseFloat(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 });
}

// Mobile menu toggle 
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Initialize home summary after DOM is loaded
    updateHomeSummary();
});

// Elements
const incomeCard = document.querySelector('.summary-cards div:nth-child(1)');
const expenseCard = document.querySelector('.summary-cards div:nth-child(2)');
const savingsCard = document.querySelector('.summary-cards div:nth-child(3)');

const pieCanvas = document.getElementById('home-expense-pie'); // expense breakdown chart

const savingsGoalInput = document.getElementById('savings-goal-input');
const setGoalBtn = document.getElementById('set-goal-btn');
const savingsText = document.getElementById('savings-text');
const progressBar = document.getElementById('savings-progress');

// Savings Goal Setup
let savingsGoal = parseFloat(localStorage.getItem('savingsGoal')) || 1000000;

// Initialize savings goal input when elements are available
document.addEventListener('DOMContentLoaded', function() {
    if (savingsGoalInput) {
        savingsGoalInput.value = savingsGoal;
    }
});

// Save goal when user clicks
if (setGoalBtn) {
    setGoalBtn.addEventListener('click', () => {
        const newGoal = parseFloat(savingsGoalInput.value);

        if (isNaN(newGoal) || newGoal <= 0) {
            alert('Please enter a valid savings goal.');
            return;
        }

        savingsGoal = newGoal;
        localStorage.setItem('savingsGoal', savingsGoal);
        updateHomeSummary();
    });
}

// Update Summary + Charts
function updateHomeSummary() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    let totalIncome = 0;
    let totalExpense = 0;
    let totalSavings = 0;
    const expenseTotals = {};

    transactions.forEach(tx => {
        const amount = parseFloat(tx.amount);

        if (tx.type === 'income') totalIncome += amount;
        if (tx.type === 'expense') {
            totalExpense += amount;
            if (!expenseTotals[tx.category]) expenseTotals[tx.category] = 0;
            expenseTotals[tx.category] += amount;
        }
        if (tx.type === 'savings') totalSavings += amount;
    });

    // Update summary cards (check if elements exist)
    if (incomeCard) incomeCard.textContent = `Income: ${formatKsh(totalIncome)}`;
    if (expenseCard) expenseCard.textContent = `Expenses: ${formatKsh(totalExpense)}`;
    if (savingsCard) savingsCard.textContent = `Savings: ${formatKsh(totalSavings)}`;

    // Draw responsive pie chart
    if (pieCanvas && pieCanvas.getContext) {
        const ctx = pieCanvas.getContext('2d');
        
        // Make canvas responsive
        const container = pieCanvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = Math.min(containerWidth * 0.5, 400); // Responsive height
        
        pieCanvas.width = containerWidth - 40; // Account for padding
        pieCanvas.height = containerHeight;
        
        ctx.clearRect(0, 0, pieCanvas.width, pieCanvas.height);

        const totalExpenseAll = Object.values(expenseTotals).reduce((a, b) => a + b, 0);
        if (totalExpenseAll === 0) {
            // Draw "No data" message
            ctx.fillStyle = '#666';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No expense data available', pieCanvas.width / 2, pieCanvas.height / 2);
            return;
        }

        const centerX = pieCanvas.width / 2;
        const centerY = pieCanvas.height / 2;
        const radius = Math.min(centerX, centerY) - 60; // More space for mobile labels

        const colors = [
            "#2196F3","#FF9800","#9C27B0","#00BCD4","#FFC107",
            "#795548","#E91E63","#607D8B","#4CAF50","#F44336",
            "#8BC34A","#FF5722","#3F51B5","#CDDC39","#673AB7",
            "#009688","#FFEB3B","#00E676","#FF4081","#AED581",
            "#FF7043","#BA68C8","#26A69A","#FFD600","#90A4AE"
        ];

        let startAngle = 0, i = 0;
        for (const [category, amount] of Object.entries(expenseTotals)) {
            const sliceAngle = (amount / totalExpenseAll) * 2 * Math.PI;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();

            // Draw category labels outside chart (responsive positioning)
            const midAngle = startAngle + sliceAngle / 2;
            const lineStartX = centerX + radius * Math.cos(midAngle);
            const lineStartY = centerY + radius * Math.sin(midAngle);
            const lineEndX = centerX + (radius + 30) * Math.cos(midAngle);
            const lineEndY = centerY + (radius + 30) * Math.sin(midAngle);

            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lineStartX, lineStartY);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.stroke();

            ctx.fillStyle = '#000';
            ctx.font = `${Math.max(10, Math.min(12, pieCanvas.width / 40))}px sans-serif`; // Responsive font size
            ctx.textAlign = lineEndX > centerX ? 'left' : 'right';
            
            // Truncate long category names on mobile
            let displayCategory = category;
            if (pieCanvas.width < 400 && category.length > 10) {
                displayCategory = category.substring(0, 8) + '...';
            }
            
            ctx.fillText(displayCategory, lineEndX + (lineEndX > centerX ? 5 : -5), lineEndY);

            startAngle += sliceAngle;
            i++;
        }
    }

    // Update savings progress (check if elements exist)
    if (progressBar && savingsText) {
        const percent = Math.min((totalSavings / savingsGoal) * 100, 100);
        progressBar.style.width = percent + '%';
        savingsText.textContent = `${formatKsh(totalSavings)} / ${formatKsh(savingsGoal)}`;
    }
}

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(updateHomeSummary, 250);
});

// Update when localStorage changes
window.addEventListener('storage', function(event) {
    if (event.key === 'transactions' || event.key === 'savingsGoal') {
        updateHomeSummary();
    }
});