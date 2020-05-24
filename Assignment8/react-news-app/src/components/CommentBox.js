import React, {Component }from 'react';
import commentBox from 'commentbox.io';

class CommentBox extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            count:0
        };
    }
    componentDidMount()
    {
        commentBox('5726406461882368-proj', {
            className: 'commentbox',
            tlcParam: 'tlc'
        });
    }
    render() {
        return (
            <div className="commentbox" id={this.props.comment}>
            </div>
        );
    }
}
export default CommentBox;

