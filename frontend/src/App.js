// frontend/src/App.js

import React, {Component} from "react";
import AppContent from "./components/AppContent";
import Fullscreen from "react-full-screen";
import Button from "@material-ui/core/Button";

let _csrfToken = null
const API_HOST = 'http://localhost:8000'

async function getCsrfToken() {
    // Gets a csrf token from the django api
    if (_csrfToken === null){
        const response = await fetch(`${API_HOST}/csrf/`, {
            credentials: 'include',
        });
        const data = await response.json();
        _csrfToken = data.csrfToken
    }
    return _csrfToken
}


class App extends Component {
    constructor(props) {
        super();

        this.state = {
            isFull: false,
        };
    }

    goFull = () => {
        this.setState({isFull: true});
    }

    testAPI = async function() {
        const response = await fetch(`${API_HOST}/test/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRFTOKEN': await getCsrfToken()
            }
        });
        let data = await response.json()
        console.log(data)
    }

    render() {
        return (
            <div>
                <h1>This app only works fullscreen, please click below to enter the app!</h1>
                <Button onClick={this.goFull} margin-left="auto" margin-right="auto">
                    Go Fullscreen
                </Button>
                <Button onClick={this.testAPI}>
                    Test API
                </Button>
                <Fullscreen
                    enabled={this.state.isFull}
                    onChange={isFull => this.setState({isFull})}
                >
                    <div className="full-screenable-node">
                        {this.state.isFull ? <AppContent/> : null}
                    </div>
                </Fullscreen>
            </div>
        );
    }
}

export default App;
