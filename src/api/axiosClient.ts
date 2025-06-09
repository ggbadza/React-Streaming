import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // 인증 쿠키 자동 전송
});

interface FailedRequestQueueItem {
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}

// 재발급 동기화용 변수
let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(null); // 토큰을 넘기지 않음
        }
    });
    failedQueue = []; // 큐 비우기
};

// 요청 인터셉터
axiosClient.interceptors.request.use((config) => {
    return config;
});

// 응답 인터셉터 (토큰 재발급 처리)
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러가 아니고 재시도 플래그도 없으면 바로 에러 반환
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            // 이미 토큰 재발급 중이면, 현재 요청을 큐에 추가하고 재발급이 완료될 때까지 대기
            return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then(() => axiosClient(originalRequest)) // 재발급 성공 후 원본 요청 재시도
                .catch((err) => Promise.reject(err)); // 재발급 실패 시 에러 반환
        }

        isRefreshing = true; // 토큰 재발급 시작 변수 설정
        try {
            // 리프레시 토큰으로 재발급 요청
            const response = await axiosClient.post("/user/reissue");
            isRefreshing = false; // 재발급 완료
            processQueue(null); // 대기 중인 요청들 재시도
            return axiosClient(originalRequest);
        } catch (refreshError) {
            console.log(refreshError);
            isRefreshing = false; // 재발급 실패
            processQueue(refreshError);
            // 재발급 실패 시 로그인 페이지로 리다이렉트
            window.location.href = "/login";
            return Promise.reject(refreshError);
        }
    }
);

export default axiosClient;