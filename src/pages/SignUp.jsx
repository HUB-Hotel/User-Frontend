import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaFacebook, FaGoogle, FaApple } from 'react-icons/fa';
import './style/Login.scss';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: 'john.doe@gmail.com',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreed) {
      setError('동의하기를 체크해주세요.');
      return;
    }

    // 회원가입 성공
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', formData.email);
    navigate('/');
  };

  return (
    <div className="auth-page signup-page">
      <div className="auth-container">
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

        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            <h1 className="auth-title">회원가입</h1>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">이름</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="이름"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">성</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="성"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">이메일</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="이메일"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">전화번호</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="전화번호"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">비밀번호</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호"
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

              <div className="form-group">
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="비밀번호 확인"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>동의하기</span>
              </label>

              <button type="submit" className="btn-primary">
                계정 생성
              </button>
            </form>

            <div className="auth-footer">
              <span>이미 계정이 있으신가요? </span>
              <Link to="/login" className="signup-link">
                로그인
              </Link>
            </div>

            <div className="divider">
              <span>또는 다음으로 가입하기</span>
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
      </div>
    </div>
  );
};

export default SignUp;

