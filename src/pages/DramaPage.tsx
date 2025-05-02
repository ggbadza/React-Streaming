import React from "react";
import TreeView from "../components/layouts/TreeView.tsx";

const DramaPage: React.FC = () => {
    return (
        <div>
            <h1>드라마 리스트</h1>
            <TreeView type="drama" />
        </div>
    );
};

export default DramaPage;
