import React, { Component } from "react";
import NavBar from "../components/NavBar";
import axios from "axios"; // or use: import axios from "../utils/axiosInstance";

const ShowCat = props => (
  <option key={props.todo._id} value={props.todo.categoryName}>
    {props.todo.categoryName}
  </option>
);

export default class AddCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseName: "",
      courseDescription: "",
      instructor: this.props.match.params.id,
      category: "",
      todos: []
    };

    this.onChangeCourseName = this.onChangeCourseName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    axios
      .get("http://localhost:5001/api/category") // ✅ fixed endpoint
      .then(response => {
        this.setState({
          todos: response.data,
          category: response.data.length > 0 ? response.data[0].categoryName : ""
        });
      })
      .catch(error => {
        console.log("Error fetching categories:", error);
      });
  }

  CatList() {
    return this.state.todos.map((currentTodo, i) => {
      return <ShowCat todo={currentTodo} key={i} />;
    });
  }

  onChangeCourseName(e) {
    this.setState({ courseName: e.target.value });
  }

  onChangeDescription(e) {
    this.setState({ courseDescription: e.target.value });
  }

  onChangeCategory(e) {
    this.setState({ category: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const newCourse = {
      courseName: this.state.courseName,
      courseDescription: this.state.courseDescription,
      instructor: this.state.instructor,
      category: this.state.category
    };

    console.log("Submitting course:", newCourse);

    axios
      .post("http://localhost:5001/api/course/add", newCourse) // ✅ fixed endpoint
      .then(() => {
        this.props.history.push("/add-lecture/" + this.state.instructor);
      })
      .catch(err => console.error("Course submission failed:", err));
  }

  render() {
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="row">
            <div className="col-md-6 mt-5 mx-auto">
              <form onSubmit={this.onSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Add Course</h1>
                <div className="form-group">
                  <label>Course Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Course name"
                    value={this.state.courseName}
                    onChange={this.onChangeCourseName}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter Description"
                    value={this.state.courseDescription}
                    onChange={this.onChangeDescription}
                  />
                </div>

                <div className="form-group">
                  <label>Course Category</label>
                  <select
                    className="form-control"
                    name="category"
                    onChange={this.onChangeCategory}
                    value={this.state.category}
                  >
                    {this.CatList()}
                  </select>
                </div>

                <p>You selected: {this.state.category}</p>

                <button
                  type="submit"
                  className="btn btn-lg btn-primary btn-block"
                >
                  Add Course
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
