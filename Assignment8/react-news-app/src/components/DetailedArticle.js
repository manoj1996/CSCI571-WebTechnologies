import React, { Component, useState }from 'react';
import {Card} from 'react-bootstrap';
import './Home.css'
import { FacebookShareButton, TwitterShareButton, EmailShareButton,FacebookIcon,TwitterIcon,EmailIcon} from 'react-share';
import { FaRegBookmark,FaAngleDown,FaAngleUp, FaBookmark } from 'react-icons/fa';
import CommentBox from './CommentBox';
import { Tooltip } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { css } from 'glamor';
import ReactTooltip from "react-tooltip";
import {animateScroll, scroller} from "react-scroll";
import {Zoom} from "react-toastify";

toast.configure({
    draggable: false,
    type: toast.TYPE.INFO,
    position:"top-center",
    hideProgressBar:true,
    transition: Zoom
});
class DetailedArticle extends Component
{
    constructor(props,location) {
        super(props,location);
        this.state = {
            article: '',
            initialDescription:true,
            articleId:'',
            facebookTooltip:false,
            twitterTooltip:false,
            emailTooltip:false,
            bookmarkTooltip:false,
            bookmarked:false
        };
        this.sendSpinning = this.sendSpinning.bind(this);
        this.facebookToggle = this.facebookToggle.bind(this);
        this.twitterToggle = this.twitterToggle.bind(this);
        this.emailToggle = this.emailToggle.bind(this);
        this.bookmarkToggle = this.bookmarkToggle.bind(this);
    }

    sendSpinning(value){
        if(this.props.spinning === true && value === false){
            this.props.spinCallBack(value);
        }
    }

    componentDidMount()
    {
        let articleId = window.location.search.substring(4,window.location.search.length);
        this.setState({articleId:articleId});
        this.props.setIsDetailed(true);
        if(localStorage.getItem("checked")==="true")
        {
            this.callGuardian(articleId);
        }
        else
        {
            this.callNyTimes(articleId);
        }

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        ReactTooltip.rebuild();
    }
    facebookToggle()
    {
        this.setState(prevState => ({
            facebookTooltip: !prevState.facebookTooltip
        }));
    }
    twitterToggle()
    {
        this.setState(prevState => ({
            twitterTooltip: !prevState.twitterTooltip
        }));
    }
    emailToggle()
    {
        this.setState(prevState => ({
            emailTooltip: !prevState.emailTooltip
        }));
    }
    bookmarkToggle()
    {
        this.setState(prevState => ({
            bookmarkTooltip: !prevState.bookmarkTooltip
        }));
    }

    callGuardian(articleId)
    {
        fetch("https://news-api.azurewebsites.net/guardian/article?id="+articleId).then(res=> {
            return res.json();
        }).then(news_article=> this.setState({article:news_article}));
    }
    callNyTimes(articleId)
    {
        fetch("https://news-api.azurewebsites.net/nyTimes/article?url="+articleId).then(res=> {
            return res.json();
        }).then(news_article=> this.setState({article:news_article}));
    }

    addToBookmark(article){
        if(this.state.bookmarked === false){
            this.setState({bookmarked: true});
            toast("Saving "+article.Title, {className:css({color:'black'})});
            if(localStorage.getItem("checked")==="true"){
                localStorage.setItem(article.url, JSON.stringify(article));
            }
            else{
                localStorage.setItem(article.url, JSON.stringify(article));
            }
        }

    }
    removeFromBookmark(article){
        if(this.state.bookmarked === true){
            this.setState({bookmarked: false});
            if(localStorage.getItem("checked")==="true"){
                localStorage.removeItem(article.url);
            }
            else{
                localStorage.removeItem(article.url);
            }
            toast("Removing "+article.Title, {className:css({color:'black'})});
        }
    }

