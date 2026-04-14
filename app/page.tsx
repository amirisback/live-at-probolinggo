import fs from 'fs'
import path from 'path'
import { getSupabase } from '@/lib/supabase'
import HeroSection from './components/HeroSection'
import DataSection from './components/DataSection'
import TestimonialSection from './components/TestimonialSection'
import CTASection from './components/CTASection'

export const dynamic = 'force-dynamic'

function readJSON(filename: string) {
  const filePath = path.join(process.cwd(), 'data', filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

export default async function Home() {
  const site = readJSON('site.json')
  const cta = readJSON('cta.json')

  // Fetch services from Supabase
  const supabase = getSupabase()

  const { data: categories } = await supabase
    .from('service_categories')
    .select('id, category, icon, description')
    .order('created_at', { ascending: true })

  const { data: contacts } = await supabase
    .from('service_contacts')
    .select('id, category_id, name, phone, address')
    .order('created_at', { ascending: true })

  // Reassemble into the nested format that DataSection expects
  const services = (categories || []).map((cat: any) => ({
    id: cat.id,
    category: cat.category,
    icon: cat.icon,
    description: cat.description,
    contacts: (contacts || [])
      .filter((c: any) => c.category_id === cat.id)
      .map((c: any) => ({ name: c.name, phone: c.phone, address: c.address })),
  }))

  // Fetch testimonials from Supabase
  const { data: rawTestimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  const testimonials = (rawTestimonials || []).map((t: any) => ({
    id: t.id.toString(),
    name: t.name,
    role: t.role,
    photo: t.photo,
    content: t.content,
    rating: t.rating,
    ...(t.service_used && { serviceUsed: t.service_used }),
  }))

  return (
    <>
      <HeroSection
        siteName={site.siteName}
        tagline={site.tagline}
        subtitle={site.heroSubtitle}
        youtubeId={site.heroYoutubeId}
        overlayOpacity={site.heroOverlayOpacity}
      />

      <DataSection services={services} />

      <TestimonialSection testimonials={testimonials} />

      <CTASection
        heading={cta.heading}
        description={cta.description}
        buttonText={cta.buttonText}
      />
    </>
  )
}
