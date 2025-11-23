import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OtpLogin() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { requestOtp, loginWithOtp } = useAuth();
  const navigate = useNavigate();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await requestOtp(email);
      setStep('otp');
      alert('OTP sent to your email');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithOtp(email, otp);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Login with OTP</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 text-white font-medium py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition"
            >
              {loading ? 'Sending...' : 'Request OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginOtp} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email: {email}</label>
              <input type="hidden" value={email} />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 text-white font-medium py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full bg-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Back
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Or{' '}
            <a href="/login" className="text-purple-500 hover:underline">
              Login with Password
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
