export default function Hero({ scrollY }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      <div className="gradient-blur absolute inset-0 opacity-100"></div>

      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500 to-transparent rounded-full blur-3xl opacity-5"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div
            className="space-y-4 animate-fade-in"
            style={{
              opacity: Math.max(0, 1 - scrollY / 300),
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <div className="inline-block">
              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
                ✦ Introducing BuildFlow
              </span>
            </div>

            <h1 className="heading-xl leading-tight">
              Ship faster,
              <br />
              <span className="accent">ship smarter</span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed max-w-md">
              The platform built for teams that demand velocity without
              compromising craft. Deploy in seconds, iterate with confidence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn-primary">Start Free Trial</button>
            <button className="btn-secondary">Watch Demo</button>
          </div>

          <div className="flex items-center gap-8 pt-4 border-t border-gray-800">
            <div>
              <div className="text-2xl font-bold text-cyan-400">5K+</div>
              <p className="text-xs text-gray-500">Teams trusted</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">99.99%</div>
              <p className="text-xs text-gray-500">Uptime guarantee</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">24/7</div>
              <p className="text-xs text-gray-500">Support</p>
            </div>
          </div>
        </div>

        <div className="relative h-96 lg:h-full min-h-96 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent rounded-2xl"></div>

          <div className="absolute top-12 right-0 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl"></div>

          <div className="relative space-y-4">
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 backdrop-blur-sm transform hover:translate-x-2 transition">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-xs font-mono text-gray-400">
                  deploy-pipeline-v2
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>

            <div
              className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 backdrop-blur-sm transform hover:translate-x-4 transition"
              style={{ marginLeft: "40px" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-xs font-mono text-gray-400">
                  api-optimization
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 backdrop-blur-sm transform hover:translate-x-2 transition">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-xs font-mono text-gray-400">
                  security-audit
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
