import type {
    ContentsInfoWithFiles,
    ContentsResponse,
    ContentsSearchResult,
    FeaturedBannersResponse,
    FileInfoSummary,
    RecommendContentsResponse,
} from '../api/contentsApi';
import type { TreeFolder } from '../api/folderApi';
import type { SubtitleMeta, VideoInfo } from '../api/videoApi';

const svgDataUrl = (
    title: string,
    subtitle: string,
    background: string,
    accent: string,
    width: number,
    height: number,
) => {
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${background}"/>
      <stop offset="100%" stop-color="#101014"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <circle cx="${Math.round(width * 0.78)}" cy="${Math.round(height * 0.2)}" r="${Math.round(width * 0.18)}" fill="${accent}" opacity="0.45"/>
  <rect x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.12)}" width="${Math.round(width * 0.5)}" height="${Math.round(height * 0.04)}" rx="8" fill="${accent}" opacity="0.9"/>
  <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.56)}" fill="#ffffff" font-family="Arial, sans-serif" font-size="${Math.round(height * 0.12)}" font-weight="700">${title}</text>
  <text x="${Math.round(width * 0.08)}" y="${Math.round(height * 0.7)}" fill="#d7d7dc" font-family="Arial, sans-serif" font-size="${Math.round(height * 0.055)}">${subtitle}</text>
</svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const makeContent = (
    contentsId: number,
    title: string,
    type: string,
    description: string,
    background: string,
    accent: string,
    folderId: number,
): ContentsResponse => ({
    contentsId,
    title,
    description,
    thumbnailUrl: svgDataUrl(title, type.toUpperCase(), background, accent, 960, 540),
    posterUrl: svgDataUrl(title, 'Mock poster', background, accent, 600, 900),
    type,
    folderId,
});

export const mockContents: ContentsResponse[] = [
    makeContent(
        101,
        'Neon Harbor',
        'movie',
        'A courier follows a signal through a rain-lit future city and uncovers a broadcast nobody was meant to hear.',
        '#16324f',
        '#26d0ce',
        1101,
    ),
    makeContent(
        102,
        'Orbit Kitchen',
        'animation',
        'A tiny crew runs the busiest diner in low orbit while serving pancakes to pilots, scientists, and lost robots.',
        '#4d2c73',
        '#ffcb45',
        1201,
    ),
    makeContent(
        103,
        'Midnight Archive',
        'drama',
        'An archivist finds that every restored tape changes a memory from her own past.',
        '#2b3440',
        '#ff6b6b',
        1301,
    ),
    makeContent(
        104,
        'Signal Room',
        'drama',
        'Two emergency dispatchers work one long night where every call seems connected.',
        '#182a2d',
        '#8fd14f',
        1302,
    ),
    makeContent(
        105,
        'Glass Runner',
        'movie',
        'A retired racer returns for one final cross-continent run in a solar-powered prototype.',
        '#432818',
        '#f77f00',
        1102,
    ),
    makeContent(
        106,
        'Moonlit Bakery',
        'animation',
        'A magical bakery opens only after midnight, and every pastry grants a small, inconvenient wish.',
        '#1f3a5f',
        '#f4a261',
        1202,
    ),
    makeContent(
        107,
        'River Protocol',
        'movie',
        'A field engineer and a local reporter race to stop a dam control system from being hijacked.',
        '#244b35',
        '#70e000',
        1103,
    ),
    makeContent(
        108,
        'Paper Planets',
        'animation',
        'Three friends fold paper worlds that become real enough to get lost inside.',
        '#264653',
        '#e9c46a',
        1203,
    ),
];

export const mockFeaturedBanners: FeaturedBannersResponse[] = mockContents.slice(0, 5).map((content, index) => ({
    sequenceId: index + 1,
    contentsId: content.contentsId,
    title: content.title,
    description: content.description,
    type: content.type,
    userRating: [91, 87, 94, 82, 89][index],
    posterUrl: content.posterUrl,
    thumbnailUrl: content.thumbnailUrl,
    seriesId: `mock-series-${content.contentsId}`,
    season: content.type === 'movie' ? 'Movie' : 'Season 1',
}));

export const mockRecommendContents: RecommendContentsResponse[] = [
    {
        userId: 'mock-user',
        recommendSeq: 1,
        description: 'Trending in Mock Mode',
        contentsResponseList: [mockContents[0], mockContents[2], mockContents[4], mockContents[6]],
    },
    {
        userId: 'mock-user',
        recommendSeq: 2,
        description: 'Animation Picks',
        contentsResponseList: mockContents.filter((content) => content.type === 'animation'),
    },
    {
        userId: 'mock-user',
        recommendSeq: 3,
        description: 'Weekend Dramas',
        contentsResponseList: mockContents.filter((content) => content.type === 'drama'),
    },
];

