import React, { Component } from "react";
import NavBar from "./components/NavBar";
import HeroSliderTwo from "./components/HeroSliderTwo";
import VideoCta from "./components/VideoCta";


import TestimonialSlider from "./components/TestimonialSlider";
import BrandLogoSlider from "./components/BrandLogoSlider";

import MobileMenu from "./components/MobileMenu";

class HomeTwo extends Component {
  render() {
    return (
      <div>
        {/* Navigation bar */}
        <NavBar />

        {/* Hero slider */}
        <HeroSliderTwo />

        {/* Video CTA */}
        <VideoCta />

        

       

        {/* Testimonial Slider */}
        <TestimonialSlider />

     

        {/* Brand logo */}
        <BrandLogoSlider background="grey-bg" />

  

       

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    );
  }
}

export default HomeTwo;
