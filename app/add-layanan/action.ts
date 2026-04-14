'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function addServiceAction(formData: FormData) {
  const categoryName = formData.get('categoryName') as string
  const description = formData.get('description') as string
  const icon = formData.get('icon') as string
  const providerName = formData.get('providerName') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  if (!categoryName || !description || !icon || !providerName || !phone || !address) {
    throw new Error('Semua bidang wajib diisi')
  }

  const filePath = path.join(process.cwd(), 'data', 'services.json')
  const content = fs.readFileSync(filePath, 'utf-8')
  const services = JSON.parse(content)

  // Generate ID based on category name
  const categoryId = categoryName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')

  const existingCategoryIndex = services.findIndex((s: any) => s.id === categoryId)

  const newContact = {
    name: providerName,
    phone,
    address
  }

  if (existingCategoryIndex >= 0) {
    // Kategori sudah ada, tambahkan kontak ke dalam array contacts
    if (!services[existingCategoryIndex].contacts) {
      services[existingCategoryIndex].contacts = []
    }
    services[existingCategoryIndex].contacts.push(newContact)
  } else {
    // Buat kategori baru
    services.push({
      id: categoryId,
      category: categoryName,
      icon,
      description,
      contacts: [newContact]
    })
  }

  fs.writeFileSync(filePath, JSON.stringify(services, null, 2))

  try {
    await execAsync(`git config user.name "Live At Probolinggo Bot"`).catch(() => {})
    await execAsync(`git config user.email "bot@liveatprobolinggo.com"`).catch(() => {})
    await execAsync(`git add data/services.json`)
    await execAsync(`git commit -m "Auto add service: ${providerName} in ${categoryName}"`)
    await execAsync(`git push origin master`).catch(() => console.log('Notice: Push failed or no origin master. Local commit succeeded.'))
  } catch (gitErr) {
    console.error('Git auto-commit process failed/skipped:', gitErr)
  }

  revalidatePath('/')
  redirect('/?success=layanan-ditambahkan')
}
