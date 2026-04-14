import { getSupabase } from '@/lib/supabase'
import DaftarLayananClient from './DaftarLayananClient'

export const dynamic = 'force-dynamic'

export default async function DaftarLayananPage() {
  const supabase = getSupabase()

  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, category, icon, description')
    .order('created_at', { ascending: true })

  const mappedCategories = (categories || []).map((s: any) => ({
    id: s.id,
    name: s.category,
    icon: s.icon,
    description: s.description
  }))

  return <DaftarLayananClient existingCategories={mappedCategories} />
}
