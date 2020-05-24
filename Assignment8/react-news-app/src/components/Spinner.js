import React, {Component} from "react";
import { css } from "@emotion/core";
import {BounceLoader} from "react-spinners";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: darkblue;
`;

class Spinner extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{marginTop:'25%', textAlign:'center'}} className="sweet-loading">
                <BounceLoader
                    css={override}
                    size={50}
                    color={"#123abc"}
                    loading={this.props.spinning}
                />
                <p style={{fontWeight:"bold", fontSize:'1em'}}>Loading</p>
            </div>
        );
    }
}
export default Spinner;