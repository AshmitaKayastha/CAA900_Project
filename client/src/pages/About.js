import React, { Component } from "react";
import NavBar from "../components/NavBar";

import TeamMemberGrid from "../components/TeamMemberGrid";



import MobileMenu from "../components/MobileMenu";

class About extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
    this.openModal = this.openModal.bind(this);
  }

  openModal() {
    this.setState({ isOpen: true });
  }

  render() {
    return (
      <div>
        {/* Navigation bar */}
        <NavBar />

        {/* breadcrumb */}
        {/*====================  breadcrumb area ====================*/}
        <div className="breadcrumb-area breadcrumb-bg">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="page-banner text-center">
                  <h1>About Us</h1>
                  <ul className="page-breadcrumb">
                    <li>
                      <a href="/">Home</a>
                    </li>
                    <li>About Us</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*====================  End of breadcrumb area  ====================*/}

        <div className="page-wrapper" style={{marginTop:"20px"}}>
          {/*About section start*/}
          
          {/*About section end*/}

      
          

          {/* Team member */}
          <TeamMemberGrid />

        </div>

        

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    );
  }
}

export default About;
