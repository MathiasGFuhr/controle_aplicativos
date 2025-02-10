import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica o usuário atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          // Reenviar email de confirmação
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
              emailRedirectTo: window.location.origin
            }
          });

          if (resendError) {
            console.error('Erro ao reenviar:', resendError);
            throw new Error('Não foi possível enviar o email de confirmação. Tente novamente mais tarde.');
          }

          throw new Error(
            'Sua conta ainda não foi confirmada. Um novo email de confirmação foi enviado. ' +
            'Por favor, verifique sua caixa de entrada e spam.'
          );
        }

        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos');
        }

        throw error;
      }

      if (!data.user) {
        throw new Error('Erro ao fazer login');
      }

      setUser(data.user);
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Primeiro, criar o usuário
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) {
        console.error('Erro no signup:', signUpError);
        if (signUpError.message?.includes('48 seconds')) {
          throw new Error('COOLDOWN_ERROR');
        }
        throw new Error(signUpError.message);
      }

      if (!authData.user) {
        throw new Error('Falha ao criar usuário');
      }

      console.log('Usuário criado:', authData.user);

      // Depois, criar o perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          email,
        })
        .select()
        .single();

      if (profileError) {
        console.error('Erro detalhado ao criar perfil:', profileError);
        // Log adicional para debug
        console.log('Dados tentando inserir:', {
          id: authData.user.id,
          name,
          email,
        });
        throw new Error(profileError.message || 'Erro ao criar perfil do usuário');
      }

      console.log('Perfil criado:', profileData);

      // Atualizar o estado do usuário
      setUser(authData.user);
      return authData;
    } catch (error: any) {
      console.error('Erro completo:', error);
      // Log adicional para debug
      if (error.code) {
        console.error('Código do erro:', error.code);
      }
      if (error.details) {
        console.error('Detalhes do erro:', error.details);
      }
      if (error.hint) {
        console.error('Dica do erro:', error.hint);
      }

      if (error.message === 'COOLDOWN_ERROR') {
        throw error;
      }
      throw new Error(error.message || 'Erro ao criar conta. Tente novamente mais tarde.');
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 