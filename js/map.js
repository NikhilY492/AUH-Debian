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
    }).setView([17.7128, 83.2970], 13);

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
    
    // Set up real-time form handling
    setupEmergencyFormHandler();
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
        
        addReportMarkerToMap(report);
    });
}

function addReportMarkerToMap(report) {
    if (!map) {
        console.error('Map not initialized');
        return;
    }
    
    if (!report.coordinates || !Array.isArray(report.coordinates) || report.coordinates.length !== 2) {
        console.error('Invalid coordinates for report');
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
            <p><strong>Status:</strong> ${getStatusDisplay(report.status || 'pending')}</p>
            ${typeof isAdmin === 'function' ? isAdmin() ? `<button class="popup-btn" onclick="selectReport('${report.id}')">View Details</button>` : '' : ''}
        </div>
    `);
    
    reportMarkers.push(marker);
    
    // Update the active incidents counter
    updateIncidentCounter();
    
    return marker;
}

function addReportMarker(report) {
    // Add the marker to the map
    const marker = addReportMarkerToMap(report);
    
    if (marker) {
        // Center the map on the new report
        map.setView(report.coordinates, 13);
        
        // Open the popup
        marker.openPopup();
    }
}
// Update setupEmergencyFormHandler function to use geocoding and create alerts
function setupEmergencyFormHandler() {
    const reportForm = document.getElementById('report-form');
    if (!reportForm) {
        console.error('Report form not found');
        return;
    }
    
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;
        const location = document.getElementById('location').value;
        const issueType = document.getElementById('issue-type').value;
        const description = document.getElementById('description').value;
        const peopleAffected = document.getElementById('people-affected').value;
        
        // Show loading indicator
        const submitButton = reportForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitButton.disabled = true;
        
        // Geocode the address
        geocodeAddress(location)
            .then(coordinates => {
                // If geocoding fails, fall back to random coordinates near map center
                if (!coordinates) {
                    // Get map center and add slight randomization
                    const center = map.getCenter();
                    coordinates = [
                        center.lat + (Math.random() - 0.5) * 0.05,
                        center.lng + (Math.random() - 0.5) * 0.05
                    ];
                    console.warn('Using approximate coordinates:', coordinates);
                }
                
                // Create a new report object
                const newReport = {
                    id: 'report_' + Date.now(),
                    name: name,
                    contact: contact,
                    location: location,
                    type: issueType,
                    description: description,
                    peopleAffected: peopleAffected,
                    coordinates: coordinates,
                    timestamp: new Date().toISOString(),
                    status: 'pending'
                };
                
                // Add the report to the mock data
                if (typeof mockReports !== 'undefined' && Array.isArray(mockReports)) {
                    mockReports.push(newReport);
                } else {
                    window.mockReports = [newReport];
                }
                
                // Add the report marker to the map
                addReportMarker(newReport);
                
                // Refresh the reports list if in admin mode
                if (typeof refreshReportsList === 'function') {
                    refreshReportsList();
                }
                
                // Create an alert from this report
                if (typeof createAlertFromReport === 'function') {
                    createAlertFromReport(newReport);
                }
                
                // Show confirmation
                showConfirmationModal('Report Submitted', 'Your emergency report has been submitted successfully and is now visible on the map. An alert has been generated to notify others in your area.');
                
                // Reset the form
                reportForm.reset();
                
                // Restore button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            })
            .catch(error => {
                console.error('Error processing form:', error);
                alert('There was an error submitting your report. Please try again.');
                
                // Restore button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
    });
    
    // Handle the "Use My Location" button
    const useMyLocationBtn = document.getElementById('use-my-location');
    if (useMyLocationBtn) {
        useMyLocationBtn.addEventListener('click', function() {
            const detectingLocation = document.getElementById('detecting-location');
            if (detectingLocation) detectingLocation.classList.remove('hidden');
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    // Get the coordinates
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    // Perform reverse geocoding to get the address
                    reverseGeocode(lat, lng)
                        .then(address => {
                            // Update the location field with the address
                            const locationInput = document.getElementById('location');
                            if (locationInput) {
                                locationInput.value = address || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
                            }
                            
                            // Center the map on the user's location
                            if (map) {
                                map.setView([lat, lng], 15);
                                
                                // Add a temporary marker
                                const tempMarker = L.marker([lat, lng], {
                                    icon: L.divIcon({
                                        className: 'temp-location-marker',
                                        html: `<i class="fas fa-user-location" style="color: #3b82f6; font-size: 24px;"></i>`,
                                        iconSize: [24, 24],
                                        iconAnchor: [12, 12]
                                    })
                                }).addTo(map);
                                
                                // Remove the marker after 5 seconds
                                setTimeout(() => {
                                    if (map && tempMarker) map.removeLayer(tempMarker);
                                }, 5000);
                            }
                            
                            if (detectingLocation) detectingLocation.classList.add('hidden');
                        });
                }, function(error) {
                    console.error('Error getting location:', error);
                    if (detectingLocation) detectingLocation.classList.add('hidden');
                    
                    alert('Could not determine your location. Please enter it manually.');
                });
            } else {
                alert('Geolocation is not supported by your browser. Please enter your location manually.');
                if (detectingLocation) detectingLocation.classList.add('hidden');
            }
        });
    }
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

// Helper function to show confirmation modal
function showConfirmationModal(title, message) {
    const modal = document.getElementById('confirmation-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirm = document.getElementById('modal-confirm');
    
    if (modal && modalTitle && modalMessage && modalConfirm) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.add('show');
        
        modalConfirm.onclick = function() {
            modal.classList.remove('show');
        };
    } else {
        // Fallback to alert if modal elements are not found
        alert(`${title}\n\n${message}`);
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
// Add this function to your map.js file

/**
 * Geocode an address string to coordinates using Nominatim
 * @param {string} address - The address to geocode
 * @returns {Promise} - Resolves to [lat, lng] array or null if geocoding fails
 */
function geocodeAddress(address) {
    // Use Nominatim's API (OpenStreetMap)
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                const result = data[0];
                return [parseFloat(result.lat), parseFloat(result.lon)];
            } else {
                console.warn('No geocoding results found for address:', address);
                return null;
            }
        })
        .catch(error => {
            console.error('Error geocoding address:', error);
            return null;
        });
}
/**
 * Reverse geocode coordinates to an address using Nominatim
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise} - Resolves to address string or null if reverse geocoding fails
 */
function reverseGeocode(lat, lng) {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.display_name) {
                return data.display_name;
            } else {
                console.warn('No reverse geocoding results found for coordinates:', lat, lng);
                return null;
            }
        })
        .catch(error => {
            console.error('Error reverse geocoding coordinates:', error);
            return null;
        });
}