    addBookmarkCode(article){
        let url = article.url;
        console.log(url);
        if(this.state.bookmarked === false && localStorage.getItem(url) == null){
            return (
                <span>
                <span style={{marginLeft:'5%'}} id="Bookmark1" onClick={() => this.addToBookmark(article)}><FaRegBookmark style={{color:'red'}}/></span>
                <Tooltip placement="top" isOpen={this.state.bookmarkTooltip} target="Bookmark1" toggle={this.bookmarkToggle}>
                Bookmark
                </Tooltip>
                </span>
            );
        }
        else{
            if(this.state.bookmarked === false){
                this.setState({"bookmarked":true});
            }
            return (
                <span>
                <span style={{marginLeft:'5%'}} id="Bookmark1" onClick={() => this.removeFromBookmark(article)}><FaBookmark style={{color:'red'}}/></span>
                <Tooltip placement="top" isOpen={this.state.bookmarkTooltip} target="Bookmark1" toggle={this.bookmarkToggle}>
                Bookmark
                </Tooltip>
                </span>
            );
        }
    }
    scrollOptions(op){
        if (window.matchMedia("(max-width: 800px)").matches){
            return (
                animateScroll.scrollTo(op+20)
            );
        }
        else{
            return (
                animateScroll.scrollTo(window.innerWidth/3.5 + op)
            );
        }
    }

    displayDescription(text)
    {
        let textArray = text.split(".");
        localStorage.removeItem("detailedArticle");
        if(textArray.length <= 4){
            let op = textArray.join(".")+".";
            return (
                <div className="detailed-description">
                    {op}
                </div>
            );
        }
        if(this.state.initialDescription)
        {
            let op = textArray.slice(0,4).join(".")+".";
            return(
                <div className="detailed-description">
                    {op}
                    <br/>
                    <FaAngleDown size={20} style={{float:"right", marginRight:'2%'}} onClick={
                        (event)=>
                        {
                            this.scrollOptions(op.length);
                            this.setState({initialDescription:false});
                        }
                    }/>
                </div>
            );

        }
        else
        {
            let op1 = textArray.slice(0,4).join(".")+".";
            let op2 = textArray.slice(4,).join(".");
            return(
                <div>
                    <div className="detailed-description">
                        {op1}
                        <br/>
                        <br/>
                    </div>
                    <div className="detailed-description">
                        {op2}
                        <br/>
                        <FaAngleUp size={20} style={{float:"right", marginRight:'2%'}} onClick={
                            (event)=>
                            {
                                animateScroll.scrollToTop();
                                this.setState({initialDescription:true});
                            }
                        }/>
                    </div>
                </div>
            );
        }
    }

