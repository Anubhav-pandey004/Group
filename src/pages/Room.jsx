import React, { useEffect } from "react";
import {joinRoomInit,localTrack,remoteUsers} from "../../js/joinRoomInit";



const Room = () => {
  const APP_Id = "8b5377b5736543e5993b4f787be23aa6";
  let uid = sessionStorage.getItem("uid");
  if (!uid) {
    uid = String(Math.floor(Math.random() * 10000));
    sessionStorage.setItem("uid", uid);
  }

  let token = null;
  let client;

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let roomId = urlParams.get("room");
  //room.html?room=234

  if (!roomId) {
    roomId = "main";
  }

  // let displayName = sessionStorage.getItem("display_name");
  // if (!displayName) {
  //   window.location = "lobby.html";
  // }\


  // let localScreenTracks;
  // let sharingScreen = false;
  joinRoomInit(client,APP_Id, roomId, token, uid)
  const handesidebar = () => {
    document.getElementById("members__container").classList.add("hidden");
  };

  
const toggleCamera = async (e) => {
  console.log("Toggle Camera",localTrack);
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
  console.log("Local Tracks are: ", localTrack);
  if (localTrack[0].muted) {
    await localTrack[0].setMuted(false);
    button.classList.add("active");
  } else {
    await localTrack[0].setMuted(true);
    button.classList.remove("active");
  }
};

  return (
    <div className="bg-slate-900 h-[100vh] ">
      <section
        id="members__container"
        className="h-full bg-blue-600 max-w-52 fixed left-0 z-30  "
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

        <div id="member__list"></div>
      </section>

      <section id="stream__container" className="h-full w-[100vw] bg-black relative lg:pl-48">
        <div id="stream_box" className="min-h-[70%] bg-slate-200 md:w-[70%] w-full mx-auto"></div>

        <div id="streams_container" className="bg-gray-950 w-[97%] gap-6 "></div>

        <div className="stream__actions fixed flex bottom-5  w-full  justify-evenly z-30">
         
          <button id="camera-btn" className="active" onClick={(e)=>{toggleCamera(e)}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M5 4h-3v-1h3v1zm10.93 0l.812 1.219c.743 1.115 1.987 1.781 3.328 1.781h1.93v13h-20v-13h3.93c1.341 0 2.585-.666 3.328-1.781l.812-1.219h5.86zm1.07-2h-8l-1.406 2.109c-.371.557-.995.891-1.664.891h-5.93v17h24v-17h-3.93c-.669 0-1.293-.334-1.664-.891l-1.406-2.109zm-11 8c0-.552-.447-1-1-1s-1 .448-1 1 .447 1 1 1 1-.448 1-1zm7 0c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5z" />
            </svg>
          </button>
          <button id="mic-btn" className="active" onClick={(e)=>{toggleMic(e)}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 2c1.103 0 2 .897 2 2v7c0 1.103-.897 2-2 2s-2-.897-2-2v-7c0-1.103.897-2 2-2zm0-2c-2.209 0-4 1.791-4 4v7c0 2.209 1.791 4 4 4s4-1.791 4-4v-7c0-2.209-1.791-4-4-4zm8 9v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z" />
            </svg>
          </button>
          <button id="screen-btn">
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
        <button id="join-btn" className="hidden">
          Join Stream
        </button>
      </section>
    </div>
  );
};

export default Room;
