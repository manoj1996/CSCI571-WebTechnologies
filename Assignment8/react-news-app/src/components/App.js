import React, {Component, useCallback} from 'react';
import Navigation from './Navigation';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router,Switch as RouterSwitch,Route} from "react-router-dom";
import Home from './Home';
import World from './World';
import Politics from './Politics';
import Business from './Business';
import Technology from './Technology';
import Sports from './Sports';
import Spinner from "./Spinner";
import DetailedArticle from './DetailedArticle';
import SearchResults from "./SearchResults";
import Bookmark from "./Bookmark";
class App extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            checked:true,
            spinning:true,
            isDetailed:false,
            isSearchUpdate: false
        };
        this.callback = this.callback.bind(this);
        this.callbackDetailed = this.callbackDetailed.bind(this);
    }

    callback = (childValue) =>{
        this.setState({checked : childValue});
    };
    callbackSpinner = (value) =>{
        this.setState({spinning: value});
    };

    callbackDetailed = (value) =>{
        this.setState({isDetailed: value})
    };

    callSpinner(){
        if (this.state.spinning){
            return (
              <Spinner spinning={this.state.spinning}/>
            );
        }
    }

    render()
    {
        return(
            <Router>
                <div>
                    <Navigation callbackFromParent={this.callback} spinCallBack={this.callbackSpinner} isDetailed={this.state.isDetailed} setIsDetailed={this.callbackDetailed}/>
                    {this.callSpinner()}
                    <RouterSwitch>
                        <Route exact path="/">
                            <Home spinCallBack={this.callbackSpinner} setIsDetailed={this.callbackDetailed} spinning={this.state.spinning} />
                        </Route>
                        <Route exact path="/world">
                            <World spinCallBack={this.callbackSpinner} spinning={this.state.spinning} setIsDetailed={this.callbackDetailed}/>
                        </Route>
                        <Route exact path="/politics">
                            <Politics spinCallBack={this.callbackSpinner} spinning={this.state.spinning} setIsDetailed={this.callbackDetailed}/>
                        </Route>
                        <Route exact path="/business">
                            <Business spinCallBack={this.callbackSpinner} spinning={this.state.spinning} setIsDetailed={this.callbackDetailed}/>
                        </Route>
                        <Route exact path="/technology">
                            <Technology spinCallBack={this.callbackSpinner} spinning={this.state.spinning} setIsDetailed={this.callbackDetailed}/>
                        </Route>
                        <Route exact path="/sports">
                            <Sports spinCallBack={this.callbackSpinner} spinning={this.state.spinning} setIsDetailed={this.callbackDetailed}/>
                        </Route>
                        <Route exact path="/article">
                            <DetailedArticle spinCallBack={this.callbackSpinner} spinning={this.state.spinning} setIsDetailed={this.callbackDetailed}/>
                        </Route>
                        <Route exact path="/searchResults">
                            <SearchResults spinCallBack={this.callbackSpinner} spinning={this.state.spinning} setIsDetailed={this.callbackDetailed}/>
                        </Route>
                        <Route exact path="/Bookmark">
                            <Bookmark spinCallBack={this.callbackSpinner} spinning={this.state.spinning} setIsDetailed={this.callbackDetailed}/>
                        </Route>

                    </RouterSwitch>
                </div>
            </Router>


        );
    }
}

export default App;