
// js/admin.js
let isAdminLoggedIn = false;

function toggleAdminLogin() {
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.add('active');
}

function closeLoginModal() {
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.remove('active');
}

function loginAdmin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple demo authentication (in a real app, this would be secure)
    if (username === 'admin' && password === 'admin123') {
        isAdminLoggedIn = true;
        
        // Switch to admin interface
        document.getElementById('public-interface').classList.add('hidden');
        document.getElementById('admin-interface').classList.remove('hidden');
        
        // Update button states
        document.getElementById('public-mode-btn').classList.remove('active');
        document.getElementById('admin-login-btn').textContent = 'Admin Mode';
        document.getElementById('admin-login-btn').classList.add('active');
        
        // Close modal
        closeLoginModal();
        
        // Load reports
        loadReports();
        
        // Load admin alerts
        loadAdminAlerts();
    } else {
        alert('Invalid credentials. For demo, use admin/admin123');
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    
    // Switch back to public interface
    document.getElementById('admin-interface').classList.add('hidden');
    document.getElementById('public-interface').classList.remove('hidden');
    
    // Update button states
    document.getElementById('public-mode-btn').classList.add('active');
    document.getElementById('admin-login-btn').textContent = 'Admin Login';
    document.getElementById('admin-login-btn').classList.remove('active');
}

function switchToPublicMode() {
    if (isAdminLoggedIn) {
        logoutAdmin();
    } else {
        // Already in public mode
        document.getElementById('public-mode-btn').classList.add('active');
        document.getElementById('admin-login-btn').classList.remove('active');
        document.getElementById('public-interface').classList.remove('hidden');
        document.getElementById('admin-interface').classList.add('hidden');
    }
}

function isAdmin() {
    return isAdminLoggedIn;
}

function loadReports() {
    const reportsList = document.getElementById('reports-list');
    reportsList.innerHTML = ''; // Clear existing reports
    
    // Sort reports by timestamp, newest first
    const sortedReports = [...reports].sort((a, b) => b.timestamp - a.timestamp);
    
    // Add each report to the list
    sortedReports.forEach(report => {
        addReportToList(report);
    });
}

function filterReports(status) {
    const reportItems = document.querySelectorAll('.report-item');
    
    reportItems.forEach(item => {
        if (status === 'all' || item.dataset.status === status) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Deactivate all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Activate the selected tab and button
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`.tab-button[data-tab="${tabName}"]`).classList.add('active');
}

function allocateResources(event) {
    event.preventDefault();
    
    const resourceType = document.getElementById('resource-type').value;
    const location = document.getElementById('resource-location').value;
    const priority = document.getElementById('resource-priority').value;
    
    // In a real app, this would communicate with a backend
    showConfirmation('Resources Allocated', `${resourceType} resources have been allocated to ${location} with ${priority} priority.`);
    
    // Reset form
    document.getElementById('allocate-resources-form').reset();
}
