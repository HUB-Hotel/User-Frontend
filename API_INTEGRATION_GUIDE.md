# API 통합 가이드

## 개요

현재 프론트엔드는 localStorage를 사용하여 동작하고 있습니다. 백엔드 API가 준비되면 다음 단계로 통합할 수 있습니다.

## API 파일 구조

```
frontend/src/api/
├── client.js          # axios 인스턴스 및 인터셉터
├── authApi.js         # 인증 관련 API
├── userApi.js         # 사용자 정보 API
├── paymentApi.js      # 결제수단 API
├── hotelApi.js        # 숙소 관련 API
├── bookingApi.js      # 예약 관련 API
└── favoriteApi.js     # 찜하기 API
```

## 환경 변수 설정

`.env` 파일을 생성하고 API URL을 설정하세요:

```env
VITE_API_URL=http://localhost:3000/api
```

## 사용 예시

### 1. 로그인 페이지 (Login.jsx)

**현재 (localStorage 사용):**
```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  if (email === '1111' && password === '1111') {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  }
};
```

**API 통합 후:**
```javascript
import { login } from '../api/authApi';

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await login({ email, password });
    localStorage.setItem('token', response.token);
    localStorage.setItem('userInfo', JSON.stringify(response.user));
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  } catch (error) {
    setError(getErrorMessage(error, '로그인에 실패했습니다.'));
  }
};
```

### 2. Account 페이지 (Account.jsx)

**현재 (localStorage 사용):**
```javascript
const loadUserInfo = () => {
  const stored = localStorage.getItem('userInfo');
  return stored ? JSON.parse(stored) : defaultInfo;
};
```

**API 통합 후:**
```javascript
import { getUserInfo, updateUserInfo } from '../api/userApi';

useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const data = await getUserInfo();
      setUserInfo(data);
    } catch (error) {
      console.error('Failed to load user info', error);
    }
  };
  fetchUserInfo();
}, []);

const handleSave = async (field) => {
  try {
    const updatedInfo = { ...userInfo, [field]: tempValue };
    const data = await updateUserInfo(updatedInfo);
    setUserInfo(data);
    setEditingField(null);
    setTempValue('');
  } catch (error) {
    alert('정보 수정에 실패했습니다.');
  }
};
```

### 3. 결제수단 (Account.jsx)

**현재 (localStorage 사용):**
```javascript
useEffect(() => {
  const stored = localStorage.getItem('paymentMethods');
  if (stored) {
    setPaymentMethods(JSON.parse(stored));
  }
}, []);
```

**API 통합 후:**
```javascript
import { getPaymentMethods, addPaymentMethod, deletePaymentMethod } from '../api/paymentApi';

useEffect(() => {
  const fetchPaymentMethods = async () => {
    try {
      const data = await getPaymentMethods();
      setPaymentMethods(data.paymentMethods);
    } catch (error) {
      console.error('Failed to load payment methods', error);
    }
  };
  fetchPaymentMethods();
}, []);

const handleAddCardSubmit = async (event) => {
  event.preventDefault();
  try {
    const data = await addPaymentMethod(newCard);
    setPaymentMethods((prev) => [...prev, data]);
    setIsAddCardModalOpen(false);
  } catch (error) {
    alert('카드 추가에 실패했습니다.');
  }
};
```

## 주요 변경 사항 체크리스트

### 인증 관련
- [ ] Login.jsx - `login` API 사용
- [ ] SignUp.jsx - `signup` API 사용
- [ ] ForgotPassword.jsx - `forgotPassword` API 사용
- [ ] Header.jsx - `getMe` API로 사용자 정보 로드

### 사용자 정보
- [ ] Account.jsx - `getUserInfo`, `updateUserInfo` API 사용
- [ ] Account.jsx - `changePassword` API 사용 (비밀번호 변경 시)

### 결제수단
- [ ] Account.jsx - `getPaymentMethods`, `addPaymentMethod`, `deletePaymentMethod` API 사용
- [ ] Booking.jsx - `getPaymentMethods` API 사용

### 숙소
- [ ] SearchResults.jsx - `searchHotels` API 사용
- [ ] HotelDetail.jsx - `getHotelDetail` API 사용
- [ ] Landing.jsx - `getRecommendedHotels` API 사용

### 예약
- [ ] Booking.jsx - `createBooking` API 사용
- [ ] BookingConfirmation.jsx - `getBookingDetail` API 사용
- [ ] Account.jsx (내역 탭) - `getBookings` API 사용

### 찜하기
- [ ] Favorites.jsx - `getFavorites` API 사용
- [ ] HotelCard.jsx - `addFavorite`, `removeFavorite` API 사용

## 주의사항

1. **에러 처리**: 모든 API 호출에 try-catch 추가
2. **로딩 상태**: API 호출 중 로딩 상태 표시
3. **토큰 관리**: 로그인 시 토큰 저장, 로그아웃 시 삭제
4. **인터셉터**: client.js의 인터셉터가 자동으로 토큰 추가 및 에러 처리

## 테스트

백엔드 API가 준비되기 전까지는 현재 localStorage 방식으로 동작합니다.
백엔드가 준비되면 위의 예시대로 API 호출로 변경하면 됩니다.

