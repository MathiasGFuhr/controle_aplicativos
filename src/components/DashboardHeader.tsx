import { useMemo } from 'react';
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
        <h3 className="text-lg font-semibold text-gray-700">Assinantes Ativos</h3>
        <p className="text-2xl font-bold text-green-600">{ativos.length}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-yellow-500">
        <h3 className="text-lg font-semibold text-gray-700">Próximos ao Vencimento</h3>
        <p className="text-2xl font-bold text-yellow-600">{proximosAoVencimento.length}</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-red-500">
        <h3 className="text-lg font-semibold text-gray-700">Vencidos</h3>
        <p className="text-2xl font-bold text-red-600">{vencidos.length}</p>
      </div>
    </div>
  );
} 