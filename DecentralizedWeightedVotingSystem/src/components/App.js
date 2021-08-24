import React, { Component } from 'react';
import {BrowserRouter as Router,Route, Switch} from "react-router-dom";
import Web3 from 'web3'
import './App.css';
import Ballot from '../abis/Ballot.json'
import Navbar from './Navbar'
import VotersLoginPage from './VotersLoginPage'
import ChairmanLoginPage from './ChairmanLoginPage';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      console.log("web3 object created")
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      console.log("web3 object refreshed")
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    console.log("loadBlockchainData started")
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Ballot.networks[networkId]

    if (networkData) {
      const ballot = web3.eth.Contract(Ballot.abi, networkData.address)
      this.setState({ ballot })
      // Add voter to the list
      const totalVoter = await ballot.methods.totalVoter.call()
      this.setState({ totalVoter })
      console.log("totalVoter: ", totalVoter)

      const ballotOfficialName = await ballot.methods.ballotOfficialName.call()
      this.setState({ ballotOfficialName })
      const options = await ballot.methods.options.call()
      this.setState({ options })
      const proposal = await ballot.methods.proposal.call()
      this.setState({ proposal })
      const ballotOfficialAddress = await ballot.methods.ballotOfficialAddress.call()
      this.setState({ ballotOfficialAddress })
      for (var i = 0; i < totalVoter; i++) {
        const voter = await ballot.methods.voterRegisterArray(i).call()
        this.setState({
          voterRegister: [...this.state.voterRegister, voter]
        })
      }
      const totalChoice = await ballot.methods.totalChoice.call()
      for(var i = 0; i < totalChoice; i++) {
        const results = await ballot.methods.finalResult(i).call()
        this.setState({
          finalResult: [...this.state.finalResult, results]
        })
        this.setState({displayResult: this.state.displayResult + results.choice + "->" + results.weight + "  "})
        
      }
      const totalVote = await ballot.methods.totalVote.call()
      this.setState({ totalVote })
      const votingState = await ballot.methods.state.call();
      this.setState({ votingState })
      const isVoted = await ballot.methods.voterRegister(this.state.account).call()
      if(isVoted){ 
        this.setState({isVoted: isVoted.voted})
      }
      this.setState({ loading: false })
    } else {
      window.alert('Ballot contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      countResult: '',
      finalResult: [],
      displayResult: '',
      totalVoter: 0,
      totalVote: 0,
      ballotOfficialAddress: '',
      ballotOfficialName: '',
      proposal: '',
      options: '',
      votingState: '',
      votes: [], 
      voterRegister: [],
      loading: true,
      isVoted: false
    }
    this.createBallot = this.createBallot.bind(this)
    this.addVoter = this.addVoter.bind(this)
    this.startVote = this.startVote.bind(this)
    this.doVote = this.doVote.bind(this)
    this.endVote = this.endVote.bind(this)
    this.watchVoterAdded = this.watchVoterAdded.bind(this)
    this.watchReturn = this.watchReturn.bind(this)
  }
   createBallot(ballotOfficialName, proposal, options) {
    this.setState({ loading: true })
    this.state.ballot.methods.createBallot(ballotOfficialName, proposal, options).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  addVoter(voterAddress, voterName, equity) {
    this.setState({ loading: true })
    this.state.ballot.methods.addVoter(voterAddress, voterName, equity).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
        console.log("voterRegister", this.state.voterRegister)
      })
  }

  startVote() {
    this.setState({ loading: true })
    this.state.ballot.methods.startVote().send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  doVote(choice) {
    this.setState({ loading: true })
    const web3 = window.web3
    const accounts = web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.state.ballot.methods.doVote(choice).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  endVote() {
    this.setState({ loading: true })
    this.state.ballot.methods.endVote().send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

/* event watcher */
  
  loadTotalVoter() {
    this.state.ballot.methods.totalVoter.call().then((result) => {
      console.log("totalVoter" + result)
      this.setState({ result })
    })
  }

  /* event watcher */
  async watchReturn(error, event) {
    // console.log("event.returnValues.voter", event.returnValues.voter);
    const result = await this.state.ballot.methods.voterRegister(event.returnValues.voter).call()
    this.setState({
      voterRegister: [...this.state.voterRegister, result]
    })
    console.log("voterRegister: ", this.state.voterRegister)
  }

  /* event watcher */

  watchVoterAdded() {
    console.log(this.state.ballot.events);
    this.state.ballot.events.voterAdded({
    }, this.watchReturn)
      .on('data', (event) => {
      })
      .on('changed', (event) => {
        // remove event from local database
      })
      .on('error', console.error)
  }

  render() {
    
    return (
      <Router>
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
            {/* <Switch> */}
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                :
                <Route exact path="/">
                  <ChairmanLoginPage
                  ballotOfficialName={this.state.ballotOfficialName}
                  proposal={this.state.proposal}
                  options={this.state.options}
                  votingState={this.state.votingState}
                  ballotOfficialAddress={this.state.ballotOfficialAddress}
                  totalVoter={this.state.totalVoter}
                  totalVote={this.state.totalVote}
                  finalResult={this.state.finalResult}
                  displayResult={this.state.displayResult}
                  voterRegister={this.state.voterRegister}
                  createBallot={this.createBallot}
                  addVoter={this.addVoter}
                  startVote={this.startVote}
                  endVote={this.endVote}
                  watchVoterAdded={this.watchVoterAdded}
                  />
                  </Route>
              }
              {
                <Route path="/votersloginpage"> 
                  <VotersLoginPage
                    doVote={this.doVote}
                    proposal={this.state.proposal}
                    options={this.state.options}
                    votingState={this.state.votingState}
                    ballotOfficialName={this.state.ballotOfficialName}
                    ballotOfficialAddress={this.state.ballotOfficialAddress}
                    isVoted={this.state.isVoted}
                  />
                </Route>
              }
            {/* </Switch> */}
            </main>
            {/* <Route path="/votersloginpage" component={VotersLoginPage} /> */}
          </div>
        </div>
      </div>
      </Router>
    );
  }
}

export default App;