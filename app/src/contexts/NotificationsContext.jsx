import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const NotificationsContext = createContext(null);

const STORAGE_KEY = 'notifications';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

function saveToStorage(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

export function NotificationsProvider({ children }) {
  const [items, setItems] = useState(() => loadFromStorage());
  const idRef = useRef(Date.now());

  useEffect(() => { saveToStorage(items); }, [items]);

  const notify = useCallback((notif) => {
    // notif: { title, message, type, payload }
    const id = ++idRef.current;
    const item = {
      id,
      title: notif.title || 'Notificación',
      message: notif.message || '',
      type: notif.type || 'info',
      createdAt: new Date().toISOString(),
      read: false,
      payload: notif.payload || null,
    };
    setItems((prev) => [item, ...prev].slice(0, 50));
    return id;
  }, []);

  const markAsRead = useCallback((id) => {
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => { setItems([]); }, []);

  const value = useMemo(() => ({
    items,
    unreadCount: items.filter((n) => !n.read).length,
    notify,
    markAsRead,
    markAllAsRead,
    clearAll,
  }), [items, notify, markAsRead, markAllAsRead, clearAll]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() { return useContext(NotificationsContext); }
