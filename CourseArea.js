import React from 'react';
import './App.css';
import Course from './Course';
import CompletedCourse from './CompletedCourse'
class CourseArea extends React.Component {
  getCourses() {
    let courses = [];
    if(this.props.identifier === "completed"){
      let temp = this.props.data
      temp.forEach((item, i) => {
        courses.push(
          <CompletedCourse ratedCourses = {this.props.ratedCourses} key={i} data={item}/>
        )
      });
      return courses
    }
    if (Array.isArray(this.props.data)){
     for(let i =0; i < this.props.data.length; i++){
      courses.push (
        <Course identifier = {this.props.identifier} allCourses={this.props.allCourses} completedCourses={this.props.completedCourses} key={i} data={this.props.data[i]} courseKey={this.props.data[i].number} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses}/>
      )
    }
  }
  else{
    for(const course of Object.keys(this.props.data)){
      courses.push (
        <Course key={this.props.data[course].number} data={this.props.data[course]} courseKey={this.props.data[course].number} addCartCourse={(data) => this.props.addCartCourse(data)} removeCartCourse={(data) => this.props.removeCartCourse(data)} cartCourses={this.props.cartCourses}/>
      )
    }
  }

    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return (JSON.stringify(this.props) !== JSON.stringify(nextProps))
  }

  render() {
    return (
      <div style={{margin: 5, marginTop: -5}}>
        {this.getCourses()}
      </div>
    )
  }
}

export default CourseArea;
