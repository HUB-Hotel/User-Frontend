import api from './client';

/**
 * 찜하기 관련 API
 */

// 찜한 숙소 목록 조회
export const getFavorites = async () => {
  const { data } = await api.get('/bookmarks');
  return data;
};

// 찜하기 추가/삭제 (토글)
export const addFavorite = async (hotelId) => {
  const { data } = await api.post(`/bookmarks/${hotelId}`);
  return data;
};

// 찜하기 삭제 (토글과 동일)
export const removeFavorite = async (hotelId) => {
  const { data } = await api.post(`/bookmarks/${hotelId}`);
  return data;
};

