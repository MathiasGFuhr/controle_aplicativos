import { useMemo } from 'react';
import { Subscriber } from '../types/subscriber';

interface DashboardHeaderProps {
  subscribers: Subscriber[];
}

export function DashboardHeader({ subscribers }: DashboardHeaderProps) {
  const stats = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    const em7dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    const em15dias = new Date(hoje.getTime() + 15 * 24 * 60 * 60 * 1000);

    return subscribers.reduce(
      (acc, subscriber) => {
        const vencimento = new Date(subscriber.expirationDate);
        const vencimentoMes = vencimento.getMonth();
        const vencimentoAno = vencimento.getFullYear();

        if (vencimento < hoje) {
          acc.vencidos.push(subscriber);
        } else if (vencimento <= em7dias) {
          acc.proximosVencimentos.push(subscriber);
        } else if (vencimentoMes === mesAtual && vencimentoAno === anoAtual) {
          acc.vencemNesteMes.push(subscriber);
        }

        return acc;
      },
      { 
        vencidos: [] as Subscriber[], 
        proximosVencimentos: [] as Subscriber[],
        vencemNesteMes: [] as Subscriber[]
      }
    );
  }, [subscribers]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-3 sm:p-6 mb-6 sm:mb-8 border border-indigo-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-lg p-3 sm:p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">Assinaturas Vencidas</h3>
          </div>
          <div className="space-y-1.5 sm:space-y-2 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {stats.vencidos.length === 0 ? (
              <p className="text-xs sm:text-sm text-white/80">Nenhuma assinatura vencida</p>
            ) : (
              stats.vencidos.map(subscriber => (
                <div key={subscriber.id} className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-md transition-colors">
                  <img src={subscriber.avatarUrl} alt="" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full ring-1 ring-white/30" />
                  <p className="text-xs sm:text-sm text-white truncate">{subscriber.name}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-amber-600 rounded-lg p-3 sm:p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">Próximos 7 dias</h3>
          </div>
          <div className="space-y-1.5 sm:space-y-2 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {stats.proximosVencimentos.length === 0 ? (
              <p className="text-xs sm:text-sm text-white/80">Nenhum vencimento próximo</p>
            ) : (
              stats.proximosVencimentos.map(subscriber => (
                <div key={subscriber.id} className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-md transition-colors">
                  <img src={subscriber.avatarUrl} alt="" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full ring-1 ring-white/30" />
                  <p className="text-xs sm:text-sm text-white truncate">
                    {subscriber.name} - {new Date(subscriber.expirationDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg p-3 sm:p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">Vencem este mês</h3>
          </div>
          <div className="space-y-1.5 sm:space-y-2 max-h-[150px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {stats.vencemNesteMes.length === 0 ? (
              <p className="text-xs sm:text-sm text-white/80">Nenhum vencimento este mês</p>
            ) : (
              stats.vencemNesteMes.map(subscriber => (
                <div key={subscriber.id} className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-md transition-colors">
                  <img src={subscriber.avatarUrl} alt="" className="w-5 h-5 sm:w-6 sm:h-6 rounded-full ring-1 ring-white/30" />
                  <p className="text-xs sm:text-sm text-white truncate">
                    {subscriber.name} - {new Date(subscriber.expirationDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 