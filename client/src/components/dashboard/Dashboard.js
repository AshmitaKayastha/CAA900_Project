import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import ProfileActions from "./ProfileActions";
import Experience from "./Experience";
import Education from "./Education";
import NavBar from "../../components/NavBar";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick = (e) => {
    this.props.deleteAccount();
  };

  render() {
    const user = this.props.auth?.user || {};
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else if (Object.keys(profile).length > 0) {
      dashboardContent = (
        <div>
          <h1 className="display-4">
            Welcome{" "}
            <Link
              to={`/profile/${profile.handle}`}
              style={{ color: "#F0542D", textDecoration: "underline" }}
            >
              {user.name || profile.handle || "User"}
            </Link>
          </h1>
          <br />
          <ProfileActions />
          <Experience experience={profile.experience || []} />
          <Education education={profile.education || []} />
          <div style={{ marginBottom: "60px" }} />
          <button onClick={this.onDeleteClick} className="btn btn-danger">
            Delete My Account
          </button>
        </div>
      );
    } else {
      dashboardContent = (
        <div>
          <h1 className="display-4">
            Welcome {user.name || "User"}
          </h1>
          <p className="lead text-muted">
            You have not yet set up a profile, please add some info
          </p>
          <Link to="/create-profile" className="btn btn-lg btn-info">
            Create Profile
          </Link>
        </div>
      );
    }

    return (
      <>
       
        <div className="dashboard">
          <div className="container">
            <div className="row">
              <div className="col-md-12">{dashboardContent}</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
