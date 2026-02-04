import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Metrics from '@/components/Metrics'
import RegistryForm from '@/components/RegistryForm'
import Footer from '@/components/Footer'
import MobileStickyCTA from '@/components/MobileStickyCTA'

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <Metrics />
      <RegistryForm />
      <Footer />
      <MobileStickyCTA />
    </main>
  )
}
