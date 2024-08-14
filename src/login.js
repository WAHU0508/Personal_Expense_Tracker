document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    console.log('Attempting to log in with:', { email, password });

    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            console.log('Fetched users:', users);
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('logoutButton').style.display = 'block';
                alert('Login successful!');
                loadUserExpenses(user.id);
            } else {
                alert('Invalid email or password');
            }
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
});

function loadUserExpenses(userId) {
    fetch('http://localhost:3000/expenses')
        .then(response => response.json())
        .then(expenses => {
            console.log('Fetched expenses:', expenses);
            const userExpenses = expenses.filter(expense => expense.userId === userId);
            displayExpenses(userExpenses);
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
}

// Ensure that the expenseList element exists
function ensureExpenseList() {
    const expenseTable = document.getElementById('expensesTable');
    
    if (!expenseTable) {
        console.error('Error: Expenses table container element does not exist.');
        return null;
    }
    
    let expenseList = document.querySelector('#expensesTable table tbody');
    
    if (!expenseList) {
        // Create the element if it does not exist
        expenseList = document.createElement('tbody');
        document.querySelector('#expensesTable table').appendChild(expenseList);
    }
    return expenseList;
}

// Function to display expenses
function displayExpenses(expenses) {
    const expenseList = ensureExpenseList();
    
    if (!expenseList) {
        console.error('Error: Could not get or create expenseList.');
        return;
    }
    
    expenseList.innerHTML = ''; // Clear any previous expenses

    expenses.forEach(expense => {
        const expenseItem = document.createElement('tr');
        expenseItem.innerHTML = `
            <td><input type="checkbox"></td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>$${expense.amount}</td>
            <td>${expense.date}</td>
        `;
        expenseList.appendChild(expenseItem);
    });
}

// Example usage of loadUserExpenses
function loadUserExpenses(userId) {
    fetch('http://localhost:3000/expenses')
        .then(response => response.json())
        .then(expenses => {
            console.log('Fetched expenses:', expenses);
            const userExpenses = expenses.filter(expense => expense.userId === userId);
            displayExpenses(userExpenses);
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
}
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('logoutButton').style.display = 'none';
    alert('You have been logged out!');
    location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && currentUser.id) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'block';
        alert(`Welcome back, ${currentUser.name}!`);
        loadUserExpenses(currentUser.id);
    } else {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'none';
        alert('Please log in to continue.');
    }
});

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && currentUser.id) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'block';
        alert(`Welcome back, ${currentUser.name}!`);
        loadUserExpenses(currentUser.id);
    } else {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'none';
        alert('Please log in to continue.');
    }
});
