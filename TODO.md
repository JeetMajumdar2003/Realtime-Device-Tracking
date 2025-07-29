## TODO: Real-Time Device Tracking Map

1. **Check Geolocation Support**
   - [x] Verify if the browser supports the Geolocation API.

2. **Configure Geolocation Options**
   - [x] Use `watchPosition` with options: high accuracy, 5-second timeout, and no caching.

3. **Track and Emit Location**
   - [x] Continuously track the user's location.
   - [x] Emit latitude and longitude to the server via a socket event (e.g., `send-location`).
   - [x] Log any geolocation errors to the console.

4. **Initialize the Map**
   - [x] Center the Leaflet map at coordinates (0, 0) with a zoom level of 15.
   - [x] Add OpenStreetMap tiles to the map.

5. **Manage Device Markers**
   - [x] Create an empty `markers` object to store device markers by ID.
   - [x] On receiving location data from the socket, extract `id`, `latitude`, and `longitude`.
   - [x] Add or update the marker for each device and center the map on the new coordinates.

6. **Device Identification & Management**
   - [x] Allow users to set a custom device name.
   - [x] Display device info (name, type, last seen time) in marker popups.
   - [x] Add a sidebar or list view showing all connected devices.

7. **User Authentication & Privacy**
   - [ ] Implement simple authentication (e.g., username/password or OAuth).
   - [ ] Allow users to choose whether to share their location.
   - [ ] Add a toggle to hide/show own location on the map.

8. **Location History & Playback**
   - [ ] Store device location history on the server.
   - [ ] Add a feature to view and playback movement history for each device.
   - [ ] Visualize paths with polylines on the map.