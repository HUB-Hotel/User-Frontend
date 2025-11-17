# ERD 검토 보고서

현재 ERD를 분석한 결과, 다음과 같은 누락된 부분과 개선 사항이 있습니다.

## 🔴 필수 추가 테이블

### 1. PaymentMethod (결제수단) 테이블
**문제점**: 
- 현재 User 테이블에 `payment_method varchar(50)` 하나만 있어서 여러 결제수단을 저장할 수 없음
- 프론트엔드에서 결제수단을 여러 개 추가/삭제하는 기능이 있음

**추가 필요**:
```sql
PaymentMethod (
  payment_method_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  card_number VARCHAR(20) NOT NULL,  -- 마스킹된 번호 또는 암호화
  card_name VARCHAR(50) NOT NULL,
  exp_date VARCHAR(10) NOT NULL,  -- MM/YY 형식
  card_brand VARCHAR(20),  -- VISA, MASTER, etc.
  country VARCHAR(50) DEFAULT '대한민국',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
)
```

### 2. UserProfile (사용자 프로필) 테이블
**문제점**:
- Account 페이지에서 프로필 이미지와 배경 이미지를 선택하는 기능이 있음
- User 테이블에 이미지 관련 컬럼이 없음

**추가 필요**:
```sql
UserProfile (
  user_id INT PRIMARY KEY,
  profile_image_url TEXT,
  cover_image_url TEXT,
  profile_color VARCHAR(20),  -- 프로필 아이콘 색상
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
)
```

### 3. Business (사업자) 테이블
**문제점**:
- 여러 테이블에 `business_id`가 있는데 Business 테이블이 없음
- 사업자 정보를 관리할 수 없음

**추가 필요**:
```sql
Business (
  business_id INT PRIMARY KEY AUTO_INCREMENT,
  business_name VARCHAR(100) NOT NULL,
  business_number VARCHAR(50) UNIQUE,  -- 사업자 등록번호
  owner_name VARCHAR(50) NOT NULL,
  phone VARCHAR(13) NOT NULL,
  email VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

## 🟡 수정 필요한 테이블

### 1. User 테이블
**문제점**:
- `payment_method varchar(50)`: 여러 결제수단을 저장할 수 없음 → PaymentMethod 테이블로 분리 필요
- `status Enum`: "사용 전, 사용 중, 사용 후"는 예약 상태인 것 같음. 사용자 상태는 'active', 'inactive', 'banned' 등이 적절
- `ENUM` 컬럼명이 이상함 → `role` 또는 `user_role`로 변경 필요

**수정 사항**:
```sql
-- 제거: payment_method (PaymentMethod 테이블로 이동)
-- 수정: ENUM → role ENUM('user', 'admin', 'business') DEFAULT 'user'
-- 수정: status ENUM('active', 'inactive', 'banned') DEFAULT 'active'
-- 추가: address VARCHAR(255) (현재 API 명세서에 있음)
```

### 2. Room 테이블
**문제점**:
- `room_price` 또는 `price` 컬럼이 없음
- 프론트엔드에서 `room.price`를 사용하고 있음

**추가 필요**:
```sql
-- 추가: price INT NOT NULL DEFAULT 0  -- 객실 가격
-- 추가: description TEXT  -- 객실 설명
```

### 3. Lodging 테이블
**문제점**:
- `user_name`: 리뷰 작성 회원 이름이 Lodging 테이블에 있는 것은 이상함 → Review 테이블로 이동 필요
- `reservation_id`: Lodging은 여러 예약을 가질 수 있는데 FK로 있으면 안 됨 → 제거 필요
- `adress` → `address` 오타 수정
- `image` 단수형 → `images` 또는 별도 테이블로 분리 고려

**수정 사항**:
```sql
-- 제거: user_name (Review 테이블로 이동)
-- 제거: reservation_id (Lodging은 여러 예약을 가질 수 있음)
-- 수정: adress → address
-- 추가: price INT  -- 기본 가격 (Room별로 다를 수 있으므로 참고용)
-- 추가: latitude DECIMAL(10, 8)  -- 위도 (지도 표시용)
-- 추가: longitude DECIMAL(11, 8)  -- 경도 (지도 표시용)
```

### 4. Payment 테이블
**문제점**:
- `PK` 컬럼명이 이상함 → `reservation_id`로 변경 필요
- `user_id2` → `user_id`로 변경 필요
- `Room_ID` → `room_id`로 변경 필요 (소문자, 언더스코어)
- `coupon_name`으로 FK 연결하는 것보다 `coupon_id`가 더 적절

**수정 사항**:
```sql
-- 수정: PK → reservation_id
-- 수정: user_id2 → user_id
-- 수정: Room_ID → room_id
-- 수정: coupon_name → coupon_id INT (Coupon 테이블에 coupon_id 추가 필요)
```

### 5. Coupon 테이블
**문제점**:
- `coupon_name`이 PK인데, `coupon_code`가 Unique임
- `coupon_id`를 PK로 하고 `coupon_code`를 Unique로 하는 것이 더 적절
- `vaild_from` → `valid_from`, `valid_to` 추가 필요 (유효기간 종료일)

**수정 사항**:
```sql
-- 추가: coupon_id INT PRIMARY KEY AUTO_INCREMENT
-- 수정: coupon_name → name VARCHAR(255)
-- 수정: vaild_from → valid_from DATE
-- 추가: valid_to DATE NOT NULL
-- 수정: coupon_code VARCHAR(255) UNIQUE NOT NULL
```

### 6. Reservation 테이블
**문제점**:
- `adult`, `child`로 나뉘어 있는데, 프론트엔드에서는 `guests`로 통합 사용
- `rooms` 개수 정보가 없음 (객실 수)

**수정 사항**:
```sql
-- 추가: rooms INT NOT NULL DEFAULT 1  -- 예약한 객실 수
-- 수정: adult, child → guests INT NOT NULL (또는 adult, child 유지하고 guests는 계산)
```

### 7. Review 테이블
**문제점**:
- `ceated_on` → `created_on` 오타 수정
- `business_id`가 있는데 Review는 Reservation과 연결되어야 함
- `user_name` 컬럼 추가 필요 (Lodging에서 이동)

**수정 사항**:
```sql
-- 수정: ceated_on → created_on
-- 제거: business_id (Review는 Reservation을 통해 연결됨)
-- 추가: user_name VARCHAR(50)  -- 리뷰 작성자 이름 (Lodging에서 이동)
-- 추가: lodging_id INT  -- 숙소 ID (직접 연결)
```

## 🟢 추가 고려 사항

### 1. 이미지 관리
- Lodging, Room의 이미지가 여러 개일 수 있음
- 별도 테이블로 분리 고려:
```sql
LodgingImage (
  image_id INT PRIMARY KEY AUTO_INCREMENT,
  lodging_id INT NOT NULL,
  image_url TEXT NOT NULL,
  image_order INT DEFAULT 0,
  FOREIGN KEY (lodging_id) REFERENCES Lodging(lodging_id) ON DELETE CASCADE
)

