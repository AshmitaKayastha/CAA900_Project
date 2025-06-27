import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "../components/NavBar";
import BrandLogoSlider from "../components/BrandLogoSlider";
import Footer from "../components/Footer";
import MobileMenu from "../components/MobileMenu";
import axios from "axios";
import VideoList from "./VideoList";
import VideoDetail from "./VideoDetail";

class BlogDetailsLeftSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      user: JSON.parse(localStorage.getItem("userid")),
      userRole: JSON.parse(localStorage.getItem("userRole")),
      selectedVideo: null,
      enrolled: "ADD TO COURSE LIST",
      buttonclass: "btn btn-success",
      addcourse: false,
      status: "Loading..."
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();

    const newEnrollment = {
      student: this.state.user,
      course: this.props.match.params.id
    };

    if (this.state.buttonclass === "btn btn-success") {
      axios
        .post("http://localhost:5001/api/enrollment/enrollbystudent/add", newEnrollment)
        .then(() => {
          toast.success("Course successfully added to your list");
          this.setState({
            enrolled: "ALREADY ENROLLED",
            buttonclass: "btn btn-danger"
          });
        })
        .catch((err) => {
          console.error("Enrollment error:", err);
          toast.error("Course not added");
        });
    } else {
      toast.warn("Course already enrolled");
    }
  }

  async componentDidMount() {
    if (this.state.userRole === "student") {
      this.setState({ addcourse: true });
    }

    try {
      const courseId = this.props.match.params.id;

      // Fetch lectures
      const videoRes = await axios.get(
        `http://localhost:5001/api/lecture/lectures?course=${courseId}`
      );

      // Check enrollment
      const enrollRes = await axios.get("http://localhost:5001/api/enrollment/checkenrollment", {
        params: { id: this.state.user, courseid: courseId },
        withCredentials: true
      });

      if (enrollRes.data) {
        this.setState({
          enrolled: "ALREADY ENROLLED",
          buttonclass: "btn btn-danger"
        });
      }

      this.setState({
        videos: videoRes.data,
        selectedVideo: videoRes.data[0] || null,
        status: videoRes.data.length > 0 ? "" : "No videos found."
      });
    } catch (error) {
      console.error("Error loading data:", error);
      this.setState({ status: "Error loading videos." });
    }
  }

  onVideoSelect = (video) => {
    this.setState({ selectedVideo: video });
  };

  render() {
    return (
      <div>
        <NavBar />

        <div className="breadcrumb-area breadcrumb-bg">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="page-banner text-center">
                  <h1>Course Details</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="page-wrapper section-space--inner--120">
          <div className="project-section">
            <div className="container">
              <div className="row">
                <div className="col-12 section-space--bottom--40">
                  <div className="ui container">
                    <div className="ui grid">
                      <div className="ui row">
                        <div className="eleven wide column">
                          <VideoDetail video={this.state.selectedVideo} />
                        </div>
                        <div className="five wide column">
                          <VideoList
                            onVideoSelect={this.onVideoSelect}
                            videos={this.state.videos}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 col-12 section-space--bottom--30 pl-30 pl-sm-15 pl-xs-15">
                  <div className="project-details">
                    <h2>
                      {this.state.selectedVideo
                        ? this.state.selectedVideo.title
                        : this.state.status}
                    </h2>
                    <p>
                      {this.state.selectedVideo?.course?.courseDescription ||
                        this.state.status}
                    </p>
                  </div>
                </div>

                <div className="col-lg-4">
                  <ToastContainer />
                  <button
                    type="button"
                    style={this.state.addcourse ? {} : { display: "none" }}
                    className={this.state.buttonclass}
                    onClick={this.onClick}
                  >
                    {this.state.enrolled}
                  </button>
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

export default BlogDetailsLeftSidebar;