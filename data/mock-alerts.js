// data/mock-alerts.js
const mockAlerts = [
    {
        id: 'A001',
        type: 'emergency',
        title: 'Flash Flood Warning',
        message: 'Immediate evacuation required in downtown areas. Move to higher ground.',
        area: 'downtown',
        timestamp: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
    },
    {
        id: 'A002',
        type: 'warning',
        title: 'Severe Weather Alert',
        message: 'Strong winds and heavy rain expected in the next 6 hours. Secure loose objects and stay indoors if possible.',
        area: 'all',
        timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
    },
    {
        id: 'A003',
        type: 'info',
        title: 'Road Closure',
        message: 'Main Street between 5th and 8th Avenue is closed due to flooding. Use alternate routes.',
        area: 'downtown',
        timestamp: new Date(Date.now() - 1000 * 60 * 180) // 3 hours ago
    }
];