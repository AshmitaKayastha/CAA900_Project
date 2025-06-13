import React, { Component } from "react";

class BlogPostContent extends Component {
  render() {
    let tagData = [
      { tagLink: "blog-left-sidebar", tagName: "Web Development" },
      { tagLink: "blog-left-sidebar", tagName: "Mobile Apps" },
      { tagLink: "blog-left-sidebar", tagName: "Programming Languages" }
    ];

    let tagDataList = tagData.map((val, i) => {
      return (
        <li key={i}>
          <a href={`${process.env.PUBLIC_URL}/${val.tagLink}`}>{val.tagName}</a>
        </li>
      );
    });

    return (
      <div>
        <div className="row">
          <div className="blog-details col-12">
            <div className="blog-inner">
              <div className="media">
                <div className="image">
                  <img src="assets/img/blog/blog-details-1.jpg" alt="" />
                </div>
              </div>
              <div className="content">
                <ul className="meta">
                  <li>
                    By <a href="blog-left-sidebar">admin</a>
                  </li>
                  <li>June 13 2025</li>
                  <li>
                    <a href="/">3 Comment</a>
                  </li>
                </ul>
                <h2 className="title">
                  Complete Python Bootcamp: Go from zero to hero in Python 3
                </h2>
                <div className="desc section-space--bottom--30">
                  <p>
                    Python is one of the most versatile and beginner-friendly programming languages. It’s used in web development, data analysis, artificial intelligence, machine learning, and more. The language emphasizes readability, allowing new developers to pick it up quickly.
                  </p>
                  <p>
                    This bootcamp covers everything from the basics of Python syntax to advanced topics like decorators, generators, and working with APIs. Whether you’re new to coding or looking to add Python to your skill set, this course is a great place to start.
                  </p>
                  <blockquote className="blockquote section-space--bottom--30 section-space--top--30">
                    <p>
                      “Python’s simplicity and wide adoption make it the ideal language for rapid development and innovation.”
                    </p>
                    <span className="author">__Denise Miller</span>
                  </blockquote>
                  <p>
                    Students will build real-world projects including a calculator, web scraper, and even a Django-based web app. These hands-on experiences reinforce your understanding and prepare you for real job scenarios.
                  </p>
                  <p>
                    By the end of this bootcamp, you’ll be confident in writing clean Python code, understanding data structures, and using Python libraries like NumPy, Pandas, and Flask. Start your journey toward becoming a Python developer today.
                  </p>
                </div>
                <ul className="tags">
                  <li>
                    <i className="fa fa-tags" />
                  </li>
                  {tagDataList}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 section-space--top--60">
            <div className="comment-wrapper">
              <h3>Leave Your Comment</h3>
              <div className="comment-form">
                <form action="#">
                  <div className="row row-10">
                    <div className="col-md-6 col-12 section-space--bottom--20">
                      <input type="text" placeholder="Your Name" />
                    </div>
                    <div className="col-md-6 col-12 section-space--bottom--20">
                      <input type="email" placeholder="Your Email" />
                    </div>
                    <div className="col-12">
                      <textarea placeholder="Your Message" defaultValue={""} />
                    </div>
                    <div className="col-12">
                      <input type="submit" defaultValue="Send Comment" />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BlogPostContent;
