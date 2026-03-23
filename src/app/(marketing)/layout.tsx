import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import GoldenSparks from '@/components/ui/GoldenSparks'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GoldenSparks />
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