const makeFiles = (content: ContentsResponse): FileInfoSummary[] => [
    {
        id: content.contentsId * 10 + 1,
        fileName: `${content.title} - Episode 1`,
        contentsId: content.contentsId,
        hasSubtitle: true,
        resolution: '1080p',
        createdAt: '2026-06-20T00:00:00Z',
    },
    {
        id: content.contentsId * 10 + 2,
        fileName: `${content.title} - Episode 2`,
        contentsId: content.contentsId,
        hasSubtitle: content.type !== 'movie',
        resolution: '720p',
        createdAt: '2026-06-20T00:00:00Z',
    },
];

export const mockFilesByContentsId = new Map<number, FileInfoSummary[]>(
    mockContents.map((content) => [content.contentsId, makeFiles(content)]),
);

export const mockFollowingIds = new Set<number>([101, 103, 106]);

export const mockFoldersByTypeAndParent = new Map<string, TreeFolder[]>();

const folder = (folderId: string, name: string, contentsId = 0, hasFiles = false): TreeFolder => {
    const content = mockContents.find((item) => item.contentsId === contentsId);

    return {
        folderId,
        name,
        hasFiles,
        contentsId,
        description: content?.description ?? '',
        posterUrl: content?.posterUrl ?? '',
        children: null,
    };
};

const addFolders = (type: string, parentId: string, folders: TreeFolder[]) => {
    mockFoldersByTypeAndParent.set(`${type}:${parentId}`, folders);
};

addFolders('movie', '1', [
    folder('movie-action', 'Action Movies'),
    folder('movie-scifi', 'Science Fiction'),
]);
addFolders('movie', 'movie-action', [folder('movie-101', 'Neon Harbor', 101, true), folder('movie-107', 'River Protocol', 107, true)]);
addFolders('movie', 'movie-scifi', [folder('movie-105', 'Glass Runner', 105, true)]);

addFolders('anime', '1', [
    folder('anime-cozy', 'Cozy Animation'),
    folder('anime-adventure', 'Adventure Animation'),
]);
addFolders('anime', 'anime-cozy', [folder('anime-102', 'Orbit Kitchen', 102, true), folder('anime-106', 'Moonlit Bakery', 106, true)]);
addFolders('anime', 'anime-adventure', [folder('anime-108', 'Paper Planets', 108, true)]);

addFolders('drama', '1', [
    folder('drama-mystery', 'Mystery Drama'),
    folder('drama-human', 'Human Drama'),
]);
addFolders('drama', 'drama-mystery', [folder('drama-103', 'Midnight Archive', 103, true)]);
addFolders('drama', 'drama-human', [folder('drama-104', 'Signal Room', 104, true)]);

for (const content of mockContents) {
    addFolders(content.type === 'animation' ? 'anime' : content.type, `${content.type}-${content.contentsId}`, []);
}

export const getMockContentById = (contentsId: number): ContentsResponse | undefined =>
    mockContents.find((content) => content.contentsId === contentsId);

export const getMockFilesByContentsId = (contentsId: number): FileInfoSummary[] =>
    mockFilesByContentsId.get(contentsId) ?? [];

export const getMockContentInfoByFileId = (fileId: number): ContentsInfoWithFiles | undefined => {
    for (const content of mockContents) {
        const filesInfoList = getMockFilesByContentsId(content.contentsId);
        if (filesInfoList.some((file) => file.id === fileId)) {
            return {
                ...content,
                filesInfoList,
            };
        }
    }
};

export const getMockSearchResults = (query: string): ContentsSearchResult[] => {
    const normalizedQuery = query.trim().toLowerCase();

    return mockContents
        .filter((content) =>
            content.title.toLowerCase().includes(normalizedQuery)
            || content.description.toLowerCase().includes(normalizedQuery)
            || content.type.toLowerCase().includes(normalizedQuery),
        )
        .map((content) => ({
            contentsId: content.contentsId,
            title: content.title,
            description: content.description,
            type: content.type,
            thumbnailUrl: content.thumbnailUrl,
            modifiedAt: '2026-06-20T00:00:00Z',
        }));
};

export const getMockFolders = (type: string, folderId: string): TreeFolder[] =>
    mockFoldersByTypeAndParent.get(`${type}:${folderId}`) ?? [];

export const getMockFollowingContents = (): ContentsResponse[] =>
    mockContents.filter((content) => mockFollowingIds.has(content.contentsId));

export const mockSubtitleMeta: SubtitleMeta = {
    hasSubtitle: 'N',
    count: 0,
    subtitleList: [],
};

export const mockVideoPlaylist: VideoInfo[] = [
    {
        videoType: 'mock-1080',
        url: '/mock/sample.mp4',
        pixel: '1080p',
        fileId: 0,
        mimeType: 'video/mp4',
    },
    {
        videoType: 'mock-720',
        url: '/mock/sample.mp4',
        pixel: '720p',
        fileId: 0,
        mimeType: 'video/mp4',
    },
];
