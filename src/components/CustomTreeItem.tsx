import React from 'react';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import { Typography } from '@mui/material';

// MuiTreeItem2의 prop 타입을 그대로 상속받음
type CustomTreeItemProps = React.ComponentProps<typeof TreeItem2>;

const CustomTreeItem: React.FC<CustomTreeItemProps> = ({ label, ...other }) => {
    return (
        <TreeItem2
            label={
                <Typography
                    variant="body1"
                    sx={{
                        fontSize: {
                            xs: '1rem', // 모바일
                            sm: '1.5rem',     // 태블릿 이상
                            md: '1.25rem',  // 데스크탑
                        },
                    }}
                >
                    {label}
                </Typography>
            }
            {...other}
        />
    );
};

export default CustomTreeItem;
