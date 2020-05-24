import React, { Component, useState }from 'react';
import {Card, Container, Row, Col, Badge} from 'react-bootstrap';
import './Home.css'
import Popup from "reactjs-popup";
import ToastContent from "./ToastContent";
import TextTruncate from "react-text-truncate";
import { IoMdShare } from 'react-icons/io';
import {withRouter} from "react-router-dom";
import ShareContent from "./ShareContent";
class SearchResults extends Component{
    constructor(props) {
        super(props);
        this.state = {
            articles: '',
            articles2 :'',
            query: null,
            update:false
        };
        this.spinnerCallback = this.spinnerCallback.bind(this);
        this.sendSpinning = this.sendSpinning.bind(this);
        this.preventEvent = this.preventEvent.bind(this);
        this.hideNewsSwitch = this.hideNewsSwitch.bind(this);
        this.updateRerender = this.updateRerender.bind(this);
    }
    preventEvent(event)
    {
        event.stopPropagation();
        event.preventDefault();
    }
    spinnerCallback(){
        this.props.spinCallBack(true);
    }
    updateRerender(props){
        this.spinnerCallback();
        let query = props.location.search.substring(3,props.location.search.length);
        this.setState({query:query});
        this.callGuardian(query);
        this.callNyTimes(query);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let query = nextProps.location.search.substring(3,nextProps.location.search.length);
        if(query!==this.state.query){
            this.updateRerender(nextProps);
        }
    }

    componentDidMount() {
        this.spinnerCallback();
        let query = window.location.search.substring(3,window.location.search.length);
        this.setState({query:query});
        this.callGuardian(query);
        this.callNyTimes(query);
        this.hideNewsSwitch();
    }

    returnBadge(section)
    {
        let color;
        let textColor;
        section=section.toLowerCase()
        switch(section)
        {
            case "world":
                color = "rgb(134, 66, 255)";
                textColor = 'white';
                break;
            case  "politics":
                color = "rgb(0, 150, 136)";
                textColor='white';
                break;
            case "business":
                color = "rgb(33, 150, 243)";
                textColor='white';
                break;
            case "technology":
                color = "rgb(202, 222, 0)";
                textColor = "black";
                break;
            case  "sport":
                color = "rgb(255, 193, 8)";
                textColor = "black";
                break;
            case "sports":
                color = "rgb(255, 193, 8)";
                textColor = "black";
                break;
            case "guardian":
                color = "rgb(15, 40, 76)";
                textColor = "white";
                break;
            case "nytimes":
                color = "rgb(221, 221, 221)";
                textColor = "black";
                break;
            default:
                color = "#6C757D";
                textColor = 'white';
                break;
        }
        return (
            <Badge style={{float:'right',backgroundColor:color, color:textColor, marginTop:'1%'}}>
                {section.toUpperCase()}
            </Badge>
        )
    }

    sendSpinning(value){
        if(this.props.spinning === true && value === false){
            this.props.spinCallBack(value);
        }
        document.getElementById("Results").innerHTML = "Results";
    }

    callGuardian(query)
    {
        fetch("https://news-api.azurewebsites.net/guardian/news/search?q="+query).then(res=> {
            return res.json();
        }).then(news_article=> this.setState({articles:news_article}));
    }
    callNyTimes(query)
    {
        fetch("https://news-api.azurewebsites.net/nyTimes/news/search?q="+query).then(res=> {
            return res.json();
        }).then(news_article=> this.setState({articles2:news_article}));
    }

    hideNewsSwitch(){
        this.props.setIsDetailed(true);
    }


    callDetailed(event,article)
    {
        this.spinnerCallback();
        this.hideNewsSwitch();
        if(article.Source === "guardian")
        {
            this.props.history.push({
                pathname:"/article",
                search: "id="+article.id
            });
        }
        else
        {
            this.props.history.push({
                pathname:"/article",
                search: "url="+article.url
            });
        }
    }

    render() {
        let articleArray = [];
        for(let i in this.state.articles){
            articleArray.push(this.state.articles[i]);
        }
        for(let j in this.state.articles2){
            articleArray.push(this.state.articles2[j]);
        }

        return (
            <div>
                <div style={{marginLeft:'1%'}}>
                    <div id="Results" style={{marginLeft:'1%', marginTop:'1%', fontSize:'180%', fontWeight:'bold', color:'rgb(110,110,110)'}}>
                    </div>
                    <Container fluid={true} className="card-container">
                        <Row xs={1} md={4} lg={4} xl={4}>
                    {
                        articleArray.map((article) =>
                                <Col style={{padding:'1%'}}>
                                <Card style={{boxShadow:'0px 0px 25px #333', width:'100%',cursor:'pointer'}} onClick={(event) => this.callDetailed(event,article)} >
                                        <Card.Body style={{marginTop:'-1.75%'}}>
                                            <Card.Title style={{fontWeight:'bold', fontSize:'100%', fontStyle:'italic'}}><TextTruncate line={2} element='span' text={article.Title}/>
                                            <span onClick = {this.preventEvent} >
                                                <span>
                                                <ShareContent title={article.Title} url={article.url}/>
                                                </span>
                                            </span>
                                
                                            </Card.Title>
                                            <div style={{textAlign:'center',padding:'0.2%'}}>
                                                <Card.Img src={article.Image} height={'100%'} width={'100%'} style={{objectFit:"cover"}}/>
                                            </div>
                                            <Card.Text style={{marginTop:'3%'}}>
                                                        <span style={{fontWeight:'550',fontStyle:'italic', color:'rgb(110,110,110)'}}>
                                                            {
                                                                article.Date
                                                            }
                                                        </span>
                                                {
                                                    this.returnBadge(article.Section)
                                                }
                                            </Card.Text>
                                        </Card.Body>
                                    {this.sendSpinning(false)}
                                </Card>
                                </Col>
                        )}
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}

export default withRouter(SearchResults);