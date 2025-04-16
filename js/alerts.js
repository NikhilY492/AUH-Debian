// js/alerts.js
function loadAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = ''; // Clear existing alerts
    
    // Sort alerts by timestamp, newest first
    const sortedAlerts = [...mockAlerts].sort((a, b) => b.timestamp - a.timestamp);
    
    // Add each alert to the container
    sortedAlerts.forEach(alert => {
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item alert-${alert.type}`;
        
        alertItem.innerHTML = `
            <div class="alert-header">
                <span class="alert-title">${alert.title}</span>
                <span class="alert-time">${formatTimestamp(alert.timestamp)}</span>
            </div>
            <div class="alert-message">${alert.message}</div>
        `;
        
        alertsContainer.appendChild(alertItem);
    });
}

function loadAdminAlerts() {
    const alertsList = document.getElementById('admin-alerts-list');
    alertsList.innerHTML = ''; // Clear existing alerts
    
    // Sort alerts by timestamp, newest first
    const sortedAlerts = [...mockAlerts].sort((a, b) => b.timestamp - a.timestamp);
    
    // Add each alert to the list
    sortedAlerts.forEach(alert => {
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item alert-${alert.type}`;
        
        alertItem.innerHTML = `
            <div class="alert-header">
                <span class="alert-title">${alert.title}</span>
                <span class="alert-time">${formatTimestamp(alert.timestamp)}</span>
            </div>
            <div class="alert-message">${alert.message}</div>
            <div class="alert-area">Target: ${alert.area === 'all' ? 'All Areas' : alert.area}</div>
        `;
        
        alertsList.appendChild(alertItem);
    });
}

function sendAlert(event) {
    event.preventDefault();
    
    // Get form values
    const alertType = document.getElementById('alert-type').value;
    const title = document.getElementById('alert-title').value;
    const message = document.getElementById('alert-message').value;
    const area = document.getElementById('alert-area').value;
    
    // Create a new alert object
    const newAlert = {
        id: 'A' + (mockAlerts.length + 1).toString().padStart(3, '0'),
        type: alertType,
        title,
        message,
        area,
        timestamp: new Date()
    };
    
    // Add the alert to our data
    mockAlerts.push(newAlert);
    
    // Add to UI
    const alertsList = document.getElementById('admin-alerts-list');
    const alertItem = document.createElement('div');
    alertItem.className = `alert-item alert-${alertType}`;
    
    alertItem.innerHTML = `
        <div class="alert-header">
            <span class="alert-title">${title}</span>
            <span class="alert-time">Just now</span>
        </div>
        <div class="alert-message">${message}</div>
        <div class="alert-area">Target: ${area === 'all' ? 'All Areas' : area}</div>
    `;
    
    alertsList.prepend(alertItem);
    
    // Also add to public alerts
    const alertsContainer = document.getElementById('alerts-container');
    const publicAlertItem = document.createElement('div');
    publicAlertItem.className = `alert-item alert-${alertType}`;
    
    publicAlertItem.innerHTML = `
        <div class="alert-header">
            <span class="alert-title">${title}</span>
            <span class="alert-time">Just now</span>
        </div>
        <div class="alert-message">${message}</div>
    `;
    
    alertsContainer.prepend(publicAlertItem);
    
    // Show confirmation
    showConfirmation('Alert Sent', `Emergency alert has been sent to ${area === 'all' ? 'all areas' : area}.`);
    
    // Reset form
    document.getElementById('send-alert-form').reset();
}
