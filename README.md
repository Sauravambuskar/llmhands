# Real-Time Hand Tracking Web App

A futuristic web application that tracks hand movements in real-time using MediaPipe Hands and displays a skeleton overlay on the webcam feed.

## Features

- Real-time hand tracking with skeletal overlay
- Futuristic UI with performance metrics
- Color-coded finger landmarks
- Supports tracking of multiple hands simultaneously
- Fullscreen mode (double-click to toggle)
- FPS counter and hand detection indicator

## Technologies Used

- HTML5, CSS3, JavaScript
- MediaPipe Hands for hand tracking
- TailwindCSS for styling

## How to Run

### Option 1: Using XAMPP (or other web server)

1. Make sure you have a web server installed (like XAMPP, which you're already using)
2. Place all files in your web server directory (e.g., `/xampp/htdocs/MLHANDS/`)
3. Open your browser and navigate to `http://localhost/MLHANDS/`
4. Allow camera access when prompted
5. Position your hand(s) in front of the camera to see the skeletal overlay

### Option 2: Using Node.js

If you have Node.js installed, you can run the application using the included simple server:

1. Open a terminal/command prompt in the project directory
2. Run `node server.js`
3. Open your browser and navigate to `http://localhost:3000/`
4. Allow camera access when prompted
5. Position your hand(s) in front of the camera to see the skeletal overlay

## Controls

- **Double-click**: Toggle fullscreen mode
- **Refresh page**: Restart the application

## Requirements

- Modern web browser with WebRTC support (Chrome, Firefox, Edge recommended)
- Webcam or camera device
- JavaScript enabled

## Notes

- For best performance, use in a well-lit environment
- The application works best when your hands are clearly visible to the camera
- Performance may vary depending on your device's capabilities 