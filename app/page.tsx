import fs from 'fs'
import path from 'path'
import HeroSection from './components/HeroSection'
import DataSection from './components/DataSection'
import TestimonialSection from './components/TestimonialSection'
import CTASection from './components/CTASection'

function readJSON(filename: string) {
  const filePath = path.join(process.cwd(), 'data', filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

export default function Home() {
  const site = readJSON('site.json')
  const services = readJSON('services.json')
  const testimonials = readJSON('testimonials.json')
  const cta = readJSON('cta.json')

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
        whatsappNumber={cta.whatsappNumber}
        whatsappMessage={cta.whatsappMessage}
      />
    </>
  )
}
