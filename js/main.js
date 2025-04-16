// Add this to your main.js file if it doesn't already exist

// Handle confirmation modal close button
document.addEventListener('DOMContentLoaded', function() {
    const confirmationModal = document.getElementById('confirmation-modal');
    const modalConfirm = document.getElementById('modal-confirm');
    
    if (modalConfirm && confirmationModal) {
        modalConfirm.addEventListener('click', function() {
            confirmationModal.classList.remove('show');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            confirmationModal.classList.remove('show');
        }
    });
});

document.getElementById('admin-login-btn').addEventListener('click', () => {
    document.getElementById('login-modal').classList.add('show');
});

document.getElementById('close-login-btn').addEventListener('click', () => {
    document.getElementById('login-modal').classList.remove('show');
});

// Handle Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username === 'admin' && password === 'admin123') {
        // Success
        document.getElementById('login-modal').classList.remove('show');
        document.getElementById('admin-interface').classList.remove('hidden');
        document.getElementById('public-interface').classList.add('hidden');
        document.getElementById('public-mode-btn').classList.remove('active');
        document.getElementById('admin-login-btn').classList.add('active');
    } else {
        alert('Invalid credentials. Please try again.');
    }
});
