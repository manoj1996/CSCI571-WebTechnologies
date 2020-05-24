import React, { Component }from 'react';
import './Home.css';
import { IoMdShare } from 'react-icons/io';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";
import {Modal} from "react-bootstrap";
class ShareContent extends Component{
    constructor(props) {
        super(props);
        this.state ={
            display:false
        };
        this.showPopup = this.showPopup.bind(this);
        this.close = this.close.bind(this);
    }

    showPopup(event){
        event.stopPropagation();
        event.preventDefault();
        this.setState({display:true});
    }

    close(){
        this.setState({display:false});
    }
    displayTitle(){
        if(this.props.bookmarkPage){
            return (
                <div>
                    <span style={{fontWeight:'bold', fontSize:'160%'}}> {this.props.source.toString().toUpperCase()}</span>
                    <br/>
                    <span style={{fontSize:'130%'}}> {this.props.title} </span>
                </div>
            );
        }
        else{
            return (
                <div>
                    {this.props.title}
                </div>
            );
        }
    }
    render() {
        return (
            <span onClick={e => e.stopPropagation()}>
                <IoMdShare onClick = {this.showPopup}/>
                <Modal show={this.state.display} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{fontSize:'130%'}}>
                            {this.displayTitle()}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p style={{textAlign:'center', fontWeight:'550', fontSize:'140%'}}>Share via</p>
                        <div style={{textAlign:'center'}}>
                            <table borderCollapse={'collapse'} borderSpacing={'20px'} style={{width:'100%'}}>
                                <tr>
                                    <td align={'center'}>
                                        <FacebookShareButton url={this.props.url} hashtag='#CSCI_571_NewsApp' className="Demo__some-network__share-button">
                                        <FacebookIcon size={40} round />
                                        </FacebookShareButton>
                                    </td>
                                    <td align={'center'}>
                                        <TwitterShareButton url={this.props.url} className="Demo__some-network__share-button" hashtags={["CSCI_571_NewsApp"]}>
                                            <TwitterIcon size={40} round />
                                        </TwitterShareButton>
                                    </td>
                                    <td align={'center'}>
                                        <EmailShareButton url={this.props.url} subject={this.props.title} body="" className="Demo__some-network__share-button">
                                            <EmailIcon size={40} round />
                                        </EmailShareButton>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </Modal.Body>
                </Modal>
            </span>
        );
    }
}
export default ShareContent;