import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
class CompletedCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }
    this.rating = React.createRef();

  }

  getRatings(){
    let ratings = []
    ratings.push(<option key={"No Rating"}>No Rating</option>)
    for(let i =1;i<6;i++){
      ratings.push(<option key={i}>{i}</option>)
    }
    return ratings
  }
  setRating(){
    let rated = []
    let temp = this.props.course

      temp.rating = this.rating.current.value
      this.props.ratedCourses(temp)
  }

  render() {
    return (
        <Form>
        <Form.Group style={{marginBottom:"0px"}}controlId="formRatings">
          <Form.Control as="select" ref={this.rating} onClick={() => this.setRating()}>
            {this.getRatings()}
          </Form.Control>
        </Form.Group>
        </Form>
    )
  }
  }
  export default CompletedCourse
