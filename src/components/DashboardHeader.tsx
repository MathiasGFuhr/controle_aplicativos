import { Subscriber } from '../types/subscriber';

interface DashboardHeaderProps {
  subscribers: Subscriber[];
}

export function DashboardHeader({ subscribers }: DashboardHeaderProps) {
  const hoje = new Date();
  const vencidos = subscribers.filter(s => new Date(s.expirationDate) < hoje);
  const ativos = subscribers.filter(s => new Date(s.expirationDate) >= hoje);
  const proximosAoVencimento = subscribers.filter(s => {
    const dataVencimento = new Date(s.expirationDate);
    const diasAteVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diasAteVencimento > 0 && diasAteVencimento <= 7;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
          <div className="rounded-full bg-green-100 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-700">Assinantes Ativos</h3>
            <p className="text-2xl font-bold text-green-600">{ativos.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-yellow-500">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
          <div className="rounded-full bg-yellow-100 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-700">Próximos ao Vencimento</h3>
            <p className="text-2xl font-bold text-yellow-600">{proximosAoVencimento.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-red-500">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2">
          <div className="rounded-full bg-red-100 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-700">Vencidos</h3>
            <p className="text-2xl font-bold text-red-600">{vencidos.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 