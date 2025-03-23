import React, { FC, PropsWithChildren } from 'react';
import Header from '../components/layouts/Header';
import Sidebar from '../components/layouts/Sidebar';

const MainPage: FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <>
            <Header>{children}</Header>
            <Sidebar />
        </>
    );
};

export default MainPage;
