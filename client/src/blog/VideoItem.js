import React from "react";
import "./VideoItem.css";

const VideoItem = ({ video, onVideoSelect }) => {
  return (
    <div onClick={() => onVideoSelect(video)} style={{ cursor: "pointer" }}>
      <div className="content">
        <br />
        <h5>{video.title}</h5>
        <hr />
      </div>
    </div>
  );
};

export default VideoItem;
