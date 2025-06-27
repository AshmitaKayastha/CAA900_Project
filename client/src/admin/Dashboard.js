import React, { Component } from "react";
import NavBar from "../components/NavBar";
import CanvasJSReact from "../canvas/canvasjs.react";
import axios from "axios";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      c1: [],
      c2: [],
      c3: []
    };
  }

  getAuthHeaders() {
    const token = localStorage.getItem("jwtToken");
    return {
      headers: { Authorization: token }
    };
  }

  getCoursedata() {
    axios.get("http://localhost:5001/api/course", this.getAuthHeaders())
      .then(response => {
        let instructorMap = {};
        let categoryMap = {};

        response.data.forEach(element => {
          const instructorEmail = element.instructor?.email || "Unknown";
          const categoryName = element.category?.categoryName || "Uncategorized";

          instructorMap[instructorEmail] = (instructorMap[instructorEmail] || 0) + 1;
          categoryMap[categoryName] = (categoryMap[categoryName] || 0) + 1;
        });

        const c1Data = Object.keys(instructorMap).map(k => ({ y: instructorMap[k], label: k }));
        const c3Data = Object.keys(categoryMap).map(k => ({ y: categoryMap[k], name: k }));

        this.setState({ c1: c1Data, c3: c3Data });
      })
      .catch(error => {
        console.error("Error fetching course data:", error);
      });
  }

  getEnrollmentdata() {
    axios.get("http://localhost:5001/api/enrollment", this.getAuthHeaders())
      .then(response => {
        let enrollmentMap = {};

        response.data.forEach(element => {
          const courseName = element.course?.courseName || "Unnamed Course";
          enrollmentMap[courseName] = (enrollmentMap[courseName] || 0) + 1;
        });

        const c2Data = Object.keys(enrollmentMap).map(k => ({ y: enrollmentMap[k], label: k }));
        this.setState({ c2: c2Data });
      })
      .catch(error => {
        console.error("Error fetching enrollment data:", error);
      });
  }

  componentDidMount() {
    this.getCoursedata();
    this.getEnrollmentdata();
  }

  render() {
    const options1 = {
      exportEnabled: true,
      animationEnabled: true,
      title: { text: "Courses Per Instructor" },
      data: [{
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}",
        showInLegend: true,
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}",
        dataPoints: this.state.c1
      }]
    };

    const options2 = {
      exportEnabled: true,
      animationEnabled: true,
      title: { text: "Students Per Course" },
      data: [{ type: "column", dataPoints: this.state.c2 }]
    };

    const options3 = {
      exportEnabled: true,
      animationEnabled: true,
      title: { text: "Courses Per Category" },
      subtitles: [{ verticalAlign: "center", fontSize: 24, dockInsidePlotArea: true }],
      data: [{
        type: "doughnut",
        showInLegend: true,
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###",
        dataPoints: this.state.c3
      }]
    };

    return (
      <div>
        <NavBar />
        <div className='container'>
          <div className='row'>
            <div className="col-md-6">
              <CanvasJSChart options={options1} />
            </div>
            <div className="col-md-6">
              <CanvasJSChart options={options3} />
            </div>
          </div>
          <br />
          <div className="row">
            <CanvasJSChart options={options2} />
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
