import React, { Component } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import BrandLogoSlider from "../components/BrandLogoSlider";
import Footer from "../components/Footer";
import MobileMenu from "../components/MobileMenu";
import jwt_decode from "jwt-decode";

class ServicesByInstructor extends Component {
  state = {
    data: [],
    error: ""
  };

  async componentDidMount() {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        this.setState({ error: "Instructor not logged in." });
        return;
      }

      const decoded = jwt_decode(token);
      const instructorId = decoded.id;

      const response = await axios.get(
        `http://localhost:5001/api/instructor/courses/${instructorId}`
      );

      // Ensure valid response
      if (response.data && Array.isArray(response.data)) {
        this.setState({ data: response.data, error: "" });
      } else {
        this.setState({ error: "Failed to load courses: Invalid data format." });
      }
    } catch (err) {
      console.error("Error fetching instructor courses:", err);
      this.setState({ error: "Failed to load courses" });
    }
  }

  render() {
    const { data, error } = this.state;

    const Datalist = data.map((val, i) => (
      <div className="col-lg-4 col-md-6 col-12 section-space--bottom--30" key={i}>
        <div className="service-grid-item">
          <div className="service-grid-item__image">
            <div className="service-grid-item__image-wrapper">
              <a href={`/blog-details-left-sidebar/${val._id}`}>
                <img
                  src={val.courseImage}
                  className="img-fluid"
                  alt="Service Grid"
                />
              </a>
            </div>
            <br />
            <div className="service-grid-item__content">
              <h3 className="title">
                <a href={`/blog-details-left-sidebar/${val._id}`}>
                  {val.courseName}
                </a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    ));

    return (
      <div>
        <NavBar />

        <div className="breadcrumb-area breadcrumb-bg">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="page-banner text-center">
                  <h1>MY COURSES</h1>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-wrapper section-space--inner--120">
          <div className="service-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="service-item-wrapper">
                    <div className="row">{Datalist}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BrandLogoSlider background="grey-bg" />
        <Footer />
        <MobileMenu />
      </div>
    );
  }
}

export default ServicesByInstructor;
