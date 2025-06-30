import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";

class NavBar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  state = {
    displayProp: "none",
    flexProp: "row"
  };

  classToggle = () => {
    const { displayProp, flexProp } = this.state;
    this.setState({
      displayProp: displayProp === "none" ? "flex" : "none",
      flexProp: flexProp === "row" ? "column" : "row"
    });
  };

  render() {
    const { isAuthenticated, users } = this.props.auth;
    localStorage.setItem("userid", JSON.stringify(users.id));
    localStorage.setItem("userRole", JSON.stringify(users.role));
    const { displayProp, flexProp } = this.state;

    let authLinks = null;

    if (users.role === "admin") {
      return (
        <div className="header-area header-sticky header-sticky--default">
          <div className="header-area__desktop header-area__desktop--default">
            <div className="header-navigation-area nav-bg">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="header-navigation header-navigation--header-default position-relative">
                      <div className="header-navigation__nav position-static" style={{ width: "100%" }}>
                        <nav className="main-nav">
                          <Link to="/home-two">
                            <div className="logoHead">
                              <h3>E-learning</h3>
                            </div>
                          </Link>
                          <ul id="main-nav-ul">
                            <li><Link to="/dashboard">DASHBOARD</Link></li>
                            <li><Link to="/allusers">USERS</Link></li>
                            <li><Link to="/ShowCourseList">COURSES</Link></li>
                            <li><Link to="/ShowCategoryList">CATEGORIES</Link></li>
                            <li><Link to="/EnrollmentList">ENROLLED USERS</Link></li>
                            <li className="inactive">
                              <a onClick={this.onLogoutClick.bind(this)} className="nav-link" href="#">
                                <img src="https://cdn1.iconfinder.com/data/icons/user-avatars-2/300/04-512.png"
                                  height="10px" width="10px" alt={users.first_name}
                                  style={{ marginRight: "5px" }}
                                  className="sticky-logo img-fluid"
                                />
                                LOGOUT
                              </a>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (users.role === "student") {
      authLinks = (
        <>
          <li className="has-children has-children--multilevel-submenu">
            <span>COURSES</span>
            <ul className="submenu">
              <li><Link to={`/servicesforstudent/${users.id}`}>MY COURSES</Link></li>
              <li><Link to="/services">ALL COURSES</Link></li>
            </ul>
          </li>
          <li className="inactive">
            <a onClick={this.onLogoutClick.bind(this)} className="nav-link" href="#">
              <img src="https://cdn1.iconfinder.com/data/icons/user-avatars-2/300/04-512.png"
                alt={users.first_name} style={{ width: "25px", marginRight: "5px" }} />
              LOGOUT
            </a>
          </li>
        </>
      );
    }

    if (users.role === "instructor") {
      authLinks = (
        <>
          <li className="has-children has-children--multilevel-submenu">
            <span>COURSES</span>
            <ul className="submenu">
              <li><Link to={`/services/${users.id}`}>MY COURSES</Link></li>
              <li><Link to={`/addcourse/${users.id}`}>ADD COURSES</Link></li>
              <li><Link to={`/add-lecture/${users.id}`}>ADD LECTURE</Link></li>
              <li><Link to="/services">ALL COURSES</Link></li>
            </ul>
          </li>
          <li><Link to="/finaldashboard">PROFILE</Link></li>
          <li>
            <a onClick={this.onLogoutClick.bind(this)} className="nav-link" href="#">
              <img src="https://cdn1.iconfinder.com/data/icons/user-avatars-2/300/04-512.png"
                alt={users.first_name} style={{ width: "25px", marginRight: "5px" }} />
              LOGOUT
            </a>
          </li>
        </>
      );
    }

    const guestLinks = (
      <>
        <li><Link className="nav-link" to="/login/student">LOGIN</Link></li>
        <li><Link className="nav-link" to="/login/instructor">Instructor Login</Link></li>
                <li><Link className="nav-link" to="/login/admin">Admin Login</Link></li>

      </>
    );

    return (
      <div className="header-area header-sticky header-sticky--default">
        <div className="header-area__desktop header-area__desktop--default">
          <div className="header-navigation-area default-bg">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="header-navigation header-navigation--header-default position-relative">
                    <div className="header-navigation__nav position-static" style={{ width: "100%" }}>
                      <nav className="main-nav">
                        <Link to="/home-two">
                          <div className="logoHead">
                          {/* <img src="/assets/img/logo/logonew.png" alt="" className="sticky-logo img-fluid" /> */}
                            <h3>E-Learning</h3>
                          </div>
                        </Link>
                        <ul id="main-nav-ul">
                          <li><Link to="/home-two">HOME</Link></li>
                          <li><Link to="/about-us">ABOUT</Link></li>
                          {isAuthenticated ? authLinks : guestLinks}
                        </ul>
                        <div className="Navbar__Link Navbar__Link-toggle" onClick={this.classToggle}>
                          <i className="fas fa-bars" />
                        </div>
                      </nav>
                      <nav className="Navbar__Items" style={{ display: displayProp }}>
                        <ul style={{ display: displayProp, flexDirection: flexProp }}>
                          <li className="has-children has-children--multilevel-submenu">
                            <Link to="/home-two">HOME</Link>
                            <ul className="submenu">
                              <li><Link to="/home-two">Homepage Two</Link></li>
                            </ul>
                          </li>
                          <li><Link to="/about-us">ABOUT</Link></li>
                          <li><Link to="/hostname/:id">IMAGE</Link></li>
                          {isAuthenticated ? authLinks : guestLinks}
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NavBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(NavBar);
