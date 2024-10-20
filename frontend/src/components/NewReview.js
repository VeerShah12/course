import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import authService from "../services/auth-service";
import { Link } from "react-router-dom";
import reviewService from "../services/review-service";

const NewReview = ({ courses }) => {
  const [show, setShow] = useState(false);
  const [loginShow, setLoginShow] = useState(false);
  const [coursesFiltered, setCoursesFiltered] = useState([]);
  const [courseInput, setCourseInput] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(undefined);
  const [review, setReview] = useState("");

  const addReview = () => {
    if (authService.isLogin()) {
      setShow(true);
    } else {
      setLoginShow(true);
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleLoginClose = () => {
    setLoginShow(false);
  };

  const updateCourseInput = (courseInput) => {
    const filtered = courses.filter((course) => {
      return course.name.includes(courseInput);
    });

    setCourseInput(courseInput);
    setCoursesFiltered(filtered);
    setSelectedCourse(undefined);
  };

  const courseClick = (course) => {
    setCourseInput(course.name);
    setSelectedCourse(course._id);
    setCoursesFiltered([]);
  };

  const postReview = () => {
    let data = {
      courseId: selectedCourse,
      review: review,
    };

    reviewService
      .createReivew(data)
      .then((res) => {
        alert("Review Created");
        setShow(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <button onClick={addReview} className="btn add-review-btn mt-3">
        New Review
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="modal-header">
          <span>Add Review</span>
          <button onClick={handleClose}>X</button>
        </Modal.Header>
        <Modal.Body className="review-modal">
          <input
            value={courseInput}
            onChange={(e) => updateCourseInput(e.target.value)}
            className="my-2"
            type="text"
            placeholder="Enter Course Name"
          />
          {coursesFiltered.length !== 0 && courseInput !== "" && (
            <ul className="filtered-list">
              {coursesFiltered.map((course, index) => {
                return (
                  <li
                    onClick={() => courseClick(course)}
                    className="filtered-item"
                    key={index}
                  >
                    {course.name}
                  </li>
                );
              })}
            </ul>
          )}
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="review-area"
            name="review"
            id=""
            cols="30"
            rows="10"
            placeholder="Course Structure, Course Outcomes, Learning Content..."
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={postReview}
            disabled={selectedCourse === undefined || review === ""}
          >
            Add Review
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={loginShow} onHide={handleLoginClose}>
        <Modal.Header className="modal-header">
          <h3>Please login first</h3>
        </Modal.Header>
        <Modal.Body>
          <span>
            This function is only available after logging in. Please register or
            log in to your existing account to continue.
          </span>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleLoginClose}>
            Return to page
          </button>
          <Link className="btn btn-primary" to="/login">
            Login
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NewReview;
