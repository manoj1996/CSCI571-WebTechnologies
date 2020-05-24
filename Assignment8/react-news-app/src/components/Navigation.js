import React, {Component} from 'react';
import {Navbar, NavDropdown, Nav, Form, FormControl, NavItem} from 'react-bootstrap';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import Switch from "react-switch";
import './Navigation.css';
import _ from "lodash";
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { Link,BrowserRouter as Router,Switch as RouterSwitch,Route,Redirect,NavLink, withRouter} from "react-router-dom"
import ReactTooltip from 'react-tooltip';
class Navigation extends Component 
{
    
  constructor(props) {
    super(props);
    this.state = {
        checked:true,
        selectedValue: null,
        bookmark:false,
        bookmarkTooltip:false
    };

    this.toggle = this.toggle.bind(this);
    this.spinnerCallback = this.spinnerCallback.bind(this);
    this.isDetailedCallback = this.isDetailedCallback.bind(this);
    this.sendChecked = this.sendChecked.bind(this);
    this.hideNewsSwitch = this.hideNewsSwitch.bind(this);
    this.bookmarkToggle = this.bookmarkToggle.bind(this);
  }

  componentDidMount() {
      if(this.props.isDetailed === true){
          this.setState({selectedValue:null});
      }
      if(localStorage.getItem("checked") == null){
          localStorage.setItem("checked", "true");
      }
  }

    componentDidUpdate(prevProps, prevState, snapshot) {
      ReactTooltip.rebuild();
  }

  toggle(checked)
  {
    this.setState({checked:checked});
    localStorage.setItem("checked", checked.toString());
    this.sendChecked(checked);
    this.spinnerCallback();
  }
  spinnerCallback(){
    this.props.spinCallBack(true);
  }

  isDetailedCallback(){
      this.setState({selectedValue:null});
      this.props.setIsDetailed(false);
  }
    hideNewsSwitch(){
        this.props.setIsDetailed(true);
    }

    bookmarkToggle()
    {
        this.setState(prevState => ({
            bookmarkTooltip: !prevState.bookmarkTooltip
        }));
    }


    addBookmarkCode(){
      if(this.state.bookmark === false || localStorage.getItem("detailedArticle")==="true"){
          if(this.state.bookmark === true){
              this.setState({"bookmark":false});
          }

          return (
              <span onClick={()=>{ReactTooltip.hide();}}>
              <Nav.Link as={NavLink} to="/Bookmark" href="/Bookmark" style={{color:"lightgray"}} activeStyle={{ color:'white' }} onClick={() => { this.setState({selectedValue:null});this.setState({"bookmark": true}); this.spinnerCallback(); this.hideNewsSwitch();}}><FaRegBookmark data-tip="Bookmark"/></Nav.Link>
              <ReactTooltip effect="solid" place="bottom"/>
              </span>
          );
      }
      else{
          return (
              <span style={{marginRight:'4%'}}><FaBookmark data-tip="Bookmark"/>
              <ReactTooltip effect="solid" place="bottom"/>
              </span>
          );
      }
    }

  loadOptions(query, callback){

          axios.get(
              `https://api.cognitive.microsoft.com/bing/v7.0/suggestions?q=${query}`,
              {
                  headers: {
                      "Ocp-Apim-Subscription-Key": "124fa9fc366942818f9c941d57067990"
                  }
              })
              .then(function(response){
                  let data= response.data.suggestionGroups[0].searchSuggestions;
                  let options= data.map(function(result){
                      return{
                          value:result.url,
                          label:result.displayText
                      }
                  });
                  callback(options)
              })
      }
    autoSearch = selectedValue =>
      {
          this.setState({selectedValue});
          this.setState({"bookmark":false});
          this.hideNewsSwitch();
          this.props.history.push({
              pathname:"/searchResults",
              search: "q="+selectedValue.label
          });
      };

  sendChecked(checked)
  {
      this.props.callbackFromParent(checked);
  }


  displaySwitch(){
    if (this.props.isDetailed === false){
      return (
            <React.Fragment>
                  <NavItem style={{color:'white', marginRight:'1%'}}>NYTimes</NavItem>
                  <Switch  onColor="#028efb" onHandleColor="#ffffff" handleDiameter={25} uncheckedIcon={false} checkedIcon={false} boxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)" activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)" height={20} width={48} className="react-switch" id="material-switch" checked = {localStorage.getItem("checked")==="true"} onChange = {this.toggle}/>
                  <NavItem style={{color:'white', marginLeft:'1%'}} >Guardian</NavItem>
            </React.Fragment>
      );
    }
    else{
        if(this.state.selectedValue !== null && window.location.href.includes('searchResults') === false)
            this.setState({selectedValue:null});
    }
  }

  render() {
      return(
            <div>
            <Navbar className = "navBar" expand = "lg">
            
            <div className="search">
                <AsyncSelect
                    loadOptions={_.debounce((query, callback) => this.loadOptions(query, callback), 1000, {leading:true})}
                    cacheOptions={true}
                    value={this.state.selectedValue}
                    onChange={this.autoSearch}
                placeholder="Enter Keyword .." />
              </div>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto"  defaultActiveKey="/">
                  <Nav.Link as={NavLink} exact to="/" href="/" activeStyle={{ color:'white' }} onClick={() => { this.spinnerCallback(); this.setState({"bookmark": false}); this.isDetailedCallback();}} style={{color:"lightgray"} }>Home</Nav.Link>
                  <Nav.Link as={NavLink} to="/world" href="/world"  activeStyle={{ color:'white' }} onClick={() => { this.spinnerCallback(); this.setState({"bookmark": false}); this.isDetailedCallback();}} style={{color:"lightgray"}}>World</Nav.Link>
                  <Nav.Link as={NavLink} to="/politics" href="/politics" activeStyle={{ color:'white' }} onClick={() => { this.spinnerCallback(); this.setState({"bookmark": false}); this.isDetailedCallback();}} style={{color:"lightgray"}}>Politics</Nav.Link>
                  <Nav.Link as={NavLink}  to="/business" href="/business"  activeStyle={{ color:'white' }} onClick={() => { this.spinnerCallback(); this.setState({"bookmark": false}); this.isDetailedCallback();}} style={{color:"lightgray"}}>Business</Nav.Link>
                  <Nav.Link as={NavLink} to="/technology" href="/technology" activeStyle={{ color:'white' }} onClick={() => { this.spinnerCallback(); this.setState({"bookmark": false}); this.isDetailedCallback();}} style={{color:"lightgray"}}>Technology</Nav.Link>
                  <Nav.Link as={NavLink} to="/sports" href="/sports" activeStyle={{ color:'white' }} onClick={() => { this.spinnerCallback(); this.setState({"bookmark": false}); this.isDetailedCallback();}} style={{color:"lightgray"}}>Sports</Nav.Link>
                </Nav>
                <div style={{color:'white',marginRight:'2%'}}>
                    {
                        this.addBookmarkCode()
                    }
              </div>
                {this.displaySwitch()}
              </Navbar.Collapse>
            </Navbar>
        </div>
      );
   }
}

export default withRouter(Navigation);