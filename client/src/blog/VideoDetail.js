import React from "react";

const VideoDetail = ({ video }) => {
  if (!video) return <div>Loading...</div>;

  const isYouTube = video.videoLink.length === 11;

  return (
    <div className="cta-video-image">
      <div className="ui embed">
        {isYouTube ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.videoLink}?rel=0`}
            title="YouTube Video"
            width="100%"
            height="400"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video width="100%" height="400" controls>
            <source src={`http://localhost:5001${video.videoLink}`} type="video/mp4" />
            Your browser does not support the video tag.
            console.log("Video link is:", video.videoLink);

          </video>
        )}
      </div>
    </div>
  );
};

export default VideoDetail;
