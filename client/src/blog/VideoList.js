import React from "react";
import VideoItem from "./VideoItem";

const VideoList = ({ videos, onVideoSelect }) => {
  if (!videos || videos.length === 0) {
    return <div>No lectures found.</div>;
  }

  const renderedList = videos.map((video) => {
    return (
      <VideoItem
        key={video._id}
        video={video}
        onVideoSelect={onVideoSelect}
      />
    );
  });

  return (
    <div className="ui relaxed divided list">
      {renderedList}
    </div>
  );
};

export default VideoList;
