// js/map.js
let map;
let reportMarkers = [];
let shelterMarkers = [];
let selectedReport = null;

function initMap() {
    // Make sure the map container exists in the DOM
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container element not found');
        return;
    }

    // Force the map container to have appropriate height
    mapContainer.style.height = '500px';
    mapContainer.style.width = '100%';

    // Initialize the map centered around default coordinates
    map = L.map('map', {
        zoomControl: true,
        attributionControl: true
    }).setView([40.7128, -74.0060], 13);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Add scale control to the map
    L.control.scale().addTo(map);

    // Force a map refresh after a slight delay to ensure proper rendering
    setTimeout(() => {
        map.invalidateSize(true);
    }, 100);

    // Load initial data
    loadShelterMarkers();
    loadReportMarkers();
    
    // Update the active incidents counter
    updateIncidentCounter();
}

function loadShelterMarkers() {
    // Clear existing shelter markers
    shelterMarkers.forEach(marker => {
        if (map && marker) map.removeLayer(marker);
    });
    shelterMarkers = [];
    
    // Check if mockShelters exists
    if (typeof mockShelters === 'undefined' || !Array.isArray(mockShelters)) {
        console.error('Mock shelter data not available');
        return;
    }
    
    // Add shelter markers to the map
    mockShelters.forEach(shelter => {
        if (!shelter.coordinates || !Array.isArray(shelter.coordinates) || shelter.coordinates.length !== 2) {
            console.warn('Invalid shelter coordinates:', shelter);
            return;
        }
        
        const marker = L.marker(shelter.coordinates, {
            icon: L.divIcon({
                className: 'shelter-marker',
                html: `<i class="fas fa-house-medical" style="color: #22c55e; font-size: 24px;"></i>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
        }).addTo(map);
        
        // Add popup with shelter information
        marker.bindPopup(`
            <div class="shelter-popup">
                <h3>${shelter.name}</h3>
                <p><strong>Location:</strong> ${shelter.location}</p>
                <p><strong>Capacity:</strong> ${shelter.currentOccupancy}/${shelter.capacity}</p>
                <p><strong>Services:</strong> 
                    ${shelter.hasFood ? '<span class="tag">Food</span>' : ''}
                    ${shelter.hasMedical ? '<span class="tag">Medical</span>' : ''}
                </p>
            </div>
        `);
        
        shelterMarkers.push(marker);
    });
}

function loadReportMarkers() {
    // Clear existing report markers
    reportMarkers.forEach(marker => {
        if (map && marker) map.removeLayer(marker);
    });
    reportMarkers = [];
    
    // Check if mockReports exists
    if (typeof mockReports === 'undefined' || !Array.isArray(mockReports)) {
        console.error('Mock report data not available');
        return;
    }
    
    // Add report markers to the map
    mockReports.forEach(report => {
        // Skip resolved reports for the map
        if (report.status === 'resolved') return;
        
        // Skip reports with invalid coordinates
        if (!report.coordinates || !Array.isArray(report.coordinates) || report.coordinates.length !== 2) {
            console.warn('Invalid report coordinates:', report);
            return;
        }
        
        // Determine marker color based on report type
        let color;
        let icon;
        
        switch (report.type) {
            case 'emergency':
                color = '#ef4444'; // red
                icon = 'exclamation-triangle';
                break;
            case 'medical':
                color = '#3b82f6'; // blue
                icon = 'user-doctor';
                break;
            case 'supplies':
                color = '#f97316'; // orange
                icon = 'droplet';
                break;
            case 'shelter':
                color = '#22c55e'; // green
                icon = 'house';
                break;
            case 'infrastructure':
                color = '#8b5cf6'; // purple
                icon = 'road';
                break;
            default:
                color = '#6b7280'; // gray
                icon = 'circle-info';
        }
        
        const marker = L.marker(report.coordinates, {
            icon: L.divIcon({
                className: 'report-marker',
                html: `<i class="fas fa-${icon}" style="color: ${color}; font-size: 24px;"></i>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            })
        }).addTo(map);
        
        // Add popup with report information
        marker.bindPopup(`
            <div class="report-popup">
                <h3>${getReportTypeName(report.type)}</h3>
                <p><strong>Location:</strong> ${report.location}</p>
                <p><strong>Description:</strong> ${report.description}</p>
                <p><strong>People affected:</strong> ${report.peopleAffected}</p>
                <p><strong>Reported by:</strong> ${report.name}</p>
                <p><strong>Status:</strong> ${getStatusDisplay(report.status)}</p>
                ${isAdmin ? isAdmin() ? `<button class="popup-btn" onclick="selectReport('${report.id}')">View Details</button>` : '' : ''}
            </div>
        `);
        
        reportMarkers.push(marker);
    });
}

