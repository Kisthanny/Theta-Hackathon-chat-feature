// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

contract ChatRoom {
    string public roomName;
    uint256 public joinFee;
    address public roomCreator;
    mapping(address => bool) public joinedUsers;

    event RoomCreated(string name, uint256 joinFee, address creator);
    event RoomJoined(address user);

    constructor(string memory _name, uint256 _joinFee) {
        roomName = _name;
        joinFee = _joinFee;
        roomCreator = msg.sender;
        joinedUsers[msg.sender] = true;
        emit RoomCreated(_name, _joinFee, msg.sender);
    }

    function joinRoom() public payable {
        require(msg.value == joinFee, "Incorrect join fee");
        require(!joinedUsers[msg.sender], "Already joined");

        joinedUsers[msg.sender] = true;
        emit RoomJoined(msg.sender);
    }

    function withdraw() public {
        require(msg.sender == roomCreator, "Only room creator can withdraw");
        uint256 balance = address(this).balance;
        payable(roomCreator).transfer(balance);
    }
}
