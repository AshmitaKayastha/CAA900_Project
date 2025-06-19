import React, { Component } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import BrandLogoSlider from "../components/BrandLogoSlider";
import Footer from "../components/Footer";
import MobileMenu from "../components/MobileMenu";

class Services extends Component {
  state = {
    data: [],
    error: false,
    loading: true
  };

  async componentDidMount() {
    try {
      const response = await axios.get("http://localhost:5001/api/course/all");
      this.setState({ data: response.data, loading: false });
    } catch (err) {
      console.error("Error fetching courses:", err);
      this.setState({ error: true, loading: false });
    }
  }

  renderCourses() {
    const { data } = this.state;

    if (data.length === 0) {
      return (
        <div className="text-center text-danger mt-4">
          No courses found.
        </div>
      );
    }

    return data.map((val, i) => (
      <div
        className="col-lg-4 col-md-6 col-12 section-space--bottom--30"
        key={i}
      >
        <div className="service-grid-item">
          <div className="service-grid-item__image">
            <div className="service-grid-item__image-wrapper">
              <a
                href={`${process.env.PUBLIC_URL}/blog-details-left-sidebar/${val._id}`}
              >
                <img
                  src={val.courseImage}
                  className="img-fluid"
                  alt="Service Grid"
                />
              </a>
            </div>
            <div className="service-grid-item__content">
              <h3 className="title">
                <a
                  href={`${process.env.PUBLIC_URL}/blog-details-left-sidebar/${val._id}`}
                >
                  {val.courseName}
                </a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  render() {
    const { error, loading } = this.state;

    return (
      <div>
        {/* Navigation bar */}
        <NavBar />

        {/* Breadcrumb */}
        <div className="breadcrumb-area breadcrumb-bg">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="page-banner text-center">
                  <h1>ALL COURSES</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="page-wrapper section-space--inner--120">
          <div className="service-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="service-item-wrapper">
                    <div className="row">
                      {loading ? (
                        <div className="col text-center">
                          <p>Loading courses...</p>
                        </div>
                      ) : error ? (
                        <div className="col text-center text-danger">
                          Unable to load courses. Please try again later.
                        </div>
                      ) : (
                        this.renderCourses()
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand logo and footer */}
        <BrandLogoSlider background="grey-bg" />
        <Footer />
        <MobileMenu />
      </div>
    );
  }
}

export default Services;