    render()
    {
        let article;
        let validArticles = [];
        if(localStorage.getItem("checked")==="true")
        {
            article = this.state.article;
            if(article.length!==0)
            {
                validArticles.push(article);
            }
            return (
                <div>
                    <div style={{marginLeft:'3%'}}>
                        {
                            validArticles.map((article) =>
                                <div>
                                    <React.Fragment>
                                        <Card style={{boxShadow:'0px 0px 25px #333',marginTop:'2%',width:'98%',cursor:'pointer'}} >
                                            <Card.Title style={{paddingLeft:'2%', paddingTop:'2%' ,fontSize:'180%',fontStyle:'italic'}}>
                                                {article.Title}
                                            </Card.Title>
                                            <Card.Body>
                                                <Card.Text style={{fontSize:'20px',fontStyle:'italic'}}>
                                                    <div style={{marginLeft:'1%'}}>
                                                        <span>
                                                        {
                                                            article.DateMMFormat
                                                        }
                                                        </span>
                                                        <span className="detailed-share-icons">
                                                            <FacebookShareButton  url={article.url} hashtag='#CSCI_571_NewsApp' className="Demo_some-network_share-button" id="FBShare">
                                                                <FacebookIcon size={30} round />
                                                            </FacebookShareButton>
                                                            <Tooltip placement="top" isOpen={this.state.facebookTooltip} target="FBShare" toggle={this.facebookToggle}>
                                                                Facebook
                                                            </Tooltip>

                                                            <TwitterShareButton  url={article.url} title={article.Title} className="Demo__some-network__share-button" hashtags={["#CSCI_571_NewsApp"]} id="TwitterShare">
                                                                <TwitterIcon size={30} round />
                                                            </TwitterShareButton>
                                                            <Tooltip placement="top" isOpen={this.state.twitterTooltip} target="TwitterShare" toggle={this.twitterToggle}>
                                                                Twitter
                                                            </Tooltip>

                                                            <EmailShareButton  url={article.url} subject={article.Title} body="" className="Demo__some-network__share-button" id="EmailShare">
                                                                <EmailIcon size={30} round />
                                                            </EmailShareButton>
                                                            <Tooltip placement="top" isOpen={this.state.emailTooltip} target="EmailShare" toggle={this.emailToggle}>
                                                                Email
                                                            </Tooltip>
                                                            {
                                                                this.addBookmarkCode(article)
                                                            }
                                                        </span>
                                                    </div>
                                                    <div style={{textAlign:'center',padding:'0.8%',width:'100%',height:'50%'}}>
                                                        <Card.Img src={article.Image} className="card-img-detailed"/>
                                                    </div>
                                                    {this.displayDescription(article.Description)}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                        <br/>
                                        <CommentBox comment={this.state.articleId} />
                                    </React.Fragment>
                                    {this.sendSpinning(false)}
                                </div>
                            )}
                    </div>
                </div>
            );
        }
        else
        {
            article = this.state.article;
            if(article.length!=0)
            {
                validArticles.push(article);
            }
            return (
                <div>
                    <div style={{marginLeft:'3%'}}>
                        {
                            validArticles.map((article) =>
                                <div>
                                    <React.Fragment>
                                        <Card style={{boxShadow:'0px 0px 25px #333',marginTop:'2%',width:'98%',cursor:'pointer'}}  >
                                            <Card.Title style={{paddingLeft:'2%', paddingTop:'2%' ,fontSize:'35px',fontStyle:'italic'}}>
                                                {article.Title}
                                            </Card.Title>
                                            <Card.Body>
                                                <Card.Text style={{fontSize:'20px',fontStyle:'italic'}}>
                                                    <div style={{marginLeft:'1%'}}>
                                                        <span>
                                                         {
                                                             article.DateMMFormat
                                                         }
                                                         </span>
                                                        <span className="detailed-share-icons">
                                                            <FacebookShareButton  id="FBShare" url={article.url} hashtag='#CSCI_571_NewsApp' className="Demo_some-network_share-button">
                                                                <FacebookIcon size={30} round />
                                                            </FacebookShareButton>
                                                            <Tooltip placement="top" isOpen={this.state.facebookTooltip} target="FBShare" toggle={this.facebookToggle}>
                                                                Facebook
                                                            </Tooltip>

                                                            <TwitterShareButton  id="TwitterShare" url={article.url} title={article.Title} className="Demo__some-network__share-button" hashtags={["#CSCI_571_NewsApp"]}>
                                                                <TwitterIcon size={30} round />
                                                            </TwitterShareButton>
                                                            <Tooltip placement="top" isOpen={this.state.twitterTooltip} target="TwitterShare" toggle={this.twitterToggle}>
                                                                Twitter
                                                            </Tooltip>

                                                            <EmailShareButton  id="EmailShare" url={article.url} subject={article.Title} body="" className="Demo__some-network__share-button">
                                                                <EmailIcon size={30} round />
                                                            </EmailShareButton>
                                                            <Tooltip placement="top" isOpen={this.state.emailTooltip} target="EmailShare" toggle={this.emailToggle}>
                                                                Email
                                                            </Tooltip>
                                                            {
                                                                this.addBookmarkCode(article)
                                                            }
                                                         </span>
                                                    </div>
                                                    <div style={{textAlign:'center',padding:'0.2%',width:'100%',height:'50%'}}>
                                                        <Card.Img src={article.Image} className="card-img-detailed"/>
                                                    </div>
                                                    {this.displayDescription(article.Description)}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                        <br/>
                                        <CommentBox comment={this.state.articleId} />
                                    </React.Fragment>
                                    {this.sendSpinning(false)}
                                </div>
                            )}
                    </div>
                </div>
            );
        }
    }
}

export default DetailedArticle;