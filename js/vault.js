import { VAULT_CONFIG } from './vault-config.js';

const { clientId, scope, folderName } = VAULT_CONFIG;
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

// ===== DOM =====
const loginPanel = document.getElementById('loginPanel');
const vaultPanel = document.getElementById('vaultPanel');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const loginError = document.getElementById('loginError');
const userInfo = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const progressLabel = document.getElementById('progressLabel');
const progressFill = document.getElementById('progressFill');
const fileList = document.getElementById('fileList');

// ===== STATE =====
let accessToken = null;
let folderId = null;
let tokenClient = null;

// ===== AUTH =====
function initTokenClient() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: scope,
    callback: handleTokenResponse,
  });
}

function handleTokenResponse(response) {
  if (response.error) {
    loginError.textContent = `Auth error: ${response.error}`;
    loginError.style.display = 'block';
    return;
  }
  accessToken = response.access_token;
  loginError.style.display = 'none';
  showVault();
}

async function showVault() {
  loginPanel.style.display = 'none';
  vaultPanel.classList.add('active');

  // Get user info
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = await res.json();
    userInfo.textContent = `Signed in as ${user.email}`;
  } catch {
    userInfo.textContent = 'Signed in';
  }

  // Find or create vault folder
  folderId = await getOrCreateFolder();
  loadFiles();
}

function showLogin() {
  loginPanel.style.display = 'block';
  vaultPanel.classList.remove('active');
}

// ===== GOOGLE SIGN IN =====
googleSignInBtn.addEventListener('click', () => {
  if (!tokenClient) {
    loginError.textContent = 'Google API still loading. Try again in a moment.';
    loginError.style.display = 'block';
    return;
  }
  tokenClient.requestAccessToken();
});

// ===== LOGOUT =====
logoutBtn.addEventListener('click', () => {
  if (accessToken) {
    google.accounts.oauth2.revoke(accessToken);
  }
  accessToken = null;
  folderId = null;
  showLogin();
});

// ===== FOLDER =====
async function getOrCreateFolder() {
  // Search for existing folder
  const q = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const res = await fetch(`${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();

  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }

  // Create folder
  const createRes = await fetch(`${DRIVE_API}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  const folder = await createRes.json();
  return folder.id;
}

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
  uploadProgress.classList.add('active');
  progressLabel.textContent = `Uploading: ${file.name}`;
  progressFill.style.width = '20%';

  try {
    // Multipart upload: metadata + file content
    const metadata = {
      name: file.name,
      parents: [folderId],
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    progressFill.style.width = '50%';

    const res = await fetch(`${UPLOAD_API}/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Upload failed');
    }

    const uploaded = await res.json();

    // Make file accessible via link
    await fetch(`${DRIVE_API}/files/${uploaded.id}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });

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

// ===== LOAD FILES =====
async function loadFiles() {
  try {
    if (!folderId) {
      fileList.innerHTML = '<p class="file-list-empty">No files uploaded yet.</p>';
      return;
    }

    const q = `'${folderId}' in parents and trashed=false`;
    const res = await fetch(
      `${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink,webContentLink,createdTime)&orderBy=createdTime desc&pageSize=100`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) throw new Error('Failed to load files');

    const data = await res.json();
    const files = data.files || [];

    if (files.length === 0) {
      fileList.innerHTML = '<p class="file-list-empty">No files uploaded yet.</p>';
      return;
    }

    fileList.innerHTML = '';

    for (const file of files) {
      const shareLink = `https://drive.google.com/uc?id=${file.id}&export=download`;

      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `
        <span class="file-name" title="${file.name}">${file.name}</span>
        <button class="btn-copy" data-url="${shareLink}">Copy Link</button>
        <button class="btn-delete" data-id="${file.id}">Delete</button>
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
          const res = await fetch(`${DRIVE_API}/files/${btn.dataset.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (!res.ok && res.status !== 204) throw new Error('Delete failed');
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
function waitForGoogleApi() {
  if (typeof google !== 'undefined' && google.accounts) {
    initTokenClient();
  } else {
    setTimeout(waitForGoogleApi, 100);
  }
}

showLogin();
waitForGoogleApi();
