import { supabaseServerReadonly } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RegisterForm from './RegisterForm';

export default async function RegisterPage() {
  const supabase = await supabaseServerReadonly();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');
  return <RegisterForm />;
}
