import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-gray-400 text-sm">© BuildFlow. All rights reserved.</span>
        <div className="flex gap-6 text-sm">
          <a href="#features" className="text-gray-400 hover:text-cyan-400 transition">Features</a>
          <a href="#pricing" className="text-gray-400 hover:text-cyan-400 transition">Pricing</a>
          <a href="#faq" className="text-gray-400 hover:text-cyan-400 transition">FAQ</a>
          <a href="#testimonials" className="text-gray-400 hover:text-cyan-400 transition">Testimonials</a>
        </div>
      </div>
    </footer>
  )
}
