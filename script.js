// DOM Elements
const rsvpForm = document.getElementById('rsvpForm');
const successMessage = document.getElementById('successMessage');
const successText = document.getElementById('successText');

// Check if form was already submitted on page load
document.addEventListener('DOMContentLoaded', function() {
    checkFormSubmissionStatus();
});

// Function to check if form was already submitted
function checkFormSubmissionStatus() {
    const submissionStatus = localStorage.getItem('nadjaPartyFormSubmitted');
    if (submissionStatus === 'true') {
        // Form was already submitted, make it non-editable
        makeFormNonEditable();
        
        // Show success message with stored data
        const storedRSVPs = JSON.parse(localStorage.getItem('nadjaPartyRSVPs')) || [];
        if (storedRSVPs.length > 0) {
            const lastRSVP = storedRSVPs[storedRSVPs.length - 1];
            showSuccessMessage(lastRSVP.name, lastRSVP.response);
        }
    }
}

// Form submission handler
rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(rsvpForm);
    const guestName = formData.get('guestName').trim();
    const response = formData.get('response');
    const message = formData.get('message').trim();
    
    // Validate required fields
    if (!guestName || !response) {
        alert('Bitte fülle alle Pflichtfelder aus!');
        return;
    }
    
    // Create RSVP object
    const rsvpData = {
        name: guestName,
        response: response,
        message: message || 'Keine Nachricht',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('de-DE'),
        time: new Date().toLocaleTimeString('de-DE')
    };
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-text">Wird gesendet...</span> <span class="btn-icon">⏳</span>';
    submitBtn.disabled = true;
    
    // Send data to Power Automate
    sendToPowerAutomate(rsvpData)
        .then(() => {
            // Store RSVP data locally as backup
            storeRSVPLocally(rsvpData);
            
            // Mark form as submitted
            localStorage.setItem('nadjaPartyFormSubmitted', 'true');
            
            // Show themed popup
            showThemePopup(guestName, response);
            
            // Make form non-editable
            makeFormNonEditable();
            
            // Show success message
            showSuccessMessage(guestName, response);
            
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Add confetti effect
            createConfetti();
        })
        .catch((error) => {
            console.error('Fehler beim Senden an Power Automate:', error);
            
            // Store locally as fallback
            storeRSVPLocally(rsvpData);
            
            // Mark form as submitted
            localStorage.setItem('nadjaPartyFormSubmitted', 'true');
            
            // Show themed popup
            showThemePopup(guestName, response);
            
            // Make form non-editable
            makeFormNonEditable();
            
            // Show success message anyway (user doesn't need to know about technical issues)
            showSuccessMessage(guestName, response);
            
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Add confetti effect
            createConfetti();
        });
});

