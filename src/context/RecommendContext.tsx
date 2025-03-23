import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

interface Folder {
    id: string;
    name: string;
}

const RecommendContext: React.FC = () => {
    const [folders, setFolders] = useState<Folder[]>([]);

    useEffect(() => {
        axiosClient
            .get('/folders/recommended')
            .then(response => {
                setFolders(response.data);
            })
            .catch(error => {
                console.error('추천 폴더 데이터를 불러오는 중 에러 발생:', error);
                setFolders([]);
            });
    }, []);

    return (
        <div
            className="folders-section"
            style={{ flex: 1, padding: '20px', overflowY: 'auto' }}
        >
            <h4 style={{ margin: '0 0 10px 0' }}>추천 폴더</h4>
            {folders.map(folder => (
                <div key={folder.id} style={{ marginBottom: '8px', cursor: 'pointer' }}>
                    {folder.name}
                </div>
            ))}
        </div>
    );
};

export default RecommendContext;
