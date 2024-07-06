import React, { useContext, useEffect } from "react";
import {
  relclient,
  joinRoomInit,
  localTrack,
  remoteUsers,
  rtmclient,
  channel,
  displayName
} from "../../js/joinRoomInit";
import sideContext from "../context";
import chatContext from "../context/chats";

const Room = () => {
  let sharingScreen = false;
  let userIdInDisplayFrame = null;

  let localScreenTracks;
  const APP_Id = "8b5377b5736543e5993b4f787be23aa6";
  let uid = sessionStorage.getItem("uid");
  if (!uid) {
    uid = String(Math.floor(Math.random() * 10000));
    sessionStorage.setItem("uid", uid);
  }

  let token = null;

  let roomId = window.location.pathname.split("/")[2];
  //room.html?room=234

  if (!roomId) {
    roomId = "main";
  }

  let client;

  let handleMemberJoined = async (MemberId) => {
    addMemberToDom(MemberId);

    let members = await channel.getMembers();
    updateMemberTotal(members);

    let { name } = await rtmclient.getUserAttributesByKeys(MemberId, ["name"]);
    addBotMessageToDom(`Welcome to the room! ${name}`)
  };
  let addMemberToDom = async (MemberId) => {
    let { name } = await rtmclient.getUserAttributesByKeys(MemberId, ["name"]);

    let memberWrapper = document.querySelector(".member__list");
    if (!document.getElementById(`member__${MemberId}__wrapper`)) {
      let memberItem = `
      <div class="member__wrapper p-3" id="member__${MemberId}__wrapper">
                <span class="green__icon"></span>
                <p class="member_name">${name}</p>
            </div> `;
      memberWrapper.insertAdjacentHTML("beforeend", memberItem);
    }
  };

  let updateMemberTotal = async (members) => {
    console.log("updated");
    let total = document.getElementById("members__count");
    total.innerText = members.length;
  };

  let handleMemberLeft = async (MemberId) => {
    console.log("member left ....", MemberId);
    removeMemberFromDom(MemberId);
    let members = await channel.getMembers();
    updateMemberTotal(members);
    let { name } = await rtmclient.getUserAttributesByKeys(MemberId, ["name"]);
    addBotMessageToDom(`${name} has left the Room !`)
  };
  let getMembers = async () => {
    let members = await channel.getMembers();
    updateMemberTotal(members);
    for (let i in members) {
      addMemberToDom(members[i]);
    }
  };


  let removeMemberFromDom = async (MemberId) => {
    let memberWrapper = document.getElementById(`member__${MemberId}__wrapper`);
    let name =
      document.getElementsByClassName("member_name")[
        document.getElementsByClassName("member_name").length - 1
      ].textContent;
   
    console.log(
      "IN RemoveMember fromDom :::::",
      document.getElementsByClassName("member_name").length
    );
    console.log("IN RemoveMember fromDom", memberWrapper);
    memberWrapper.remove();
  };
  let sendMessage = async (e) =>{
    e.preventDefault();
    let message = e.target.message.value
    console.log("Message is ",message);
    channel.sendMessage({text: JSON.stringify({'type':'chat','message':message,'displayName':displayName})})
    addMessageToDom(displayName,message)
    e.target.reset()
  }

  let addMessageToDom = (name,message)=>{
    let messageWrapper = document.getElementById('messages')

    let newMessage = `
                    <div class="message__wrapper">
                        <div class="message__body text-white">
                            <strong class="message__author">${name}</strong>
                            <p class="message__text">${message}</p>
                        </div>
                    </div>`
    messageWrapper.insertAdjacentHTML('beforeend', newMessage)
    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage){

        lastMessage.scrollIntoView()
    }
  }

  let addBotMessageToDom = (botMessage)=>{
    let messageWrapper = document.getElementById('messages')

    let newMessage = `
                     <div class="message__wrapper bg-black rounded-lg">
                        <div class="message__body__bot text-white">
                            <strong class="message__author__bot">🤖 Mumble Bot</strong>
                            <p class="message__text__bot">${botMessage}</p>
                        </div>
                    </div>`
    messageWrapper.insertAdjacentHTML('beforeend', newMessage)
    let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
    if(lastMessage){

        lastMessage.scrollIntoView()
    }
}
  let handleChannelMessage = async (messageData, MemberId) =>{
    console.log("A new message was receved");
    let data = JSON.parse(messageData.text);
    if(data.type ==='chat'){
        addMessageToDom(data.displayName,data.message)
    }
    if(data.type === 'user_left'){
        document.getElementById(`user-container-${data.uid}`).remove()
        if(userIdInDisplayFrame === `user-container-${uid}`){
            displayFrame.style.display = null
        
            for(let i = 0; videoFrame.length > i; i++){
              videoFrame[i].style.width = '300px'
              videoFrame[i].style.height = '300px'
          }
          }
        }
}

  let leaveChannel = async () => {
    await channel.leave();
    await rtmclient.logout();
  };
  window.addEventListener("beforeunload", leaveChannel);


  joinRoomInit(
    client,
    APP_Id,
    roomId,
    token,
    uid,
    handleMemberJoined,
    handleMemberLeft,
    getMembers,
    handleChannelMessage,
    addBotMessageToDom
  );
  client = relclient;

  let expandVideoFrame = async (e) => {
    let child = displayFrame.children[0];
    if (child) {
      document.getElementById("streams_container").appendChild(child);
    }
    displayFrame.style.display = "block";
    displayFrame.appendChild(e.currentTarget);
    userIdInDisplayFrame = e.currentTarget.id;

    for (let i = 0; videoFrame.length > i; i++) {
      if (videoFrame[i].id !== userIdInDisplayFrame) {
        videoFrame[i].style.height = "100px";
        videoFrame[i].style.width = "100px";
      }
    }
  };

  const toggleCamera = async (e) => {
    let button = e.currentTarget;
    if (localTrack[1].muted) {
      await localTrack[1].setMuted(false);
      button.classList.add("active");
    } else {
      await localTrack[1].setMuted(true);
      button.classList.remove("active");
    }
  };

  let toggleMic = async (e) => {
    let button = e.currentTarget;

    if (localTrack[0].muted) {
      await localTrack[0].setMuted(false);
      button.classList.add("active");
    } else {
      await localTrack[0].setMuted(true);
      button.classList.remove("active");
    }
  };

  let switchToCamera = async () => {
    let displayFrame = document.getElementById("stream_box");

    let player = `<div class="video_container" id="user-container-${uid}">
    <div class="video-player" id="user-${uid}"></div>
   </div>`;

    displayFrame.insertAdjacentHTML("beforeend", player);
    await localTrack[0].setMuted(true);
    await localTrack[1].setMuted(true);

    document.getElementById("mic-btn").classList.remove("active");
    document.getElementById("screen-btn").classList.remove("active");

    localTrack[1].play(`user-${uid}`);
    await relclient.publish([localTrack[1]]);
  };

  let toggleScreen = async (e) => {
    let screenBtn = e.currentTarget;
    let cameraBtn = document.getElementById("camera-btn");

    let displayFrame = document.getElementById("stream_box");

    if (!sharingScreen) {
      sharingScreen = true;
      screenBtn.classList.add("active");
      cameraBtn.classList.remove("active");
      cameraBtn.style.display = "none";

      localScreenTracks = await AgoraRTC.createScreenVideoTrack(); // {encoderConfig: {width: 1920, height: 1080}}

      document.getElementById(`user-container-${uid}`).remove();
      displayFrame.style.display = "block";
      let player = `<div class="video_container" id="user-container-${uid}">
                      <div class="video-player h-full w-full" id="user-${uid}"></div>
                  </div>`;
      displayFrame.insertAdjacentHTML("beforeend", player);
      document
        .getElementById(`user-container-${uid}`)
        .addEventListener("click", expandVideoFrame);

      userIdInDisplayFrame = `user-container-${uid}`;
      localScreenTracks.play(`user-${uid}`);

      await relclient.unpublish([localTrack[1]]);
      await relclient.publish([localScreenTracks]);

      let videoFrame = document.getElementsByClassName("video_container");
      for (let i = 0; videoFrame.length > i; i++) {
        videoFrame[i].style.width = "100px";
        videoFrame[i].style.height = "100px";
      }
    } else {
      sharingScreen = false;
      cameraBtn.style.display = "block";
      document.getElementById(`user-container-${uid}`).remove();
      // document.getElementById('stream_box').remove()
      await relclient.unpublish([localScreenTracks]);

      switchToCamera();
    }
  };

  const { side, setSide } = useContext(sideContext);
  const { chats, setChats } = useContext(chatContext);
  return (
    <div className="bg-slate-900 w-[100vw] h-[100vh] ">
      {side ? (
        <section
          id="members__container"
          className="h-full bg-blue-600 max-w-52 fixed left-0 z-30  md:block "
        >
          <div></div>

          <div
            id="members__header"
            className="flex gap-5 justify-center items-center bg-slate-200 p-2"
          >
            <p className="text-xl font-bold">Participants</p>
            <strong
              id="members__count"
              className="bg-blue-800 w-6 flex justify-center text-white rounded-full"
            >
              0
            </strong>
          </div>

          <div className="member__list" id="member__list"></div>
        </section>
      ) : (
        <section
          id="members__container"
          className="h-full bg-blue-600 max-w-52 fixed left-[-400px] transition-all z-30  md:block "
        >
          <div></div>

          <div
            id="members__header"
            className="flex gap-5 justify-center items-center bg-slate-200 p-2"
          >
            <p className="text-xl font-bold">Participants</p>
            <strong
              id="members__count"
              className="bg-blue-800 w-6 flex justify-center text-white rounded-full"
            >
              0
            </strong>
          </div>

          <div className="member__list" id="member__list"></div>
        </section>
      )}

      <section
        id="stream__container"
        className="h-full w-[100%] bg-black relative md:pl-48 md:pr-48"
      >
        <div
          id="stream_box"
          className="min-h-[70%] object-scale-down  bg-slate-200 lg:w-[70%] w-full mx-auto"
        ></div>

        <div
          id="streams_container"
          className="bg-gray-950 w-[100%] gap-6 overflow-auto scrollbar-none"
        ></div>

        <div className="stream__actions fixed flex bottom-5  w-full z-20  gap-3 justify-center">
          <button
            id="camera-btn"
            className="active"
            onClick={(e) => {
              toggleCamera(e);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" />
            </svg>
          </button>
          <button
            id="mic-btn"
            className="active"
            onClick={(e) => {
              toggleMic(e);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z" />
            </svg>
          </button>
          <button
            id="screen-btn"
            onClick={(e) => {
              toggleScreen(e);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M0 1v17h24v-17h-24zm22 15h-20v-13h20v13zm-6.599 4l2.599 3h-12l2.599-3h6.802z" />
            </svg>
          </button>
          <button id="leave-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M16 10v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z" />
            </svg>
          </button>
        </div>
        {/* <button id="join-btn" className="hidden">
          Join Stream
        </button> */}
      </section>

     {
      chats ?(
        <section id="messages__container"
        className=" w-40 fixed scrollbar-none top-14 right-72 z-20  md:block transition-all ">
        <div id="messages" className="h-full w-full bg-slate-100 overflow-auto scrollbar-none">
          <div class="message__wrapper">
            <div class="message__body__bot bg-black rounded-lg">
              <strong class="message__author__bot">🤖 Mumble Bot</strong>
              <p class="message__text__bot">
                Welcome to the room, Don't be shy, say hello!
              </p>
            </div>
          </div>

          <div class="message__wrapper"></div>
        <form id="message__form" className="w-[100%] fixed " onSubmit={(e)=>{sendMessage(e)}}>
          <input type="text" name="message" placeholder="Send a message...." />
        </form>
        </div>

      </section>
      ):
      (
        <section id="messages__container"
        className="h-fit max-w-52 fixed scrollbar-none  right-[400px] z-20 hidden">
      

      </section>
      )
     }

    </div>
  );
};

export default Room;
