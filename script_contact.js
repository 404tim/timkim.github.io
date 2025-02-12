document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');

    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            
            if (this.validity.valueMissing) {
                setError(this, 'This field is required');
            } else if (this.type === 'email' && this.validity.typeMismatch) {
                setError(this, 'Please enter a valid email address');
            } else if (this.id === 'phone' && this.validity.patternMismatch) {
                setError(this, 'Invalid phone format. Must start with + and country code');
            }
        });

        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                clearError(this);
            }
        });
    });

    function setError(input, message) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = message;
        } else {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = message;
            input.parentNode.insertBefore(error, input.nextSibling);
        }
        input.classList.add('invalid');
    }

    function clearError(input) {
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.remove();
        }
        input.classList.remove('invalid');
    }

    function validatePhone(phone) {
        const regex = /^\+[0-9]{1,3}[0-9]{7,14}$/;
        return regex.test(phone);
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    phoneInput.addEventListener('input', function() {
        if (this.value && !validatePhone(this.value)) {
            setError(this, 'Invalid format. Example: +1234567890');
        } else {
            clearError(this);
        }
    });

    emailInput.addEventListener('input', function() {
        if (this.value && !validateEmail(this.value)) {
            setError(this, 'Please enter a valid email address');
        } else {
            clearError(this);
        }
    });

    form.addEventListener('submit', function(e) {
        let isValid = true;

        document.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                setError(input, 'This field is required');
                isValid = false;
            }
        });

        if (phoneInput.value && !validatePhone(phoneInput.value)) {
            setError(phoneInput, 'Invalid phone format. Must start with + and country code');
            isValid = false;
        }

        if (emailInput.value && !validateEmail(emailInput.value)) {
            setError(emailInput, 'Invalid email format. Example: user@domain.com');
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
        }
    });
});
