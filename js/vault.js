import { VAULT_CONFIG } from './vault-config.js';

const API = 'https://api.github.com';
const { owner, repo, branch, uploadPath } = VAULT_CONFIG;

// ===== DOM =====
const loginPanel = document.getElementById('loginPanel');
const vaultPanel = document.getElementById('vaultPanel');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const tokenInput = document.getElementById('tokenInput');
const userInfo = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const progressLabel = document.getElementById('progressLabel');
const progressFill = document.getElementById('progressFill');
const fileList = document.getElementById('fileList');

// ===== AUTH (GitHub PAT stored in localStorage) =====
let token = localStorage.getItem('vault_token');

async function verifyToken(t) {
  const res = await fetch(`${API}/user`, {
    headers: { Authorization: `token ${t}` }
  });
  if (!res.ok) return null;
  return res.json();
}

async function init() {
  if (token) {
    const user = await verifyToken(token);
    if (user) {
      showVault(user);
    } else {
      localStorage.removeItem('vault_token');
      token = null;
      showLogin();
    }
  } else {
    showLogin();
  }
}

function showLogin() {
  loginPanel.style.display = 'block';
  vaultPanel.classList.remove('active');
}

function showVault(user) {
  loginPanel.style.display = 'none';
  vaultPanel.classList.add('active');
  userInfo.textContent = `Signed in as ${user.login}`;
  loadFiles();
}

// ===== LOGIN =====
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.style.display = 'none';
  const t = tokenInput.value.trim();

  if (!t) return;

  try {
    const user = await verifyToken(t);
    if (user) {
      token = t;
      localStorage.setItem('vault_token', t);
      showVault(user);
    } else {
      loginError.textContent = 'Invalid token. Check permissions.';
      loginError.style.display = 'block';
    }
  } catch (err) {
    loginError.textContent = `Error: ${err.message}`;
    loginError.style.display = 'block';
  }
});

// ===== LOGOUT =====
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('vault_token');
  token = null;
  showLogin();
});

// ===== UPLOAD =====
uploadZone.addEventListener('click', () => fileInput.click());

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
  handleFiles(e.target.files);
  fileInput.value = '';
});

function handleFiles(files) {
  for (const file of files) {
    uploadFile(file);
  }
}

async function uploadFile(file) {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `${timestamp}_${safeName}`;
  const path = `${uploadPath}/${fileName}`;

  uploadProgress.classList.add('active');
  progressLabel.textContent = `Uploading: ${file.name}`;
  progressFill.style.width = '30%';

  try {
    // Read file as base64
    const base64 = await fileToBase64(file);

    progressFill.style.width = '60%';

    // Upload via GitHub API
    const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `vault: upload ${safeName}`,
        content: base64,
        branch: branch,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Upload failed');
    }

    progressFill.style.width = '100%';
    progressLabel.textContent = `Uploaded: ${file.name}`;

    setTimeout(() => {
      uploadProgress.classList.remove('active');
      progressFill.style.width = '0%';
    }, 2000);

    loadFiles();
  } catch (err) {
    progressLabel.textContent = `Error: ${err.message}`;
    setTimeout(() => {
      uploadProgress.classList.remove('active');
      progressFill.style.width = '0%';
    }, 3000);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove the data:...;base64, prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ===== LOAD FILES =====
async function loadFiles() {
  try {
    const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${uploadPath}?ref=${branch}`, {
      headers: { Authorization: `token ${token}` }
    });

    if (res.status === 404) {
      fileList.innerHTML = '<p class="file-list-empty">No files uploaded yet.</p>';
      return;
    }

    if (!res.ok) throw new Error('Failed to load files');

    const files = await res.json();

    if (!Array.isArray(files) || files.length === 0) {
      fileList.innerHTML = '<p class="file-list-empty">No files uploaded yet.</p>';
      return;
    }

    // Sort newest first
    const sorted = files.sort((a, b) => b.name.localeCompare(a.name));

    fileList.innerHTML = '';

    for (const file of sorted) {
      const displayName = file.name.replace(/^\d+_/, '');
      // Raw URL for sharing
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${uploadPath}/${file.name}`;

      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `
        <span class="file-name" title="${displayName}">${displayName}</span>
        <button class="btn-copy" data-url="${rawUrl}">Copy Link</button>
        <button class="btn-delete" data-path="${file.path}" data-sha="${file.sha}">Delete</button>
      `;
      fileList.appendChild(item);
    }

    // Copy buttons
    fileList.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.url);
        } catch {
          const input = document.createElement('input');
          input.value = btn.dataset.url;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          input.remove();
        }
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy Link';
          btn.classList.remove('copied');
        }, 2000);
      });
    });

    // Delete buttons
    fileList.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this file?')) return;
        try {
          const res = await fetch(`${API}/repos/${owner}/${repo}/contents/${btn.dataset.path}`, {
            method: 'DELETE',
            headers: {
              Authorization: `token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `vault: delete file`,
              sha: btn.dataset.sha,
              branch: branch,
            }),
          });
          if (!res.ok) throw new Error('Delete failed');
          loadFiles();
        } catch (err) {
          alert('Error: ' + err.message);
        }
      });
    });

  } catch (err) {
    fileList.innerHTML = `<p class="file-list-empty">Error: ${err.message}</p>`;
  }
}

// ===== INIT =====
init();
