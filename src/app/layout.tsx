import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Luna CRM — CRM para Clínicas de Estética',
  description: 'CRM premium especializado em clínicas de estética corporal e harmonização facial. Pipeline visual, WhatsApp integrado, IA especialista, Radar de Retenção Biológico.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
