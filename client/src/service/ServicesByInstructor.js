import React, { Component } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import BrandLogoSlider from "../components/BrandLogoSlider";
import Footer from "../components/Footer";
import MobileMenu from "../components/MobileMenu";

class ServicesByInstructor extends Component {
  state = {
    data: []
  };

  async componentDidMount() {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/instructor/courses/${this.props.match.params.id}`
      );
      this.setState({ data: response.data });
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
    }
  }

  render() {
    const { data } = this.state;

    const Datalist = data.map((val, i) => (
      <div
        className="col-lg-4 col-md-6 col-12 section-space--bottom--30"
        key={i}
      >
        <div className="service-grid-item">
          <div className="service-grid-item__image">
            <div className="service-grid-item__image-wrapper">
              <a href={`${process.env.PUBLIC_URL}/blog-details-left-sidebar/${val._id}`}>
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
                <a href={`${process.env.PUBLIC_URL}/blog-details-left-sidebar/${val._id}`}>
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
