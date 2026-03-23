import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Luna CRM — AI CRM para Clínicas de Estética Premium',
  description:
    'O Luna CRM unifica agendamento, WhatsApp, IA e automações em uma plataforma premium. Projetado exclusivamente para clínicas de estética que faturam alto.',
  keywords: [
    'CRM estética', 'CRM clínica', 'CRM dermatologia',
    'agendamento clínica', 'WhatsApp CRM', 'IA para clínicas',
    'gestão clínica estética', 'Luna CRM',
  ],
  authors: [{ name: 'EB Develop' }],
  creator: 'EB Develop',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://lunacrm.com.br',
    siteName: 'Luna CRM',
    title: 'Luna CRM — AI CRM para Clínicas de Estética Premium',
    description:
      'Unifique agendamento, WhatsApp, IA e automações em uma plataforma premium para clínicas de estética.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
