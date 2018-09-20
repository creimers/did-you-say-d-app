pragma solidity ^0.4.17;

contract Adoption {

    address[16] public adopters;

    event Adopted(address from, uint petId);

    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);

        adopters[petId] = msg.sender;
        emit Adopted(msg.sender, petId);
        return petId;
    }

    function getAdopters() public view returns (address[16]) {
        return adopters;
    }
}