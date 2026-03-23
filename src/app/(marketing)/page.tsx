import Hero from '@/components/sections/Hero'
import LogoBar from '@/components/sections/LogoBar'
import Metrics from '@/components/sections/Metrics'
import Features from '@/components/sections/Features'
import ScrollShowcase from '@/components/sections/ScrollShowcase'
import HowItWorks from '@/components/sections/HowItWorks'
import Comparison from '@/components/sections/Comparison'
import Testimonials from '@/components/sections/Testimonials'
import Integrations from '@/components/sections/Integrations'
import Pricing from '@/components/sections/Pricing'
import ROICalculator from '@/components/sections/ROICalculator'
import Security from '@/components/sections/Security'
import FAQ from '@/components/sections/FAQ'
import FinalCTA from '@/components/sections/FinalCTA'

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <LogoBar />
      <Metrics />
      <Features />
      <ScrollShowcase />
      <HowItWorks />
      <Comparison />
      <Integrations />
      <Testimonials />
      <Pricing />
      <ROICalculator />
      <Security />
      <FAQ />
      <FinalCTA />
    </main>
  )
}
