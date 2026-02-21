// JavaScript for contact.html

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize form submission
    initializeFormSubmission();
    
    // Initialize contact form reset functionality
    initializeFormReset();
});

// Form validation
function initializeFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear error on focus
        input.addEventListener('focus', function() {
            clearFieldError(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (!errorElement) return;
    
    // Clear previous error
    errorElement.textContent = '';
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        errorElement.textContent = 'Ce champ est obligatoire';
        field.style.borderColor = '#f44336';
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorElement.textContent = 'Veuillez entrer une adresse email valide';
            field.style.borderColor = '#f44336';
            return false;
        }
    }
    
    // Name validation (minimum 2 characters)
    if ((fieldId === 'prenom' || fieldId === 'nom') && value.length < 2) {
        errorElement.textContent = 'Minimum 2 caractères requis';
        field.style.borderColor = '#f44336';
        return false;
    }
    
    // Message validation (minimum 10 characters)
    if (fieldId === 'message' && value.length < 10) {
        errorElement.textContent = 'Le message doit contenir au moins 10 caractères';
        field.style.borderColor = '#f44336';
        return false;
    }
    
    // Valid field
    field.style.borderColor = '#4CAF50';
    return true;
}

// Clear field error
function clearFieldError(field) {
    const fieldId = field.id;
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    field.style.borderColor = '#ddd';
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Initialize form submission
function initializeFormSubmission() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            showAlert('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }
        
        // Get form data
        const formData = {
            prenom: document.getElementById('prenom').value.trim(),
            nom: document.getElementById('nom').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim(),
            sujet: document.getElementById('sujet').value,
            date: new Date().toISOString()
        };
        
        // Save to localStorage (simulating database)
        saveContactMessage(formData);
        
        // Show confirmation message
        showConfirmationMessage(formData);
        
        // Reset form
        form.reset();
        
        // Clear all field errors
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        // Reset field borders
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#ddd';
        });
        
        // Log to console (for debugging)
        console.log('Message envoyé:', formData);
    });
}

// Save contact message to localStorage
function saveContactMessage(formData) {
    try {
        // Get existing messages or initialize empty array
        const messages = JSON.parse(localStorage.getItem('mbaaymi_contact_messages') || '[]');
        
        // Add new message with ID and timestamp
        const newMessage = {
            id: Date.now(),
            ...formData,
            timestamp: new Date().toISOString()
        };
        
        messages.push(newMessage);
        
        // Save back to localStorage (limit to last 50 messages)
        const recentMessages = messages.slice(-50);
        localStorage.setItem('mbaaymi_contact_messages', JSON.stringify(recentMessages));
        
        // Update message count in dashboard
        updateMessageCount();
        
        return true;
    } catch (error) {
        console.error('Error saving contact message:', error);
        return false;
    }
}

// Update message count for dashboard
function updateMessageCount() {
    try {
        const messages = JSON.parse(localStorage.getItem('mbaaymi_contact_messages') || '[]');
        localStorage.setItem('mbaaymi_total_messages', messages.length.toString());
        
        // Dispatch event to update dashboard if open
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'mbaaymi_total_messages',
            newValue: messages.length.toString()
        }));
    } catch (error) {
        console.error('Error updating message count:', error);
    }
}

// Show confirmation message
function showConfirmationMessage(formData) {
    const confirmationMessage = document.getElementById('confirmation-message');
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const newMessageBtn = document.getElementById('new-message-btn');
    
    if (!confirmationMessage || !userNameElement || !userEmailElement || !newMessageBtn) return;
    
    // Set user information
    userNameElement.textContent = `${formData.prenom} ${formData.nom}`;
    userEmailElement.textContent = formData.email;
    
    // Show confirmation message
    confirmationMessage.style.display = 'flex';
    
    // New message button functionality
    newMessageBtn.addEventListener('click', function() {
        confirmationMessage.style.display = 'none';
    });
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (confirmationMessage.style.display === 'flex') {
            confirmationMessage.style.display = 'none';
        }
    }, 10000);
}

// Initialize form reset functionality
function initializeFormReset() {
    const newMessageBtn = document.getElementById('new-message-btn');
    if (newMessageBtn) {
        newMessageBtn.addEventListener('click', function() {
            const confirmationMessage = document.getElementById('confirmation-message');
            if (confirmationMessage) {
                confirmationMessage.style.display = 'none';
            }
        });
    }
    
    // Close confirmation when clicking outside
    const confirmationMessage = document.getElementById('confirmation-message');
    if (confirmationMessage) {
        confirmationMessage.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    }
}

// Show alert function (using common.js function)
function showAlert(message, type = 'info') {
    // Use common.js showAlert if available
    if (typeof window.showAlert === 'function') {
        window.showAlert(message, type);
    } else {
        // Fallback alert
        alert(message);
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        validateField,
        saveContactMessage,
        showConfirmationMessage
    };
}