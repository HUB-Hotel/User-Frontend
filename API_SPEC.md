# API 명세서

백엔드 개발자를 위한 API 엔드포인트 명세서입니다.

## 기본 설정

- Base URL: `http://localhost:3000/api` (개발 환경)
- 인증: JWT Bearer Token (Authorization 헤더)
- Content-Type: `application/json`

## 인증 API (`/auth`)

### 1. 로그인
```
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: {
  token: string,
  user: {
    id: number,
    name: string,
    email: string
  }
}
```

### 2. 회원가입
```
POST /auth/signup
Body: {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string
}
Response: {
  token: string,
  user: {
    id: number,
    name: string,
    email: string
  }
}
```

### 3. 비밀번호 찾기
```
POST /auth/forgot-password
Body: {
  email: string,
  name: string
}
Response: {
  password: string
}
```

### 4. 현재 사용자 정보 조회
```
GET /auth/me
Headers: Authorization: Bearer {token}
Response: {
  id: number,
  name: string,
  email: string,
  phone: string,
  address: string,
  birthDate: string
}
```

### 5. 로그아웃
```
POST /auth/logout
Headers: Authorization: Bearer {token}
Response: { message: string }
```

## 사용자 정보 API (`/user`)

### 1. 사용자 정보 조회
```
GET /user/info
Headers: Authorization: Bearer {token}
Response: {
  name: string,
  email: string,
  phone: string,
  address: string,
  birthDate: string
}
```

### 2. 사용자 정보 수정
```
PUT /user/info
Headers: Authorization: Bearer {token}
Body: {
  name?: string,
  email?: string,
  phone?: string,
  address?: string,
  birthDate?: string
}
Response: {
  name: string,
  email: string,
  phone: string,
  address: string,
  birthDate: string
}
```

### 3. 비밀번호 변경
```
PUT /user/password
Headers: Authorization: Bearer {token}
Body: {
  currentPassword: string,
  newPassword: string
}
Response: { message: string }
```

## 결제수단 API (`/user/payment-methods`)

### 1. 결제수단 목록 조회
```
GET /user/payment-methods
Headers: Authorization: Bearer {token}
Response: {
  paymentMethods: [
    {
      id: string,
      label: string,
      brand: string,
      cardNumber: string,
      expDate: string,
      cardName: string,
      country: string
    }
  ]
}
```

### 2. 결제수단 추가
```
POST /user/payment-methods
Headers: Authorization: Bearer {token}
Body: {
  cardNumber: string,
  expDate: string,
  cvc: string,
  cardName: string,
  country: string
}
Response: {
  id: string,
  label: string,
  brand: string,
  cardNumber: string,
  expDate: string,
  cardName: string,
  country: string
}
```

### 3. 결제수단 삭제
```
DELETE /user/payment-methods/:cardId
Headers: Authorization: Bearer {token}
Response: { message: string }
```

## 숙소 API (`/hotels`)

### 1. 숙소 검색
```
GET /hotels/search
Query Parameters:
  - destination: string (예: "서울, 대한민국")
  - checkIn: string (YYYY-MM-DD)
  - checkOut: string (YYYY-MM-DD)
  - rooms: number
  - guests: number
  - type?: 'hotel' | 'motel' | 'resort' | 'all'
  - minPrice?: number
  - maxPrice?: number
  - minRating?: number
  - freebies?: string[]
  - amenities?: string[]
  - sortBy?: 'recommended' | 'price_low' | 'price_high' | 'rating'
  - page?: number
  - limit?: number

Response: {
  hotels: Hotel[],
  total: number,
  page: number,
  limit: number
}
```

### 2. 숙소 상세 정보
```
GET /hotels/:id
Response: {
  id: number,
  name: string,
  price: number,
  address: string,
  destination: string,
  type: string,
  starRating: number,
  amenitiesCount: number,
  reviewScore: number,
  reviewText: string,
  reviewCount: number,
  images: string[],
  freebies: {...},
  amenities: {...},
  description: string,
  rooms: Room[]
}
```

### 3. 인기 숙소 추천
```
GET /hotels/recommended?limit=4
Response: {
  hotels: Hotel[]
}
```

## 예약 API (`/bookings`)

### 1. 예약 생성
```
POST /bookings
Headers: Authorization: Bearer {token}
Body: {
  hotelId: number,
  roomId: number,
  checkIn: string (YYYY-MM-DD),
  checkOut: string (YYYY-MM-DD),
  rooms: number,
  guests: number,
  paymentMethodId: string,
  phoneNumber: string,
  couponCode?: string,
  totalPrice: number
}
Response: {
  bookingId: string,
  bookingNumber: string,
  hotelName: string,
  roomName: string,
  checkInDate: string,
  checkOutDate: string,
  totalPrice: number,
  createdAt: string
}
```

### 2. 예약 내역 조회
```
GET /bookings
Headers: Authorization: Bearer {token}
Response: {
  bookings: Booking[]
}
```

### 3. 예약 상세 조회
```
GET /bookings/:bookingId
Headers: Authorization: Bearer {token}
Response: {
  bookingId: string,
  bookingNumber: string,
  hotelName: string,
  roomName: string,
  checkInDate: string,
  checkOutDate: string,
  totalPrice: number,
  status: string,
  createdAt: string
}
```

### 4. 예약 취소
```
DELETE /bookings/:bookingId
Headers: Authorization: Bearer {token}
Response: { message: string }
```

## 찜하기 API (`/favorites`)

### 1. 찜한 숙소 목록 조회
```
GET /favorites
Headers: Authorization: Bearer {token}
Response: {
  hotelIds: number[]
}
```

### 2. 찜하기 추가
```
POST /favorites
Headers: Authorization: Bearer {token}
Body: {
  hotelId: number
}
Response: { message: string }
```

### 3. 찜하기 삭제
```
DELETE /favorites/:hotelId
Headers: Authorization: Bearer {token}
Response: { message: string }
```

## 에러 응답 형식

모든 API는 에러 발생 시 다음 형식으로 응답합니다:

```json
{
  "message": "에러 메시지",
  "error": "에러 코드 (선택사항)"
}
```

HTTP 상태 코드:
- 200: 성공
- 201: 생성 성공
- 400: 잘못된 요청
- 401: 인증 실패
- 403: 권한 없음
- 404: 리소스 없음
- 500: 서버 에러

