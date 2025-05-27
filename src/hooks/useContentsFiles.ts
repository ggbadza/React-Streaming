import { useState, useEffect } from 'react';
import { fetchContentsFiles, FileInfoSummary } from '../api/contentsApi';

export const useContentFiles = (contentsId: number | null) => {
    const [files, setFiles] = useState<FileInfoSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!contentsId) {
            setFiles([]);
            return;
        }

        const loadFiles = async () => {
            setLoading(true);
            setError(null);

            try {
                const filesData = await fetchContentsFiles(contentsId);
                setFiles(filesData);
            } catch (err) {
                setError('파일을 불러오는데 실패했습니다.');
                console.error('Failed to fetch content files:', err);
            } finally {
                setLoading(false);
            }
        };

        loadFiles();
    }, [contentsId]);

    return { files, loading, error };
};