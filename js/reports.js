
// js/reports.js
let reports = [...mockReports]; // Clone the mock reports

function submitReport(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const location = document.getElementById('location').value;
    const issueType = document.getElementById('issue-type').value;
    const description = document.getElementById('description').value;
    const peopleAffected = document.getElementById('people-affected').value;
    
    // Generate fake coordinates based on location input
    // In a real app, we would use geocoding here
    const baseCoords = [40.7128, -74.0060];
    const coords = [
        baseCoords[0] + (Math.random() * 0.01 - 0.005),
        baseCoords[1] + (Math.random() * 0.01 - 0.005)
    ];
    
    // Create a new report object
    const newReport = {
        id: 'R' + (1000 + reports.length + 1),
        name,
        contact,
        location,
        coordinates: coords,
        type: issueType,
        description,
        peopleAffected: parseInt(peopleAffected),
        timestamp: new Date(),
        status: 'pending'
    };
    
    // Add the report to our data
    reports.push(newReport);
    mockReports.push(newReport);
    
    // Add the report to the map
    addReportMarker(newReport);
    
    // If in admin mode, add to the reports list
    if (isAdmin()) {
        addReportToList(newReport);
    }
    
    // Show confirmation
    showConfirmation('Report Submitted', 'Your emergency report has been submitted successfully. Help is on the way.');
    
    // Reset form
    document.getElementById('report-form').reset();
}

function addReportToList(report) {
    const reportsList = document.getElementById('reports-list');
    
    const reportItem = document.createElement('div');
    reportItem.className = 'report-item';
    reportItem.dataset.id = report.id;
    reportItem.dataset.status = report.status;
    
    reportItem.innerHTML = `
        <div class="report-header">
            <span class="report-type">${getReportTypeName(report.type)}</span>
            <span class="report-id">${report.id}</span>
        </div>
        <div class="report-location">
            <i class="fas fa-location-dot"></i> ${report.location}
        </div>
        <div class="report-description">${report.description}</div>
        <div class="report-footer">
            <span class="report-timestamp">${formatTimestamp(report.timestamp)}</span>
            <div class="report-actions">
                ${getStatusDisplay(report.status)}
                <button class="btn btn-small" onclick="updateReportStatus('${report.id}', '${report.status === 'pending' ? 'in-progress' : report.status === 'in-progress' ? 'resolved' : 'pending'}')">
                    <i class="fas fa-${report.status === 'pending' ? 'truck-medical' : report.status === 'in-progress' ? 'check' : 'refresh'}"></i>
                </button>
            </div>
        </div>
    `;
    
    reportsList.prepend(reportItem);
}

function updateReportStatus(reportId, newStatus) {
    // Find the report
    const report = reports.find(r => r.id === reportId);
    if (report) {
        // Update status
        report.status = newStatus;
        
        // Update UI
        const reportItem = document.querySelector(`.report-item[data-id="${reportId}"]`);
        if (reportItem) {
            reportItem.dataset.status = newStatus;
            
            const statusDisplay = reportItem.querySelector('.status-badge');
            statusDisplay.className = `status-badge status-${newStatus.replace('-', '')}`;
            statusDisplay.textContent = newStatus.replace('-', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
            
            const actionButton = reportItem.querySelector('.report-actions button');
            actionButton.innerHTML = `<i class="fas fa-${newStatus === 'pending' ? 'truck-medical' : newStatus === 'in-progress' ? 'check' : 'refresh'}"></i>`;
            actionButton.onclick = function() {
                updateReportStatus(reportId, newStatus === 'pending' ? 'in-progress' : newStatus === 'in-progress' ? 'resolved' : 'pending');
            };
        }
        
        // Refresh map markers if status is resolved
        if (newStatus === 'resolved') {
            loadReportMarkers();
        }
        
        // Update the active incidents counter
        updateIncidentCounter();
    }
}

function formatTimestamp(timestamp) {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // difference in seconds
    
    if (diff < 60) {
        return 'Just now';
    } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return timestamp.toLocaleDateString('en-US', options);
    }
}

function useCurrentLocation() {
    const detectingStatus = document.getElementById('detecting-location');
    detectingStatus.classList.remove('hidden');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                
                // In a real app, we would reverse geocode to get an address
                document.getElementById('location').value = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
                
                // Hide status indicator
                detectingStatus.classList.add('hidden');
            },
            error => {
                console.error('Error getting location:', error);
                detectingStatus.classList.add('hidden');
                alert('Unable to get your location. Please enter it manually.');
            }
        );
    } else {
        detectingStatus.classList.add('hidden');
        alert('Geolocation is not supported by your browser. Please enter your location manually.');
    }
}

