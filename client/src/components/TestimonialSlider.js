import React, { Component } from "react";
import Swiper from "react-id-swiper";

class TestimonialSlider extends Component {
  render() {
    const params = {
      slidesPerView: 1,
      loop: true,
      speed: 1000,
      effect: "fade",
      autoplay: {
        delay: 2000
      },
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true
      },
      renderPagenation: () => <div className="swiper-pagination" />
    };
    let data = [
      {
        testimonialImage: "1.jpg",
        testimonialName: "Yubaraj Ghimirei",
        testimonialDesignation: "Founder",
        testimonialText:
          "At our core, we believe learning should be accessible,engaging, and empowering. I started this platform to bridge the gap between traditional education and real-world skills. Our mission is to help you grow, adapt, and succeed—wherever you are in your learning journey."
      },
      {
        testimonialImage: "3.jpg",
        testimonialName: "Pujan Limbu",
        testimonialDesignation: "Engineer",
        testimonialText:
          "As engineers, we’re driven by innovation and precision. Every feature we build is designed to make learning seamless, intuitive, and impactful. Behind the scenes, our team works tirelessly to ensure the platform is fast, reliable, and always evolving to meet your needs."
      },
      {
        testimonialImage: "2.jpg",
        testimonialName: "Ashmita Kayastha",
        testimonialDesignation: "CEO",
        testimonialText:
          "Welcome to our learning community. In a world that's constantly evolving, our goal is to equip you with the knowledge and skills to stay ahead. We're committed to delivering high-quality, accessible education that empowers you to reach your full potential. Thank you for trusting us with your learning journey."
      }
    ];

    let DataList = data.map((val, i) => {
      return (
        <div className="swiper-slide testimonial-slider__single-slide" key={i}>
          <div className="author">
            <div className="author__image">
              <img
                src={`assets/img/testimonial/${val.testimonialImage}`}
                alt=""
              />
            </div>
            <div className="author__details">
              <h4 className="name">{val.testimonialName}</h4>
              <div className="designation">{val.testimonialDesignation}</div>
            </div>
          </div>
          <div className="content">{val.testimonialText}</div>
        </div>
      );
    });

    return (
      <div>
        {/*====================  testimonial slider area ====================*/}
        <div className="testimonial-slider-area testimonial-slider-area-bg section-space--inner--120">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                <div className="testimonial-slider">
                  <div className="testimonial-slider__container-area">
                    <Swiper {...params}>{DataList}</Swiper>
                    <div className="swiper-pagination" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*====================  End of testimonial slider area  ====================*/}
      </div>
    );
  }
}

export default TestimonialSlider;
