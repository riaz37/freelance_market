'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '@contexts/AuthContext';
import {
  GET_MY_ORDERS,
  GET_RECEIVED_ORDERS,
  CREATE_ORDER_MUTATION,
  UPDATE_ORDER_MUTATION,
  ACCEPT_ORDER_MUTATION,
  START_ORDER_MUTATION,
  COMPLETE_ORDER_MUTATION,
  REQUEST_REVISION_MUTATION,
  CANCEL_ORDER_MUTATION,
} from '@lib/graphql/queries';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';

interface Order {
  id: string;
  projectId: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED' | 'REVISION';
  totalAmount: number;
  requirements?: string;
  deliveryDate?: string;
  createdAt: string;
  project: {
    id: string;
    title: string;
    freelancer?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const OrdersManagement: React.FC = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({
    requirements: '',
    deliveryDate: '',
  });

  // Determine which query to use based on user role
  const isClient = user?.role === 'CLIENT';
  const query = isClient ? GET_MY_ORDERS : GET_RECEIVED_ORDERS;
  
  const { data, loading, error, refetch } = useQuery(query, {
    fetchPolicy: 'cache-and-network',
  });

  const [updateOrder] = useMutation(UPDATE_ORDER_MUTATION);
  const [acceptOrder] = useMutation(ACCEPT_ORDER_MUTATION);
  const [startOrder] = useMutation(START_ORDER_MUTATION);
  const [completeOrder] = useMutation(COMPLETE_ORDER_MUTATION);
  const [requestRevision] = useMutation(REQUEST_REVISION_MUTATION);
  const [cancelOrder] = useMutation(CANCEL_ORDER_MUTATION);

  const orders: Order[] = data?.myOrders || data?.receivedOrders || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'DISPUTED':
        return 'bg-orange-100 text-orange-800';
      case 'REVISION':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <ClockIcon className="h-4 w-4" />;
      case 'ACCEPTED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <PlayIcon className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircleIcon className="h-4 w-4" />;
      case 'DISPUTED':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'REVISION':
        return <PauseIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleStatusChange = async (orderId: string, action: string) => {
    try {
      switch (action) {
        case 'accept':
          await acceptOrder({ variables: { id: orderId } });
          break;
        case 'start':
          await startOrder({ variables: { id: orderId } });
          break;
        case 'complete':
          await completeOrder({ variables: { id: orderId } });
          break;
        case 'revision':
          await requestRevision({ variables: { id: orderId } });
          break;
        case 'cancel':
          if (window.confirm('Are you sure you want to cancel this order?')) {
            await cancelOrder({ variables: { id: orderId } });
          }
          return;
      }
      refetch();
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await updateOrder({
        variables: {
          updateOrderInput: {
            id: selectedOrder.id,
            requirements: updateData.requirements || undefined,
            deliveryDate: updateData.deliveryDate ? new Date(updateData.deliveryDate).toISOString() : undefined,
          },
        },
      });
      setShowUpdateForm(false);
      setSelectedOrder(null);
      refetch();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getAvailableActions = (order: Order) => {
    const actions = [];
    
    if (isClient) {
      // Client actions
      if (order.status === 'PENDING' || order.status === 'ACCEPTED') {
        actions.push({ label: 'Cancel', action: 'cancel', color: 'bg-red-600 hover:bg-red-700' });
      }
      if (order.status === 'COMPLETED') {
        actions.push({ label: 'Request Revision', action: 'revision', color: 'bg-amber-600 hover:bg-amber-700' });
      }
    } else {
      // Freelancer actions
      if (order.status === 'PENDING') {
        actions.push({ label: 'Accept', action: 'accept', color: 'bg-green-600 hover:bg-green-700' });
        actions.push({ label: 'Decline', action: 'cancel', color: 'bg-red-600 hover:bg-red-700' });
      }
      if (order.status === 'ACCEPTED') {
        actions.push({ label: 'Start Work', action: 'start', color: 'bg-blue-600 hover:bg-blue-700' });
      }
      if (order.status === 'IN_PROGRESS' || order.status === 'REVISION') {
        actions.push({ label: 'Mark Complete', action: 'complete', color: 'bg-green-600 hover:bg-green-700' });
      }
    }

    return actions;
  };

  const openUpdateForm = (order: Order) => {
    setSelectedOrder(order);
    setUpdateData({
      requirements: order.requirements || '',
      deliveryDate: order.deliveryDate ? order.deliveryDate.split('T')[0] : '',
    });
    setShowUpdateForm(true);
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
        <p className="text-red-800">Error loading orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {isClient ? 'My Orders' : 'Received Orders'}
        </h1>
        <p className="text-slate-600 mt-1">
          {isClient 
            ? 'Track your project orders and communicate with freelancers'
            : 'Manage incoming orders and deliver quality work'
          }
        </p>
      </div>

      {/* Update Form Modal */}
      {showUpdateForm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Update Order</h2>
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Requirements
                </label>
                <textarea
                  value={updateData.requirements}
                  onChange={(e) => setUpdateData({ ...updateData, requirements: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Update project requirements..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={updateData.deliveryDate}
                  onChange={(e) => setUpdateData({ ...updateData, deliveryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpdateForm(false)}
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {order.project.title}
                </h3>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.replace('_', ' ')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">${order.totalAmount}</div>
                <div className="text-sm text-slate-600">
                  {isClient && order.project.freelancer && (
                    <span>by {order.project.freelancer.firstName} {order.project.freelancer.lastName}</span>
                  )}
                  {!isClient && order.client && (
                    <span>from {order.client.firstName} {order.client.lastName}</span>
                  )}
                </div>
              </div>
            </div>

            {order.requirements && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-1">Requirements:</h4>
                <p className="text-slate-600 text-sm">{order.requirements}</p>
              </div>
            )}

            <div className="flex justify-between items-center text-sm text-slate-600 mb-4">
              <span>Order placed: {new Date(order.createdAt).toLocaleDateString()}</span>
              {order.deliveryDate && (
                <span>Delivery: {new Date(order.deliveryDate).toLocaleDateString()}</span>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {getAvailableActions(order).map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleStatusChange(order.id, action.action)}
                  className={`text-white px-3 py-2 rounded-lg transition-colors text-sm ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
              
              {(isClient && ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(order.status)) && (
                <button
                  onClick={() => openUpdateForm(order)}
                  className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  Update Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <ClockIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {isClient ? 'No orders yet' : 'No orders received'}
          </h3>
          <p className="text-slate-600">
            {isClient 
              ? 'Browse projects and place your first order'
              : 'Orders will appear here when clients hire you'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
