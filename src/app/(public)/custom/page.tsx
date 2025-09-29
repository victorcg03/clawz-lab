import { supabaseServerReadonly } from '@/lib/supabase/server';
import { CustomWizard } from './ui/CustomWizard';

async function getUserProfile() {
  const supabase = await supabaseServerReadonly();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, email, phone')
    .eq('id', user.id)
    .single();

  return profile;
}

export default async function CustomPage() {
  const profile = await getUserProfile();

  return <CustomWizard userProfile={profile} />;
}
