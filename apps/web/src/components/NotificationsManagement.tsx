'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_MY_NOTIFICATIONS,
  MARK_NOTIFICATION_READ_MUTATION,
} from '@lib/graphql/queries';
import {
  BellIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'ORDER_PLACED' | 'ORDER_ACCEPTED' | 'ORDER_COMPLETED' | 'ORDER_CANCELLED' | 'PAYMENT_RECEIVED' | 'MESSAGE_RECEIVED' | 'REVIEW_RECEIVED';
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const NotificationsManagement: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const { data, loading, error, refetch } = useQuery(GET_MY_NOTIFICATIONS, {
    fetchPolicy: 'cache-and-network',
  });

  const [markAsRead] = useMutation(MARK_NOTIFICATION_READ_MUTATION);

  const notifications: Notification[] = data?.myNotifications || [];

  const filteredNotifications = notifications.filter(notification =>
    filter === 'all' || !notification.isRead
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ORDER_PLACED':
        return <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />;
      case 'ORDER_ACCEPTED':
        return <CheckIcon className="h-5 w-5 text-green-600" />;
      case 'ORDER_COMPLETED':
        return <CheckIcon className="h-5 w-5 text-green-600" />;
      case 'ORDER_CANCELLED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'PAYMENT_RECEIVED':
        return <CurrencyDollarIcon className="h-5 w-5 text-green-600" />;
      case 'MESSAGE_RECEIVED':
        return <ChatBubbleLeftIcon className="h-5 w-5 text-blue-600" />;
      case 'REVIEW_RECEIVED':
        return <StarIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-slate-600" />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    const baseColor = isRead ? 'bg-slate-50' : 'bg-white border-l-4';

    if (isRead) return baseColor;

    switch (type) {
      case 'ORDER_PLACED':
      case 'MESSAGE_RECEIVED':
        return `${baseColor} border-l-blue-500`;
      case 'ORDER_ACCEPTED':
      case 'ORDER_COMPLETED':
      case 'PAYMENT_RECEIVED':
        return `${baseColor} border-l-green-500`;
      case 'ORDER_CANCELLED':
        return `${baseColor} border-l-red-500`;
      case 'REVIEW_RECEIVED':
        return `${baseColor} border-l-yellow-500`;
      default:
        return `${baseColor} border-l-slate-500`;
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead({
        variables: { id: notificationId },
      });
      refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(notification =>
          markAsRead({ variables: { id: notification.id } })
        )
      );
      refetch();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading notifications: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">
            Stay updated with your latest activities and messages
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setFilter('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              filter === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            All Notifications
            <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
              {notifications.length}
            </span>
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              filter === 'unread'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-lg border border-slate-200 p-4 transition-all hover:shadow-sm ${getNotificationColor(notification.type, notification.isRead)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notification.type.replace('_', ' ')}
                    </h3>
                    <p className={`text-sm mt-1 ${notification.isRead ? 'text-slate-500' : 'text-slate-600'}`}>
                      {notification.content}
                    </p>
                    {notification.sender && (
                      <p className={`text-xs mt-1 ${notification.isRead ? 'text-slate-400' : 'text-slate-500'}`}>
                        from {notification.sender.firstName} {notification.sender.lastName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Mark as read"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <BellIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h3>
          <p className="text-slate-600">
            {filter === 'unread'
              ? 'All caught up! Check back later for new updates.'
              : 'Notifications about your orders, messages, and activities will appear here.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsManagement;
