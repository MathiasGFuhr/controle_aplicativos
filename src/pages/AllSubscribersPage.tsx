import { useEffect, useState } from 'react';
import { getSubscribers } from '../services/subscriberService';
import { Subscriber } from '../types/subscriber';
import { SubscriberForm } from '../components/SubscriberForm';

export function AllSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | undefined>();

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Todos os Assinantes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista completa de todos os assinantes cadastrados no sistema.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Adicionar Assinante
          </button>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                      Nome
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Aplicativo
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Data de Vencimento
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {subscribers.map((subscriber) => {
                    const expirationDate = new Date(subscriber.expirationDate);
                    const today = new Date();
                    const isExpired = expirationDate < today;
                    const isCloseToExpiration = !isExpired && 
                      expirationDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000;

                    return (
                      <tr key={subscriber.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 lg:pl-8">
                          <div className="flex items-center">
                            <img 
                              src={subscriber.avatarUrl} 
                              alt="" 
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{subscriber.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {subscriber.appName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {expirationDate.toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            isExpired 
                              ? 'bg-red-100 text-red-800'
                              : isCloseToExpiration
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {isExpired 
                              ? 'Vencido'
                              : isCloseToExpiration
                                ? 'Próximo ao vencimento'
                                : 'Ativo'
                            }
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <button
                            onClick={() => handleEdit(subscriber)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <SubscriberForm
              subscriber={selectedSubscriber}
              onSuccess={loadSubscribers}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
} 