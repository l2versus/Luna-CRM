export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--luna-bg)' }}>
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-display" style={{ color: 'var(--luna-gold)' }}>
          Luna CRM
        </h1>
        <p className="text-xl" style={{ color: 'var(--luna-text-muted)' }}>
          CRM premium para clínicas de estética
        </p>
        <p className="text-sm" style={{ color: 'var(--luna-text-dim)' }}>
          Projeto em construção — EB Develop
        </p>
      </div>
    </main>
  )
}
