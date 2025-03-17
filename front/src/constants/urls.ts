export const baseURL = import.meta.env.VITE_BACK_BASE_URL;

export const urls = {
  auth: {
    sign_up: "/auth/sign-up",
    sign_in: "/auth/sign-in",
    refresh: "/auth/refresh",
    log_out: "/auth/sign-out",
  },
  user: {
    me: "/user/me",
    all: "/user/all",
  },
  message: {
    all: (id: string) => `/message/${id}`,
    edit: (id: string) => `/message/${id}`,
    delete: (id: string) => `/message/${id}`,
    file_upload: "/message/files/upload",
    file_download: (id: string) => `/message/file/${id}`,
  },
  health: "/health",
};
