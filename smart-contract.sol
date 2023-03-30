// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

//Factory contract will have 64 boxes, each box will have a color and a price and a owner address and a message
//The initial owner of the factory will be the contract creator
//the starting price of the boxes will be 0.01 ether
//each purchase will increase the price by 20%
//the owner of the factory can change the color of the factory
//every time someone buys a box, the previous owner will receive the money and the new owner will be the buyer
//the owner of the contract receives an 8% fee from each purchase
//the color and message can only be change in the buyBox() function not at any other time

contract Factory {
    struct Box {
        address payable owner;
        uint256 price;
        bytes3 color;
        string message;
        uint timestamp;
    }

    Box[64] public boxes;
    mapping(uint256 => Box[]) public boxesHistory;

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
        for (uint256 i = 0; i < 64; i++) {
            boxes[i].owner = payable(msg.sender);
            boxes[i].price = 0.01 ether;
            boxes[i].color = 0xffffff;
            boxes[i].message = "New Box";
        }
    }

    function buyBox(
        uint256 _boxId,
        bytes3 _color,
        string calldata _message
    ) public payable {
        require(msg.value >= boxes[_boxId].price, "Not enough money");
        require(_boxId < 64, "Invalid box id");
        require(bytes(_message).length < 128, "Message too long");

        uint256 _price = boxes[_boxId].price;
        uint256 fee = (_price * 8) / 100;
        owner.transfer(fee);
        boxes[_boxId].owner.transfer(_price - fee);

        boxes[_boxId].owner = payable(msg.sender);
        boxes[_boxId].price = (_price * 120) / 100;
        boxes[_boxId].color = _color;
        boxes[_boxId].message = _message;
        boxes[_boxId].timestamp = block.timestamp;
        boxesHistory[_boxId].push(boxes[_boxId]);
    }

    function getBoxes() public view returns (Box[64] memory) {
        return boxes;
    }

    function getBoxHistory(uint256 _boxId) public view returns (Box[] memory) {
        return boxesHistory[_boxId];
    }
}
