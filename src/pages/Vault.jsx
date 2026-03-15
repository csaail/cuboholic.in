import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const CLIENT_ID = '625446478311-h8lgj1nvi6bs7c40p0rn8i8ugia7gr1r.apps.googleusercontent.com';
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const ROOT_FOLDER_NAME = 'CuboholicVault';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

const FILE_ICONS = {
  'application/pdf': { icon: '📄', color: '#e05050' },
  'image/': { icon: '🖼️', color: '#50a0e0' },
  'video/': { icon: '🎬', color: '#a050e0' },
  'audio/': { icon: '🎵', color: '#e0a050' },
  'application/zip': { icon: '📦', color: '#50e0a0' },
  'application/x-rar': { icon: '📦', color: '#50e0a0' },
  'text/': { icon: '📝', color: '#999' },
  'application/json': { icon: '{ }', color: '#e0e050' },
  'application/vnd.google-apps.folder': { icon: '📁', color: '#f0c050' },
  default: { icon: '📎', color: '#666' },
};

function getFileIcon(mimeType) {
  if (!mimeType) return FILE_ICONS.default;
  for (const [key, val] of Object.entries(FILE_ICONS)) {
    if (key !== 'default' && mimeType.startsWith(key)) return val;
  }
  return FILE_ICONS.default;
}

