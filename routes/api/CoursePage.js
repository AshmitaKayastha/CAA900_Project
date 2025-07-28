import React from 'react';
import AskAI from './AskAI';
import { useParams } from 'react-router-dom';

function CoursePage() {
  const { id } = useParams(); // this is instructor or course ID from the route

  return (
    <div>
      <h1>Course Details</h1>
      {/* ... your course UI here ... */}
      <AskAI courseId={id} />
    </div>
  );
}

export default CoursePage;
