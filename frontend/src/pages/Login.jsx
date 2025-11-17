import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaFacebook, FaGoogle, FaApple } from 'react-icons/fa';
import './style/Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 로그인 검증: id는 1111, 비밀번호는 1111
    if (email === '1111' && password === '1111') {
      // 로그인 성공
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      // 로그인 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } else {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <h1 className="auth-title">Login</h1>
            <p className="auth-subtitle">로그인해주세요</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>비밀번호기억하기</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  비밀번호 찾기
                </Link>
              </div>

              <button type="submit" className="btn-primary">
                Login
              </button>
            </form>

            <div className="auth-footer">
              <Link to="/signup" className="signup-link">
                회원가입
              </Link>
            </div>

            <div className="divider">
              <span>Or login with</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn facebook">
                <FaFacebook />
              </button>
              <button type="button" className="social-btn google">
                <FaGoogle />
              </button>
              <button type="button" className="social-btn apple">
                <FaApple />
              </button>
            </div>
          </div>
        </div>

        <div className="auth-image-section">
          <div className="image-carousel">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
              alt="Resort"
            />
            <div className="carousel-indicators">
              <span className="indicator active"></span>
              <span className="indicator"></span>
              <span className="indicator"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

