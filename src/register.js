document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            // Check if email already exists
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                alert('Email already registered!');
                return;
            }

            // Create new user
            const newUser = {
                id: generateUniqueId(), // Implement a function to generate a unique ID
                name: name,
                email: email,
                password: password,
                expenses: [],  // Initialize with an empty array
                budget: {}     // Initialize with an empty object
            };

            // Send POST request to add new user
            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            .then(response => response.json())
            .then(user => {
                alert('Registration successful!');
                // Optionally handle successful registration (e.g., redirect to login)
            });
        });
});

// Utility function to generate a unique ID (e.g., using timestamp or UUID)
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
