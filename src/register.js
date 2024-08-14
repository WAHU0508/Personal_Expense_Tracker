document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const initialBudget = 20000; // Default monthly budget amount for new users

    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            // Check if email already exists
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                alert('Email already registered!');
                return;
            }

            // Generate unique IDs for the user and budget
            const userId = generateUniqueId();
            const budgetId = generateUniqueId();

            // Create new user
            const newUser = {
                id: userId,
                name: name,
                email: email,
                password: password,
                expenses: [],  // Initialize with an empty array
                budget: budgetId // Link budget ID here
            };

            // Create new budget
            const newBudget = {
                id: budgetId,
                monthlyBudget: initialBudget,
                userId: userId // Link the user ID here
            };

            // Send POST request to add new user
            return fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            .then(response => response.json())
            .then(user => {
                // Send POST request to add the budget
                return fetch('http://localhost:3000/budget', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newBudget)
                });
            })
            .then(response => response.json())
            .then(budget => {
                alert('Registration successful!');
                // Close the modal
                const modal = document.getElementById('registerModal'); // Adjust ID based on your modal
                if (modal) {
                    const bootstrapModal = new bootstrap.Modal(modal);
                    bootstrapModal.hide();
                }
                // Optionally handle successful registration (e.g., redirect to login)
            })
            .catch(error => console.error('Error:', error));
        });
});

// Utility function to generate a unique ID (e.g., using timestamp or UUID)
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
