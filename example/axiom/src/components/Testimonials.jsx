import { useEffect, useState } from 'react'

export default function Testimonials({ scrollY }) {
  const [visibleTestimonials, setVisibleTestimonials] = useState(new Array(3).fill(false))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index)
            setVisibleTestimonials((prev) => {
              const newArray = [...prev]
              newArray[index] = true
              return newArray
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    document.querySelectorAll('[data-testimonial-index]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const testimonials = [
    {
      quote: "BuildFlow cut our deployment time by 80%. We went from 30-minute deploys to 3 minutes. It's a game-changer for our velocity.",
      author: 'Sarah Chen',
      role: 'VP Engineering',
      company: 'TechFlow Inc',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      quote: "The real-time collaboration features are incredible. Our entire team stays in sync without endless Slack threads and status updates.",
      author: 'Marcus Rodriguez',
      role: 'Product Lead',
      company: 'Velocity Labs',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      quote: "We've tried everything in this space. BuildFlow is the first platform that actually understands how modern teams work. Worth every penny.",
      author: 'Emma Williams',
      role: 'CTO',
      company: 'NextGen Systems',
      avatar: '👩‍💻',
      rating: 5
    }
  ]

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="heading-lg mb-6">
            Loved by <span className="accent">engineering teams</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover why thousands of teams trust BuildFlow for their most critical deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              data-testimonial-index={i}
              className={`transition-all duration-700 ${
                visibleTestimonials[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="testimonial-card">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating).fill(null).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-base leading-relaxed mb-6 text-gray-300">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-700/50">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-white text-sm">{testimonial.author}</p>
                    <p className="text-xs text-gray-400">
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof section */}
        <div className="mt-24 bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-700/30 rounded-xl p-12 text-center">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">98%</div>
              <p className="text-sm text-gray-400">Customer satisfaction</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">5,000+</div>
              <p className="text-sm text-gray-400">Active teams</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">$2.3B</div>
              <p className="text-sm text-gray-400">Deployments processed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}