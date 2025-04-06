export const baseURL = import.meta.env.VITE_BACK_BASE_URL

export const urls = {
  auth: {
    sign_up: '/auth/sign-up',
    sign_in: '/auth/sign-in',
    refresh: '/auth/refresh',
    log_out: '/auth/sign-out',
  },
  user: {
    me: '/user/me',
    search: (query: string) => `user/search?${query}`,
    add_contact: (id: string) => `/user/contact/${id}`,
    delete_contact: (id: string) => `/user/contact/${id}`,
  },
  message: {
    all: (id: string) => `/message/${id}`,
    file_upload: '/message/files/upload',
    file_download: (id: string) => `/message/file/${id}`,
  },
  health: '/health',
}
