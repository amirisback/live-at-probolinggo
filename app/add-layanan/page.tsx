import fs from 'fs'
import path from 'path'
import DaftarLayananClient from './DaftarLayananClient'

export default function DaftarLayananPage() {
  const filePath = path.join(process.cwd(), 'data', 'services.json')
  const content = fs.readFileSync(filePath, 'utf-8')
  const services = JSON.parse(content)
  
  const categories = services.map((s: any) => ({
    id: s.id,
    name: s.category,
    icon: s.icon,
    description: s.description
  }))

  return <DaftarLayananClient existingCategories={categories} />
}
