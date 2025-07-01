import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import { ToastContainer, toast } from "react-toastify";
import "./admin.css";

export default class EnrollList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      search: ""
    };

    this.refreshEnrollList = this.refreshEnrollList.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  componentDidMount() {
    axios
      .get("http://localhost:5001/api/enrollment/")
      .then((response) => {
        this.setState({ todos: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  delete(id) {
    axios
      .delete(`http://localhost:5001/api/enrollment?id=${id}`)
      .then(() => {
        toast.success("Deleted successfully");
      })
      .catch(() => {
        toast.error("Course not deleted");
      });

    setTimeout(() => {
      window.location.reload();
    }, 1300);
  }

  refreshEnrollList(res) {
    this.setState({ todos: res.data.todos });
  }

  render() {
    // ✅ Avoid crash by checking course & student first
    const filteredUsers = this.state.todos.filter((enroll) => {
      return (
        enroll?.student?.email?.toLowerCase().includes(this.state.search.toLowerCase()) ||
        enroll?.course?.courseName?.toLowerCase().includes(this.state.search.toLowerCase())
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
          <a
            href="/createEnrollAdmin"
            className="btn btn-primary btn-info btn active"
            role="button"
            aria-pressed="true"
          >
            Create Enrollment
          </a>

          <h1
            style={{
              marginLeft: "-200px",
              textDecoration: "underline",
              color: "#F0542D"
            }}
          >
            Enrollment List
          </h1>

          <input
            type="text"
            placeholder="Search..."
            className="form-control input-sm"
            style={{ width: "250px" }}
            value={this.state.search}
            onChange={this.updateSearch}
          />
        </div>

        <div className="container" style={{ border: "10px solid lightgray" }}>
          <table
            className="table table-striped"
            id="usertable"
            ref={(el) => (this.el = el)}
            data-order='[[ 1, "asc" ]]'
            data-page-length="25"
          >
            <thead>
              <tr>
                <th>Student Email</th>
                <th>Course Title</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((enroll, i) => {
                return enroll?.student && enroll?.course ? (
                  <tr key={i}>
                    <td>{enroll.student.email}</td>
                    <td>{enroll.course.courseName}</td>
                    <td>
                      <button
                        onClick={() => this.delete(enroll._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ) : null; // skip rows with missing data
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
