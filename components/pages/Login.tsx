
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../App';

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@cras.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authContext?.login(email, password);
      if (!user) {
        setError('Email ou senha inválidos.');
      }
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <svg width="48" height="48" viewBox="0 0 32 32">
                <defs>
                    <linearGradient x1="28.538%" y1="20.229%" x2="100%" y2="108.156%" id="logo-a">
                        <stop stopColor="#fff" stopOpacity=".8" offset="0%"></stop>
                        <stop stopColor="#fff" offset="100%"></stop>
                    </linearGradient>
                    <linearGradient x1="88.638%" y1="29.267%" x2="22.42%" y2="100%" id="logo-b">
                        <stop stopColor="#38bdf8" stopOpacity="0" offset="0%"></stop>
                        <stop stopColor="#38bdf8" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <rect fill="#0ea5e9" width="32" height="32" rx="16"></rect>
                <path d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16A16 16 0 010 16C0 7.938 5.965 1.267 13.723.16c.784-.108 1.519.08 2.112.639.593.56 1.02 1.288 1.11 2.133l.623 5.854c.14 1.32.76 2.534 1.658 3.432.897.9 2.108 1.52 3.428 1.66l5.854.623c.845.09 1.573.517 2.133 1.11.56.593.747 1.328.64 2.112-.108.784-.39 1.519-.81 2.112a16 16 0 01-22.628-22.628c.593-.42 1.328-.702 2.112-.81.845-.09 1.573.18 2.133.747l.01.01z" fill="url(#logo-a)"></path>
                <path d="M13.823 28.192c-1.32-.14-2.534-.76-3.432-1.658-.9-.897-1.52-2.108-1.66-3.428l-.623-5.854c-.09-.845-.517-1.573-1.11-2.133-.593-.56-1.328-.747-2.112-.64-.784.108-1.519.39-2.112.81a16 16 0 0022.628 22.628c.42-.593.702-1.328.81-2.112.09-.845-.18-1.573-.747-2.133l-.01-.01z" fill="url(#logo-b)"></path>
            </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          CRAS Agendamentos
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
              </div>
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
