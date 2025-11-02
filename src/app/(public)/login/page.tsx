import { supabaseServerReadonly } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const supabase = await supabaseServerReadonly();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');
  return <LoginForm />;
}
