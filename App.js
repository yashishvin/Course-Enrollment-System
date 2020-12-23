import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Recommender from './Recommender.js'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      interests:[],
      cartCourses: {},
      completedCourses:[],
      ratedCourses:[]
    };
  }



  componentDidMount() {
   this.loadInitialState()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json()
    let completedCourses = await (await fetch("http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed")).json()
    this.setState({allCourses: courseData, filteredCourses: courseData, subjects: this.getSubjects(courseData),interests: this.getInterests(courseData),completedCourses: this.getCompletedCourses(completedCourses,courseData)});
  }


  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return
    }

    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }


      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    this.setState({cartCourses: newCartCourses});
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }
  getCompletedCourses(completedCourses,courseData){
    let courses = []

      for(let j =0;j< courseData.length; j++){
        for(let i = 0;i<completedCourses.data.length;i++){
          if(completedCourses.data[i] === courseData[j].number)
            courses.push(
              {
                "credits":courseData[j].credits,
                "description":courseData[j].description,
                "name":courseData[j].name,
                "number":courseData[j].number,
                "keywords":courseData[j].keywords,
                "subject":courseData[j].subject,
                "rating":""
              }
            );
        }

      }

    return courses
  }
  getInterests(data) {
    let interests = [];
    interests.push("All");

    for(let i = 0; i < data.length; i++) {
      data[i].keywords.forEach((keyword) => {
        if(interests.indexOf(keyword) === -1){
          interests.push(keyword)
        }
      });

      if(interests.indexOf(data[i].subject) === -1)
        interests.push(data[i].subject);
    }

    return interests;
  }
  ratedCourses(data){
    let temp = this.state.ratedCourses
    if(temp.length === 0){
      temp.push(data)
      this.setState({ratedCourses:temp})
      return;
    }
    let count = 0
    temp.forEach((course) => {
      if(course.name === data.name){
        course.rating = data.rating
        count = count +1
      }
    });
    if(count>0){
      this.setState({ratedCourses:temp})
      console.log(temp)
      return;
    }
    temp.push(data)
    this.setState({ratedCourses:temp})
    console.log(temp)

  }


  render() {

    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />


        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} interests={this.state.interests}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea identifier="search" data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea identifier="cart" allCourses={this.state.allCourses} completedCourses={this.state.completedCourses} data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="completedCourses" title="Completed Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea identifier="completed" data={this.state.completedCourses} ratedCourses={(data) => this.ratedCourses(data)} />
            </div>
          </Tab>
          <Tab eventKey="RecommendedCourses" title="Recommended Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <Recommender allCourses={this.state.allCourses} completedCourses={this.state.completedCourses} ratedCourses={this.state.ratedCourses} />
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;