RoomImage (
  image_id INT PRIMARY KEY AUTO_INCREMENT,
  room_id INT NOT NULL,
  image_url TEXT NOT NULL,
  image_order INT DEFAULT 0,
  FOREIGN KEY (room_id) REFERENCES Room(room_id) ON DELETE CASCADE
)
```

### 2. Amenities (편의시설) 관리
- 현재 Lodging에 amenities 정보가 명확하지 않음
- 별도 테이블로 분리 고려:
```sql
Amenity (
  amenity_id INT PRIMARY KEY AUTO_INCREMENT,
  amenity_name VARCHAR(50) NOT NULL,
  amenity_type ENUM('facility', 'service', 'freebie') NOT NULL,
  icon VARCHAR(50)  -- 아이콘 이름
)

LodgingAmenity (
  lodging_id INT NOT NULL,
  amenity_id INT NOT NULL,
  PRIMARY KEY (lodging_id, amenity_id),
  FOREIGN KEY (lodging_id) REFERENCES Lodging(lodging_id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES Amenity(amenity_id) ON DELETE CASCADE
)
```

### 3. Room 가격 이력
- 날짜별로 가격이 변동될 수 있음
- 별도 테이블 고려:
```sql
RoomPrice (
  price_id INT PRIMARY KEY AUTO_INCREMENT,
  room_id INT NOT NULL,
  date DATE NOT NULL,
  price INT NOT NULL,
  FOREIGN KEY (room_id) REFERENCES Room(room_id) ON DELETE CASCADE,
  UNIQUE KEY (room_id, date)
)
```

## 📋 요약

### 필수 추가
1. ✅ PaymentMethod 테이블
2. ✅ UserProfile 테이블
3. ✅ Business 테이블

### 필수 수정
1. ✅ User 테이블: payment_method 제거, role/status 수정
2. ✅ Room 테이블: price 추가
3. ✅ Lodging 테이블: 불필요한 컬럼 제거, 오타 수정
4. ✅ Payment 테이블: 컬럼명 수정, coupon_id로 변경
5. ✅ Coupon 테이블: coupon_id 추가, valid_to 추가
6. ✅ Reservation 테이블: rooms 추가
7. ✅ Review 테이블: 오타 수정, user_name 추가

### 선택적 추가 (향후 확장)
- LodgingImage, RoomImage 테이블
- Amenity, LodgingAmenity 테이블
- RoomPrice 테이블

