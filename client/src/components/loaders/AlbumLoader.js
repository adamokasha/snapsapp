import React from "react";
import ContentLoader from "react-content-loader";

const AlbumLoader = props => (
  <ContentLoader
    height={200}
    width={200}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  />
);

export default AlbumLoader;
