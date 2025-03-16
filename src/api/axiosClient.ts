import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // 인증 쿠키 자동 전송
});

// 요청 인터셉터
axiosClient.interceptors.request.use((config) => {
    return config;
});

// 응답 인터셉터 (토큰 재발급 처리)
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 리프레시 토큰으로 재발급 요청
                await axiosClient.post("/user/reissue");
                return axiosClient(originalRequest); // 원본 요청 재시도
            } catch (refreshError) {
                window.location.href = "/user/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;