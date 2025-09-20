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

    // Initialize transactions after DOM is loaded
    initializeTransactions();
});

// Category Data
const incomeCategories = ["Business Income", "Side Hustle", "Investments", "Salary"];
const expenseCategories = ["Car Service", "Clothing", "Donations", "Electricity", "Entertainment", "Fast Food", "Family Support", "Gifts", "Groceries", "Internet", "Medical", "Rent", "School Fees", "Skin Care", "Subscriptions", "Transport", "Other"];
const savingsCategories = ["Savings", "Emergency Fund"];

// Elements
let form, tableBody, typeSelect, categorySelect;

// Load existing transactions from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize all elements and functionality
function initializeTransactions() {
    form = document.getElementById('transaction-form');
    tableBody = document.querySelector('#transaction-table tbody');
    typeSelect = document.getElementById('type');
    categorySelect = document.getElementById('category');

    if (!form || !tableBody || !typeSelect || !categorySelect) {
        console.error('Required elements not found');
        return;
    }

    // Set up event listeners
    setupEventListeners();
    
    // Render existing transactions
    transactions.forEach(tx => renderTransaction(tx));
}

// Set up all event listeners
function setupEventListeners() {
    // Populate category dropdown based on type
    typeSelect.addEventListener('change', updateCategoryOptions);

    // Add new transaction
    form.addEventListener('submit', handleFormSubmit);
}

// Update category options based on selected type
function updateCategoryOptions() {
    const selectedType = typeSelect.value;
    categorySelect.innerHTML = '<option value="">Select Category</option>';

    let categories = [];
    if (selectedType === 'income') categories = incomeCategories;
    else if (selectedType === 'expense') categories = expenseCategories;
    else if (selectedType === 'savings') categories = savingsCategories;

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.toLowerCase().replace(/\s+/g, '_');
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const amount = parseFloat(form.amount.value);
    const type = form.type.value;
    const category = categorySelect.options[categorySelect.selectedIndex].text;
    const date = form.date.value;
    const notes = form.notes.value;

    // Validation
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }
    
    if (!type) {
        alert('Please select a transaction type.');
        return;
    }
    
    if (!category || category === 'Select Category') {
        alert('Please select a category.');
        return;
    }
    
    if (!date) {
        alert('Please select a date.');
        return;
    }

    const newTransaction = { date, type, category, amount, notes };
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransaction(newTransaction);

    form.reset();
    categorySelect.innerHTML = '<option value="">Select Category</option>'; // Reset category dropdown
}

// Function to render a transaction row with improved mobile responsiveness
function renderTransaction(tx) {
    const row = document.createElement('tr');
    
    // Format amount for display
    const formattedAmount = formatKsh(tx.amount);
    
    // Truncate notes for mobile display
    const maxNotesLength = window.innerWidth < 600 ? 20 : 50;
    const displayNotes = tx.notes && tx.notes.length > maxNotesLength 
        ? tx.notes.substring(0, maxNotesLength) + '...' 
        : tx.notes || '';

    row.innerHTML = `
        <td data-label="Date">${tx.date}</td>
        <td data-label="Type"><span class="type-badge type-${tx.type}">${tx.type}</span></td>
        <td data-label="Category">${tx.category}</td>
        <td data-label="Amount" class="amount">${formattedAmount}</td>
        <td data-label="Notes" class="notes" title="${tx.notes}">${displayNotes}</td>
        <td data-label="Actions">
            <select class="action-select" aria-label="Select action for this transaction">
                <option value="">Actions</option>
                <option value="edit">Edit</option>
                <option value="delete">Delete</option>
            </select>
        </td>
    `;
    
    tableBody.appendChild(row);

    // Add action select functionality
    const actionSelect = row.querySelector('.action-select');
    actionSelect.addEventListener('change', function() {
        handleTransactionAction(this.value, tx, row);
        this.value = ''; // Reset dropdown
    });
}

// Handle transaction actions (edit/delete)
function handleTransactionAction(action, tx, row) {
    if (action === 'delete') {
        if (confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(tx, row);
        }
    } else if (action === 'edit') {
        editTransaction(tx, row);
    }
}

// Delete transaction
function deleteTransaction(tx, row) {
    row.remove();
    transactions = transactions.filter(t => 
        !(t.date === tx.date && t.type === tx.type && t.category === tx.category && 
          t.amount === tx.amount && t.notes === tx.notes)
    );
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Trigger storage event to update other pages
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'transactions',
        newValue: JSON.stringify(transactions)
    }));
}

// Edit transaction
function editTransaction(tx, row) {
    // Fill form with existing data
    form.amount.value = tx.amount;
    form.type.value = tx.type;
    
    // Update category options and set selected category
    updateCategoryOptions();
    
    // Set the category after a brief delay to ensure options are populated
    setTimeout(() => {
        const categoryValue = tx.category.toLowerCase().replace(/\s+/g, '_');
        categorySelect.value = categoryValue;
    }, 10);
    
    form.date.value = tx.date;
    form.notes.value = tx.notes;

    // Remove the transaction from list and table
    deleteTransaction(tx, row);
    
    // Scroll to form for better UX
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Focus on amount field
    form.amount.focus();
}

// Add CSS for responsive table and type badges
const style = document.createElement('style');
style.textContent = `
    .type-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: capitalize;
    }
    
    .type-income {
        background-color: #e8f5e8;
        color: #2e7d32;
    }
    
    .type-expense {
        background-color: #ffeaa7;
        color: #d63031;
    }
    
    .type-savings {
        background-color: #e3f2fd;
        color: #1976d2;
    }
    
    .amount {
        font-weight: 600;
        text-align: right;
    }
    
    .notes {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .action-select {
        min-width: 80px;
        padding: 0.3rem;
        border-radius: 5px;
        border: 1px solid #ddd;
        background: white;
    }
    
    /* Mobile responsive table */
    @media (max-width: 768px) {
        .notes {
            max-width: 100px;
        }
        
        .action-select {
            min-width: 70px;
            font-size: 0.8rem;
        }
    }
    
    @media (max-width: 600px) {
        #transaction-table td[data-label]:before {
            content: attr(data-label) ": ";
            font-weight: bold;
            margin-right: 0.5rem;
        }
    }
`;

document.head.appendChild(style);

// Handle window resize to update notes truncation
window.addEventListener('resize', function() {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(function() {
        // Re-render table with updated truncation
        if (tableBody) {
            tableBody.innerHTML = '';
            transactions.forEach(tx => renderTransaction(tx));
        }
    }, 250);
});