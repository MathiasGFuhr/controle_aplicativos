import { supabase } from '../lib/supabase';
import { Subscriber } from '../types/subscriber';

// Função auxiliar para ajustar o fuso horário
function adjustTimezone(date: Date): Date {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

export async function getSubscribers() {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('name');

  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    expirationDate: adjustTimezone(new Date(item.expiration_date)),
    avatarUrl: item.avatar_url,
    appName: item.app_name,
    userId: item.user_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) as Subscriber[];
}

export async function createSubscriber(subscriber: Omit<Subscriber, 'id' | 'userId'>) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');

  // Ajustar a data para UTC antes de salvar
  const utcDate = new Date(subscriber.expirationDate.getTime() - subscriber.expirationDate.getTimezoneOffset() * 60000);

  const { data, error } = await supabase
    .from('subscribers')
    .insert({
      name: subscriber.name,
      expiration_date: utcDate.toISOString(),
      avatar_url: subscriber.avatarUrl,
      app_name: subscriber.appName,
      user_id: user.id
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    expirationDate: adjustTimezone(new Date(data.expiration_date)),
    avatarUrl: data.avatar_url,
    appName: data.app_name,
    userId: data.user_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Subscriber;
}

export async function updateSubscriber(id: string, subscriber: Partial<Subscriber>) {
  const updateData: any = {};
  if (subscriber.name) updateData.name = subscriber.name;
  if (subscriber.expirationDate) {
    // Ajustar a data para UTC antes de salvar
    const utcDate = new Date(subscriber.expirationDate.getTime() - subscriber.expirationDate.getTimezoneOffset() * 60000);
    updateData.expiration_date = utcDate.toISOString();
  }
  if (subscriber.avatarUrl) updateData.avatar_url = subscriber.avatarUrl;
  if (subscriber.appName) updateData.app_name = subscriber.appName;

  const { data, error } = await supabase
    .from('subscribers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    expirationDate: adjustTimezone(new Date(data.expiration_date)),
    avatarUrl: data.avatar_url,
    appName: data.app_name,
    userId: data.user_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Subscriber;
}

export async function deleteSubscriber(id: string) {
  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 