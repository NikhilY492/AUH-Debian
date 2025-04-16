const mockReports = [
    {
        id: 'R1001',
        name: 'Rajesh Kumar',
        contact: '9876543210',
        location: 'MVP Colony, Sector 5',
        coordinates: [17.7281, 83.3192],
        type: 'emergency',
        description: 'Apartment basement flooded, 10 people stuck.',
        peopleAffected: 10,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'in-progress'
    },
    {
        id: 'R1002',
        name: 'Anjali Mehta',
        contact: 'anjali@example.com',
        location: 'Gajuwaka Main Road',
        coordinates: [17.6801, 83.2075],
        type: 'medical',
        description: 'Two elderly residents need medical assistance, no transport.',
        peopleAffected: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: 'pending'
    },
    {
        id: 'R1003',
        name: 'Vinod Reddy',
        contact: 'vinodreddy@example.com',
        location: 'Dabagardens, near RTC Complex',
        coordinates: [17.7041, 83.2994],
        type: 'supplies',
        description: 'Colony running out of food and clean water.',
        peopleAffected: 40,
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        status: 'pending'
    },
    {
        id: 'R1004',
        name: 'Sneha Rao',
        contact: 'sneha@example.com',
        location: 'Yendada Hills',
        coordinates: [17.7480, 83.3210],
        type: 'infrastructure',
        description: 'Power lines snapped, sparks near a transformer.',
        peopleAffected: 20,
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        status: 'resolved'
    }
];
