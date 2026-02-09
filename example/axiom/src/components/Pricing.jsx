import { useEffect, useState } from "react";

export default function Pricing({ scrollY }) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [visiblePricing, setVisiblePricing] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisiblePricing(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById("pricing-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      name: "Starter",
      description: "For individuals and small projects",
      price: isAnnual ? 29 : 39,
      features: [
        "Up to 5 team members",
        "100GB storage",
        "Basic analytics",
        "Community support",
        "Standard deployments",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      description: "For growing teams",
      price: isAnnual ? 89 : 119,
      features: [
        "Unlimited team members",
        "1TB storage",
        "Advanced analytics",
        "Priority support",
        "Zero-downtime deploys",
        "Custom workflows",
        "API access",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      description: "For organizations at scale",
      price: "Custom",
      features: [
        "Unlimited everything",
        "Dedicated support",
        "SLA guarantee",
        "Custom integrations",
        "Advanced security",
        "On-premises option",
        "Account manager",
      ],
      highlighted: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative py-32 overflow-hidden"
      ref={() => {}}
    >
      <div id="pricing-section" className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">
            Simple, <span className="accent">transparent pricing</span>
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Choose the perfect plan for your team. Always flexible, always fair.
          </p>

          {/* Toggle for annual/monthly */}
          <div className="inline-flex items-center gap-4 bg-gray-900/50 border border-gray-700 rounded-full p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full transition font-semibold text-sm ${
                !isAnnual
                  ? "bg-cyan-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full transition font-semibold text-sm ${
                isAnnual
                  ? "bg-cyan-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Annual <span className="text-xs ml-1">Save 25%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative group transition-all duration-700 ${
                visiblePricing
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className={`relative rounded-xl border overflow-hidden ${
                  plan.highlighted
                    ? "pricing-highlight bg-gradient-to-br from-gray-900/80 to-black/80"
                    : "bg-gray-900/30 border-gray-700/50 hover:border-gray-600"
                } transition-all duration-300`}
              >
                {/* Badge for highlighted plan */}
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-cyan-500 text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8 space-y-8">
                  {/* Plan name and description */}
                  <div>
                    <h3 className="heading-md text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-gray-700/50 pt-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      {typeof plan.price === "number" ? (
                        <>
                          <span className="text-4xl font-bold text-white">
                            ${plan.price}
                          </span>
                          <span className="text-gray-400">/month</span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-white">
                          {plan.price}
                        </span>
                      )}
                    </div>
                    {isAnnual && typeof plan.price === "number" && (
                      <p className="text-xs text-gray-500">Billed annually</p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all text-sm ${
                      plan.highlighted
                        ? "btn-primary w-full hover:shadow-lg hover:shadow-cyan-500/50"
                        : "btn-secondary w-full"
                    }`}
                  >
                    {plan.highlighted ? "Start Free Trial" : "Get Started"}
                  </button>

                  {/* Features list */}
                  <div className="border-t border-gray-700/50 pt-8 space-y-4">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-2">Need a custom plan?</p>
          <button className="text-cyan-400 hover:text-cyan-300 transition font-semibold inline-flex items-center gap-2">
            Contact our sales team
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
