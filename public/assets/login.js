'use strict';
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('password-toggle');
passwordToggle.addEventListener('click', () => {
    const showPassword = passwordInput.type === 'password';
    passwordInput.type = showPassword ? 'text' : 'password';
    passwordToggle.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password');
    passwordToggle.setAttribute('aria-pressed', String(showPassword));
    passwordToggle.innerHTML = '<span class="material-symbols-rounded">' + (showPassword ? 'visibility_off' : 'visibility') + '</span>';
});
document.getElementById('login-form').addEventListener('submit', () => {
    const signInButton = document.getElementById('sign-in-button');
    signInButton.disabled = true;
    signInButton.textContent = 'Signing in…';
});
window.addEventListener('pageshow', () => {
    const signInButton = document.getElementById('sign-in-button');
    signInButton.disabled = false;
    signInButton.innerHTML = '<span>Sign in</span><span class="material-symbols-rounded">arrow_forward</span>';
});
