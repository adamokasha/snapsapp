import React from "react";
import ContentLoader from "react-content-loader";

export const PostCardLoader = props => (
  <ContentLoader
    height={350}
    width={350}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="79" y="20" rx="4" ry="4" width="117" height="6.4" />
    <rect x="79" y="40" rx="3" ry="3" width="85" height="6.4" />
    <rect x="8.57" y="335" rx="3" ry="3" width="350" height="6.4" />
    <rect x="8.57" y="355" rx="3" ry="3" width="380" height="6.4" />
    <rect x="8.57" y="375" rx="3" ry="3" width="201" height="6.4" />
    <circle cx="39" cy="35" r="20" />
    <rect x="8.98" y="78.67" rx="0" ry="0" width="383.16" height="242.55" />
  </ContentLoader>
);

export default PostCardLoader;
