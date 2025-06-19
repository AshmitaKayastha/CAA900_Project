import React, { Component } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { Progress } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowCourse = props => (
  <option key={props.todo.courseName} value={props.todo.courseName}>
    {props.todo.courseName}
  </option>
);

export default class Upload extends Component {
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

    this.onChangeCourse = this.onChangeCourse.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeYouTubeLink = this.onChangeYouTubeLink.bind(this);
  }

  componentDidMount() {
    axios
      .get(`http://localhost:5001/api/course/coursebyinstructor?id=${this.props.match.params.id}`)
      .then(response => {
        this.setState({ Courses: response.data });
      })
      .catch(error => {
        console.log("Error fetching instructor courses:", error);
      });
  }

  CourseList() {
    return this.state.Courses.map((currentTodo, i) => (
      <ShowCourse todo={currentTodo} key={i} />
    ));
  }

  onChangeCourse(e) {
    this.setState({ course: e.target.value });
  }

  onChangeTitle(e) {
    this.setState({ title: e.target.value });
  }

  onChangeYouTubeLink(e) {
    this.setState({ youtubelink: e.target.value });
  }

  checkMimeType = event => {
    const files = event.target.files;
    const types = ["video/mp4", "video/mkv"];
    let err = [];

    for (let x = 0; x < files.length; x++) {
      if (types.every(type => files[x].type !== type)) {
        err.push(files[x].type + " is not a supported format\n");
      }
    }

    if (err.length > 0) {
      err.forEach(e => toast.error(e));
      event.target.value = null;
    }

    return err.length === 0;
  };

  maxSelectFile = event => {
    const files = event.target.files;
    if (files.length > 3) {
      toast.warn("Only 3 files can be uploaded at a time");
      event.target.value = null;
      return false;
    }
    return true;
  };

  checkFileSize = event => {
    const files = event.target.files;
    const size = 2000000000000;
    let err = [];

    for (let x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err.push(`${files[x].name} is too large`);
      }
    }

    if (err.length > 0) {
      err.forEach(e => toast.error(e));
      event.target.value = null;
    }

    return err.length === 0;
  };

  onChangeHandler = event => {
    if (
      this.maxSelectFile(event) &&
      this.checkMimeType(event) &&
      this.checkFileSize(event)
    ) {
      this.setState({ selectedFile: event.target.files, loaded: 0 });
    }
  };

  onClickHandler = () => {
    const data = new FormData();
    data.append("course", this.state.course);
    data.append("title", this.state.title);

    if (!this.state.youtubelink) {
      for (let x = 0; x < this.state.selectedFile.length; x++) {
        data.append("file", this.state.selectedFile[x]);
      }
    } else {
      data.append("videoLink", this.state.youtubelink);
    }

    axios
      .post("http://localhost:5001/lectures/localupload", data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      })
      .then(() => toast.success("Upload successful"))
      .catch(() => toast.error("Upload failed"));

    setTimeout(() => {
      window.location.reload();
    }, 1300);
  };

  render() {
    const message2 = "You have selected " + this.state.course;
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="row" style={{ marginTop: "30px" }}>
            <div className="offset-md-3 col-md-6">
              <form encType="multipart/form-data">
                <h1 className="h3 mb-3 font-weight-normal">Upload Video</h1>
                <div className="form-group">
                  <label>Course Name</label>
                  <select
                    className="form-control"
                    name="course"
                    onChange={this.onChangeCourse}
                    value={this.state.course}
                  >
                    {this.CourseList()}
                  </select>
                  <p>{message2}</p>
                </div>
                <div className="form-group">
                  <label>Video Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.title}
                    onChange={this.onChangeTitle}
                  />
                </div>
                <div className="form-group">
                  <label>Upload Your File</label>
                  <input
                    type="file"
                    name="file"
                    className="form-control"
                    multiple
                    onChange={this.onChangeHandler}
                  />
                </div>
                <ToastContainer />
                <div className="form-group">
                  <Progress max="100" color="success" value={this.state.loaded}>
                    {Math.round(this.state.loaded)}%
                  </Progress>
                </div>
                <h3 className="text-center">OR</h3>
                <div className="form-group">
                  <label>YouTube Video URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ex: https://www.youtube.com/embed/..."
                    value={this.state.youtubelink}
                    onChange={this.onChangeYouTubeLink}
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
