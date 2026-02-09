import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How do I get started with BuildFlow?',
      answer: 'Getting started is simple. Sign up for a free account, connect your repository, and you\'re ready to deploy. Our onboarding wizard guides you through everything in under 5 minutes. No credit card required for the first 30 days.'
    },
    {
      question: 'What kind of support do you offer?',
      answer: 'We offer 24/7 community support for all plans. Professional and Enterprise customers get priority email support with 1-hour response times, plus access to a dedicated Slack channel with our support team.'
    },
    {
      question: 'Can I use BuildFlow with my existing CI/CD pipeline?',
      answer: 'Absolutely. BuildFlow integrates seamlessly with GitHub Actions, GitLab CI, Jenkins, CircleCI, and dozens of other platforms. We also provide a REST API for custom integrations.'
    },
    {
      question: 'What about data privacy and security?',
      answer: 'We take security seriously. All data is encrypted at rest and in transit using industry-standard protocols. We\'re SOC 2 Type II compliant, GDPR compliant, and undergo regular third-party security audits.'
    },
    {
      question: 'Is there a free tier?',
      answer: 'Yes, our Starter plan includes free tier features: up to 5 team members, 100GB storage, and basic analytics. Perfect for evaluating BuildFlow before committing to a paid plan.'
    },
    {
      question: 'Can I export my data if I want to leave?',
      answer: 'Of course. You own your data. We provide full data export in multiple formats (JSON, CSV, etc.) at any time. There are no lock-in contracts, and you can cancel anytime.'
    }
  ]

  return (
    <section id="faq" className="relative py-32 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="heading-lg mb-6">
            Frequently asked <span className="accent">questions</span>
          </h2>
          <p className="text-lg text-gray-400">
            Can't find what you're looking for? Check our full documentation or contact support.
          </p>
        </div>

        <div className="space-y-px bg-gray-900/30 border border-gray-700/50 rounded-lg overflow-hidden">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-gray-700/50 last:border-b-0 hover:bg-gray-900/50 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="accordion-button px-8"
              >
                {faq.question}
                <svg
                  className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              <div
                className={`accordion-content px-8 overflow-hidden transition-all duration-300 ${
                  openIndex === i ? 'open' : ''
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-secondary">
              📧 Contact Support
            </button>
            <button className="btn-secondary">
              📚 View Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}