interface ILocalStorageService {
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  deleteTokens: () => void; 
}

export const storage: ILocalStorageService = {
  setAccessToken: (token) => localStorage.setItem('accessToken', token),
  setRefreshToken: (token) => localStorage.setItem('refreshToken', token),
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  deleteTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};