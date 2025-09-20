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

    // Initialize reports after DOM is loaded
    initializeReports();
});

// Elements
let totalsList, barCanvas, pieCanvas, reportFilters;

// Initialize reports functionality
function initializeReports() {
    totalsList = document.getElementById('totals-list');
    barCanvas = document.getElementById('bar-chart');
    pieCanvas = document.getElementById('pie-chart');
    reportFilters = document.getElementById('report-filters');

    if (reportFilters) {
        reportFilters.addEventListener('submit', handleFilterSubmit);
    }

    renderReports();
}

// Handle filter form submission
function handleFilterSubmit(e) {
    e.preventDefault();
    renderReports();
}

// Function to filter transactions based on selected month/year
function getFilteredTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    
    if (!monthSelect || !yearSelect) return transactions;
    
    const selectedMonth = monthSelect.value;
    const selectedYear = yearSelect.value;
    
    if (!selectedMonth && !selectedYear) return transactions;
    
    return transactions.filter(tx => {
        const txDate = new Date(tx.date);
        const txMonth = txDate.getMonth() + 1; // getMonth() returns 0-11
        const txYear = txDate.getFullYear();
        
        const monthMatch = !selectedMonth || txMonth === parseInt(selectedMonth);
        const yearMatch = !selectedYear || txYear === parseInt(selectedYear);
        
        return monthMatch && yearMatch;
    });
}

// Function to render reports with responsive design
function renderReports() {
    const transactions = getFilteredTransactions();

    // Compute totals
    const totals = {};
    let totalIncome = 0, totalExpense = 0, totalSavings = 0;

    transactions.forEach(tx => {
        if (!totals[tx.category]) totals[tx.category] = 0;
        totals[tx.category] += parseFloat(tx.amount);

        if (tx.type === 'income') totalIncome += parseFloat(tx.amount);
        if (tx.type === 'expense') totalExpense += parseFloat(tx.amount);
        if (tx.type === 'savings') totalSavings += parseFloat(tx.amount);
    });

    // Populate category totals
    if (totalsList) {
        totalsList.innerHTML = '';
        
        if (Object.keys(totals).length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No transactions found for the selected period.';
            li.style.color = '#666';
            li.style.fontStyle = 'italic';
            totalsList.appendChild(li);
        } else {
            // Sort categories by amount (descending)
            const sortedTotals = Object.entries(totals).sort((a, b) => b[1] - a[1]);
            
            sortedTotals.forEach(([category, amount]) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="category-name">${category}</span>
                    <span class="category-amount">${formatKsh(amount)}</span>
                `;
                totalsList.appendChild(li);
            });
        }
    }

    // Draw responsive Bar Chart (Income vs Expenses vs Savings)
    drawBarChart(totalIncome, totalExpense, totalSavings);
    
    // Draw responsive Pie Chart (Expenses by Category)
    drawPieChart(transactions, totals);
}

// Draw responsive bar chart
function drawBarChart(totalIncome, totalExpense, totalSavings) {
    if (!barCanvas || !barCanvas.getContext) return;
    
    const ctx = barCanvas.getContext('2d');
    const container = barCanvas.parentElement;
    const containerWidth = container.clientWidth;
    
    // Make canvas responsive
    barCanvas.width = containerWidth - 40; // Account for padding
    barCanvas.height = Math.min(containerWidth * 0.4, 250); // Responsive height
    
    const chartWidth = barCanvas.width;
    const chartHeight = barCanvas.height - 60; // Leave space for labels
    const maxValue = Math.max(totalIncome, totalExpense, totalSavings);
    
    ctx.clearRect(0, 0, chartWidth, barCanvas.height);
    
    if (maxValue === 0) {
        // Draw "No data" message
        ctx.fillStyle = '#666';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', chartWidth / 2, barCanvas.height / 2);
        return;
    }
    
    const scale = chartHeight / maxValue;
    const barWidth = Math.max(60, Math.min(100, chartWidth / 6)); // Responsive bar width
    const spacing = (chartWidth - (3 * barWidth)) / 4; // Equal spacing
    
    // Draw bars with responsive positioning
    const bars = [
        { value: totalIncome, color: '#4CAF50', label: 'Income', x: spacing },
        { value: totalExpense, color: '#FF5722', label: 'Expenses', x: spacing * 2 + barWidth },
        { value: totalSavings, color: '#2196F3', label: 'Savings', x: spacing * 3 + barWidth * 2 }
    ];
    
    bars.forEach(bar => {
        const barHeight = bar.value * scale;
        
        // Draw bar
        ctx.fillStyle = bar.color;
        ctx.fillRect(bar.x, chartHeight - barHeight + 20, barWidth, barHeight);
        
        // Draw value on top of bar
        ctx.fillStyle = '#000';
        ctx.font = `${Math.max(10, Math.min(14, chartWidth / 40))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(
            formatKsh(bar.value), 
            bar.x + barWidth / 2, 
            chartHeight - barHeight + 10
        );
        
        // Draw label below bar
        ctx.fillText(
            bar.label, 
            bar.x + barWidth / 2, 
            chartHeight + 40
        );
    });
}

// Draw responsive pie chart
function drawPieChart(transactions, totals) {
    if (!pieCanvas || !pieCanvas.getContext) return;
    
    const ctx = pieCanvas.getContext('2d');
    const container = pieCanvas.parentElement;
    const containerWidth = container.clientWidth;
    
    // Make canvas responsive
    const canvasSize = Math.min(containerWidth - 40, 400);
    pieCanvas.width = canvasSize;
    pieCanvas.height = canvasSize;
    
    const centerX = pieCanvas.width / 2;
    const centerY = pieCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 80; // Space for labels
    
    ctx.clearRect(0, 0, pieCanvas.width, pieCanvas.height);

    // Filter for expense categories only
    const expenseTotals = {};
    transactions.forEach(tx => {
        if (tx.type === 'expense') {
            if (!expenseTotals[tx.category]) expenseTotals[tx.category] = 0;
            expenseTotals[tx.category] += parseFloat(tx.amount);
        }
    });

    const totalExpenseAll = Object.values(expenseTotals).reduce((a, b) => a + b, 0);
    
    if (totalExpenseAll === 0) {
        // Draw "No expense data" message
        ctx.fillStyle = '#666';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No expense data available', centerX, centerY);
        return;
    }

    let startAngle = 0;
    const colors = [
        "#2196F3","#FF9800","#9C27B0","#00BCD4","#FFC107","#795548",
        "#E91E63","#607D8B","#4CAF50","#F44336","#8BC34A","#FF5722",
        "#3F51B5","#CDDC39","#673AB7","#009688","#FFEB3B","#00E676",
        "#FF4081","#AED581","#FF7043","#BA68C8","#26A69A","#FFD600"
    ];

    let i = 0;
    for (const [category, amount] of Object.entries(expenseTotals)) {
        const sliceAngle = (amount / totalExpenseAll) * 2 * Math.PI;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        // Draw line pointing outside (responsive)
        const midAngle = startAngle + sliceAngle / 2;
        const lineStartX = centerX + radius * Math.cos(midAngle);
        const lineStartY = centerY + radius * Math.sin(midAngle);
        const lineEndX = centerX + (radius + 25) * Math.cos(midAngle);
        const lineEndY = centerY + (radius + 25) * Math.sin(midAngle);

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lineStartX, lineStartY);
        ctx.lineTo(lineEndX, lineEndY);
        ctx.stroke();

        // Category label outside (responsive font and positioning)
        ctx.fillStyle = '#000';
        ctx.font = `${Math.max(9, Math.min(12, pieCanvas.width / 35))}px sans-serif`;
        ctx.textAlign = lineEndX > centerX ? 'left' : 'right';
        
        // Truncate long category names for small screens
        let displayCategory = category;
        if (pieCanvas.width < 300 && category.length > 8) {
            displayCategory = category.substring(0, 6) + '...';
        }
        
        ctx.fillText(
            displayCategory, 
            lineEndX + (lineEndX > centerX ? 3 : -3), 
            lineEndY
        );

        startAngle += sliceAngle;
        i++;
    }
}

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(renderReports, 250);
});

