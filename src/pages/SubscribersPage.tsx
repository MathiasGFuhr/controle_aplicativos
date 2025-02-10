import { useState, useEffect } from 'react';
import { SubscriberCard } from '../components/SubscriberCard';
import { SubscriberForm } from '../components/SubscriberForm';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { DashboardHeader } from '../components/DashboardHeader';
import { useAuth } from '../contexts/AuthContext';
import { getSubscribers, deleteSubscriber } from '../services/subscriberService';
import { Subscriber } from '../types/subscriber';

export function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | undefined>();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; subscriber?: Subscriber }>({
    isOpen: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    try {
      const data = await getSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error('Erro ao carregar assinantes:', err);
      setError('Erro ao carregar assinantes');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (subscriber: Subscriber) => {
    try {
      await deleteSubscriber(subscriber.id);
      await loadSubscribers();
      setDeleteModal({ isOpen: false });
    } catch (err) {
      console.error('Erro ao deletar assinante:', err);
      // Você pode adicionar uma notificação de erro aqui
    }
  };

  const handleEdit = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedSubscriber(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[95%] xl:max-w-7xl mx-auto p-2 sm:p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gerenciar Assinaturas</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Total de assinantes: {subscribers.length}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Adicionar Assinante
        </button>
      </div>

      <DashboardHeader subscribers={subscribers} />

      <div className="space-y-8">
        {subscribers.map((subscriber) => (
          <SubscriberCard
            key={subscriber.id}
            subscriber={subscriber}
            onEdit={() => handleEdit(subscriber)}
            onDelete={(subscriber) => setDeleteModal({ isOpen: true, subscriber })}
          />
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <SubscriberForm
              subscriber={selectedSubscriber}
              onSuccess={() => {
                loadSubscribers();
                handleCloseForm();
              }}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        subscriberName={deleteModal.subscriber?.name || ''}
        onConfirm={() => deleteModal.subscriber && handleDelete(deleteModal.subscriber)}
        onCancel={() => setDeleteModal({ isOpen: false })}
      />
    </div>
  );
} 