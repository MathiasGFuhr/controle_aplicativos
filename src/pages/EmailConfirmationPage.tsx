import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function EmailConfirmationPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleResendEmail = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (resendError) throw resendError;
      
      setSuccess(true);
    } catch (err: any) {
      setError('Não foi possível enviar o email. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-indigo-900">
            Confirme seu email
          </h2>
          <p className="mt-2 text-sm text-indigo-600">
            Para acessar sua conta, confirme seu email através do link enviado.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-sm text-green-700">
              Email de confirmação reenviado com sucesso!
            </p>
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            className="w-full px-3 py-2 border border-indigo-300 rounded-md"
          />
          
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Reenviar email de confirmação'}
          </button>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
} 