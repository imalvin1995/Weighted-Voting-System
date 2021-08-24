import React, { Component } from 'react';

class Main extends Component {

  constructor(){
    super()
    this.state={
      showContent: false,
      // totalVoter: 0,
      // totalVote: 0
      status:''
    }
    this.votingStatus = this.votingStatus.bind(this);
    this.numberTransfer = this.numberTransfer.bind(this);
  }

  votingStatus(votingState){
    if(votingState === 0)
      return 'Created'
    if(votingState === 1)
      return 'Voting'
    if(votingState ===2)
      return 'Ended'
  }

  numberTransfer(number){
    if(number === null){
      return 0
    }else{
      return number.toString()
    }
  }


  // numbertransfer(){
  //   if(totalVoter === 0)
  // }

  render() {
    // var totalVoter = this.state.totalVoter;
    // var totalVote = this.state.totalVote;

    // if(!this.props.totalVoter === 0){
    //   var mtotalVoter = this.props.totalVoter.toString()
    //   this.setState({totalVoter: mtotalVoter})
    // }
    
    // if(!this.props.totalVote === 0){
    //   var mtotalVote = this.props.totalVote.toString()
    //   this.setState({totalVote: mtotalVote})
    // }

    return (
      <div id="content">
      <h2>New Ballot</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        const ballotName = this.ballotOfficialName.value
        const proposal = this.proposal.value
        const options = this.options.value
        this.props.createBallot(ballotName, proposal, options)
        // this.props.watchVoterAdded()

      }}>
        <div className="form-group mr-sm-2">
          <input
            id="ballotOfficialName"
            type="text"
            ref={(input) => { this.ballotOfficialName = input }}
            className="form-control"
            placeholder="Ballot's Offical Name"
            required />
        </div>
        <div className="form-group mr-sm-2">
          <input
            id="proposal"
            type="text"
            ref={(input) => { this.proposal = input }}
            className="form-control"
            placeholder="Proposal"
            required />
        </div>
        <div className="form-group mr-sm-2">
          <input
            id="options"
            type="text"
            ref={(input) => { this.options = input }}
            className="form-control"
            placeholder="Options"
            required />
        </div>
        <button type="submit" className="btn btn-primary">Go</button>
      </form>
      <br/>
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
        <button
          className="btn btn-dark"
          onClick={(event) => {
            this.props.startVote()
          }}
        >
          Start Voting
        </button>
        <p>&nbsp;</p>
        <button
          className="btn btn-dark"
          onClick={(event) => {
            this.props.endVote()
          }}
        >
          End Voting
        </button>
        <p>&nbsp;</p>
        <h2>Vote Details</h2>
        <ul className="list-group">
          <li className="list-group-item"><b>Result</b>: {this.props.displayResult}</li>
          <li className="list-group-item"><b>Total Voters</b>: {this.numberTransfer(this.props.totalVoter)}</li>
          <li className="list-group-item"><b>Total Votes</b>: {this.numberTransfer(this.props.totalVote)}</li>
        </ul>
        <br/>
        <p>&nbsp;</p>
        <h2>Add Voters</h2>
        <form onSubmit={(event) => {
          event.preventDefault()
          const voterAddress = this.voterAddress.value
          const voterName = this.voterName.value
          const equity = this.equity.value
          // TODO: equity needs to be fetched from db
          this.props.watchVoterAdded()
          this.props.addVoter(voterAddress, voterName, equity)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="voterAddress"
              type="text"
              ref={(input) => { this.voterAddress = input }}
              className="form-control"
              placeholder="Voter's Address"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="voterName"
              type="text"
              ref={(input) => { this.voterName = input }}
              className="form-control"
              placeholder="Voter's Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="equity"
              type="text"
              ref={(input) => { this.equity = input }}
              className="form-control"
              placeholder="Voter's Equity"
              required />
          </div>
          <button type="submit" className="btn btn-dark">Add Voter</button>
        </form>
        <p>&nbsp;</p>
        <h2>Voters</h2>
          <table className="table">
            <thead>
              <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Equity</th>
              <th scope="col">Voted</th>
              <th scope="col">Choice</th>
              </tr>
            </thead>
            <tbody id="voterList">
              {this.props.voterRegister.map((voter) => {
                return (
                  <tr key={voter.voterAddress}>
                    <th scope="row"></th>
                    <td>{voter.voterName}</td>
                    <td>{voter.voterAddress.toString()}</td>
                    <td>{voter.equity.toString()}</td>
                    <td>{voter.voted.toString()}</td>
                    <td>{voter.choice.toString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </div>

    <p>&nbsp;</p>
    </div>
    );
  }
}

export default Main;