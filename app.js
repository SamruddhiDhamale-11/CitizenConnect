/* ============================================================
   CITIZEN CONNECT — Role-Based Application Logic
   Roles: Citizen | Politician | Admin (login only)
   ============================================================ */

'use strict';

// ---- State ----
let currentStep = 1;
let currentRole = ''; // 'citizen' | 'politician'

// ---- Step label maps per role ----
const STEP_LABELS = {
  citizen:    ['Personal', 'Location', 'Security'],
  politician: ['Personal', 'Political', 'Verify'],
};

// ---- Populate ward dropdown (1–40) ----
(function populateWards() {
  const wardSelect = document.getElementById('c-ward');
  for (let i = 1; i <= 40; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = 'Ward ' + i;
    wardSelect.appendChild(opt);
  }
})();

// ================================================================
// LOGIN — Role change handler
// ================================================================
function onLoginRoleChange() {
  const role = document.getElementById('loginRole').value;
  const adminNotice = document.getElementById('adminNotice');
  const registerLink = document.getElementById('registerLink');

  if (role === 'admin') {
    adminNotice.classList.remove('hidden');
    registerLink.classList.add('hidden');
  } else {
    adminNotice.classList.add('hidden');
    registerLink.classList.remove('hidden');
  }
}

// ================================================================
// VIEW SWITCHERS
// ================================================================
function showRegister() {
  // Must have a non-admin role selected on the login page first
  const loginRole = document.getElementById('loginRole').value;
  if (!loginRole) {
    showError('loginError', 'Please select a role before registering.');
    return;
  }
  if (loginRole === 'admin') {
    showError('loginError', 'Admin accounts cannot self-register.');
    return;
  }

  document.getElementById('loginCard').classList.add('hidden');
  document.getElementById('registerCard').classList.remove('hidden');
  document.getElementById('successCard').classList.add('hidden');

  // Carry the role over from login
  currentRole = loginRole;
  document.getElementById('regRole').value = loginRole;

  // Show the locked role banner, hide the dropdown
  const bannerIcon = { citizen: '👤', politician: '🏛️' };
  const bannerName = { citizen: 'Citizen', politician: 'Politician' };
  document.getElementById('roleBannerIcon').textContent = bannerIcon[loginRole] || '👤';
  document.getElementById('roleBannerName').textContent = bannerName[loginRole] || loginRole;
  document.getElementById('roleBanner').classList.remove('hidden');
  document.getElementById('regRoleGroup').classList.add('hidden');

  // Update step labels and show step 1
  if (STEP_LABELS[loginRole]) {
    STEP_LABELS[loginRole].forEach((label, i) => {
      const el = document.getElementById('stepLabel' + (i + 1));
      if (el) el.textContent = label;
    });
  }
  currentStep = 1;
  resetRegisterFormFields();
  showStepPanel(1);
  updateStepIndicator(1);
}

function showLogin() {
  document.getElementById('registerCard').classList.add('hidden');
  document.getElementById('successCard').classList.add('hidden');
  document.getElementById('loginCard').classList.remove('hidden');
  // Reset banner state for next time
  document.getElementById('roleBanner').classList.add('hidden');
  document.getElementById('regRoleGroup').classList.add('hidden');
  currentRole = '';
}

function showSuccess() {
  document.getElementById('registerCard').classList.add('hidden');
  document.getElementById('loginCard').classList.add('hidden');
  const card = document.getElementById('successCard');
  card.classList.remove('hidden');

  setTimeout(() => {
    document.getElementById('progressBar').style.width = '100%';
  }, 100);

  setTimeout(() => {
    alert('Redirecting to dashboard... (Demo: no backend connected)');
    showLogin();
  }, 4600);
}

// ================================================================
// REGISTER — Role change handler
// Switches which step panels are visible and resets to step 1
// ================================================================
function onRoleChange() {
  const role = document.getElementById('regRole').value;
  currentRole = role;

  // Hide all step panels
  hideAllStepPanels();

  if (!role) {
    updateStepIndicator(1);
    return;
  }

  // Update step labels for the selected role
  if (STEP_LABELS[role]) {
    STEP_LABELS[role].forEach((label, i) => {
      const el = document.getElementById('stepLabel' + (i + 1));
      if (el) el.textContent = label;
    });
  }

  // Show step 1 for the selected role
  currentStep = 1;
  showStepPanel(1);
  updateStepIndicator(1);

  // Clear all errors
  ['step1Error-citizen', 'step1Error-politician',
   'step2Error-citizen', 'step2Error-politician',
   'step3Error-citizen', 'step3Error-politician'].forEach(id => clearError(id));
}

