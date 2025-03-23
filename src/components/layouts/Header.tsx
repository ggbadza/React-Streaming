import React, { FC, HTMLAttributes, PropsWithChildren } from 'react';
// import './HeaderStyles.css';

const Header: FC<PropsWithChildren<HTMLAttributes<HTMLElement>>> = ({ children, ...restProps }) => {
    return <nav {...restProps}>{children}</nav>;
};

export default Header;
