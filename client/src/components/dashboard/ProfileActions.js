import React from 'react';
import { Link } from 'react-router-dom';

const ProfileActions = () => {
  return (
    <>
      <div className="btn-group mb-4" role="group" aria-label="Profile Actions">
        <Link to="/edit-profile" className="btn btn-light me-2" aria-label="Edit Profile">
          <i className="fas fa-user-circle text-info me-1" />
          Edit Profile
        </Link>
        <Link to="/add-experience" className="btn btn-light me-2" aria-label="Add Experience">
          <i className="fab fa-black-tie text-info me-1" />
          Add Experience
        </Link>
        <Link to="/add-education" className="btn btn-light" aria-label="Add Education">
          <i className="fas fa-graduation-cap text-info me-1" />
          Add Education
        </Link>
      </div>
    </>
  );
};

export default ProfileActions;
