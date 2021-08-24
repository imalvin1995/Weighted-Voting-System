import React, { Component } from 'react';
import { Alert } from 'reactstrap';

class Voter extends Component {

  constructor(){
    super()
    this.state={
      showContent: false,
      status:''
    }
    this.validBallotAddress=this.validBallotAddress.bind(this);
    this.checkVoterIdentity=this.checkVoterIdentity.bind(this);
  }
  validBallotAddress(inputAddress){
    if(inputAddress === this.props.ballotOfficialAddress)
    this.setState({showContent :true})
  }

  checkVoterIdentity(choice){
    // const accountAddress = this.props.account
    // if(this.props.match.voterRegister.map(accountAddress))
    this.props.doVote(choice)
  }

  votingStatus(votingState){
    if(votingState === 0)
      return 'Created'
    if(votingState === 1)
      return 'Voting'
    if(votingState ===2)
      return 'Ended'
  }

  render() {
    return (
     <div id="content">
      <h2>Contract</h2>
        <ul className="list-group">
          <li className="list-group-item"><b>Ballot Offical Name</b>: {this.props.ballotOfficialName}</li>
          <li className="list-group-item"><b>Address</b>: {this.props.ballotOfficialAddress}</li>
          <li className="list-group-item"><b>Voting State</b>: {this.votingStatus(this.props.votingState)}</li>
        </ul>
      <br/>
      <h3>Enter the contract address</h3>
      <form onSubmit={(event) => {
        event.preventDefault()
        const inputAddress = this.ballotOfficialAddress.value
        this.validBallotAddress(inputAddress)
      }}>
        <div className="form-group mr-sm-2">
          <input
            id="ballotOfficialAddress"
            type="text"
            ref={(input) => { this.ballotOfficialAddress = input }}
            className="form-control"
            placeholder="Ballot's Address"
            required />
        </div>
        <button type="submit" className="btn btn-primary">Go</button>
      </form>
      <br/>
      {
      this.state.showContent?
      <div>
        <h2>Contract Details</h2>
        <ul className="list-group">
          <li className="list-group-item"><b>Ballot Offical Name</b>: {this.props.ballotOfficialName}</li>
          <li className="list-group-item"><b>Proposal</b>: {this.props.proposal}</li>
          <li className="list-group-item"><b>Address</b>: {this.props.ballotOfficialAddress}</li>
          <li className="list-group-item"><b>Options</b>: {this.props.options}</li>
          <li className="list-group-item"><b>Voting State</b>: {this.votingStatus(this.props.votingState)}</li>
        </ul>
        <br/>
        <h2>Your Vote</h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          const choice = this.choice.value
          this.props.doVote(choice)
          }}>
          <div className="form-group mr-sm-2">
            <input
              id="choice"
              type="text"
              ref={(input) => { this.choice = input }}
              className="form-control"
              placeholder="Your Choice"
              required />
          </div>
          {this.props.isVoted?
              <Alert color="warning">
                Already Voted!
              </Alert>
              :<button type="submit" className="btn btn-success">Vote</button>
          }
      </form>
      </div>
      : null
      }
      <p>&nbsp;</p>
    </div>
    );
  }
}

export default Voter;