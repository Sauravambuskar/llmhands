// DOM Elements
const videoElement = document.querySelector('.input-video');
const canvasElement = document.querySelector('.output-canvas');
const canvasCtx = canvasElement.getContext('2d');
const fpsElement = document.getElementById('fps');
const handsDetectedElement = document.getElementById('hands-detected');
const resolutionElement = document.getElementById('resolution');
const timestampElement = document.getElementById('timestamp');

// Add loading screen
const loadingScreen = document.createElement('div');
loadingScreen.className = 'loading';
loadingScreen.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">INITIALIZING HAND TRACKING</div>
`;
document.body.appendChild(loadingScreen);

// Add hand detected indicator
const handIndicator = document.createElement('div');
handIndicator.className = 'hand-detected-indicator';
handIndicator.textContent = 'HAND DETECTED';
document.body.appendChild(handIndicator);

// Performance monitoring
let lastFrameTime = 0;
let frameCount = 0;
let fps = 0;
let frameInterval = 0;

// MediaPipe Hands configuration
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Process results from MediaPipe Hands
hands.onResults(results => {
    // Calculate FPS
    const now = performance.now();
    frameCount++;
    frameInterval += now - lastFrameTime;
    lastFrameTime = now;
    
    if (frameCount % 10 === 0) {
        fps = Math.round(1000 / (frameInterval / 10));
        frameInterval = 0;
        fpsElement.textContent = `FPS: ${fps}`;
    }
    
    // Update canvas size to match video dimensions
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    
    // Clear canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Draw hand landmarks
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Show hand detected indicator
        handIndicator.classList.add('active');
        
        // Update hands detected count
        handsDetectedElement.textContent = `Hands: ${results.multiHandLandmarks.length}`;
        
        // Draw each detected hand
        for (const landmarks of results.multiHandLandmarks) {
            // Draw the hand skeleton
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: 'rgba(0, 255, 255, 0.8)',
                lineWidth: 2
            });
            
            // Draw landmarks with different colors based on finger type
            for (let i = 0; i < landmarks.length; i++) {
                const landmark = landmarks[i];
                let color = 'rgba(0, 255, 255, 0.8)'; // Default cyan color
                
                // Thumb (landmarks 1-4)
                if (i >= 1 && i <= 4) {
                    color = 'rgba(255, 50, 50, 0.8)'; // Red
                } 
                // Index finger (landmarks 5-8)
                else if (i >= 5 && i <= 8) {
                    color = 'rgba(50, 255, 50, 0.8)'; // Green
                }
                // Middle finger (landmarks 9-12)
                else if (i >= 9 && i <= 12) {
                    color = 'rgba(50, 50, 255, 0.8)'; // Blue
                }
                // Ring finger (landmarks 13-16)
                else if (i >= 13 && i <= 16) {
                    color = 'rgba(255, 255, 50, 0.8)'; // Yellow
                }
                // Pinky finger (landmarks 17-20)
                else if (i >= 17 && i <= 20) {
                    color = 'rgba(255, 50, 255, 0.8)'; // Magenta
                }
                
                // Draw landmark point
                canvasCtx.fillStyle = color;
                canvasCtx.beginPath();
                canvasCtx.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height, 6, 0, 2 * Math.PI);
                canvasCtx.fill();
            }
            
            // Add futuristic effects - draw circles around wrist
            const wrist = landmarks[0];
            canvasCtx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            canvasCtx.lineWidth = 2;
            
            for (let radius = 20; radius <= 50; radius += 10) {
                canvasCtx.beginPath();
                canvasCtx.arc(
                    wrist.x * canvasElement.width,
                    wrist.y * canvasElement.height,
                    radius,
                    0,
                    2 * Math.PI
                );
                canvasCtx.stroke();
            }
        }
    } else {
        // Hide hand detected indicator when no hands are present
        handIndicator.classList.remove('active');
        handsDetectedElement.textContent = 'Hands: 0';
    }
    
    canvasCtx.restore();
});

// Initialize camera
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    width: 1280,
    height: 720
});

// Start camera with permission handling
camera.start()
    .then(() => {
        console.log('Camera started successfully');
        // Hide loading screen after a short delay
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Update resolution display
            videoElement.addEventListener('loadedmetadata', () => {
                resolutionElement.textContent = `${videoElement.videoWidth}x${videoElement.videoHeight}`;
            });
            
            // Start timestamp update
            updateTimestamp();
        }, 1500);
    })
    .catch(error => {
        console.error('Error starting camera:', error);
        loadingScreen.innerHTML = `
            <div class="loading-text" style="color: #ff3333">ERROR: Camera access denied</div>
            <div class="loading-text" style="font-size: 14px; margin-top: 10px">Please allow camera access and refresh</div>
        `;
    });

// Update timestamp every second
function updateTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timestampElement.textContent = `${hours}:${minutes}:${seconds}`;
    setTimeout(updateTimestamp, 1000);
}

// Handle window resize
window.addEventListener('resize', () => {
    // Canvas will be resized automatically through CSS
    // This ensures the video and canvas maintain full screen coverage
});

// Add fullscreen toggle on double click
document.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

// Info button functionality
const infoButton = document.querySelector('.info-button');
const infoModal = document.querySelector('.info-modal');
const infoClose = document.querySelector('.info-close');

infoButton.addEventListener('click', () => {
    infoModal.classList.add('active');
});

infoClose.addEventListener('click', () => {
    infoModal.classList.remove('active');
});

// Close modal when clicking outside of it
infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
        infoModal.classList.remove('active');
    }
}); 