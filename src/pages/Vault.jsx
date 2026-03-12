import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const CLIENT_ID = '625446478311-h8lgj1nvi6bs7c40p0rn8i8ugia7gr1r.apps.googleusercontent.com';
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const FOLDER_NAME = 'CuboholicVault';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

export default function Vault() {
  const [accessToken, setAccessToken] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadLabel, setUploadLabel] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragover, setDragover] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const folderIdRef = useRef(null);
  const tokenClientRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load Google Identity Services script
  useEffect(() => {
    if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      initTokenClient();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => initTokenClient();
    document.head.appendChild(script);
  }, []);

  function initTokenClient() {
    const wait = () => {
      if (typeof google !== 'undefined' && google.accounts) {
        tokenClientRef.current = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          callback: handleTokenResponse,
        });
      } else {
        setTimeout(wait, 100);
      }
    };
    wait();
  }

  function handleTokenResponse(response) {
    if (response.error) {
      setError(`Auth error: ${response.error}`);
      return;
    }
    setError('');
    setAccessToken(response.access_token);
  }

  // When we get a token, fetch user info and files
  useEffect(() => {
    if (!accessToken) return;

    (async () => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = await res.json();
        setUserEmail(user.email || 'Signed in');
      } catch {
        setUserEmail('Signed in');
      }

      folderIdRef.current = await getOrCreateFolder(accessToken);
      loadFiles(accessToken, folderIdRef.current);
    })();
  }, [accessToken]);

  async function getOrCreateFolder(token) {
    const q = `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    const res = await fetch(`${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id,name)`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.files && data.files.length > 0) return data.files[0].id;

    const createRes = await fetch(`${DRIVE_API}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' }),
    });
    const folder = await createRes.json();
    return folder.id;
  }

  const loadFiles = useCallback(async (token, fId) => {
    const t = token || accessToken;
    const f = fId || folderIdRef.current;
    if (!f) { setFiles([]); return; }

    const q = `'${f}' in parents and trashed=false`;
    const res = await fetch(
      `${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id,name,webViewLink,webContentLink,createdTime)&orderBy=createdTime desc&pageSize=100`,
      { headers: { Authorization: `Bearer ${t}` } }
    );
    if (!res.ok) return;
    const data = await res.json();
    setFiles(data.files || []);
  }, [accessToken]);

  function handleSignIn() {
    if (!tokenClientRef.current) {
      setError('Google API still loading. Try again in a moment.');
      return;
    }
    tokenClientRef.current.requestAccessToken();
  }

  function handleSignOut() {
    if (accessToken) google.accounts.oauth2.revoke(accessToken);
    setAccessToken(null);
    folderIdRef.current = null;
    setUserEmail('');
    setFiles([]);
  }

  async function uploadFile(file) {
    setUploading(true);
    setUploadLabel(`Uploading: ${file.name}`);
    setUploadProgress(20);

    try {
      const metadata = { name: file.name, parents: [folderIdRef.current] };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      setUploadProgress(50);

      const res = await fetch(
        `${UPLOAD_API}/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink`,
        { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: form }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Upload failed');
      }

      const uploaded = await res.json();

      await fetch(`${DRIVE_API}/files/${uploaded.id}/permissions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'reader', type: 'anyone' }),
      });

      setUploadProgress(100);
      setUploadLabel(`Uploaded: ${file.name}`);
      setTimeout(() => { setUploading(false); setUploadProgress(0); }, 2000);
      loadFiles();
    } catch (err) {
      setUploadLabel(`Error: ${err.message}`);
      setTimeout(() => { setUploading(false); setUploadProgress(0); }, 3000);
    }
  }

  function handleFiles(fileList) {
    for (const file of fileList) uploadFile(file);
  }

  async function handleCopy(fileId) {
    const url = `https://drive.google.com/uc?id=${fileId}&export=download`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    setCopiedId(fileId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleDelete(fileId) {
    if (!confirm('Delete this file?')) return;
    try {
      const res = await fetch(`${DRIVE_API}/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      loadFiles();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  const isLoggedIn = !!accessToken;

  return (
    <div className="vault-page">
      <div className="vault-container">
        <Link to="/" className="vault-back">&larr; Back to portfolio</Link>

        <div className="vault-header">
          <h1>Private Vault</h1>
          <p>Upload files to Google Drive and get shareable links.</p>
        </div>

        {!isLoggedIn ? (
          <div id="loginPanel">
            <div className="login-box">
              <h2>Sign In</h2>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '20px', lineHeight: '1.6' }}>
                Sign in with your Google account to access the vault.
              </p>
              <button type="button" className="submit-btn" onClick={handleSignIn}>
                Sign in with Google &rarr;
              </button>
              {error && <p className="login-error" style={{ display: 'block' }}>{error}</p>}
            </div>
          </div>
        ) : (
          <div className="vault-panel active">
            <div className="vault-toolbar">
              <span>Signed in as {userEmail}</span>
              <button className="btn-logout" onClick={handleSignOut}>Sign Out</button>
            </div>

            <div
              className={`upload-zone${dragover ? ' dragover' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={(e) => { e.preventDefault(); setDragover(false); handleFiles(e.dataTransfer.files); }}
            >
              <div className="upload-icon">&#128193;</div>
              <p>Drop files here or click to browse</p>
              <input
                type="file"
                className="upload-input"
                ref={fileInputRef}
                multiple
                onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
              />
            </div>

            {uploading && (
              <div className="upload-progress active">
                <div className="progress-label">{uploadLabel}</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}

            <div className="file-list">
              <h3>Uploaded Files</h3>
              {files.length === 0 ? (
                <p className="file-list-empty">No files uploaded yet.</p>
              ) : (
                files.map((file) => (
                  <div className="file-item" key={file.id}>
                    <span className="file-name" title={file.name}>{file.name}</span>
                    <button
                      className={`btn-copy${copiedId === file.id ? ' copied' : ''}`}
                      onClick={() => handleCopy(file.id)}
                    >
                      {copiedId === file.id ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(file.id)}>Delete</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
