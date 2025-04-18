const frontCamera = document.getElementById('frontCamera');
const backCamera = document.getElementById('backCamera');

// Function to request fullscreen
function requestFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
        document.documentElement.msRequestFullscreen();
    }
}

// Function to handle fullscreen change
function handleFullscreenChange() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        requestFullscreen();
    }
}

// Add event listeners for fullscreen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

async function getCameras() {
    try {
        // First request camera access to get device labels
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        return videoDevices;
    } catch (error) {
        console.error('Error getting cameras:', error);
        return [];
    }
}

async function startCameras() {
    try {
        const cameras = await getCameras();
        if (cameras.length < 2) {
            alert('Please make sure you have both front and back cameras available on your device. If you do, try rotating your device to landscape mode or restarting the browser.');
            return;
        }

        // Try to identify front and back cameras
        let frontCam = cameras[0];
        let backCam = cameras[1];

        // On some devices, the back camera might be listed first
        if (cameras[0].label.toLowerCase().includes('back') || 
            cameras[0].label.toLowerCase().includes('rear')) {
            frontCam = cameras[1];
            backCam = cameras[0];
        }

        // Get front camera
        const frontStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: frontCam.deviceId }
        });
        frontCamera.srcObject = frontStream;

        // Get back camera
        const backStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: backCam.deviceId }
        });
        backCamera.srcObject = backStream;

        // Request fullscreen after cameras are started
        requestFullscreen();
    } catch (error) {
        console.error('Error accessing cameras:', error);
        alert('Error accessing cameras. Please make sure you have granted camera permissions and try again.');
    }
}

// Start cameras automatically when the page loads
window.addEventListener('load', startCameras); 