import React, { Component } from 'react';
import './ToastContent.css'
import { FacebookShareButton, TwitterShareButton, EmailShareButton,FacebookIcon,TwitterIcon,EmailIcon} from 'react-share';
export default function ToastContent({close,title,url}) {
    return (
      <div className="modals">
      <a className="close" onClick={close}>
        &times;
      </a>
      <div className="header" > 
      {title} 
      <br/>
      <br/>
      </div>
     
      <div className="content">
      <p> Share via</p>
      <div align="center" style={{paddingRight:"10%"}}>
        <FacebookShareButton style={{marginLeft:"10%"}} url={url} hashtag='#CSCI_571_NewsApp' className="Demo_some-network_share-button">
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        <TwitterShareButton style={{marginLeft:"10%"}} url={url} title={title} className="Demo__some-network__share-button" hashtags={["#CSCI_571_NewsApp"]}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>
        <EmailShareButton style={{marginLeft:"10%"}} url={url} subject={title} body="" className="Demo__some-network__share-button">
          <EmailIcon size={40} round />
        </EmailShareButton>
      </div>

      </div>
      </div>
    )
}



