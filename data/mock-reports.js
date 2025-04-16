// data/mock-reports.js
const mockReports = [
    {
        id: 'R1001',
        name: 'John Smith',
        contact: '555-123-4567',
        location: 'Downtown, Main St & 5th Ave',
        coordinates: [40.7128, -74.0060],
        type: 'emergency',
        description: 'Building partially collapsed, people trapped inside.',
        peopleAffected: 12,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: 'in-progress'
    },
    {
        id: 'R1002',
        name: 'Maria Garcia',
        contact: 'maria@example.com',
        location: 'North District, Oak Street',
        coordinates: [40.7200, -74.0100],
        type: 'medical',
        description: 'Several elderly people need medical attention, no access to medicine.',
        peopleAffected: 7,
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        status: 'pending'
    },
    {
        id: 'R1003',
        name: 'David Wilson',
        contact: '555-987-6543',
        location: 'East District, River Rd',
        coordinates: [40.7150, -73.9900],
        type: 'supplies',
        description: 'Neighborhood cut off by flooding, running low on drinking water and food.',
        peopleAffected: 45,
        timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
        status: 'pending'
    },
    {
        id: 'R1004',
        name: 'Sarah Johnson',
        contact: 'sarah@example.com',
        location: 'West District, Pine Ave',
        coordinates: [40.7180, -74.0200],
        type: 'infrastructure',
        description: 'Power lines down, causing fire risk. Road blocked.',
        peopleAffected: 30,
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        status: 'resolved'
    }
];