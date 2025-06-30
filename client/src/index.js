import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";


import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import jwt_decode from "jwt-decode";
import * as serviceWorker from "./serviceWorker";

// Redux Actions
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

// Common Components
import PrivateRoute from "./components/common/PrivateRoute";
import PageNotFound from "./pages/404";

// Auth
import Login from "./auth/Login";
import Register from "./auth/Register";
import Forgot from "./auth/Forgot";

// Pages
import HomeTwo from "./HomeTwo";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Services / Blogs / Projects
import Services from "./service/Services";
import ServicesByInstructor from "./service/ServicesByInstructor";
import Servicesforstudent from "./service/ServiceforStudent";
import ServiceDetailsLeftSidebar from "./service/ServiceDetailsLeftSidebar";
import Projects from "./project/Projects";
import ProjectDetails from "./project/ProjectDetails";
import BlogLeftSidebar from "./blog/BlogLeftSidebar";
import AddCourse from "./blog/AddCourse";
import AddLecture from "./blog/Addlecture";
import BlogDetailsLeftSidebar from "./blog/BlogDetailsLeftSidebar";

// Admin
import UserList from "./admin/showallusers";
import CreateUser from "./admin/createuser";
import EditUser from "./admin/edituser";
import ShowCategoryList from "./admin/ShowCategoryAdmin";
import ShowCourseList from "./admin/showCourseAdmin";
import EditCourseList from "./admin/editCourseAdmin";
import CreateCategoryAdmin from "./admin/createCategoryAdmin";
import EditCategoryList from "./admin/editCategoryAdmin";
import EnrollmentList from "./admin/showEnrollAdmin";
import Dashboard from "./admin/Dashboard";
import CreateEnrollAdmin from "./admin/createEnrollAdmin";

// Profile
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import AddExperience from "./components/add-credentials/AddExperience";
import AddEducation from "./components/add-credentials/AddEducation";
import Profile from "./components/profile/Profile";
import FinalDashboard from "./components/FinalDashboard";
import FinalProfiles from "./components/FinalProfiles";


if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;

  setAuthToken(token);

  const decoded = jwt_decode(token);

  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    window.location.href = "/login/student";
  }
}


class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            {/* Public Routes */}
            <Route exact path="/" component={HomeTwo} />
            <Route exact path="/home-two" component={HomeTwo} />
            <Route exact path="/about-us" component={About} />
            <Route exact path="/contact-us" component={Contact} />
            <Route exact path="/login/:role" component={Login} />
            <Route exact path="/register/:role" component={Register} />
            <Route exact path="/forgot-password" component={Forgot} />
            <Route exact path="/finalprofiles" component={FinalProfiles} />
            <Route exact path="/profile/:handle" component={Profile} />
            <Route exact path="/admin" component={Dashboard} />





            {/* Protected Routes */}
            <PrivateRoute exact path="/servicesforstudent/:id" component={Servicesforstudent} />
            <PrivateRoute exact path="/servicesbyinstructor/:id" component={ServicesByInstructor} />
            <PrivateRoute exact path="/services" component={Services} />
            <PrivateRoute exact path="/services/:id" component={ServicesByInstructor} />
            <PrivateRoute exact path="/service-details-left-sidebar" component={ServiceDetailsLeftSidebar} />
            <PrivateRoute exact path="/projects" component={Projects} />
            <PrivateRoute exact path="/project-details" component={ProjectDetails} />
            <PrivateRoute exact path="/blog-left-sidebar" component={BlogLeftSidebar} />
            <PrivateRoute exact path="/addcourse/:id" component={AddCourse} />
            <PrivateRoute exact path="/blog-details-left-sidebar/:id" component={BlogDetailsLeftSidebar} />
            <PrivateRoute exact path="/allusers" component={UserList} />
            <PrivateRoute exact path="/users/create" component={CreateUser} />
            <PrivateRoute exact path="/allusers/edit/:id" component={EditUser} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/ShowCourseList" component={ShowCourseList} />
            <PrivateRoute exact path="/ShowCategoryList" component={ShowCategoryList} />
            <PrivateRoute exact path="/ShowCourseList/edit/:id" component={EditCourseList} />
            <PrivateRoute exact path="/ShowCategoryList/edit/:id" component={EditCategoryList} />
            <PrivateRoute exact path="/CreateCategoryAdmin" component={CreateCategoryAdmin} />
            <PrivateRoute exact path="/createEnrollAdmin" component={CreateEnrollAdmin} />
            <PrivateRoute exact path="/EnrollmentList" component={EnrollmentList} />
            <PrivateRoute exact path="/add-lecture/:id" component={AddLecture} />
            <PrivateRoute exact path="/finaldashboard" component={FinalDashboard} />
            <PrivateRoute exact path="/create-profile" component={CreateProfile} />
            <PrivateRoute exact path="/edit-profile" component={EditProfile} />
            <PrivateRoute exact path="/add-experience" component={AddExperience} />
            <PrivateRoute exact path="/add-education" component={AddEducation} />

            {/* Fallback 404 */}
            <Route component={PageNotFound} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById("root"));

serviceWorker.register();