function addReportMarker(report) {
    if (!map) {
        console.error('Map not initialized');
        return;
    }
    
    if (!report.coordinates || !Array.isArray(report.coordinates) || report.coordinates.length !== 2) {
        console.error('Invalid coordinates for new report');
        return;
    }
    
    // Determine marker color based on report type
    let color;
    let icon;
    
    switch (report.type) {
        case 'emergency':
            color = '#ef4444'; // red
            icon = 'exclamation-triangle';
            break;
        case 'medical':
            color = '#3b82f6'; // blue
            icon = 'user-doctor';
            break;
        case 'supplies':
            color = '#f97316'; // orange
            icon = 'droplet';
            break;
        case 'shelter':
            color = '#22c55e'; // green
            icon = 'house';
            break;
        case 'infrastructure':
            color = '#8b5cf6'; // purple
            icon = 'road';
            break;
        default:
            color = '#6b7280'; // gray
            icon = 'circle-info';
    }
    
    const marker = L.marker(report.coordinates, {
        icon: L.divIcon({
            className: 'report-marker',
            html: `<i class="fas fa-${icon}" style="color: ${color}; font-size: 24px;"></i>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        })
    }).addTo(map);
    
    // Add popup with report information
    marker.bindPopup(`
        <div class="report-popup">
            <h3>${getReportTypeName(report.type)}</h3>
            <p><strong>Location:</strong> ${report.location}</p>
            <p><strong>Description:</strong> ${report.description}</p>
            <p><strong>People affected:</strong> ${report.peopleAffected}</p>
            <p><strong>Reported by:</strong> ${report.name}</p>
            <p><strong>Status:</strong> ${getStatusDisplay(report.status)}</p>
            ${typeof isAdmin === 'function' ? isAdmin() ? `<button class="popup-btn" onclick="selectReport('${report.id}')">View Details</button>` : '' : ''}
        </div>
    `);
    
    reportMarkers.push(marker);
    
    // Update the active incidents counter
    updateIncidentCounter();
    
    // Center the map on the new report
    map.setView(report.coordinates, 13);
    
    // Open the popup
    marker.openPopup();
}

function updateIncidentCounter() {
    const activeIncidentsElement = document.getElementById('active-incidents');
    if (!activeIncidentsElement) return;
    
    if (typeof mockReports !== 'undefined' && Array.isArray(mockReports)) {
        const activeIncidents = mockReports.filter(report => report.status !== 'resolved').length;
        activeIncidentsElement.textContent = activeIncidents;
    }
}

function selectReport(reportId) {
    if (typeof isAdmin === 'function' && isAdmin()) {
        // Find the report
        if (typeof mockReports !== 'undefined' && Array.isArray(mockReports)) {
            const report = mockReports.find(r => r.id === reportId);
            if (report) {
                selectedReport = report;
                
                // Highlight the report in the admin panel
                const reportElements = document.querySelectorAll('.report-item');
                reportElements.forEach(el => {
                    if (el.dataset.id === reportId) {
                        el.classList.add('selected');
                        el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        el.classList.remove('selected');
                    }
                });
            }
        }
    }
}

function getReportTypeName(type) {
    switch (type) {
        case 'emergency': return 'Emergency (Life-Threatening)';
        case 'medical': return 'Medical Need';
        case 'supplies': return 'Supply Need';
        case 'shelter': return 'Shelter Need';
        case 'infrastructure': return 'Infrastructure Damage';
        default: return 'Other Emergency';
    }
}

function getStatusDisplay(status) {
    switch (status) {
        case 'pending': return '<span class="status-badge status-pending">Pending</span>';
        case 'in-progress': return '<span class="status-badge status-progress">In Progress</span>';
        case 'resolved': return '<span class="status-badge status-resolved">Resolved</span>';
        default: return status;
    }
}

// Make sure the map is initialized when the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Give the DOM a moment to fully render before initializing the map
    setTimeout(initMap, 100);
});

// Add listener for tab changes or similar events that might affect the map display
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('tab-button')) {
        // If tabs are clicked, invalidate the map size after a brief delay
        setTimeout(() => {
            if (map) map.invalidateSize(true);
        }, 100);
    }
});

// Add a window resize handler to ensure the map resizes properly
window.addEventListener('resize', function() {
    if (map) map.invalidateSize(true);
});