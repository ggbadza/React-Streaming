import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
    getMockContentById,
    getMockContentInfoByFileId,
    getMockFilesByContentsId,
    getMockFolders,
    getMockFollowingContents,
    getMockSearchResults,
    mockFeaturedBanners,
    mockFollowingIds,
    mockRecommendContents,
    mockSubtitleMeta,
    mockVideoPlaylist,
} from './mockData';

type MockRouteResult = {
    data: unknown;
    status?: number;
    statusText?: string;
};

const MOCK_DELAY_MS = 180;

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const parseBody = (data: unknown): Record<string, unknown> => {
    if (!data) return {};
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch {
            return {};
        }
    }
    if (typeof data === 'object') {
        return data as Record<string, unknown>;
    }
    return {};
};

const readParam = (config: AxiosRequestConfig, url: URL, name: string): string | null => {
    const params = config.params as Record<string, unknown> | undefined;
    const value = params?.[name];

    if (value !== undefined && value !== null) {
        return String(value);
    }

    return url.searchParams.get(name);
};

const toNumber = (value: string | null): number => Number(value ?? 0);

const makeResponse = (
    config: InternalAxiosRequestConfig,
    result: MockRouteResult,
): AxiosResponse => ({
    data: result.data,
    status: result.status ?? 200,
    statusText: result.statusText ?? 'OK',
    headers: {},
    config,
    request: { mock: true },
});

const makeError = (
    config: InternalAxiosRequestConfig,
    result: MockRouteResult,
): Error & { config: InternalAxiosRequestConfig; isAxiosError: boolean; response: AxiosResponse } => {
    const response = makeResponse(config, result);
    const error = new Error(`Mock API returned ${response.status} for ${config.url}`) as Error & {
        config: InternalAxiosRequestConfig;
        isAxiosError: boolean;
        response: AxiosResponse;
    };

    error.config = config;
    error.isAxiosError = true;
    error.response = response;

    return error;
};

const getMockRouteResult = (config: InternalAxiosRequestConfig): MockRouteResult => {
    const method = (config.method ?? 'get').toLowerCase();
    const url = new URL(config.url ?? '/', 'http://mock.local');
    const path = url.pathname;
    const body = parseBody(config.data);

    if (method === 'get' && path === '/user/me') {
        return {
            data: {
                userId: 'mock-user',
                userName: 'Mock User',
                userPlan: 'PREMIUM',
            },
        };
    }

    if (method === 'post' && ['/user/login', '/user/register', '/user/logout', '/user/reissue'].includes(path)) {
        return { data: { success: true } };
    }

    if (method === 'get' && path === '/contents/recommend') {
        return { data: mockRecommendContents };
    }

    if (method === 'get' && path === '/contents/get_featured_banners') {
        return { data: mockFeaturedBanners };
    }

    if (method === 'get' && path === '/contents/info') {
        const content = getMockContentById(toNumber(readParam(config, url, 'contentsId')));
        return content
            ? { data: content }
            : { status: 404, statusText: 'Not Found', data: { message: 'Mock content not found' } };
    }

    if (method === 'get' && path === '/contents/get_files') {
        return { data: getMockFilesByContentsId(toNumber(readParam(config, url, 'contentsId'))) };
    }

    if (method === 'get' && path === '/contents/contents_infos') {
        const data = getMockContentInfoByFileId(toNumber(readParam(config, url, 'fileId')));
        return data
            ? { data }
            : { status: 404, statusText: 'Not Found', data: { message: 'Mock file not found' } };
    }

    if (method === 'post' && path === '/contents/search') {
        return { data: getMockSearchResults(String(body.query ?? '')) };
    }

    if (method === 'get' && path === '/contents/is_following') {
        return { data: mockFollowingIds.has(toNumber(readParam(config, url, 'contentsId'))) };
    }

    if (method === 'get' && path === '/contents/register_following') {
        mockFollowingIds.add(toNumber(readParam(config, url, 'contentsId')));
        return { data: true };
    }

    if (method === 'get' && path === '/contents/delete_following') {
        mockFollowingIds.delete(toNumber(readParam(config, url, 'contentsId')));
        return { data: true };
    }

    if (method === 'get' && path === '/contents/get_following') {
        return { data: getMockFollowingContents() };
    }

    if (method === 'get' && path === '/folder/folders') {
        return {
            data: getMockFolders(
                readParam(config, url, 'type') ?? 'movie',
                readParam(config, url, 'folderId') ?? '1',
            ),
        };
    }

    if (method === 'get' && path === '/video/playlist') {
        const fileId = toNumber(readParam(config, url, 'fileId'));
        return {
            data: mockVideoPlaylist.map((item) => ({
                ...item,
                fileId,
            })),
        };
    }

    if (method === 'get' && path === '/video/sub_meta') {
        return { data: mockSubtitleMeta };
    }

    return {
        status: 404,
        statusText: 'Not Found',
        data: {
            message: `No mock response registered for ${method.toUpperCase()} ${path}`,
        },
    };
};

export const mockAxiosAdapter: AxiosAdapter = async (config) => {
    await delay(MOCK_DELAY_MS);

    const internalConfig = config as InternalAxiosRequestConfig;
    const result = getMockRouteResult(internalConfig);
    const status = result.status ?? 200;

    if (status >= 200 && status < 300) {
        return makeResponse(internalConfig, result);
    }

    return Promise.reject(makeError(internalConfig, result));
};