// Function to send data to Power Automate
async function sendToPowerAutomate(rsvpData) {
    const powerAutomateUrl = 'https://prod-54.westeurope.logic.azure.com:443/workflows/6855924dab94460ca60d26dcee2c5bab/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=imaDlgwBzg8Mm_zGDvyBg4lgzkG6WwIbgULnpW9pkg4';
    
    // Prepare data for Power Automate
    const requestBody = {
        name: rsvpData.name,
        response: rsvpData.response,
        message: rsvpData.message
    };
    
    try {
        const response = await fetch(powerAutomateUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('✅ RSVP erfolgreich an Power Automate gesendet:', requestBody);
        return response;
        
    } catch (error) {
        console.error('❌ Fehler beim Senden an Power Automate:', error);
        throw error;
    }
}

// Function to store RSVP data locally
function storeRSVPLocally(rsvpData) {
    try {
        // Get existing RSVPs from localStorage
        let existingRSVPs = JSON.parse(localStorage.getItem('nadjaPartyRSVPs')) || [];
        
        // Add new RSVP
        existingRSVPs.push(rsvpData);
        
        // Store back to localStorage
        localStorage.setItem('nadjaPartyRSVPs', JSON.stringify(existingRSVPs));
        
        // Also log to console for the party organizer
        console.log('Neue RSVP gespeichert:', rsvpData);
        console.log('Alle RSVPs:', existingRSVPs);
        
    } catch (error) {
        console.error('Fehler beim Speichern der RSVP:', error);
    }
}

// Function to show themed popup
function showThemePopup(guestName, response) {
    const popupMessages = [
        "🌞 Sommer, Sonne, Sonnenschein - das wird ein tolles Fest! 🌞",
        "🎉 Party-Time! Lass uns das Sommerfest rocken! 🎉",
        "🌺 Coole Leute, warme Vibes - perfekt für Nadjas Tag! 🌺",
        "☀️ Sonnige Grüße und gute Laune garantiert! ☀️",
        "🎊 Ready to party? Das wird legendär! 🎊"
    ];
    
    const randomMessage = popupMessages[Math.floor(Math.random() * popupMessages.length)];
    
    let popupText = '';
    if (response === 'yes') {
        popupText = `Yeahhh, ${guestName}! 🎉\n\n${randomMessage}\n\nWir können es kaum erwarten!`;
    } else {
        popupText = `Oh nein, ${guestName}! 😢\n\n${randomMessage}\n\nSchade, dass du nicht dabei sein kannst, aber wir verstehen es!`;
    }
    
    // Create custom popup overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-in;
    `;
    
    const popup = document.createElement('div');
    popup.style.cssText = `
        background: linear-gradient(135deg, #FFE66D 0%, #FF8E53 50%, #FF6B6B 100%);
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        max-width: 90vw;
        width: 400px;
        margin: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: popIn 0.5s ease-out;
        color: white;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-size: 18px;
        line-height: 1.5;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        position: relative;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '🎉 Weiter 🎉';
    closeBtn.style.cssText = `
        background: white;
        color: #FF6B6B;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
        margin-top: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.transform = 'scale(1.05)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.transform = 'scale(1)';
    });
    
    closeBtn.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 300);
    });
    
    // Add touch event for mobile devices
    closeBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 300);
    });
    
    // Close popup when clicking outside (overlay)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            }, 300);
        }
    });
    
    popup.innerHTML = popupText.replace(/\n/g, '<br>');
    popup.appendChild(closeBtn);
    overlay.appendChild(popup);
    
    // Add animations
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes popIn {
            0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
            50% { transform: scale(1.1) rotate(2deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
    `;
    document.head.appendChild(animationStyle);
    
    document.body.appendChild(overlay);
}

// Function to make form non-editable
function makeFormNonEditable() {
    const form = document.getElementById('rsvpForm');
    const inputs = form.querySelectorAll('input, textarea, button');
    
    inputs.forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.6';
        input.style.cursor = 'not-allowed';
    });
    
    // Check if lock indicator already exists to avoid duplicates
    if (!form.querySelector('.form-lock-indicator')) {
        // Add a visual indicator that the form is locked
        const lockIndicator = document.createElement('div');
        lockIndicator.className = 'form-lock-indicator';
        lockIndicator.innerHTML = '🔒 Antwort gesendet - Formular gesperrt';
        lockIndicator.style.cssText = `
            background: #f0f0f0;
            color: #666;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            margin-top: 15px;
            font-weight: bold;
            border: 2px dashed #ccc;
        `;
        
        form.appendChild(lockIndicator);
    }
}

// Function to show success message
function showSuccessMessage(guestName, response) {
    let messageText = '';
    
    if (response === 'yes') {
        messageText = `Fantastisch, ${guestName}! Wir freuen uns riesig, dass du dabei bist! 🎉`;
    } else {
        messageText = `Schade, ${guestName}, dass du nicht dabei sein kannst. 😢<br><br>Wir werden dich vermissen, aber verstehen es natürlich!`;
    }
    
    successText.innerHTML = messageText;
    successMessage.style.display = 'block';
    
    // Smooth scroll to success message
    successMessage.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// Confetti animation function
function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8E53', '#87CEEB'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }, i * 100);
    }
}

