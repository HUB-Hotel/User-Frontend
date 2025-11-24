import React, { useState, useEffect } from 'react';
import SearchCard from './SearchCard';
import './style/HeroSection.scss';

const heroImages = [
  'https://images.unsplash.com/photo-1501117716987-c8e1ecb210ab?auto=format&fit=crop&w=1600&q=80', // 호텔
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80', // 파리
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80', // 도쿄
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80', // 뉴욕
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80', // 부산
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80', // 런던
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // 5초마다 이미지 변경

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-background">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <span className="badge">신청해보세요</span>
          <h1 className="hero-title">호텔 및 다양한 숙소를 확인하세요!</h1>
          <p className="hero-description">
            나라별 숙소 요금을 비교하고 여행 준비를 확인하세요!
          </p>
          <SearchCard />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