// Update reports when localStorage changes
window.addEventListener('storage', function(event) {
    if (event.key === 'transactions') {
        renderReports();
    }
});

// Export CSV
function exportCSV() {
    const transactions = getFilteredTransactions();
    
    if (transactions.length === 0) {
        alert('No transactions to export.');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,"; 
    csvContent += "Date,Type,Category,Amount,Notes\r\n";

    transactions.forEach(tx => {
        // Escape quotes and commas in data
        const escapedNotes = tx.notes ? '"' + tx.notes.replace(/"/g, '""') + '"' : '';
        const escapedCategory = '"' + tx.category.replace(/"/g, '""') + '"';
        
        csvContent += `${tx.date},${tx.type},${escapedCategory},${tx.amount},${escapedNotes}\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    // Generate filename with current date and filter info
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const monthFilter = monthSelect?.value || 'all';
    const yearFilter = yearSelect?.value || 'all';
    
    const filename = `transactions_${dateStr}_${monthFilter}_${yearFilter}.csv`;
    link.setAttribute("download", filename);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add CSS for better category totals styling
const style = document.createElement('style');
style.textContent = `
    .category-totals li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.8rem;
        margin-bottom: 0.5rem;
        background: rgba(102, 126, 234, 0.05);
        border-radius: 8px;
        border-left: 4px solid #667eea;
        font-size: clamp(0.9rem, 2vw, 1rem);
    }
    
    .category-name {
        font-weight: 500;
        flex: 1;
    }
    
    .category-amount {
        font-weight: 600;
        color: #667eea;
        margin-left: 1rem;
    }
    
    .category-totals li:hover {
        background: rgba(102, 126, 234, 0.1);
        transform: translateX(5px);
        transition: all 0.3s ease;
    }
    
    @media (max-width: 600px) {
        .category-totals li {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
        }
        
        .category-amount {
            margin-left: 0;
            font-size: 1.1em;
        }
    }
`;

document.head.appendChild(style);