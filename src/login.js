document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('loginName').value;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    console.log('Attempting to log in with:', { name, email, password });

    // Fetch users from db.json
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

// Load expenses for the logged-in user
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

// Function to display expenses
function displayExpenses(expenses) {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = ''; // Clear any previous expenses

    expenses.forEach(expense => {
        const expenseItem = document.createElement('li');
        expenseItem.textContent = `${expense.category}: ${expense.description} - $${expense.amount}`;
        expenseList.appendChild(expenseItem);
    });
}

// Handle logout functionality
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('logoutButton').style.display = 'none';
    alert('You have been logged out!');
    location.reload();
}

// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'block';
        alert(`Welcome back, ${currentUser.name}!`);
        loadUserExpenses(currentUser.id);
    }
});
