import React, { Component } from "react";
import "whatwg-fetch";
import { getFromStorage, setInStorage } from "../utils/storage";
import axios from 'axios';

import Voter from "./Voter";


const localStorageObjectName = "voter_login_storage";

class VoterLoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: "", // if they have a token, they are signed in
      signUpError: "",
      signInError: "",
      signInUsername: "",
      signInPassword: "",
      signUpWalletAddress: "",
      signUpEquity: "",
      signUpUsername: "",
      signUpPassword: "",
    };

    // Bind the functions so React can use them
    this.onTextboxChangeSignInUsername = this.onTextboxChangeSignInUsername.bind(
      this
    );
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(
      this
    );
    this.onTextboxChangeSignUpWalletAddress = this.onTextboxChangeSignUpWalletAddress.bind(
      this
    );
    this.onTextboxChangeSignUpEquity = this.onTextboxChangeSignUpEquity.bind(
      this
    );
    this.onTextboxChangeSignUpUsername = this.onTextboxChangeSignUpUsername.bind(
      this
    );
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(
      this
    );
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  /**
   * Acquire token stored in local storage.
   * Use token to gather user information from DB.
   */
  componentDidMount() {
    // get the localstorage object
    const obj = getFromStorage(localStorageObjectName);
    if (obj && obj.token) {
      // get token from local storage
      const { token } = obj;

      // verify token
      axios.get(`http://localhost:5000/voters/verify?token=${token}`)
        .then(res => {
            this.setState({
              token,
              isLoading: false
            })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
          })
    } else {
      // there is no token
      this.setState({
        isLoading: false
      });
    }
  }

  /**
   * Runs when the user clicks the `sign up` button
   * 1. Grab state
   * 2. Post req to backend
   */
  onSignUp() {
    // grab state
    this.setState({
      isLoading: true
    });

    // Post req to backend
        axios.post('http://localhost:5000/voters/signup',{
            username :this.state.signUpUsername,
            password :this.state.signUpPassword,
            walletAddress :this.state.signUpWalletAddress,
            equity :this.state.signUpEquity
          })
        .then(res => {
          this.setState({
            signUpError: res.mes,
            isLoading: false,
            signUpUsername: "",
            signUpPassword: "",
            signUpWalletAddress: "",
            signUpEquity: ""
          });
          console.log(res)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  /**
   * 1. Grab state
   * 2. Post req to backend
   */
  onSignIn() {

    this.setState({
      isLoading: true
    });

    // Post req to backend
    axios.post('http://localhost:5000/voters/signin', {
        username: this.state.signInUsername,
        password: this.state.signInPassword
     })
      .then(res => {
          setInStorage(localStorageObjectName, { token: res.data.token});
          this.setState({
            signInError: res.mes,
            isLoading: false,
            signInUsername: "",
            signInPassword: "",
            token: res.data.token
          });
          console.log(res)
          console.log(res.data.token)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  logout() {
    this.setState({
      isLoading: true
    });
    // get the localstorage object
    const obj = setInStorage(localStorageObjectName, '');
    if (obj && obj.token) {
      // get token from local storage
      const { token } = obj;

      // verify token
      axios.post(`http://localhost:5000/voters/logout?token=${token}`)
        .then(res => {
            this.setState({
              token: '',
              isLoading: false
            });
          console.log(res)
        });
    } else {
      // there is no token
      this.setState({
        isLoading: false,
        token: ''
      });
    }
  }

  /**
   *
   * @param {Where the value of the text box goes} event
   */
  onTextboxChangeSignInUsername(event) {
    this.setState({
      signInUsername: event.target.value
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value
    });
  }

  onTextboxChangeSignUpWalletAddress(event) {
    this.setState({
      signUpWalletAddress: event.target.value
    });
  }

  onTextboxChangeSignUpEquity(event) {
    this.setState({
      signUpEquity: event.target.value
    });
  }

  onTextboxChangeSignUpUsername(event) {
    this.setState({
      signUpUsername: event.target.value
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
  }

  render() {
   
    const isLoading = this.state.isLoading;
    const token = this.state.token;
    const signInError = this.state.signInError;
    const signUpError = this.state.signUpError;

    if (isLoading) {
      return <p>We are loading...</p>;
    }

    /**
     * This should probably be broken into multiple components and conglomerated in some
     * container, but what the hell
     */
    if (!token) {
      return (
        <div id="content">
            <h2>Voter's Page</h2>
            {/* If there is an error in the sign in, show it. */}
            {signInError ? <p>{signInError}</p> : null}
            <h3>Sign In</h3>
            <div className="form-group mr-sm-2">
            <input
              type="username"
              placeholder="Username"
              value={this.state.signInUsername}
              onChange={this.onTextboxChangeSignInUsername}
            />
            </div>
            <div className="form-group mr-sm-2">
            <input
              type="password"
              placeholder="Password"
              value={this.state.signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
            </div>
            <button className="btn btn-primary" onClick={this.onSignIn}>Sign In</button>
          <br />
          <br />
          <div>
            {/* If there is an error in the sign in, show it. */}
            {signUpError ? <p>{signUpError}</p> : null}
            <h3>Sign Up</h3>
            <div className="form-group mr-sm-2">
            <input
              type="text"
              placeholder="Username"
              value={this.state.signUpUsername}
              onChange={this.onTextboxChangeSignUpUsername}
            />
            </div>
            <div className="form-group mr-sm-2">
            <input
              type="password"
              placeholder="Password"
              value={this.state.signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            />
            </div>
            <div className="form-group mr-sm-2">
            <input
              type="text"
              placeholder="Wallet Address"
              value={this.state.signUpWalletAddress}
              onChange={this.onTextboxChangeSignUpWalletAddress}
            />
            </div>
            <div className="form-group mr-sm-2">
            <input
              type="text"
              placeholder="Equity"
              value={this.state.signUpEquity}
              onChange={this.onTextboxChangeSignUpEquity}
            />
            </div>
            <button className="btn btn-primary" onClick={this.onSignUp}>Sign Up</button>
          </div>
          </div>
      );
    }

    return (
      <>
        <div>
        <Voter
            doVote={this.props.doVote}
            proposal={this.props.proposal}
            options={this.props.options}
            votingState={this.props.votingState}
            ballotOfficialName={this.props.ballotOfficialName}
            ballotOfficialAddress={this.props.ballotOfficialAddress}
            isVoted={this.props.isVoted}
            />
        <button className="btn btn-danger" onClick={this.logout}>Logout</button>
        </div>
      </>
    );
  }
}

export default VoterLoginPage;