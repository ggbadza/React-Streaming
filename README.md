# React Streaming

## 프로젝트 소개
이 프로젝트는 Spring WebFlux 기반의 비디오 스트리밍 백엔드 서버와 연동되는 리액트 프론트엔드 웹애플리케이션입니다.

*   **다양한 콘텐츠 시청**: 영화, 드라마, 애니메이션 등 다양한 비디오 콘텐츠를 자막과 함께 스트리밍으로 시청할 수 있습니다.
*   **HLS 스트리밍 지원**: Video.js를 활용하여 HLS을 프로토콜을 지원하여 안정적인 비디오 재생 환경을 제공합니다.
*   **사용자 중심 기능**: JWT 기반의 회원 인증, 즐겨찾기, 콘텐츠 검색 등 사용자 편의 기능을 제공합니다.
*   **반응형 UI**: 데스크톱 및 모바일과 태블릿 환경에 최적화된 반응형 웹 디자인을 적용했습니다.
*   **파일 탐색기**: 서버의 파일 시스템을 탐색할 수 있는 트리 뷰 인터페이스를 제공합니다.

### 연관 프로젝트
*   **백엔드**: [Spring-Webflux-Streaming](https://github.com/ggbadza/Spring-Webflux-Streaming)

## 기술 스택
*   **Core**: `React`, `TypeScript`, `Vite`
*   **Styling**: `Material-UI (MUI)`, `CSS`
*   **State Management**: `React Context API`
*   **API Client**: `Axios`
*   **Video**: `video.js`

## 실행 방법

### 요구 사항

*   `Node.js` (v18.x 이상 권장)
*   `npm` (v9.x 이상 권장)
*   `Docker` 및 `Docker-compose`

### 설치 및 실행

1.  **프로젝트 클론**
    ```bash
    git clone [저장소 URL]
    cd react-streaming
    ```

2.  **서버 실행**
    프로젝트 루트의 `docker-compose.yml` 파일을 사용하여 관련 서비스를 실행합니다.
    ```bash
    docker-compose up -d
    ```

## 주요 기능

*   **비디오 스트리밍**: HLS 및 일반 비디오 파일 스트리밍을 지원합니다.
*   **자막 재생**: Subtitles Octopus 라이브러리를 활용하여 AAS 기반의 자막 재생을 지원합니다.
*   **사용자 인증**: 회원가입, 로그인, 로그아웃 기능을 제공합니다.
*   **콘텐츠 탐색**: 메인, 영화, 드라마, 애니메이션 등 카테고리별 페이지를 제공합니다.
*   **콘텐츠 검색**: 키워드를 통해 원하는 콘텐츠를 검색할 수 있습니다.
*   **추천 시스템**: 사용자 맞춤형 콘텐츠를 추천합니다.
*   **즐겨찾기**: 원하는 콘텐츠를 즐겨찾기에 추가하고 관리할 수 있습니다.
*   **파일 탐색기**: 트리뷰 형태의 파일 탐색기를 제공합니다.

## 프로젝트 구조

```
.
├── src
│   ├── api         # 백엔드 API 연동 관련 함수
│   ├── assets      # 이미지, 폰트 등 정적 에셋
│   ├── components  # 재사용 가능한 UI 컴포넌트
│   │   └── layouts # 페이지 레이아웃 컴포넌트
│   ├── context     # React Context API
│   ├── hooks       # 커스텀 React Hooks
│   ├── pages       # 라우팅되는 페이지 컴포넌트
│   ├── services    # 비즈니스 로직 관련 서비스
│   └── types       # TypeScript 타입 정의
├── public          # 정적 파일
├── .env.development # 개발 환경 변수
├── Dockerfile      # Docker 이미지 빌드 설정
├── nginx.conf      # Nginx 설정
├── package.json    # 프로젝트 의존성 및 스크립트
└── vite.config.ts  # Vite 설정
```