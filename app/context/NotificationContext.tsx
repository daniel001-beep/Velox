'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bell, Shield, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export type NotificationType = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO' | 'SENTINEL';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50)); // Keep last 50
    
    // Auto-remove toast after 5 seconds if we were to implement a toast UI
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll, unreadCount }}>
      {children}
      
      {/* Real-Time Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {notifications.filter(n => !n.isRead).slice(0, 3).map((n) => (
          <NotificationToast key={n.id} notification={n} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function NotificationToast({ notification }: { notification: Notification }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'ERROR': return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'SENTINEL': return <Shield className="w-5 h-5 text-blue-400" />;
      default: return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-start gap-4 min-w-[320px] animate-in slide-in-from-right duration-500">
      <div className="p-2 bg-white/5 rounded-xl">
        {getIcon()}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-white mb-1">{notification.title}</h4>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">{notification.message}</p>
      </div>
    </div>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
