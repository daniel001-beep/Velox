import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { AuthContext } from './AuthContext';

export default function Account() {
  const { login, register, user } = useContext(AuthContext);
  const [authState, setAuthState] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/products');
    }
  }, [user, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage({ show: false, text: '', type: '' });
    setLoading(true);

    try {
      if (authState === 'signin') {
        await login(email, password);
        setMessage({ show: true, text: 'Signed in successfully!', type: 'success' });
      } else {
        await register(email, password, name);
        setMessage({ show: true, text: 'Account created successfully!', type: 'success' });
      }
    } catch (error) {
      const errorMessage = error.code === 'auth/user-not-found' ? 'User not found.' : 
                         error.code === 'auth/wrong-password' ? 'Incorrect password.' :
                         error.code === 'auth/email-already-in-use' ? 'Email already in use.' :
                         'Authentication failed. Please try again.';
      setMessage({ show: true, text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-page-wrapper">
      <div className="auth-container">
        {authState === 'signin' ? (
          <div className="signin-view glass-morphism">
            <div className="auth-header text-center">
              <h2>Welcome Back</h2>
              <p>Enter your credentials to access your store</p>
            </div>
            <form onSubmit={handleAuth} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@example.com" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <div className="auth-footer text-center">
              <p>Don't have an account? <span onClick={() => setAuthState('signup')}>Create one</span></p>
            </div>
          </div>
        ) : (
          <div className="signup-view creative-morphism">
            <div className="row">
              <div className="col-md-6 signup-intro">
                <h2>Join the Elite</h2>
                <p>Create an account to start your journey with RedStore and get exclusive access to new drops.</p>
                <ul className="perks-list">
                  <li><i className="fas fa-check-circle"></i> Early access to sales</li>
                  <li><i className="fas fa-check-circle"></i> Global shipping tracking</li>
                  <li><i className="fas fa-check-circle"></i> Membership rewards</li>
                </ul>
              </div>
              <div className="col-md-6 signup-form-container">
                <div className="auth-header">
                  <h3>Sign Up</h3>
                </div>
                <form onSubmit={handleAuth} className="auth-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="John Doe" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="name@example.com" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Min. 8 characters" 
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-accent w-100" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Get Started'}
                  </button>
                </form>
                <div className="auth-footer text-center">
                  <p>Already a member? <span onClick={() => setAuthState('signin')}>Sign in</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {message.show && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
