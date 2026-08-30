'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AlertCircle, Loader2 } from 'lucide-react';

const demoCredentials = [
  { email: 'central@ministry.gov', password: 'password123', role: 'Central Ministry Officer' },
  { email: 'state@officer.gov', password: 'password123', role: 'State Government Officer' },
  { email: 'district@admin.gov', password: 'password123', role: 'District Administration Officer' },
  { email: 'field@officer.gov', password: 'password123', role: 'Field Officer' },
  { email: 'finance@dept.gov', password: 'password123', role: 'Finance Officer' },
  { email: 'rr@officer.gov', password: 'password123', role: 'R&R Officer' },
  { email: 'viewer@system.gov', password: 'password123', role: 'Viewer' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('central@ministry.gov');
  const [password, setPassword] = useState('password123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    router.push('/dashboard');
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    await login(demoEmail, demoPassword);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gov-navy via-gov-800 to-gov-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🇮🇳</div>
          <h1 className="text-3xl font-bold text-white mb-2">Land Acquisition</h1>
          <p className="text-gov-300">National Management System</p>
          <p className="text-gov-400 text-sm mt-2">Ministry of Rural Development</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gov-800 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-accent focus:border-transparent"
                placeholder="your.email@gov.in"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-accent focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gov-accent hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="bg-white bg-opacity-10 backdrop-blur rounded-2xl p-6 border border-white border-opacity-20">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span>📋</span> Demo Credentials
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {demoCredentials.map((cred) => (
              <button
                key={cred.email}
                onClick={() => handleDemoLogin(cred.email, cred.password)}
                className="w-full text-left p-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition text-white text-sm border border-white border-opacity-10 hover:border-opacity-30"
              >
                <div className="font-medium">{cred.role}</div>
                <div className="text-xs text-gov-300">{cred.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gov-300 text-sm">
          <p>🔒 Secure Government Portal</p>
          <p className="mt-2 text-xs text-gov-400">For official use only | © 2024 Ministry of Rural Development</p>
        </div>
      </div>
    </div>
  );
}
