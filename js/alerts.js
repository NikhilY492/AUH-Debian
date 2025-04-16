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
// Add this function to alerts.js to create alerts from emergency reports

/**
 * Create and publish an alert based on emergency report data
 * @param {Object} report - The emergency report data
 */
function createAlertFromReport(report) {
    // Generate alert type based on report type
    let alertType;
    switch(report.type) {
        case 'emergency':
            alertType = 'emergency';
            break;
        case 'medical':
        case 'supplies':
            alertType = 'warning';
            break;
        case 'shelter':
        case 'infrastructure':
        default:
            alertType = 'info';
    }
    
    // Create appropriate title based on report type
    const titlePrefix = {
        'emergency': 'EMERGENCY: ',
        'medical': 'Medical Need: ',
        'supplies': 'Supply Need: ',
        'shelter': 'Shelter Need: ',
        'infrastructure': 'Infrastructure Alert: '
    }[report.type] || 'Alert: ';
    
    // Create a new alert object
    const newAlert = {
        id: 'A' + (mockAlerts.length + 1).toString().padStart(3, '0'),
        type: alertType,
        title: titlePrefix + report.location,
        message: `${getReportTypeName(report.type)} reported at ${report.location}. ${report.description} ${report.peopleAffected} people affected.`,
        area: determineAreaFromCoordinates(report.coordinates),
        timestamp: new Date(),
        relatedReportId: report.id
    };
    
    // Add the alert to our data
    mockAlerts.push(newAlert);
    
    // Update both public and admin alert views
    updateAlertViews(newAlert);
    
    return newAlert;
}

/**
 * Determine which area the coordinates belong to
 * This is a simplified approach - in a real app you would use geofencing
 * @param {Array} coordinates - [lat, lng] coordinates
 * @return {string} - The area name
 */
function determineAreaFromCoordinates(coordinates) {
    // This is a simplified example
    // In a real implementation, you would check if the coordinates fall within defined geofenced areas
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
        return 'all'; // Default to all areas if coordinates are invalid
    }
    
    const [lat, lng] = coordinates;
    
    // Simple geofencing logic based on map center (NYC in this example)
    // Real implementation would use proper polygon containment tests
    const mapCenterLat = 40.7128;
    const mapCenterLng = -74.0060;
    
    // Determine quadrant based on relation to map center
    if (lat > mapCenterLat && lng > mapCenterLng) {
        return 'north';
    } else if (lat > mapCenterLat && lng < mapCenterLng) {
        return 'west';
    } else if (lat < mapCenterLat && lng > mapCenterLng) {
        return 'east';
    } else if (lat < mapCenterLat && lng < mapCenterLng) {
        return 'south';
    } else {
        return 'downtown'; // If exactly on center (unlikely)
    }
}

/**
 * Update both public and admin alert views with a new alert
 * @param {Object} alert - The alert object to add to views
 */
function updateAlertViews(alert) {
    // Update public alerts
    const alertsContainer = document.getElementById('alerts-container');
    if (alertsContainer) {
        const publicAlertItem = document.createElement('div');
        publicAlertItem.className = `alert-item alert-${alert.type}`;
        
        publicAlertItem.innerHTML = `
            <div class="alert-header">
                <span class="alert-title">${alert.title}</span>
                <span class="alert-time">Just now</span>
            </div>
            <div class="alert-message">${alert.message}</div>
        `;
        
        alertsContainer.prepend(publicAlertItem);
    }
    
    // Update admin alerts if in admin mode
    const adminAlertsList = document.getElementById('admin-alerts-list');
    if (adminAlertsList) {
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item alert-${alert.type}`;
        
        alertItem.innerHTML = `
            <div class="alert-header">
                <span class="alert-title">${alert.title}</span>
                <span class="alert-time">Just now</span>
            </div>
            <div class="alert-message">${alert.message}</div>
            <div class="alert-area">Target: ${alert.area === 'all' ? 'All Areas' : alert.area}</div>
            ${alert.relatedReportId ? `<div class="alert-related">Related Report: ${alert.relatedReportId}</div>` : ''}
        `;
        
        adminAlertsList.prepend(alertItem);
    }
}

// Modify the existing formatTimestamp function or add it if it doesn't exist
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    // If the date is today, just show the time
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show date and time
    return date.toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}