function formatSize(bytes) {
  if (!bytes || bytes === '0') return '—';
  const b = parseInt(bytes, 10);
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  if (b < 1024 * 1024 * 1024) return (b / (1024 * 1024)).toFixed(1) + ' MB';
  return (b / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function getExtension(name) {
  if (!name) return '';
  const parts = name.split('.');
  return parts.length > 1 ? parts.pop().toUpperCase() : '';
}

export default function Vault() {
  const [accessToken, setAccessToken] = useState(() => {
    const saved = sessionStorage.getItem('vault_token');
    const expiry = sessionStorage.getItem('vault_token_expiry');
    if (saved && expiry && Date.now() < parseInt(expiry, 10)) return saved;
    sessionStorage.removeItem('vault_token');
    sessionStorage.removeItem('vault_token_expiry');
    return null;
  });
  const [userEmail, setUserEmail] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [dragover, setDragover] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [folderPath, setFolderPath] = useState([]);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [toast, setToast] = useState(null);
  const [storageUsed, setStorageUsed] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);

  const rootFolderIdRef = useRef(null);
  const tokenClientRef = useRef(null);
  const fileInputRef = useRef(null);
  const renameInputRef = useRef(null);

  // Toast helper
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Current folder ID
  const currentFolderId = folderPath.length > 0
    ? folderPath[folderPath.length - 1].id
    : rootFolderIdRef.current;

  // Load Google Identity Services
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
    // Token typically lasts ~1 hour, store with expiry
    sessionStorage.setItem('vault_token', response.access_token);
    sessionStorage.setItem('vault_token_expiry', String(Date.now() + (response.expires_in || 3600) * 1000));
  }

  // On token, load user info + root folder
  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const user = await res.json();
        setUserEmail(user.email || 'Signed in');
        setUserPhoto(user.picture || '');
      } catch {
        setUserEmail('Signed in');
      }

      // Get storage info
      try {
        const aboutRes = await fetch(`${DRIVE_API}/about?fields=storageQuota`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const about = await aboutRes.json();
        if (about.storageQuota) setStorageUsed(about.storageQuota);
      } catch { /* ignore */ }

      rootFolderIdRef.current = await getOrCreateFolder(accessToken, ROOT_FOLDER_NAME, null);
      setFolderPath([]);
      loadItems(accessToken, rootFolderIdRef.current);
    })();
  }, [accessToken]);

  async function getOrCreateFolder(token, name, parentId) {
    let q = `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    if (parentId) q += ` and '${parentId}' in parents`;
    const res = await fetch(`${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id,name)`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.files && data.files.length > 0) return data.files[0].id;

    const body = { name, mimeType: 'application/vnd.google-apps.folder' };
    if (parentId) body.parents = [parentId];
    const createRes = await fetch(`${DRIVE_API}/files`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const folder = await createRes.json();
    return folder.id;
  }

  const loadItems = useCallback(async (token, fId) => {
    const t = token || accessToken;
    const f = fId || currentFolderId;
    if (!f) { setItems([]); return; }

    setLoading(true);
    const q = `'${f}' in parents and trashed=false`;
    const res = await fetch(
      `${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,size,createdTime,modifiedTime,webViewLink,webContentLink,iconLink)&orderBy=folder,modifiedTime desc&pageSize=200`,
      { headers: { Authorization: `Bearer ${t}` } }
    );
    setLoading(false);
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.files || []);
  }, [accessToken, currentFolderId]);

  function handleSignIn() {
    if (!tokenClientRef.current) {
      setError('Google API still loading. Try again in a moment.');
      return;
    }
    tokenClientRef.current.requestAccessToken();
  }

  function handleSignOut() {
    if (accessToken) google.accounts.oauth2.revoke(accessToken);
    sessionStorage.removeItem('vault_token');
    sessionStorage.removeItem('vault_token_expiry');
    setAccessToken(null);
    rootFolderIdRef.current = null;
    setUserEmail('');
    setUserPhoto('');
    setItems([]);
    setFolderPath([]);
    setStorageUsed(null);
  }

  // Navigate into folder
  function openFolder(folder) {
    setFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
    setSearchQuery('');
    loadItems(null, folder.id);
  }

  // Navigate to breadcrumb
  function navigateTo(index) {
    if (index === -1) {
      setFolderPath([]);
      loadItems(null, rootFolderIdRef.current);
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      loadItems(null, newPath[newPath.length - 1].id);
    }
    setSearchQuery('');
  }

  // Create new folder
  async function createFolder() {
    if (!newFolderName.trim()) return;
    try {
      const parentId = currentFolderId;
      const res = await fetch(`${DRIVE_API}/files`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName.trim(),
          mimeType: 'application/vnd.google-apps.folder',
          parents: [parentId],
        }),
      });
      if (!res.ok) throw new Error('Failed to create folder');
      setNewFolderName('');
      setShowNewFolder(false);
      showToast(`Folder "${newFolderName.trim()}" created`);
      loadItems();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Rename
  async function handleRename(fileId) {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    try {
      const res = await fetch(`${DRIVE_API}/files/${fileId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renameValue.trim() }),
      });
      if (!res.ok) throw new Error('Rename failed');
      setRenamingId(null);
      showToast('Renamed successfully');
      loadItems();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Move file to folder (drag & drop)
  async function moveToFolder(fileId, fileName, targetFolderId, targetFolderName) {
    try {
      // Get current parents to remove
      const infoRes = await fetch(`${DRIVE_API}/files/${fileId}?fields=parents`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const info = await infoRes.json();
      const removeParents = (info.parents || []).join(',');

      const res = await fetch(
        `${DRIVE_API}/files/${fileId}?addParents=${targetFolderId}&removeParents=${removeParents}`,
        { method: 'PATCH', headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!res.ok) throw new Error('Move failed');
      showToast(`Moved "${fileName}" to ${targetFolderName}`);
      loadItems();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Drag handlers for moving items into folders
  function handleItemDragStart(e, item) {
    setDraggingItem(item);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleFolderDragOver(e, folderId) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetId(folderId);
  }

  function handleFolderDragLeave(e) {
    e.preventDefault();
    setDropTargetId(null);
  }

  function handleFolderDrop(e, targetFolder) {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetId(null);
    const fileId = e.dataTransfer.getData('text/plain');
    if (!fileId || fileId === targetFolder.id) return;
    const item = items.find((i) => i.id === fileId);
    if (!item) return;
    moveToFolder(fileId, item.name, targetFolder.id, targetFolder.name);
    setDraggingItem(null);
  }

  function handleItemDragEnd() {
    setDraggingItem(null);
    setDropTargetId(null);
  }

  // Move to parent (breadcrumb drop)
  function handleBreadcrumbDrop(e, targetFolderId) {
    e.preventDefault();
    const fileId = e.dataTransfer.getData('text/plain');
    if (!fileId) return;
    const item = items.find((i) => i.id === fileId);
    if (!item) return;
    const name = targetFolderId === rootFolderIdRef.current ? 'Vault' : folderPath.find((f) => f.id === targetFolderId)?.name || 'folder';
    moveToFolder(fileId, item.name, targetFolderId, name);
    setDraggingItem(null);
    setDropTargetId(null);
  }

  // Upload
  async function uploadFile(file) {
    const uploadId = Date.now() + Math.random();
    setUploads((prev) => [...prev, { id: uploadId, name: file.name, progress: 0, status: 'uploading' }]);

    try {
      const metadata = { name: file.name, parents: [currentFolderId] };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      setUploads((prev) => prev.map((u) => u.id === uploadId ? { ...u, progress: 50 } : u));

      const res = await fetch(
        `${UPLOAD_API}/files?uploadType=multipart&fields=id,name`,
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

      setUploads((prev) => prev.map((u) => u.id === uploadId ? { ...u, progress: 100, status: 'done' } : u));
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.id !== uploadId));
      }, 2000);
      loadItems();
    } catch (err) {
      setUploads((prev) => prev.map((u) => u.id === uploadId ? { ...u, progress: 0, status: 'error', error: err.message } : u));
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.id !== uploadId));
      }, 4000);
    }
  }

  function handleFileInput(fileList) {
    for (const file of fileList) uploadFile(file);
  }

  // Copy link
  async function handleCopy(fileId) {
    const url = `https://drive.google.com/uc?id=${fileId}&export=download`;
    try { await navigator.clipboard.writeText(url); }
    catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    setCopiedId(fileId);
    showToast('Link copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Delete
  async function handleDelete(item) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      const res = await fetch(`${DRIVE_API}/files/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      showToast(`"${item.name}" deleted`);
      loadItems();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Filter & sort
  const isFolder = (item) => item.mimeType === 'application/vnd.google-apps.folder';
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    // Folders first
    if (isFolder(a) && !isFolder(b)) return -1;
    if (!isFolder(a) && isFolder(b)) return 1;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'size') return (parseInt(b.size) || 0) - (parseInt(a.size) || 0);
    return new Date(b.modifiedTime) - new Date(a.modifiedTime);
  });

  const totalFiles = items.filter((i) => !isFolder(i)).length;
  const totalFolders = items.filter((i) => isFolder(i)).length;

  const isLoggedIn = !!accessToken;

  return (
    <div className="vault-page">
      {/* Toast */}
      {toast && (
        <div className={`v-toast v-toast--${toast.type}`}>
          {toast.type === 'error' ? '✕' : '✓'} {toast.message}
        </div>
      )}

      <div className="vault-container">
        <Link to="/" className="vault-back">&larr; Back to portfolio</Link>

        <div className="vault-header">
          <h1>Vault</h1>
          <p>Your private cloud storage powered by Google Drive.</p>
        </div>

        {!isLoggedIn ? (
          <div className="v-login">
            <div className="v-login-box">
              <div className="v-login-icon">🔐</div>
              <h2>Welcome to Vault</h2>
              <p>Sign in with Google to upload files, create folders, and generate shareable links.</p>
              <button type="button" className="v-btn v-btn--primary v-btn--lg" onClick={handleSignIn}>
                <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Sign in with Google
              </button>
              {error && <p className="v-error">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="v-main">
            {/* Toolbar */}
            <div className="v-toolbar">
              <div className="v-user">
                {userPhoto && <img src={userPhoto} alt="" className="v-avatar" referrerPolicy="no-referrer" />}
                <span className="v-user-email">{userEmail}</span>
              </div>
              <button className="v-btn v-btn--danger v-btn--sm" onClick={handleSignOut}>Sign Out</button>
            </div>

            {/* Storage bar */}
            {storageUsed && (
              <div className="v-storage">
                <div className="v-storage-bar">
                  <div
                    className="v-storage-fill"
                    style={{ width: `${Math.min((parseInt(storageUsed.usage) / parseInt(storageUsed.limit)) * 100, 100)}%` }}
                  />
                </div>
                <span className="v-storage-text">
                  {formatSize(storageUsed.usage)} of {formatSize(storageUsed.limit)} used
                </span>
              </div>
            )}

            {/* Breadcrumb */}
            <div className="v-breadcrumb">
              <button
                className={`v-breadcrumb-item${dropTargetId === rootFolderIdRef.current ? ' v-drop-active' : ''}`}
                onClick={() => navigateTo(-1)}
                onDragOver={(e) => { e.preventDefault(); setDropTargetId(rootFolderIdRef.current); }}
                onDragLeave={() => setDropTargetId(null)}
                onDrop={(e) => handleBreadcrumbDrop(e, rootFolderIdRef.current)}
              >
                Vault
              </button>
              {folderPath.map((folder, i) => (
                <span key={folder.id}>
                  <span className="v-breadcrumb-sep">/</span>
                  <button
                    className={`v-breadcrumb-item${dropTargetId === folder.id ? ' v-drop-active' : ''}`}
                    onClick={() => navigateTo(i)}
                    onDragOver={(e) => { e.preventDefault(); setDropTargetId(folder.id); }}
                    onDragLeave={() => setDropTargetId(null)}
                    onDrop={(e) => handleBreadcrumbDrop(e, folder.id)}
                  >
                    {folder.name}
                  </button>
                </span>
              ))}
            </div>

            {/* Actions bar */}
            <div className="v-actions">
              <div className="v-actions-left">
                <button className="v-btn v-btn--primary v-btn--sm" onClick={() => fileInputRef.current?.click()}>
                  ↑ Upload
                </button>
                <button className="v-btn v-btn--ghost v-btn--sm" onClick={() => { setShowNewFolder(true); setTimeout(() => document.querySelector('.v-newfolder-input')?.focus(), 50); }}>
                  + New Folder
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => { handleFileInput(e.target.files); e.target.value = ''; }}
                />
              </div>
              <div className="v-actions-right">
                <div className="v-search">
                  <span className="v-search-icon">⌕</span>
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="v-search-input"
                  />
                  {searchQuery && (
                    <button className="v-search-clear" onClick={() => setSearchQuery('')}>✕</button>
                  )}
                </div>
                <select className="v-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="date">Recent</option>
                  <option value="name">Name</option>
                  <option value="size">Size</option>
                </select>
                <div className="v-view-toggle">
                  <button
                    className={`v-view-btn${viewMode === 'list' ? ' active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List view"
                  >☰</button>
                  <button
                    className={`v-view-btn${viewMode === 'grid' ? ' active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                  >▦</button>
                </div>
              </div>
            </div>

            {/* New folder input */}
            {showNewFolder && (
              <div className="v-newfolder">
                <span className="v-newfolder-icon">📁</span>
                <input
                  className="v-newfolder-input"
                  type="text"
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') createFolder(); if (e.key === 'Escape') setShowNewFolder(false); }}
                />
                <button className="v-btn v-btn--primary v-btn--xs" onClick={createFolder}>Create</button>
                <button className="v-btn v-btn--ghost v-btn--xs" onClick={() => setShowNewFolder(false)}>Cancel</button>
              </div>
            )}

            {/* Upload zone (drag & drop overlay - only for external files) */}
            <div
              className={`v-dropzone${dragover ? ' v-dropzone--active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); if (!draggingItem) setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={(e) => { e.preventDefault(); setDragover(false); if (!draggingItem && e.dataTransfer.files.length > 0) handleFileInput(e.dataTransfer.files); }}
            >
              {dragover && (
                <div className="v-dropzone-overlay">
                  <div className="v-dropzone-content">
                    <span className="v-dropzone-icon">↓</span>
                    <p>Drop files to upload</p>
                  </div>
                </div>
              )}

              {/* Upload progress queue */}
              {uploads.length > 0 && (
                <div className="v-uploads">
                  {uploads.map((u) => (
                    <div className={`v-upload-item v-upload-item--${u.status}`} key={u.id}>
                      <span className="v-upload-name">{u.name}</span>
                      <div className="v-upload-bar">
                        <div className="v-upload-fill" style={{ width: `${u.progress}%` }} />
                      </div>
                      <span className="v-upload-status">
                        {u.status === 'uploading' && '⬆'}
                        {u.status === 'done' && '✓'}
                        {u.status === 'error' && '✕'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* File count summary */}
              <div className="v-summary">
                <span>{totalFolders > 0 ? `${totalFolders} folder${totalFolders !== 1 ? 's' : ''}` : ''}</span>
                {totalFolders > 0 && totalFiles > 0 && <span className="v-summary-dot">·</span>}
                <span>{totalFiles > 0 ? `${totalFiles} file${totalFiles !== 1 ? 's' : ''}` : ''}</span>
                {totalFolders === 0 && totalFiles === 0 && !loading && <span className="v-summary-empty">This folder is empty</span>}
              </div>

              {/* Loading */}
              {loading && (
                <div className="v-loading">
                  <div className="v-spinner" />
                  <span>Loading...</span>
                </div>
              )}

              {/* File list */}
              {!loading && sorted.length > 0 && viewMode === 'list' && (
                <div className="v-file-list">
                  <div className="v-file-list-header">
                    <span className="v-col-name">Name</span>
                    <span className="v-col-size">Size</span>
                    <span className="v-col-date">Modified</span>
                    <span className="v-col-actions"></span>
                  </div>
                  {sorted.map((item) => {
                    const folder = isFolder(item);
                    const icon = getFileIcon(item.mimeType);
                    return (
                      <div
                        className={`v-file-row${folder ? ' v-file-row--folder' : ''}${dropTargetId === item.id ? ' v-drop-active' : ''}`}
                        key={item.id}
                        draggable={!folder && renamingId !== item.id}
                        onDragStart={(e) => !folder && handleItemDragStart(e, item)}
                        onDragEnd={handleItemDragEnd}
                        onDragOver={(e) => folder ? handleFolderDragOver(e, item.id) : null}
                        onDragLeave={(e) => folder ? handleFolderDragLeave(e) : null}
                        onDrop={(e) => folder ? handleFolderDrop(e, item) : null}
                        onDoubleClick={() => folder && openFolder(item)}
                      >
                        <div className="v-col-name">
                          <span className="v-file-icon" style={{ color: icon.color }}>{icon.icon}</span>
                          {renamingId === item.id ? (
                            <input
                              ref={renameInputRef}
                              className="v-rename-input"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleRename(item.id); if (e.key === 'Escape') setRenamingId(null); }}
                              onBlur={() => handleRename(item.id)}
                              autoFocus
                            />
                          ) : (
                            <span
                              className="v-file-name"
                              onClick={() => folder ? openFolder(item) : null}
                              style={folder ? { cursor: 'pointer' } : {}}
                            >
                              {item.name}
                              {!folder && <span className="v-file-ext">{getExtension(item.name)}</span>}
                            </span>
                          )}
                        </div>
                        <span className="v-col-size">{folder ? '—' : formatSize(item.size)}</span>
                        <span className="v-col-date">{formatDate(item.modifiedTime)}</span>
                        <div className="v-col-actions">
                          {!folder && (
                            <button
                              className={`v-btn v-btn--ghost v-btn--xs${copiedId === item.id ? ' v-btn--copied' : ''}`}
                              onClick={() => handleCopy(item.id)}
                              title="Copy link"
                            >
                              {copiedId === item.id ? '✓' : '🔗'}
                            </button>
                          )}
                          <button
                            className="v-btn v-btn--ghost v-btn--xs"
                            onClick={() => { setRenamingId(item.id); setRenameValue(item.name); }}
                            title="Rename"
                          >✏️</button>
                          <button
                            className="v-btn v-btn--ghost v-btn--xs v-btn--danger-text"
                            onClick={() => handleDelete(item)}
                            title="Delete"
                          >🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Grid view */}
              {!loading && sorted.length > 0 && viewMode === 'grid' && (
                <div className="v-file-grid">
                  {sorted.map((item) => {
                    const folder = isFolder(item);
                    const icon = getFileIcon(item.mimeType);
                    return (
                      <div
                        className={`v-grid-item${folder ? ' v-grid-item--folder' : ''}${dropTargetId === item.id ? ' v-drop-active' : ''}`}
                        key={item.id}
                        draggable={!folder}
                        onDragStart={(e) => !folder && handleItemDragStart(e, item)}
                        onDragEnd={handleItemDragEnd}
                        onDragOver={(e) => folder ? handleFolderDragOver(e, item.id) : null}
                        onDragLeave={(e) => folder ? handleFolderDragLeave(e) : null}
                        onDrop={(e) => folder ? handleFolderDrop(e, item) : null}
                        onDoubleClick={() => folder && openFolder(item)}
                      >
                        <div className="v-grid-preview" style={{ color: icon.color }}>
                          <span className="v-grid-icon">{icon.icon}</span>
                          {!folder && <span className="v-grid-ext">{getExtension(item.name)}</span>}
                        </div>
                        <div className="v-grid-info">
                          <span className="v-grid-name" title={item.name}>{item.name}</span>
                          <span className="v-grid-meta">{folder ? 'Folder' : formatSize(item.size)} · {formatDate(item.modifiedTime)}</span>
                        </div>
                        <div className="v-grid-actions">
                          {!folder && (
                            <button className={`v-btn v-btn--ghost v-btn--xs${copiedId === item.id ? ' v-btn--copied' : ''}`} onClick={() => handleCopy(item.id)}>
                              {copiedId === item.id ? '✓' : '🔗'}
                            </button>
                          )}
                          <button className="v-btn v-btn--ghost v-btn--xs" onClick={() => { setRenamingId(item.id); setRenameValue(item.name); }}>✏️</button>
                          <button className="v-btn v-btn--ghost v-btn--xs v-btn--danger-text" onClick={() => handleDelete(item)}>🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty state when not loading and no results */}
              {!loading && sorted.length === 0 && searchQuery && (
                <div className="v-empty">
                  <span className="v-empty-icon">🔍</span>
                  <p>No results for "{searchQuery}"</p>
                </div>
              )}

              {!loading && items.length === 0 && !searchQuery && (
                <div className="v-empty" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                  <span className="v-empty-icon">📂</span>
                  <p>Drop files here or click to upload</p>
                  <span className="v-empty-hint">Supports any file type</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
