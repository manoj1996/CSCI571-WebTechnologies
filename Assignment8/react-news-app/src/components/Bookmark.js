import React, { Component, useState }from 'react';
import {Card, Container, Row, Col, Badge} from 'react-bootstrap';
import './Home.css'
import Popup from "reactjs-popup";
import ToastContent from "./ToastContent";
import TextTruncate from "react-text-truncate";
import { IoMdShare, IoMdTrash } from 'react-icons/io';
import {withRouter} from "react-router-dom";
import {cssTransition, toast} from "react-toastify";
import {css} from "glamor";
import ShareContent from "./ShareContent";
import {Zoom} from "react-toastify";

toast.configure({
    draggable: false,
    type: toast.TYPE.INFO,
    position:"top-center",
    hideProgressBar:true,
    transition: Zoom
});
class Bookmark extends Component{
    constructor(props) {
        super(props);
        this.state = {
            articles: ''
        };
        this.spinnerCallback = this.spinnerCallback.bind(this);
        this.sendSpinning = this.sendSpinning.bind(this);
        this.preventEvent = this.preventEvent.bind(this);
        this.hideNewsSwitch = this.hideNewsSwitch.bind(this);
    }
    preventEvent(event)
    {
        event.stopPropagation();
        event.preventDefault();
    }
    spinnerCallback(){
        this.props.spinCallBack(true);
    }

    componentDidMount() {
        this.spinnerCallback();
        let values = [],
            keys = Object.keys(localStorage),
            i = keys.length;

        while ( i-- ) {
            try{
                if(keys[i].includes('guardian') || keys[i].includes('nytimes')){
                    values.push(JSON.parse(localStorage.getItem(keys[i])));
                }

            }
            catch {e} {
                continue;
            }
        }
        this.setState({articles:values});
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
                section = "sports";
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
            <Badge style={{float:'right',backgroundColor:color, color:textColor, margin:'1.3%'}}>
                {section.toUpperCase()}
            </Badge>
        )
    }

    sendSpinning(value){
        if(this.props.spinning === true && value === false){
            this.props.spinCallBack(value);
        }
    }

    removeFromBookmark(event, article){
        localStorage.removeItem(article.url);
        this.componentDidMount();
    }


    hideNewsSwitch(){
        this.props.setIsDetailed(true);
    }


    callDetailed(event,article)
    {
        this.spinnerCallback();
        this.hideNewsSwitch();
        localStorage.setItem("detailedArticle", "true");
        if(article.Source == "guardian")
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
    addFavoriteCardCode(){
        if(this.state.articles.length > 0){
            let values = this.state.articles;
            return (
                <Container fluid={true}>
                    <Row xs={1} md={4} lg={4} xl={4}>
                        {
                            values.map((article) =>
                                <Col style={{padding: '0.5%'}}>
                                    <Card style={{boxShadow:'0px 0px 25px #333', width: '100%', cursor: 'pointer'}}
                                          onClick={(event) => this.callDetailed(event, article)}>
                                        <Card.Body style={{marginTop: '-1.75%'}}>
                                            <Card.Title style={{
                                                fontWeight: 'bold',
                                                fontSize: '100%',
                                                fontStyle: 'italic'
                                            }}><TextTruncate line={2} element="span" text= {article.Title} />
                                                <span style={{marginLeft:'1%'}}>
                                                <ShareContent bookmarkPage={true} title={article.Title} url={article.url} source={article.Source}/>
                                                </span>
                                                <span onClick={this.preventEvent}>
                                            <span onClick={() => {
                                                toast("Removing " + article.Title, {
                                                    transition: Zoom,
                                                    autoClose: 2000,
                                                    className: css({color: 'black'})
                                                });
                                                this.removeFromBookmark(event, article)
                                            }}>
                                                <IoMdTrash></IoMdTrash>
                                            </span>
                                            </span>
                                            </Card.Title>
                                            <div style={{
                                                textAlign: 'center',
                                                padding: '0.2%'
                                            }}>
                                                <Card.Img src={article.Image} height={'100%'} width={'100%'}
                                                          style={{objectFit: "cover"}}/>
                                            </div>
                                            <Card.Text style={{marginTop: '3%'}}>
                                                                <span style={{
                                                                    fontWeight: '550',
                                                                    fontStyle: 'italic',
                                                                    color: 'rgb(110,110,110)'
                                                                }}>
                                                                    {
                                                                        article.DateMMFormat
                                                                    }
                                                                </span>
                                                {
                                                    this.returnBadge(article.Source)
                                                }
                                                {
                                                    this.returnBadge(article.Section)
                                                }
                                            </Card.Text>
                                        </Card.Body>
                                    {this.sendSpinning(false)}
                                </Card>
                                </Col>
                            )
                        }
                    </Row>
                </Container>
            );
        }
    }

    render() {
        if(this.state.articles.length > 0) {
            return (
                <div>
                    <div style={{marginLeft: '1%'}}>
                        <div id="Favorites" style={{
                            marginLeft: '1%',
                            marginTop: '1%',
                            fontSize: '180%',
                            fontWeight: 'bold',
                            color: 'rgb(110,110,110)'
                        }}>
                            Favorites
                        </div>
                        {
                            this.addFavoriteCardCode()
                        }
                    </div>
                </div>
            );
        }
        else{
            {this.sendSpinning(false)}
            return (
                <div id="No Result" style={{
                    textAlign:'center',
                    fontSize: '110%',
                    color: 'rgb(10,10,10)'
                }}>
                    You have no saved articles
                </div>
            );
        }
    }
}

export default withRouter(Bookmark);