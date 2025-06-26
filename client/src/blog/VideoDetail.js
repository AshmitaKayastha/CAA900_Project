import React from "react";

const VideoDetail = ({ video }) => {
  if (!video) {
    return <div>Loading....</div>;
  }

  // Convert YouTube watch link to embed link and add ?rel=0
  let embedUrl = video.videoLink;

  if (embedUrl.includes("watch?v=")) {
    embedUrl = embedUrl.replace("watch?v=", "embed/");
  }

  // Add ?rel=0 or &rel=0 based on existing query string
  embedUrl += embedUrl.includes("?") ? "&rel=0" : "?rel=0";

  return (
    <div>
      <div className="cta-video-image">
        <div className="ui embed">
          <iframe
            src={embedUrl}
            title="video player"
            width="100%"
            height="400"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
