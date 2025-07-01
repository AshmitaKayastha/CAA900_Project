import React, { useEffect, useRef } from "react";

const VideoDetail = ({ video }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Force reload video when new one is selected
    }
  }, [video]);

  if (!video) {
    return <div>Select a lecture to view the video.</div>;
  }

  const isYouTube = video.videoLink.startsWith("http") || video.videoLink.length === 11;
  const isLocal = video.videoLink.includes("/uploads/");

  return (
    <div>
      {isLocal ? (
        <video
          width="100%"
          height="400"
          controls
          ref={videoRef}
          key={video.videoLink} // This helps force remount
        >
          <source
            src={`http://localhost:5001${video.videoLink}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${video.videoLink}`}
          frameBorder="0"
          allowFullScreen
          title={video.title}
        ></iframe>
      )}
      <h2>{video.title}</h2>
      <p>
        {video.course && video.course.courseDescription
          ? video.course.courseDescription
          : "No description available"}
      </p>
    </div>
  );
};

export default VideoDetail;
