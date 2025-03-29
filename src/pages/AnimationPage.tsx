// 예: AnimationPage.tsx
import React from "react";
import TreeView from "../components/layouts/TreeView.tsx";

const AnimationPage: React.FC = () => {
    return (
        <div>
            <h1>애니메이션 리스트</h1>
            <TreeView type="ani" />
        </div>
    );
};

export default AnimationPage;
