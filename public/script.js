const socket = io();

// Privacy settings
let shareLocation = localStorage.getItem('shareLocation') !== 'false'; // Default to true
let showOnMap = localStorage.getItem('showOnMap') !== 'false'; // Default to true

// Update checkboxes with saved settings
document.getElementById('share-location').checked = shareLocation;
document.getElementById('show-on-map').checked = showOnMap;

// Listen for privacy control changes
document.getElementById('share-location').addEventListener('change', function() {
    shareLocation = this.checked;
    localStorage.setItem('shareLocation', shareLocation);
    if (!shareLocation) {
        // If sharing is disabled, also disable showing on map
        showOnMap = false;
        document.getElementById('show-on-map').checked = false;
        localStorage.setItem('showOnMap', showOnMap);
    }
});

document.getElementById('show-on-map').addEventListener('change', function() {
    showOnMap = this.checked;
    localStorage.setItem('showOnMap', showOnMap);
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    fetch('/logout', { method: 'POST' })
        .then(() => window.location.href = '/login.html')
        .catch(() => window.location.href = '/login.html');
});

// device name
let deviceName = localStorage.getItem('deviceName') || '';
if (!deviceName) {
    deviceName = prompt('Enter your device name:') || 'Unknown Device';
    localStorage.setItem('deviceName', deviceName);
}

// Detect Device type 
function getDeviceType() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'Mobile';
    if (/tablet/i.test(ua)) return 'Tablet';
    return 'Desktop';
}
const deviceType = getDeviceType();

// Send device info on connection
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        
        // Only send location if user has enabled sharing
        if (shareLocation) {
            socket.emit('send-location', {
                latitude,
                longitude,
                name: deviceName,
                type: deviceType,
                lastSeen: Date.now(),
                shareLocation: shareLocation,
                showOnMap: showOnMap
            });
        }
    }, (error) => {
        console.error('Geolocation error:', error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    })
}

const map = L.map('map').setView([20.5937, 78.9629], 15);   // Default view set to Center of India

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const markers = {}
let firstLocationReceived = false;

// Store device info for sidebar
const devices = {};

socket.on('receive-location', (data) => {
    const { id, latitude, longitude, name, type, lastSeen, username } = data;
    devices[id] = { name, type, lastSeen, latitude, longitude, username };

    if (!firstLocationReceived && typeof latitude === 'number' && typeof longitude === 'number') {
        map.setView([latitude, longitude], 15);
        firstLocationReceived = true;
    }

    let popupContent = `<b>${name || 'Device'}</b><br>User: ${username || 'Unknown'}<br>Type: ${type || 'Unknown'}<br>Last seen: ${lastSeen ? new Date(lastSeen).toLocaleTimeString() : ''}`;
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]).setPopupContent(popupContent);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map).bindPopup(popupContent);
    }
    updateDeviceList();
})

// Handle user disconnection
socket.on('user-disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id])
        delete markers[id]
    }
    delete devices[id];
    updateDeviceList();
})

// Sidebar device list
function updateDeviceList() {
    const list = document.getElementById('device-list');
    if (!list) return;
    list.innerHTML = '<h4>Connected Devices</h4>';
    Object.entries(devices).forEach(([id, info]) => {
        const item = document.createElement('div');
        item.className = 'device-item';
        item.innerHTML = `<b>${info.name || 'Device'}</b><br>User: ${info.username || 'Unknown'}<br>Type: ${info.type || 'Unknown'}<br>Last seen: ${info.lastSeen ? new Date(info.lastSeen).toLocaleTimeString() : ''}`;
        item.onclick = () => {
            if (markers[id]) {
                map.setView(markers[id].getLatLng(), 15);
                markers[id].openPopup();
            }
        };
        list.appendChild(item);
    });
}