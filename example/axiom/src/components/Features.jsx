import { useEffect, useState } from 'react'

export default function Features({ scrollY }) {
  const [visibleCards, setVisibleCards] = useState(new Array(6).fill(false))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index)
            setVisibleCards((prev) => {
              const newArray = [...prev]
              newArray[index] = true
              return newArray
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-index]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly. See changes as they happen across your entire team in real-time.',
      icon: '⚡',
      delay: 0
    },
    {
      title: 'Zero-Downtime Deploys',
      description: 'Ship updates without interrupting service. Our intelligent deployment system handles the complexity.',
      icon: '🚀',
      delay: 1
    },
    {
      title: 'Comprehensive Analytics',
      description: 'Track every metric that matters. Deep insights into performance, user behavior, and system health.',
      icon: '📊',
      delay: 2
    },
    {
      title: 'Advanced Security',
      description: 'Enterprise-grade encryption and compliance. Your data stays protected with our multi-layer architecture.',
      icon: '🔒',
      delay: 3
    },
    {
      title: 'Custom Workflows',
      description: 'Build automation that fits your team. Flexible workflow engine with no-code configuration.',
      icon: '⚙️',
      delay: 4
    },
    {
      title: 'Global Infrastructure',
      description: 'Deploy anywhere globally. Edge computing with sub-50ms latency across all major regions.',
      icon: '🌍',
      delay: 5
    }
  ]

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="heading-lg mb-6">
            Built for <span className="accent">modern teams</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need to move fast without breaking things. Powerful tools designed for precision and speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Diagonal accent line */}
          <div 
            className="absolute -top-20 -left-40 w-96 h-1 bg-gradient-to-r from-cyan-500 to-transparent opacity-20"
            style={{ transform: 'rotate(-15deg)' }}
          ></div>

          {features.map((feature, i) => (
            <div
              key={i}
              data-index={i}
              className={`card-overlap relative group transition-all duration-700 ${
                visibleCards[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transform: `translateY(${i % 2 === 0 ? `${i * 8}px` : `${-i * 8}px`})`,
              }}
            >
              {/* Card background with border */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-lg border border-gray-700/50 group-hover:border-cyan-500/50 transition-colors"></div>
              
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-cyan-500/10 to-transparent"></div>
              
              {/* Content */}
              <div className="relative p-8 space-y-4">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="heading-md text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
                
                {/* Arrow accent */}
                <div className="pt-4 flex items-center gap-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-semibold">Learn more</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}