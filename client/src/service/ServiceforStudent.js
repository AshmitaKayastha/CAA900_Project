import React, { Component } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import BrandLogoSlider from "../components/BrandLogoSlider";

import MobileMenu from "../components/MobileMenu";

class Services extends Component {
  state = {
    data: []
  };

  async componentDidMount() {
    const studentId = localStorage.getItem("userid")?.replace(/"/g, "");

    if (!studentId) {
      console.error("Student ID not found in localStorage.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5001/api/enrollment/enrollmentbystudentid/${studentId}`
      );
      this.setState({ data: response.data });
    } catch (error) {
      console.error("Failed to fetch enrolled courses:", error);
    }
  }

  render() {
    const { data } = this.state;

    const Datalist = data.map((val, i) => {
      const course = val?.course;
      if (!course) return null; // Skip broken data

      return (
        <div
          className="col-lg-4 col-md-6 col-12 section-space--bottom--30"
          key={i}
        >
          <div className="service-grid-item">
            <div className="service-grid-item__image">
              <div className="service-grid-item__image-wrapper">
                <a
                  href={`${process.env.PUBLIC_URL}/blog-details-left-sidebar/${course._id}`}
                >
                  <img
                    src={course.courseImage || "/default-image.jpg"}
                    className="img-fluid"
                    alt="Course"
                  />
                </a>
              </div>

              <div className="service-grid-item__content">
                <h3 className="title">
                  <a
                    href={`${process.env.PUBLIC_URL}/blog-details-left-sidebar/${course._id}`}
                  >
                    {course.courseName || "Untitled Course"}
                  </a>
                </h3>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        <NavBar />

        <div className="breadcrumb-area breadcrumb-bg">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="page-banner text-center">
                  <h1>MY COURSES</h1>
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
                    <div className="row">
                      {data.length > 0 ? (
                        Datalist
                      ) : (
                        <div className="col text-center mt-5">
                          <h4>No courses enrolled</h4>
                          <p>Please browse available courses and enroll to get started.</p>
                          <a
                            href={`${process.env.PUBLIC_URL}/services`}
                            className="btn btn-primary mt-3"
                          >
                            Browse All Courses
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BrandLogoSlider background="grey-bg" />
        
        <MobileMenu />
      </div>
    );
  }
}

export default Services;
