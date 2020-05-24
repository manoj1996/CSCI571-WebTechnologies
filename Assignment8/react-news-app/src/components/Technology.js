import React, { useState, useEffect,Component }from 'react';
import {Modal,Card,Button,Badge} from 'react-bootstrap';
import TextTruncate from 'react-text-truncate'
import { IoMdShare } from 'react-icons/io';
import './Home.css'
import Popup from "reactjs-popup";
import ToastContent from './ToastContent';
import {withRouter} from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ShareContent from "./ShareContent";

class Technology extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
          articles: '',
          articles2 :''
        };
        this.spinnerCallback = this.spinnerCallback.bind(this);
        this.sendSpinning = this.sendSpinning.bind(this);
        this.preventEvent = this.preventEvent.bind(this);
        this.hideNewsSwitch = this.hideNewsSwitch.bind(this);
      }

    sendSpinning(value){
        if(this.props.spinning === true && value === false){
            this.props.spinCallBack(value);
        }
    }
    hideNewsSwitch(){
        this.props.setIsDetailed(true);
    }

    spinnerCallback(){
        this.props.spinCallBack(true);
    }
    
    componentDidMount()
    {
        this.props.setIsDetailed(false);
        this.callGuardian();
        this.callNyt();
    }

    callGuardian()
    {
        fetch("https://news-api.azurewebsites.net/guardian/news?section=technology").then(res=> {
        return res.json();
            }).then(news_articles=> this.setState({articles:news_articles}));
    }
    callNyt()
    {
        fetch("https://news-api.azurewebsites.net/nyTimes/news?section=technology").then(res=> {
            return res.json();
            }).then(news_articles=> this.setState({articles2:news_articles}));
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
                section = "sports";
                color = "rgb(255, 193, 8)";
                textColor = "black";
                break;
            case "sports":
                color = "rgb(255, 193, 8)";
                textColor = "black";
                break;
            default:
                color = "#6C757D";
                textColor = 'white';
                break;
        }
        return (
            <Badge style={{float:'right',backgroundColor:color, color:textColor}}>
                {section.toUpperCase()}
            </Badge>
        )
    }
    preventEvent(event)
    {
        event.stopPropagation();
        event.preventDefault();
    }

    callDetailed(event,article)
    {
        this.spinnerCallback();
        this.hideNewsSwitch();
        if(localStorage.getItem("checked")==="true")
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
    render()
    {
        let articles;
        let articlesArray = [];
        if(localStorage.getItem("checked")==="true") {
            articles = this.state.articles;
        }
        else {
            articles = this.state.articles2;
        }
        for (let article in articles) {
            articlesArray.push(articles[article]);
        }

        return (
            <div style={{marginBottom:'3%'}}>
                {
                    articlesArray.map((article) =>
                        <Container fluid={true} className="card-container">
                            <Row xs={1} md={1} lg={1} xl={1}>
                                <Card style={{boxShadow:'0px 0px 25px #333',marginTop:'2%',width:'98%',cursor:'pointer'}} onClick={(event) => this.callDetailed(event,article)}>
                                    <Card.Body>
                                        <Col xl={3} xs={12} md={3} lg={3} >
                                            <Card.Img src={article.Image} height={'auto'} width={'auto'} className="card-img"/>
                                        </Col>
                                        <Col xl={9} xs={12} style={{float:'right'}}>
                                            <Card.Title style={{fontWeight:'bold', fontSize:'110%', fontStyle:'italic'}}>{article.Title}
                                                <span onClick = {this.preventEvent} >
                                                <span style={{marginLeft:'1%'}}>
                                                <ShareContent title={article.Title} url={article.url}/>
                                                </span>
                                            </span>
                                            </Card.Title>
                                            <span>
                                            <TextTruncate line={3} style={{fontSize:'100%'}} text= {article.Description} />
                                        </span>
                                            <Card.Text style={{marginTop:'2%'}}>
                                            <span style={{fontWeight:'550',fontStyle:'italic'}}>
                                                 {
                                                     article.Date
                                                 }
                                            </span>
                                                {
                                                    this.returnBadge(article.Section)
                                                }
                                            </Card.Text>
                                        </Col>
                                    </Card.Body>
                                </Card>
                                {this.sendSpinning(false)}
                            </Row>
                        </Container>
                    )
                }
            </div>
        );
    }
}

export default withRouter(Technology);