# 💰 SpendWise - Personal Budget Planner

A fully responsive, offline-first personal budget tracking application built with vanilla HTML, CSS, and JavaScript. Track your income, expenses, and savings goals securely in your browser with beautiful interactive charts and comprehensive reporting.

![Budget Planner Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Responsive](https://img.shields.io/badge/Responsive-Yes-blue) ![Offline](https://img.shields.io/badge/Offline-Support-orange)


## 🚀 Deployment
### 🚀 View Live Demo

**[🌐 SpendWise Website](https://spendwiseonline.netlify.app/)**


## ✨ Features

### 💡 Core Functionality
- **📊 Transaction Management** - Add, edit, and delete income, expense, and savings transactions
- **📈 Visual Analytics** - Interactive pie charts and bar charts for expense breakdown
- **🎯 Savings Goals** - Set and track your savings targets with progress visualization
- **📱 Fully Responsive** - Seamless experience across all devices (mobile, tablet, desktop)
- **🔒 Privacy First** - All data stored locally in your browser
- **💾 Offline Support** - Works completely offline using localStorage
- **📤 Data Export** - Export your transactions as CSV files

### 🎨 User Experience
- **Modern Glass-morphism Design** - Beautiful, contemporary UI with smooth animations
- **Touch-Friendly Interface** - Optimized for mobile interactions
- **Smart Navigation** - Responsive hamburger menu for mobile devices
- **Real-time Updates** - Charts and summaries update automatically
- **Form Validation** - Comprehensive input validation and error handling

### 📊 Reporting & Analytics
- **Category Breakdown** - Visual spending analysis by category
- **Income vs Expenses** - Comparative bar charts
- **Time-based Filtering** - Filter reports by month and year
- **Summary Cards** - Quick overview of financial status
- **Detailed Transaction History** - Comprehensive transaction listing

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage API
- **Charts**: Canvas API (Custom Implementation)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Responsive**: Mobile-First Design with CSS Media Queries

## 📁 Project Structure

```
SpendWise/
├── 🏠 index.html
├── 🎨 css/
│   ├── ℹ️ style.css 
├── 📁 pages/
│   ├── 🏠 home.html           
│   ├── ℹ️ about.html          
│   ├── 💸 transactions.html   
│   ├── 📊 reports.html        
│   └── 📞 contact.html        
├── 📁 script/
│   ├── 🏠 home.js           
│   ├── 💸 about.js    
│   └── 📊 transactions.js
│   └── 📊 reports.js
│   └── 📊 contact.js

```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server requirements - runs entirely in the browser!

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vee-kodes/plp-webtechnologies-classroom-july-2025-Week8-Final-Project-and-Deployment.git
   
   cd budget-planner
   ```

2. **Open in browser**
   ```bash
   # Option 1: Direct file opening
   open index.html
   
   # Option 2: Local server (recommended)
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

3. **Start budgeting!** 🎉

### Quick Setup
1. 📥 Download or clone the project
2. 🌐 Open `index.html` in your browser
3. 🏠 Navigate to different pages using the menu
4. ➕ Start adding transactions
5. 📊 View your financial insights in reports

## 💡 Usage Guide

### Adding Transactions
1. **Navigate** to the Transactions page
2. **Fill out** the transaction form:
   - Amount (in Kenyan Shillings)
   - Type (Income/Expense/Savings)  
   - Category (auto-populated based on type)
   - Date
   - Notes (optional)
3. **Click** "Add Transaction"

### Categories

**📈 Income Categories:**
- Business Income
- Side Hustle  
- Investments
- Salary

**📉 Expense Categories:**
- Car Service, Clothing, Donations
- Electricity, Entertainment, Fast Food
- Family Support, Gifts, Groceries
- Internet, Medical, Rent
- School Fees, Skin Care, Subscriptions
- Transport, Other

**💰 Savings Categories:**
- Savings
- Emergency Fund

### Setting Savings Goals
1. **Go** to the Home dashboard
2. **Enter** your target amount in the savings goal input
3. **Click** "Set Goal"
4. **Track** your progress with the visual progress bar

### Generating Reports
1. **Visit** the Reports page
2. **Filter** by month/year (optional)
3. **View** interactive charts and category breakdowns
4. **Export** data as CSV for external analysis

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:

### Breakpoints
- **📱 Mobile**: ≤600px
- **📱 Large Mobile**: ≤768px  
- **💻 Tablet**: ≤1024px
- **🖥️ Desktop**: ≥1200px

### Features
- **🍔 Hamburger Navigation** - Touch-friendly mobile menu
- **📊 Responsive Charts** - Charts scale with screen size
- **📋 Horizontal Scroll Tables** - Tables remain functional on small screens
- **👆 Touch Optimized** - Large touch targets and intuitive gestures


## 🌟 Key Features Breakdown

| Feature | Description | Mobile | Desktop |
|---------|-------------|---------|---------|
| 📊 **Dashboard** | Overview with summary cards and charts | ✅ | ✅ |
| 💸 **Transactions** | CRUD operations with validation | ✅ | ✅ |
| 📈 **Reports** | Interactive charts and filtering | ✅ | ✅ |
| 📱 **Responsive** | Works on all screen sizes | ✅ | ✅ |
| 🔒 **Privacy** | No data leaves your browser | ✅ | ✅ |
| 💾 **Offline** | Works without internet | ✅ | ✅ |
| 📤 **Export** | CSV download functionality | ✅ | ✅ |


## 🙏 Acknowledgments

- **Design Inspiration**: Modern financial apps and glass-morphism trends
- **Icons**: Using Unicode symbols for universal compatibility
- **Color Palette**: Inspired by modern UI/UX design principles
- **Responsive Design**: Mobile-first methodology


---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Made with ❤️ by [Viola C.](https://github.com/vee-kodes)

[🔝 Back to top](#-spendwise---personal-budget-planner)

</div>