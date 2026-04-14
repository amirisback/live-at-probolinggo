'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export async function addServiceAction(formData: FormData) {
  const categoryName = formData.get('categoryName') as string
  const description = formData.get('description') as string
  const icon = (formData.get('icon') as string) || '💼'
  const providerName = formData.get('providerName') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  if (!categoryName || !description || !providerName || !phone || !address) {
    throw new Error('Semua bidang wajib diisi')
  }

  const supabase = getSupabase()

  // Generate ID based on category name
  const categoryId = categoryName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')

  // Upsert category (create if not exists, ignore if already exists)
  const { error: catError } = await supabase
    .from('service_categories')
    .upsert(
      {
        id: categoryId,
        category: categoryName,
        icon,
        description,
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )

  if (catError) {
    console.error('Error upserting category:', catError)
    throw new Error('Gagal menyimpan kategori layanan: ' + catError.message)
  }

  // Insert contact
  const { error: contactError } = await supabase
    .from('service_contacts')
    .insert({
      category_id: categoryId,
      name: providerName,
      phone,
      address,
    })

  if (contactError) {
    console.error('Error inserting contact:', contactError)
    throw new Error('Gagal menyimpan kontak penyedia jasa: ' + contactError.message)
  }

  revalidatePath('/')
  redirect('/?success=layanan-ditambahkan')
}