// Add confetti animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Function to display all RSVPs (for the party organizer)
function showAllRSVPs() {
    try {
        const rsvps = JSON.parse(localStorage.getItem('nadjaPartyRSVPs')) || [];
        
        if (rsvps.length === 0) {
            console.log('Noch keine RSVPs vorhanden.');
            return;
        }
        
        console.log('=== ALLE RSVPs FÜR NADJAS PARTY ===');
        console.log(`Insgesamt: ${rsvps.length} Antworten`);
        
        const yesResponses = rsvps.filter(rsvp => rsvp.response === 'yes');
        const noResponses = rsvps.filter(rsvp => rsvp.response === 'no');
        
        console.log(`✅ Zusagen: ${yesResponses.length}`);
        console.log(`❌ Absagen: ${noResponses.length}`);
        console.log('');
        
        rsvps.forEach((rsvp, index) => {
            console.log(`${index + 1}. ${rsvp.name}`);
            console.log(`   Antwort: ${rsvp.response === 'yes' ? '✅ Kommt' : '❌ Kommt nicht'}`);
            console.log(`   Nachricht: ${rsvp.message}`);
            console.log(`   Zeitpunkt: ${rsvp.date} um ${rsvp.time}`);
            console.log('---');
        });
        
        return rsvps;
    } catch (error) {
        console.error('Fehler beim Abrufen der RSVPs:', error);
    }
}

// Function to export RSVPs as text (for easy copying)
function exportRSVPs() {
    try {
        const rsvps = JSON.parse(localStorage.getItem('nadjaPartyRSVPs')) || [];
        
        if (rsvps.length === 0) {
            alert('Noch keine RSVPs vorhanden.');
            return;
        }
        
        let exportText = '=== NADJAS PARTY - GÄSTELISTE ===\n\n';
        exportText += `Datum: ${new Date().toLocaleDateString('de-DE')}\n`;
        exportText += `Insgesamt: ${rsvps.length} Antworten\n\n`;
        
        const yesResponses = rsvps.filter(rsvp => rsvp.response === 'yes');
        const noResponses = rsvps.filter(rsvp => rsvp.response === 'no');
        
        exportText += `ZUSAGEN (${yesResponses.length}):\n`;
        exportText += '================\n';
        yesResponses.forEach((rsvp, index) => {
            exportText += `${index + 1}. ${rsvp.name}\n`;
            exportText += `   Nachricht: ${rsvp.message}\n`;
            exportText += `   Geantwortet am: ${rsvp.date}\n\n`;
        });
        
        exportText += `ABSAGEN (${noResponses.length}):\n`;
        exportText += '================\n';
        noResponses.forEach((rsvp, index) => {
            exportText += `${index + 1}. ${rsvp.name}\n`;
            exportText += `   Nachricht: ${rsvp.message}\n`;
            exportText += `   Geantwortet am: ${rsvp.date}\n\n`;
        });
        
        // Copy to clipboard
        navigator.clipboard.writeText(exportText).then(() => {
            alert('Gästeliste wurde in die Zwischenablage kopiert!');
        }).catch(() => {
            // Fallback: Show in alert
            alert('Gästeliste:\n\n' + exportText);
        });
        
    } catch (error) {
        console.error('Fehler beim Exportieren der RSVPs:', error);
    }
}

// Add helper functions to window for easy access in console
window.showAllRSVPs = showAllRSVPs;
window.exportRSVPs = exportRSVPs;

// Add some helpful console messages for the party organizer
console.log('🎉 Nadjas Party Einladung geladen!');
console.log('📋 Verwende showAllRSVPs() um alle Antworten zu sehen');
console.log('📤 Verwende exportRSVPs() um die Gästeliste zu exportieren');

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add form validation feedback
const inputs = document.querySelectorAll('input[required]');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = '#FF6B6B';
        } else {
            this.style.borderColor = '#4ECDC4';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.style.borderColor = '#4ECDC4';
        }
    });
});

// Add radio button change animation
const radioButtons = document.querySelectorAll('input[type="radio"]');
radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
        // Add a little celebration when someone says yes
        if (this.value === 'yes') {
            const yesOption = this.closest('.radio-option');
            yesOption.style.transform = 'scale(1.05)';
            setTimeout(() => {
                yesOption.style.transform = 'scale(1)';
            }, 200);
        }
    });
});
