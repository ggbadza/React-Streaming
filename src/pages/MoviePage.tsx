import React from "react";
import TreeView from "../components/layouts/TreeView.tsx";

const MoviePage: React.FC = () => {
    return (
        <div>
            <h1>영화 리스트</h1>
            <TreeView type="movie" />
        </div>
    );
};

export default MoviePage;