// ================================================================
// STEP PANEL HELPERS
// ================================================================
function hideAllStepPanels() {
  const panels = document.querySelectorAll('.step-panel');
  panels.forEach(p => p.classList.add('hidden'));
}

function showStepPanel(step) {
  if (!currentRole) return;
  const panelId = 'step' + step + '-' + currentRole;
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.remove('hidden');
    // Re-trigger animation
    panel.style.animation = 'none';
    panel.offsetHeight; // reflow
    panel.style.animation = '';
  }
}

// ================================================================
// STEP NAVIGATION
// ================================================================
function nextStep(from) {
  if (!currentRole) {
    showError('step' + from + 'Error', 'Please select a role before proceeding.');
    return;
  }
  if (!validateStep(from)) return;

  const next = from + 1;
  hideAllStepPanels();
  showStepPanel(next);
  currentStep = next;
  updateStepIndicator(next);

  // Scroll card into view smoothly
  document.getElementById('registerCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function prevStep(from) {
  const prev = from - 1;
  hideAllStepPanels();
  showStepPanel(prev);
  currentStep = prev;
  updateStepIndicator(prev);
  document.getElementById('registerCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateStepIndicator(active) {
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById('stepDot' + i);
    dot.classList.remove('active', 'completed', 'inactive');
    if (i < active)       dot.classList.add('completed');
    else if (i === active) dot.classList.add('active');
    else                   dot.classList.add('inactive');
  }
  for (let i = 1; i <= 2; i++) {
    const line = document.getElementById('stepLine' + i);
    i < active ? line.classList.add('completed') : line.classList.remove('completed');
  }
}

// ================================================================
// WARD QUESTION — update label when ward dropdown changes
// ================================================================
function updateWardQuestion() {
  const ward = document.getElementById('c-ward').value;
  const label = document.getElementById('wardConfirmLabel');
  if (ward) {
    label.innerHTML = '<strong>Are you from Ward ' + ward + '?</strong> <span class="req">*</span>';
    // Reset confirmation when ward changes
    document.querySelectorAll('input[name="wardConfirm"]').forEach(r => r.checked = false);
  } else {
    label.innerHTML = '<strong>Are you from this ward?</strong> <span class="req">*</span>';
  }
}

function onWardConfirmChange(radio) {
  if (radio.value === 'no') {
    // Reset ward selection so user picks again
    document.getElementById('c-ward').value = '';
    document.querySelectorAll('input[name="wardConfirm"]').forEach(r => r.checked = false);
    document.getElementById('wardConfirmLabel').innerHTML = '<strong>Are you from this ward?</strong> <span class="req">*</span>';
  }
}
function toggleOtherInput(radio) {
  const group = document.getElementById('otherResidentGroup');
  if (radio.value === 'other' && radio.checked) {
    group.classList.remove('hidden');
  } else {
    group.classList.add('hidden');
  }
}

// Also hide when another radio is selected
document.addEventListener('change', function (e) {
  if (e.target.name === 'residentType' && e.target.value !== 'other') {
    document.getElementById('otherResidentGroup').classList.add('hidden');
    document.getElementById('c-otherResident').value = '';
  }
});

// ================================================================
// VALIDATION
// ================================================================
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
}

function clearError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '';
  el.classList.remove('visible');
}

// Returns the correct error element ID for the current role + step
function errId(step) {
  return 'step' + step + 'Error-' + (currentRole || 'citizen');
}

