let currentStep = 1;
const totalSteps = 5;

// Data Payload
const submissionData = {
    id: 'SUB-' + Date.now(),
    sellerInfo: {},
    gps: null,
    photos: [],
    details: {},
    ownership: {},
    status: 'DRAFT',
    createdAt: new Date().toISOString()
};

function updateProgress() {
    for(let i=1; i<=totalSteps; i++) {
        const ind = document.getElementById(`ind-${i}`);
        if(i < currentStep) ind.className = 'step-indicator completed';
        else if(i === currentStep) ind.className = 'step-indicator active';
        else ind.className = 'step-indicator';

        const step = document.getElementById(`step-${i}`);
        if(i === currentStep) step.className = 'step-container active';
        else step.className = 'step-container';
    }
}

function nextStep() {
    if(currentStep < totalSteps) {
        if(currentStep === 2) startCamera();
        currentStep++;
        updateProgress();
    }
}

function prevStep() {
    if(currentStep > 1) {
        currentStep--;
        updateProgress();
    }
}

// STEP 1: PHONE OTP
function sendOTP() {
    const phone = document.getElementById('phoneNum').value;
    const name = document.getElementById('fullName').value;
    if(!phone || !name) {
        alert("Please enter Name and Phone Number.");
        return;
    }
    document.getElementById('otp-section').style.display = 'block';
    document.getElementById('btnSendOtp').style.display = 'none';
}

function verifyOTP() {
    const otp = document.getElementById('otpCode').value;
    if(otp.length === 4) {
        submissionData.sellerInfo = {
            name: document.getElementById('fullName').value,
            phone: document.getElementById('phoneNum').value,
            phoneVerifiedAt: new Date().toISOString()
        };
        submissionData.status = 'PHONE_VERIFIED';
        nextStep();
    } else {
        alert("Enter 4 digits.");
    }
}

// STEP 2: GPS
function captureGPS() {
    if(!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    const statusBox = document.getElementById('gpsStatus');
    statusBox.style.display = 'block';
    statusBox.innerHTML = 'Locating... please ensure GPS/Location is enabled.';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            submissionData.gps = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracyMeters: position.coords.accuracy,
                capturedAt: new Date().toISOString()
            };
            submissionData.status = 'GPS_CAPTURED';
            
            statusBox.innerHTML = `<i class="fa-solid fa-check-circle"></i> Location captured successfully! (Accuracy: ${Math.round(position.coords.accuracy)}m)`;
            statusBox.style.borderColor = "var(--primary-accent)";
            
            document.getElementById('btnNextGps').disabled = false;
        },
        (error) => {
            statusBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:var(--color-muted-red);"></i> Error capturing location. Please check browser permissions and move outdoors if on mobile.`;
            statusBox.style.borderColor = "var(--color-muted-red)";
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

// STEP 3: CAMERA
let videoStream = null;

async function startCamera() {
    const video = document.getElementById('videoElement');
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = videoStream;
    } catch (err) {
        console.error("Camera error:", err);
        alert("Camera access denied or unavailable.");
    }
}

function stopCamera() {
    if(videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
}

function takePhoto() {
    const video = document.getElementById('videoElement');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    if(submissionData.photos.length < 4) {
        submissionData.photos.push({
            id: 'IMG-' + Date.now(),
            capturedAt: new Date().toISOString(),
            data: dataUrl
        });
        
        const slot = document.getElementById(`photo-${submissionData.photos.length}`);
        slot.style.backgroundImage = `url(${dataUrl})`;
        slot.classList.add('has-image');
        
        if(submissionData.photos.length === 4) {
            document.getElementById('btnNextCamera').disabled = false;
        }
    } else {
        alert("All 4 photos captured.");
    }
}

// STEP 5: SUBMIT
function submitListing() {
    if(!document.getElementById('declaration').checked) {
        alert("Please confirm the declaration.");
        return;
    }

    // Gather details
    submissionData.details = {
        locality: document.getElementById('locality').value,
        type: document.getElementById('propType').value,
        size: document.getElementById('propSize').value,
    };
    
    // Gather ownership
    const docs = Array.from(document.querySelectorAll('.doc-check:checked')).map(cb => cb.value);
    submissionData.ownership = {
        ownerType: document.getElementById('ownerType').value,
        documents: docs
    };

    // Simulated Validation Logic
    submissionData.status = 'SUBMITTED';
    // If we had real bounding boxes, we'd check if GPS matches locality. Here we simulate LOCATION_REVIEW_REQUIRED randomly or based on missing docs.
    if(docs.length === 0) {
        submissionData.status = 'DOCUMENT_REVIEW';
    }

    // Save Admin Data Table payload
    const adminRecord = {
        submissionId: submissionData.id,
        sellerId: submissionData.sellerInfo.phone,
        phoneVerified: !!submissionData.sellerInfo.phoneVerifiedAt,
        gpsLatitude: submissionData.gps.latitude,
        gpsLongitude: submissionData.gps.longitude,
        gpsAccuracy: submissionData.gps.accuracyMeters,
        gpsCapturedAt: submissionData.gps.capturedAt,
        cameraPhotoIds: submissionData.photos.map(p => p.id),
        selectedArea: submissionData.details.locality,
        resolvedArea: null, // to be done by admin
        legalStatusAtSubmission: 'UNKNOWN', // would lookup from directory
        documentStatus: docs.length > 0 ? 'PENDING_REVIEW' : 'MISSING',
        reviewer: null,
        reviewNotes: '',
        listingStatus: submissionData.status
    };

    // In a real app, send to API. For now, localStorage.
    let existing = JSON.parse(localStorage.getItem('siddhu_submissions') || '[]');
    existing.push(adminRecord);
    localStorage.setItem('siddhu_submissions', JSON.stringify(existing));

    // Show success
    document.getElementById('btnSubmit').style.display = 'none';
    document.getElementById('btnFinalBack').style.display = 'none';
    
    const resultBox = document.getElementById('submitResult');
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <h3 style="color:var(--primary-accent); margin-bottom:10px;"><i class="fa-solid fa-check-circle"></i> Submission Received Successfully</h3>
        <p style="font-size:14px; color:var(--text-light);">Your submission ID is <strong>${submissionData.id}</strong>.</p>
        <p style="font-size:14px; color:var(--text-light); margin-top:8px;">Admin Status: <span class="status-badge status-amber">${submissionData.status}</span></p>
        <p style="font-size:14px; color:var(--text-muted); margin-top:16px;">Our team will review your location, photos, and property details securely before publishing with public trust labels.</p>
    `;
    
    console.log("Admin Record Saved:", adminRecord);
}
