import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

class Auth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            username: '',
            errorMessage: ''
        };
    }

    handleChange(event) {
        let field = event.target.name;
        let value = event.target.value;

        let changes = {};
        changes[field] = value;
        this.setState(changes);
    }

    handleSignUp() {

        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                let profilePromise = firebase.auth().currentUser.updateProfile({
                    displayName: this.state.username
                });

                return profilePromise;
            })
            .then(() => {
                this.setState({
                    user: firebase.auth().currentUser,
                    username: ''
                });
            })
            .catch((err) => {
                this.setState({ errorMessage: err.message });
            });
    }

    handleSignIn() {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch((err) => {
                this.setState({ errorMessage: err.message });
            });
    }

    render() {
        let errorDiv = this.state.errorMessage === "" ? "" : <div className="alert alert-danger">Error: {this.state.errorMessage}</div>
        return (
            <div>
                <img id="signin_pic" src="img/signup.jpg" alt="sign in"/>
                <h2>Sign up to become a host or Sign in to see history posts.</h2>
                <div className="container">
                    {errorDiv}
                    <div className="form-group">
                        <label>Email:</label>
                        <input className="form-control"
                            name="email"
                            value={this.state.email}
                            onChange={(event) => { this.handleChange(event) }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" className="form-control"
                            name="password"
                            value={this.state.password}
                            onChange={(event) => { this.handleChange(event) }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Username:</label>
                        <input className="form-control"
                            name="username"
                            value={this.state.username}
                            onChange={(event) => { this.handleChange(event) }}
                        />
                    </div>

                    <div className="form-group">
                        <button className="btn btn-primary mr-2" onClick={() => this.handleSignUp()}>
                            Sign Up
                     </button>
                        <button className="btn btn-success mr-2" onClick={() => this.handleSignIn()}>
                            Sign In
                    </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Auth;