function validateStep(step) {
  clearError(errId(step));

  // ---- STEP 1 ----
  if (step === 1) {
    if (currentRole === 'citizen') {
      const firstName = document.getElementById('c-firstName').value.trim();
      const lastName  = document.getElementById('c-lastName').value.trim();
      const dob       = document.getElementById('c-dob').value;
      const gender    = document.getElementById('c-gender').value;
      const mobile    = document.getElementById('c-mobile').value.trim();
      const email     = document.getElementById('c-email').value.trim();

      if (!firstName || !lastName || !dob || !gender || !mobile || !email) {
        showError(errId(1), 'Please fill all required fields before proceeding.');
        return false;
      }
      if (!/^\d{10}$/.test(mobile)) {
        showError(errId(1), 'Mobile number must be exactly 10 digits.');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(errId(1), 'Please enter a valid email address.');
        return false;
      }
    }

    if (currentRole === 'politician') {
      const firstName = document.getElementById('p-firstName').value.trim();
      const lastName  = document.getElementById('p-lastName').value.trim();
      const ageVal    = document.getElementById('p-age').value.trim();
      const age       = parseInt(ageVal, 10);
      const mobile    = document.getElementById('p-mobile').value.trim();
      const email     = document.getElementById('p-email').value.trim();
      const address   = document.getElementById('p-address').value.trim();

      if (!firstName || !lastName || !ageVal || !mobile || !email || !address) {
        showError(errId(1), 'Please fill all required fields before proceeding.');
        return false;
      }
      if (isNaN(age) || age < 25) {
        showError(errId(1), 'Age must be at least 25 years to register as a Politician.');
        return false;
      }
      if (!/^\d{10}$/.test(mobile)) {
        showError(errId(1), 'Mobile number must be exactly 10 digits.');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(errId(1), 'Please enter a valid email address.');
        return false;
      }
    }

    return true;
  }

  // ---- STEP 2 ----
  if (step === 2) {
    if (currentRole === 'citizen') {
      const ward         = document.getElementById('c-ward').value;
      const wardConfirm  = document.querySelector('input[name="wardConfirm"]:checked');
      const residentType = document.querySelector('input[name="residentType"]:checked');

      if (!ward) {
        showError(errId(2), 'Please select your ward number.');
        return false;
      }
      if (!wardConfirm) {
        showError(errId(2), 'Please confirm whether you belong to Ward ' + ward + '.');
        return false;
      }
      if (!residentType) {
        showError(errId(2), 'Please select your residency type.');
        return false;
      }
      if (residentType.value === 'other') {
        const otherText = document.getElementById('c-otherResident').value.trim();
        if (!otherText) {
          showError(errId(2), 'Please specify your residency type.');
          return false;
        }
      }
    }

    if (currentRole === 'politician') {
      const jurisdiction = document.getElementById('p-jurisdiction').value;
      const wardNumber   = document.getElementById('p-wardNumber').value.trim();
      const wardName     = document.getElementById('p-wardName').value.trim();
      const position     = document.getElementById('p-position').value;

      if (!jurisdiction || !wardNumber || !wardName || !position) {
        showError(errId(2), 'Please fill all required fields before proceeding.');
        return false;
      }
    }

    return true;
  }

  return true;
}

// ================================================================
// SUBMIT REGISTRATION
// ================================================================
function submitRegistration() {
  const e3 = errId(3);
  clearError(e3);

  if (!currentRole) {
    showError(e3, 'Please select a role before registering.');
    return;
  }

  const pwdId     = currentRole === 'citizen' ? 'c-password'        : 'p-password';
  const confirmId = currentRole === 'citizen' ? 'c-confirmPassword' : 'p-confirmPassword';
  const termsId   = currentRole === 'citizen' ? 'c-acceptTerms'     : 'p-acceptTerms';

  const password = document.getElementById(pwdId).value;
  const confirm  = document.getElementById(confirmId).value;
  const terms    = document.getElementById(termsId).checked;

  if (!password || !confirm) {
    showError(e3, 'Please fill all required fields before proceeding.');
    return;
  }
  if (password.length < 6) {
    showError(e3, 'Password must be at least 6 characters long.');
    return;
  }
  if (password !== confirm) {
    showError(e3, 'Passwords do not match. Please re-enter.');
    return;
  }

  // Politician: ID proof required
  if (currentRole === 'politician') {
    const idProof = document.getElementById('p-idProof');
    if (!idProof.files || idProof.files.length === 0) {
      showError(e3, 'Please upload your ID proof document.');
      return;
    }
    const file = idProof.files[0];
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      showError(e3, 'Invalid file type. Please upload a PDF, JPG, or PNG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError(e3, 'File size must not exceed 5 MB.');
      return;
    }
  }

  if (!terms) {
    showError(e3, 'You must accept the Terms & Conditions to register.');
    return;
  }

  showSuccess();
}

// ================================================================
// LOGIN FORM SUBMIT
// ================================================================
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  clearError('loginError');

  const role     = document.getElementById('loginRole').value;
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!role) {
    showError('loginError', 'Please select a role before logging in.');
    return;
  }
  if (!email || !password) {
    showError('loginError', 'Please fill all required fields before proceeding.');
    return;
  }

  // Demo: redirect to role-specific dashboard
  if (role === 'citizen') {
    window.location.href = 'dashboard.html';
  } else if (role === 'politician') {
    window.location.href = 'politician.html';
  } else {
    alert('Login successful! (Demo mode — Admin dashboard coming soon)');
  }
});

// ================================================================
// PASSWORD TOGGLE
// ================================================================
function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    icon.textContent = '🙈';
  } else {
    input.type = 'password';
    icon.textContent = '👁';
  }
}

