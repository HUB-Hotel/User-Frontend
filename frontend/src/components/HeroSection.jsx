import React, { useEffect, useState } from 'react';
import SearchCard from './SearchCard';
import './style/HeroSection.scss';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1501117716987-c8e1ecb210ab?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbf6db?auto=format&fit=crop&w=1600&q=80',
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length),
      6000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-background">
          {HERO_IMAGES.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`추천 숙소 이미지 ${index + 1}`}
              className={index === currentSlide ? 'active' : ''}
            />
          ))}
          <div className="hero-overlay" />
          <div className="hero-indicators">
            {HERO_IMAGES.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`배경 이미지 ${index + 1} 보기`}
              />
            ))}
          </div>
        </div>
        <div className="hero-content">
          <span className="badge">Stay better with HotelBnB</span>
          <h1 className="hero-title">호텔부터 BnB까지, 나만의 숙소를 찾아보세요.</h1>
          <p className="hero-description">
            호텔부터 감성 숙소까지, 여행지에서도 집처럼 편안한 공간을 HotelBnB에서 만나보세요.
          </p>
          <SearchCard />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

