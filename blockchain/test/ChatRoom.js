const { expect } = require("chai");
const hre = require("hardhat");

const tokens = (n) => hre.ethers.utils.parseEther(n.toString());
const fromWei = (n) => hre.ethers.utils.formatEther(n);

describe("ChatRoom", () => {
  let chatRoom;
  let creator;
  let member1;
  let member2;
  let member3;
  let member4;

  const CHAT_ROOM_NAME = "MY CHAT ROOM";
  const CHAT_ROOM_FEE = tokens(1);

  beforeEach(async () => {
    [creator, member1, member2, member3, member4] =
      await hre.ethers.getSigners();
    const ChatRoomFactory = await hre.ethers.getContractFactory("ChatRoom");
    chatRoom = await ChatRoomFactory.connect(creator).deploy(
      CHAT_ROOM_NAME,
      CHAT_ROOM_FEE
    );
    await chatRoom.deployed();
  });

  describe("Deploy", () => {
    it("Sets the room name", async () => {
      const roomName = await chatRoom.roomName();
      expect(roomName).equal(CHAT_ROOM_NAME);
    });
    it("Sets the room fee", async () => {
      const roomFee = await chatRoom.joinFee();
      expect(roomFee).equal(CHAT_ROOM_FEE);
    });
    it("Sets the room creator", async () => {
      const roomCreator = await chatRoom.roomCreator();
      expect(roomCreator).equal(creator.address);
    });
  });

  describe("Join Room", () => {
    beforeEach(async () => {
      const promiseList = [member1, member2, member3].map(async (member) => {
        const tx = await chatRoom
          .connect(member)
          .joinRoom({ value: CHAT_ROOM_FEE });
        await tx.wait();
      });
      await Promise.all(promiseList);
    });
    it("Updates joined users list", async () => {
      const promiseList = [member1, member2, member3].map(async (member) => {
        const joined = await chatRoom.joinedUsers(member.address);
        return joined;
      });
      const res = await Promise.all(promiseList);
      console.log(`chat: ${chatRoom.address}`)
      expect(res.every((joined) => joined)).to.be.true;
    });
    it("Returns false if not joined", async () => {
      const joined = await chatRoom.joinedUsers(member4.address);
      expect(joined).to.be.false;
    });

    describe("Withdraw", () => {
      it("Adds funds to room creator", async () => {
        const beforeBalance = fromWei(await creator.getBalance());
        console.log(`before: ${beforeBalance}`);
        const tx = await chatRoom.connect(creator).withdraw();
        await tx.wait();
        const afterBalance = fromWei(await creator.getBalance());
        console.log(`after: ${afterBalance}`);
        expect(Number(afterBalance)).to.be.greaterThan(Number(beforeBalance));
      });
    });
  });
});