// ================================================================
// PASSWORD STRENGTH — works for both citizen and politician fields
// ================================================================
function checkStrength(val, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  if (!val) { el.textContent = ''; el.style.color = ''; return; }

  let score = 0;
  if (val.length >= 6)           score++;
  if (val.length >= 10)          score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val))  score++;

  const levels = [
    { label: 'Very Weak',   color: '#c0392b' },
    { label: 'Weak',        color: '#e67e22' },
    { label: 'Fair',        color: '#d4a017' },
    { label: 'Strong',      color: '#27ae60' },
    { label: 'Very Strong', color: '#1a8a3a' },
  ];
  const level = levels[Math.min(score, 4)];
  el.textContent = 'Strength: ' + level.label;
  el.style.color = level.color;
}

document.getElementById('c-password').addEventListener('input', function () {
  checkStrength(this.value, 'pwStrength');
});
document.getElementById('p-password').addEventListener('input', function () {
  checkStrength(this.value, 'pwStrengthP');
});

// ================================================================
// RESET REGISTER FORM — fields only (called when entering register card)
// ================================================================
function resetRegisterFormFields() {
  // Clear citizen fields
  ['c-firstName', 'c-middleName', 'c-lastName', 'c-dob', 'c-mobile', 'c-email', 'c-otherResident'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const cGender = document.getElementById('c-gender');
  if (cGender) cGender.value = '';
  const cWard = document.getElementById('c-ward');
  if (cWard) cWard.value = '';
  document.querySelectorAll('input[name="wardConfirm"]').forEach(r => r.checked = false);
  document.querySelectorAll('input[name="residentType"]').forEach(r => r.checked = false);
  document.getElementById('otherResidentGroup').classList.add('hidden');
  // Reset ward confirm label
  const wcLabel = document.getElementById('wardConfirmLabel');
  if (wcLabel) wcLabel.innerHTML = '<strong>Are you from this ward?</strong> <span class="req">*</span>';
  const cPwd = document.getElementById('c-password');
  if (cPwd) cPwd.value = '';
  const cConf = document.getElementById('c-confirmPassword');
  if (cConf) cConf.value = '';
  const cTerms = document.getElementById('c-acceptTerms');
  if (cTerms) cTerms.checked = false;
  const pwStr = document.getElementById('pwStrength');
  if (pwStr) { pwStr.textContent = ''; pwStr.style.color = ''; }

  // Clear politician fields
  ['p-firstName', 'p-middleName', 'p-lastName', 'p-age', 'p-mobile', 'p-email', 'p-address',
   'p-wardNumber', 'p-wardName'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const pJuris = document.getElementById('p-jurisdiction');
  if (pJuris) pJuris.value = '';
  const pPos = document.getElementById('p-position');
  if (pPos) pPos.value = '';
  const pPwd = document.getElementById('p-password');
  if (pPwd) pPwd.value = '';
  const pConf = document.getElementById('p-confirmPassword');
  if (pConf) pConf.value = '';
  const pTerms = document.getElementById('p-acceptTerms');
  if (pTerms) pTerms.checked = false;
  const pIdProof = document.getElementById('p-idProof');
  if (pIdProof) pIdProof.value = '';
  const pwStrP = document.getElementById('pwStrengthP');
  if (pwStrP) { pwStrP.textContent = ''; pwStrP.style.color = ''; }

  // Hide all step panels
  hideAllStepPanels();

  // Clear all errors
  ['step1Error-citizen', 'step1Error-politician',
   'step2Error-citizen', 'step2Error-politician',
   'step3Error-citizen', 'step3Error-politician'].forEach(id => clearError(id));
}

// ================================================================
// RESET REGISTER FORM — full reset (called after success redirect)
// ================================================================
function resetRegisterForm() {
  currentRole = '';
  document.getElementById('regRole').value = '';
  document.getElementById('roleBanner').classList.add('hidden');
  document.getElementById('regRoleGroup').classList.add('hidden');

  // Reset step labels to defaults
  ['Personal', 'Details', 'Security'].forEach((label, i) => {
    const el = document.getElementById('stepLabel' + (i + 1));
    if (el) el.textContent = label;
  });

  resetRegisterFormFields();

  // Reset step indicator
  updateStepIndicator(1);

  // Reset progress bar
  const bar = document.getElementById('progressBar');
  bar.style.transition = 'none';
  bar.style.width = '0%';
  setTimeout(() => { bar.style.transition = 'width 4s linear'; }, 50);
}
