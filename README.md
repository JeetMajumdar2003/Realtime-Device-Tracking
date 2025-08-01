# Realtime Device Tracking

Track devices in real-time on a web dashboard. Built for learning and demo purposes.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)

## Features
- **User Authentication**: Simple username/password authentication system
- **Privacy Controls**: Users can choose whether to share their location and show it on the map
- Real-time device tracking on a web dashboard
- Interactive map view using Leaflet
- Live updates via socket.io
- Simple Node.js server (`server.js`)
- Modern UI with HTML, CSS, and JavaScript
- Demo images included

## Tech Stack
- Node.js
- Express.js
- express-session (for authentication)
- socket.io (for real-time communication)
- Leaflet (interactive maps)
- HTML5
- CSS3
- JavaScript (Vanilla)

## Installation
1. Clone this repository:
   ```pwsh
   git clone <repo-url>
   ```
2. Navigate to the project folder:
   ```pwsh
   cd "Realtime-Device-Tracking"
   ```
3. Install dependencies (if any):
   ```pwsh
   npm install
   ```
4. Start the server:
   ```pwsh
   npm start
   ```

## Usage
1. Open `http://localhost:3000` in your browser
2. Login with demo credentials (username: "demo", password: "demo") or any username/password combination
3. Set your device name when prompted
4. Use the privacy controls to:
   - Toggle "Share my location" to control whether your location is sent to the server
   - Toggle "Show my location on map" to control whether your location marker appears on the map
5. Track devices in real-time on the dashboard

## License
This project is licensed under the MIT License.

## Contributing

Contributions are welcome! If you would like to improve this project, please follow these steps:

1. **Fork the repository**: Click the "Fork" button at the top right of this page to create your own copy of this repository.
2. **Clone your fork**: Download your fork to your local machine with:
   ```bash
   git clone https://github.com/<your-username>/Realtime-Device-Tracking.git
   ```
3. **Create a new branch**: It’s best to create a new branch for your changes:
   ```bash
   git checkout -b my-feature-branch
   ```
4. **Make your changes**: Implement your feature, fix a bug, or update documentation.
5. **Commit and push**: Commit your changes and push the branch to your fork:
   ```bash
   git add .
   git commit -m "Describe your changes"
   git push origin my-feature-branch
   ```
6. **Open a Pull Request**: Go to the original repository and open a Pull Request. Please describe your changes in detail.
7. **Code Review**: Work with the repo maintainers to address any feedback.

**Tips:**
- For significant changes, please open an issue to discuss your idea first.
- Make sure your code follows existing style and conventions.
- Update documentation as needed.

Thank you for contributing!