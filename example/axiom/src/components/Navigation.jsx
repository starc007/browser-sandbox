export default function Navigation({ scrollY }) {
  return (
    <nav className="nav-sticky">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-sm flex items-center justify-center">
            <span className="text-black font-black text-sm">B</span>
          </div>
          <span className="text-lg font-bold tracking-tight">BuildFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-400 hover:text-cyan-400 transition text-sm font-medium">
            Features
          </a>
          <a href="#pricing" className="text-gray-400 hover:text-cyan-400 transition text-sm font-medium">
            Pricing
          </a>
          <a href="#faq" className="text-gray-400 hover:text-cyan-400 transition text-sm font-medium">
            FAQ
          </a>
          <a href="#testimonials" className="text-gray-400 hover:text-cyan-400 transition text-sm font-medium">
            Social Proof
          </a>
        </div>

        <button className="btn-primary text-sm">
          Get Started
        </button>
      </div>
    </nav>
  )
}