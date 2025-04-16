const mockAlerts = [
    {
        id: 'A001',
        type: 'emergency',
        title: 'Flood Alert – MVP Colony',
        message: 'Evacuate low-lying areas immediately in MVP Colony. Move to designated shelters.',
        area: 'MVP Colony',
        timestamp: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
        id: 'A002',
        type: 'warning',
        title: 'Cyclone Warning',
        message: 'Heavy rains and winds expected along the coastline near RK Beach in the next 6 hours.',
        area: 'RK Beach',
        timestamp: new Date(Date.now() - 1000 * 60 * 120)
    },
    {
        id: 'A003',
        type: 'info',
        title: 'Road Blockage',
        message: 'Beach Road is blocked due to waterlogging. Use alternate routes.',
        area: 'Beach Road',
        timestamp: new Date(Date.now() - 1000 * 60 * 180)
    }
];
