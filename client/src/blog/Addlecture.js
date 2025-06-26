import React, { Component } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { Progress } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowCourse = (props) => (
  <option key={props.todo._id} value={props.todo._id}>
    {props.todo.courseName}
  </option>
);

export default class AddLecture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      youtubelink: "",
      loaded: 0,
      Courses: [],
      course: "",
      title: ""
    };
  }

  componentDidMount() {
    const instructorId = this.props.match.params.id;
    axios
      .get(`http://localhost:5001/api/course/instructor/${instructorId}`)
      .then((response) => this.setState({ Courses: response.data }))
      .catch(() => toast.error("Failed to load courses"));
  }

  CourseList() {
    return this.state.Courses.map((course, i) => (
      <ShowCourse todo={course} key={i} />
    ));
  }

  checkMimeType = (event) => {
    const types = ["video/mp4", "video/mkv"];
    const files = event.target.files;
    for (let x = 0; x < files.length; x++) {
      if (!types.includes(files[x].type)) {
        toast.error(`${files[x].type} is not a supported format`);
        return false;
      }
    }
    return true;
  };

  checkFileSize = (event) => {
    const maxSize = 2000000000; // 2GB
    const files = event.target.files;
    for (let x = 0; x < files.length; x++) {
      if (files[x].size > maxSize) {
        toast.error(`${files[x].name} is too large`);
        return false;
      }
    }
    return true;
  };

  onChangeHandler = (event) => {
    if (this.checkMimeType(event) && this.checkFileSize(event)) {
      this.setState({ selectedFile: event.target.files, loaded: 0 });
    } else {
      event.target.value = null;
    }
  };

  onClickHandler = () => {
    const { course, title, youtubelink, selectedFile } = this.state;

    if (!course || !title) {
      toast.error("Please select a course and enter a title");
      return;
    }

    // Upload YouTube link
    if (youtubelink.trim() !== "") {
      const payload = { course, title, videoLink: youtubelink };

      axios
        .post("http://localhost:5001/api/lecture/lectures/youtube", payload)
        .then(() => {
          toast.success("YouTube link uploaded successfully");
          this.resetForm();
        })
        .catch((error) => {
          console.error("Upload error:", error.response?.data || error.message);
          toast.error("Upload failed: YouTube");
        });
    }

    // Upload local video file
    else if (selectedFile && selectedFile.length > 0) {
      const data = new FormData();
      data.append("course", course);
      data.append("title", title);
      data.append("file", selectedFile[0]); // Only take first file

      axios
        .post("http://localhost:5001/api/lecture/lectures/localupload", data, {
          onUploadProgress: (ProgressEvent) => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
            });
          }
        })
        .then(() => {
          toast.success("Video file uploaded successfully");
          this.resetForm();
        })
        .catch((error) => {
          console.error("Upload failed:", error.response?.data || error.message);
          toast.error("Upload failed: File");
        });
    } else {
      toast.error("Please upload a file or provide a YouTube link");
    }
  };

  resetForm = () => {
    this.setState({
      selectedFile: null,
      youtubelink: "",
      loaded: 0,
      course: "",
      title: ""
    });
    setTimeout(() => window.location.reload(), 1300);
  };

  render() {
    const { course, title, youtubelink, loaded } = this.state;

    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="row" style={{ marginTop: "30px" }}>
            <div className="offset-md-3 col-md-6">
              <form encType="multipart/form-data">
                <h1 className="h3 mb-3 font-weight-normal">Upload Lecture</h1>

                <div className="form-group">
                  <label>Course Name</label>
                  <select
                    className="form-control"
                    name="course"
                    value={course}
                    onChange={(e) => this.setState({ course: e.target.value })}
                  >
                    <option value="">-- Select a Course --</option>
                    {this.CourseList()}
                  </select>
                  <p>{course ? `You have selected: ${course}` : "Please select a course"}</p>
                </div>

                <div className="form-group">
                  <label>Video Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => this.setState({ title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Upload Your File</label>
                  <input
                    type="file"
                    name="file"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                </div>

                <ToastContainer />
                <div className="form-group">
                  <Progress max="100" color="success" value={loaded}>
                    {Math.round(loaded)}%
                  </Progress>
                </div>

                <h3 className="text-center">OR</h3>

                <div className="form-group">
                  <label>YouTube Video URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubelink}
                    onChange={(e) =>
                      this.setState({ youtubelink: e.target.value })
                    }
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-success btn-block"
                  onClick={this.onClickHandler}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
