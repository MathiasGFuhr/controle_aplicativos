import { FormEvent, useState, useEffect } from 'react';
import { createSubscriber, updateSubscriber } from '../services/subscriberService';
import { Subscriber } from '../types/subscriber';

interface SubscriberFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
  subscriber?: Subscriber; // Para edição
}

export function SubscriberForm({ onSuccess, onCancel, subscriber }: SubscriberFormProps) {
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [appName, setAppName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Preencher o formulário se for edição
  useEffect(() => {
    if (subscriber) {
      setName(subscriber.name);
      setExpirationDate(subscriber.expirationDate.toISOString().split('T')[0]);
      setAvatarUrl(subscriber.avatarUrl);
      setAppName(subscriber.appName || '');
    }
  }, [subscriber]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const subscriberData = {
        name,
        expirationDate: new Date(expirationDate),
        avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        appName,
      };

      if (subscriber) {
        // Edição
        await updateSubscriber(subscriber.id, subscriberData);
      } else {
        // Criação
        await createSubscriber(subscriberData);
      }

      onSuccess?.();
      onCancel();
    } catch (err) {
      console.error('Erro ao salvar assinante:', err);
      setError('Erro ao salvar assinante. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {subscriber ? 'Editar Assinante' : 'Novo Assinante'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Nome do assinante"
          />
        </div>

        <div>
          <label htmlFor="appName" className="block text-sm font-medium text-gray-700">
            Nome do Aplicativo
          </label>
          <input
            type="text"
            id="appName"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Ex: Netflix, Spotify, etc."
          />
        </div>

        <div>
          <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">
            Data de Vencimento
          </label>
          <input
            type="date"
            id="expiration"
            required
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
            URL do Avatar (opcional)
          </label>
          <input
            type="url"
            id="avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="https://exemplo.com/avatar.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">
            Se não fornecido, um avatar será gerado automaticamente
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
} 