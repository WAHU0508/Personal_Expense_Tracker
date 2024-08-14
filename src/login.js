document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Elements to be controlled based on login status
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const contentSections = document.querySelectorAll('.content'); // Assuming content sections have the class 'content'

    // Hide or show elements based on login status
    if (currentUser && currentUser.id) {
        // User is logged in
        loginForm.style.display = 'none';
        logoutButton.style.display = 'block';
        contentSections.forEach(section => section.style.display = 'block'); // Show content

        // Load and display user-specific data
        loadUserExpenses(currentUser.id);
    } else {
        // User is not logged in
        loginForm.style.display = 'block';
        logoutButton.style.display = 'none';
        contentSections.forEach(section => section.style.display = 'none'); // Hide content

        alert('Please log in to continue.');
    }
});

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
                document.querySelectorAll('.content').forEach(section => section.style.display = 'block'); // Show content
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

            // Close the login modal after successful login
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
        });
}

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

function ensureExpenseList() {
    const expenseTable = document.getElementById('expensesTable');
    
    if (!expenseTable) {
        console.error('Error: Expenses table container element does not exist.');
        return null;
    }
    
    let expenseList = document.querySelector('#expensesTable table tbody');
    
    if (!expenseList) {
        expenseList = document.createElement('tbody');
        document.querySelector('#expensesTable table').appendChild(expenseList);
    }
    return expenseList;
}

function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('logoutButton').style.display = 'none';
    document.querySelectorAll('.content').forEach(section => section.style.display = 'none'); // Hide content
    alert('You have been logged out!');
    location.reload();
}
