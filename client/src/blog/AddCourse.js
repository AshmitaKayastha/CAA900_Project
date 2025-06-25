import React, { Component } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowCat = (props) => (
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
  }

  componentDidMount() {
    axios
    .get("http://localhost:5001/api/category")

      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            todos: response.data,
            category: response.data[0].categoryName // ✅ Set default category
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      });
  }

  CatList = () => {
    return this.state.todos.map((currentTodo, i) => (
      <ShowCat todo={currentTodo} key={i} />
    ));
  };

  onChangeCourseName = (e) => {
    this.setState({ courseName: e.target.value });
  };

  onChangeDescription = (e) => {
    this.setState({ courseDescription: e.target.value });
  };

  onChangeCategory = (e) => {
    this.setState({ category: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { courseName, courseDescription, instructor, category } = this.state;

    // ✅ Prevent submission if required fields are missing
    if (!courseName || !courseDescription || !category) {
      toast.error("Please fill out all fields.");
      return;
    }

    const newCourse = {
      courseName,
      courseDescription,
      instructor,
      category
    };

    console.log("Submitting course:", newCourse);

    axios
      .post("http://localhost:5001/api/course/add", newCourse)
      .then(() => {
        toast.success("Course added successfully!");
        setTimeout(() => {
          this.props.history.push("/add-lecture/" + instructor);
        }, 1000);
      })
      .catch((err) => {
        console.error("Course submission failed:", err);
        toast.error("Failed to submit course.");
      });
  };

  render() {
    return (
      <div>
        <NavBar />
        <ToastContainer />
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

                <p>You selected: <strong>{this.state.category}</strong></p>

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
