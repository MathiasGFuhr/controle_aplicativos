import { Subscriber } from '../types/subscriber';
import { getOptimizedAvatarUrl } from '../utils/image';

interface SubscriberCardProps {
  subscriber: Subscriber;
  onEdit: () => void;
  onDelete: (subscriber: Subscriber) => void;
}

export function SubscriberCard({ subscriber, onEdit, onDelete }: SubscriberCardProps) {
  const expirationDate = new Date(subscriber.expirationDate);
  const today = new Date();
  const isExpired = expirationDate < today;
  const isCloseToExpiration = !isExpired && 
    expirationDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full">
          <img
            src={getOptimizedAvatarUrl(subscriber.avatarUrl)}
            alt={`Avatar de ${subscriber.name}`}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-indigo-900 text-base truncate">
              {subscriber.name}
            </h3>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-sm text-gray-600">
              {subscriber.appName && (
                <span>
                  App: {subscriber.appName}
                </span>
              )}
              <span className={isExpired ? 'text-red-600 font-medium' : ''}>
                Vence: {expirationDate.toLocaleDateString()}
                {isExpired && <span className="ml-1 text-red-600 font-bold">(Vencido)</span>}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onEdit}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            aria-label="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(subscriber)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Excluir"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
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
      </div>
    </div>
  );
} 