pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Ballot {

    struct vote{
        address voterAddress;
        string choice; // the index of the choice
        uint weight; // weight of the vote
    }
    
    struct voter{
        string voterName;
        address voterAddress;
        bool voted;
        uint equity; // equity of the voter
        string choice;
    }

    struct voteResult {
        string choice;
        uint weight;
    }

    string public name;
    uint public totalVoter = 0;
    uint public totalVote = 0;
    uint public totalChoice = 0;  //number of choices chosen by the voters
    address public ballotOfficialAddress;      
    string public ballotOfficialName;
    string public proposal;
    string public options; // options for one voting event
    

    // mapping(choice => weight)
    mapping(string => uint) private _countResult;

    // final result
    voteResult[] public finalResult;
    // _key: choice, _value: weight
    function addToMapping(string memory _key, uint _value) internal {
        _countResult[_key] = _value;
        voteResult memory vr;
        vr.choice = _key;
        vr.weight = _value;
        finalResult.push(vr);
        totalChoice += 1;
    }
    
    mapping(uint => vote) private votes;
    mapping(address => voter) public voterRegister;
    voter[] public voterRegisterArray;
    
    enum State { Created, Voting, Ended }
	State public state;
	
	//creates a new ballot contract
	constructor() public {
        name = "Weighted Voting System";
    }
    
    
	modifier condition(bool _condition) {
		require(_condition);
		_;
	}

	modifier onlyOfficial() {
		require(msg.sender ==ballotOfficialAddress);
		_;
	}

	modifier inState(State _state) {
		require(state == _state);
		_;
	}
	
	string[] arr;
	event ballotCreated();
    event voterAdded(address voter);
    event voteStarted();
    event voteEnded();
    event voteDone(address voter);
    
    // create ballotOfficialAddress
    function createBallot(string memory _ballotOfficialName, string memory _proposal, string memory _options) public{
        ballotOfficialAddress = msg.sender;
        ballotOfficialName = _ballotOfficialName;
        proposal = _proposal;
        options = _options;
        totalVoter = 0;
        totalVote = 0;
        totalChoice = 0;
        delete voterRegisterArray;
        delete finalResult;
        state = State.Created;
        // emit ballotCreated();
    }
    
    //add voter
    function addVoter(address _voterAddress, string memory _voterName, uint _equity)
        public
        inState(State.Created)
        onlyOfficial
    {
        voter memory v;
        v.voterName = _voterName;
        v.voted = false;
        v.equity = _equity;
        v.voterAddress = _voterAddress;
        if(v.voted == false){
            v.choice = 'Not Decided';
        }else{
            v.choice = voterRegister[_voterAddress].choice;
        }
        voterRegister[_voterAddress] = v;
        totalVoter++;
        voterRegisterArray.push(v);
        emit voterAdded(_voterAddress);
    }

    //declare voting starts now
    function startVote()
        public
        inState(State.Created)
        onlyOfficial
    {
        state = State.Voting;     
        emit voteStarted();
    }

    // vote from different options
    function doVote(string memory _choice)
        public
        inState(State.Voting)
        returns (bool voted)
    {
        bool found = false;
        
        if (bytes(voterRegister[msg.sender].voterName).length != 0 
        && !voterRegister[msg.sender].voted){
            voterRegister[msg.sender].voted = true;
            voterRegister[msg.sender].choice = _choice;
            for(uint i; i < voterRegisterArray.length; i++) {
                if (voterRegisterArray[i].voterAddress == msg.sender) {
                    voterRegisterArray[i].voted = true;
                    voterRegisterArray[i].choice = _choice;
                }
            }
            vote memory v;
            v.voterAddress = msg.sender;
            v.choice = _choice;
            v.weight = voterRegister[msg.sender].equity;
            // calculate weighted result for current vote
            addToMapping(v.choice, _countResult[v.choice] + v.weight);
            // _countResult[v.choice] += v.weight;  
            votes[totalVote] = v;
            totalVote++;
            found = true;

        }
        emit voteDone(msg.sender);
        return found;
    }
    //end votes
    function endVote()
        public
        inState(State.Voting)
        onlyOfficial
    {
        state = State.Ended;
        // //move result from private _countResult to public finalResult
        // for(uint i; i < result.length; i++) {
        //     finalResult[result[i]] = _countResult[result[i]];
        // }
        emit voteEnded();
    }
}