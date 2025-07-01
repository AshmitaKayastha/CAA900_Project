import React, { Component } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { ToastContainer, toast } from "react-toastify";

export default class ShowCourseAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = { todos: [], search: "" };
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  componentDidMount() {
    axios
      .get("http://localhost:5001/api/course/")
      .then(response => {
        this.setState({ todos: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  delete(id) {
    axios
      .delete(`http://localhost:5001/api/course/${id}`)
      .then(result => {
        toast.success("Deleted successfully");
      })
      .catch(err => {
        toast.error("Course not deleted");
      });

    setTimeout(() => {
      window.location.reload();
    }, 1300);
  }

  render() {
    const filteredCourses = this.state.todos.filter(course => {
      return (
        course.courseName.toLowerCase().includes(this.state.search.toLowerCase()) ||
        course.courseDescription.toLowerCase().includes(this.state.search.toLowerCase()) ||
        course.category?.categoryName.toLowerCase().includes(this.state.search.toLowerCase()) ||
        course.instructor?.email.toLowerCase().includes(this.state.search.toLowerCase())
      );
    });

    return (
      <div>
        <NavBar />

        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <input type="hidden" />
          <h1
            style={{
              marginLeft: "-200px",
              textDecoration: "underline",
              color: "#F0542D"
            }}
          >
            Course List
          </h1>
          <input
            type="text"
            placeholder="Search..."
            className="form-control input-sm"
            style={{ width: "250px" }}
            value={this.state.search}
            onChange={this.updateSearch.bind(this)}
          />
        </div>

        <div className="container" style={{ border: "10px solid lightgray" }}>
          <table
            className="table table-striped"
            id="coursetable"
            style={{ marginTop: 20 }}
          >
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Course Description</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <ToastContainer />
            <tbody>
              {filteredCourses.map((course, i) => (
                <tr key={i}>
                  <td>{course.courseName}</td>
                  <td>{course.courseDescription}</td>
                  <td>{course.instructor?.email}</td>
                  <td>{course.category?.categoryName}</td>
                  <td>
                    <a
                      href={`/ShowCourseList/edit/${course._id}`}
                      className="btn btn-primary btn-info"
                      role="button"
                    >
                      Edit
                    </a>{" "}
                    &nbsp;
                    <button
                      onClick={() => this.delete(course._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
