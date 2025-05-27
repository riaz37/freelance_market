import React from 'react';
import Link from 'next/link';

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">FreelanceMarket</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with
            <span className="text-blue-600"> talented freelancers</span>
            <br />
            and exciting projects
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            FreelanceMarket is the modern platform where skilled professionals meet innovative projects.
            Build your career or find the perfect team member with real-time collaboration tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Start as a Freelancer
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Hire Talent
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Launch Your Career</h3>
            <p className="text-gray-600">
              Find projects that match your skills and build a successful freelance career with our advanced matching system.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💼</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Hire Top Talent</h3>
            <p className="text-gray-600">
              Connect with skilled professionals from around the world and build your dream team for any project.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Collaboration</h3>
            <p className="text-gray-600">
              Stay connected with live updates, instant messaging, and real-time project tracking tools.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Freelancers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">5K+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals already using FreelanceMarket
          </p>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
                <span className="ml-2 text-xl font-bold">FreelanceMarket</span>
              </div>
              <p className="text-gray-400">
                The modern platform connecting talented professionals with exciting projects.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Freelancers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-white">Find Work</Link></li>
                <li><Link href="/register" className="hover:text-white">Build Profile</Link></li>
                <li><Link href="/register" className="hover:text-white">Get Paid</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/register" className="hover:text-white">Post Projects</Link></li>
                <li><Link href="/register" className="hover:text-white">Find Talent</Link></li>
                <li><Link href="/register" className="hover:text-white">Manage Teams</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/admin" className="hover:text-white">Admin Panel</Link></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FreelanceMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
