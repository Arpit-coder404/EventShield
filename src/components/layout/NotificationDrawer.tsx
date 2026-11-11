import React from 'react';
import { X, CheckCheck, Bell, AlertTriangle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    setCurrentPage
  } = useAppStore();

  if (!isNotificationDrawerOpen) return null;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-[#E36B62]" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-[#E5AA52]" />;
      default: return <Info className="w-4 h-4 text-[#80A8C8]" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'warning': return 'amber';
      default: return 'blue';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1B231E] border-l border-[#303B33] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-[#303B33] bg-[#151C18] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#64B58A]" />
              <h2 className="text-sm font-semibold text-[#F0F2EC]">Operational Alerts & Notifications</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={<CheckCheck className="w-3.5 h-3.5" />}
                onClick={markAllNotificationsAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-1 rounded text-[#9AA59C] hover:text-[#F0F2EC] hover:bg-[#202A24]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-[#9AA59C] text-xs font-mono">
                No active operational alerts.
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.linkPage) {
                      setCurrentPage(notif.linkPage as any);
                      setIsNotificationDrawerOpen(false);
                    }
                  }}
                  className={cn(
                    'p-3.5 rounded border transition-colors cursor-pointer text-left',
                    notif.read ? 'bg-[#151C18]/60 border-[#303B33] opacity-75' : 'bg-[#202A24] border-[#78977E]/40',
                    'hover:border-[#64B58A]/60'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(notif.severity)}
                      <span className="text-xs font-semibold text-[#F0F2EC]">{notif.title}</span>
                    </div>
                    <Badge variant={getSeverityBadgeVariant(notif.severity)} className="text-[10px]">
                      {notif.type}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-[#9AA59C] mb-2 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#78977E]">
                    <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    {notif.linkPage && (
                      <span className="flex items-center gap-1 text-[#80A8C8] hover:underline">
                        <span>Open {notif.linkPage}</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

