import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import RecommendedCourse from './RecommendedCourse'
class Recommender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendedCourses:[],
    }
    this.rating = React.createRef();
  }
  getInterests(data) {
    let interests = [];


      data.keywords.forEach((keyword) => {
        if(interests.indexOf(keyword) === -1){
          interests.push(keyword)
        }
      });

      if(interests.indexOf(data.subject) === -1){
        interests.push(data.subject);
      }


    return interests;
  }
courseInCompletedCourses(data){
  let completedCourses = this.props.completedCourses
  for(let i =0;i<completedCourses.length;i++){
    if(completedCourses[i].name === data.name){
      return true
    }
  }
  return false
}
courseInRecommended(course,recommended){
  for(let i =0;i<recommended.length;i++){
    if(recommended[i].name === course.name){
      return true
    }
  }
  return false
}
showCourses(courses){
  let temp = []
  courses.forEach((course) => {
    temp.push(<RecommendedCourse data={course} interest={course.interest}/>)
  });
  return temp
}
Recommended(){
  let allCourses = this.props.allCourses
  let ratedCourses = this.props.ratedCourses
  let completedCourses = this.props.completedCourses
  let tempRecommended = []
  //filter for No Rating  1 ,2

  ratedCourses = ratedCourses.filter((course) =>{
    if(course.rating !== "No Rating"&& course.rating>2){
      return true
    }
    else {
      return false
    }
  } )
  //sort in descending order by rating
  ratedCourses = ratedCourses.sort((x,y)=> y.rating-x.rating)

  for(let i=0;i<ratedCourses.length;i++){
    //find interest areas
    let interests = []
    interests = this.getInterests(ratedCourses[i])

    //find courses with same interest areas
    interests.forEach((interest) => {
      allCourses.forEach((course) => {

        //find interests of selected courses
        let courseInterests = []
        courseInterests = this.getInterests(course)
        // if Rated course interest matches course interest
          if(courseInterests.indexOf(interest)=== -1){
            console.log("1")
          }
          else{
            //check if course is in CompletedCourses
            if(!this.courseInCompletedCourses(course)&&!this.courseInRecommended(course,tempRecommended)){
                //check if course is already there in recommended
                course.interest = interest
              tempRecommended.push(course)

            }
          }
      });

    });

  }
  console.log(tempRecommended)
let temp =   this.showCourses(tempRecommended)
return temp
}

  render() {
    return (
        <>
        {this.Recommended()}
        </>
    )
  }
  }
  export default Recommender
