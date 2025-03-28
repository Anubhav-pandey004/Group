


let localTrack;
let remoteUsers = {};

let relclient;
let rtmclient
let channel

let displayName = sessionStorage.getItem("display_name");
const joinRoomInit = async (client,APP_Id, roomId, token, uid,handleMemberJoined,handleMemberLeft,getMembers,handleChannelMessage,addBotMessageToDom) => {
  // let displayName = sessionStorage.getItem("display_name");
  if(!displayName){
    window.location = '/'
  
  }

  console.log("Handel Displayname",displayName);




  rtmclient = await AgoraRTM.createInstance(APP_Id);
  await rtmclient.login({ uid, token })
  await rtmclient.addOrUpdateLocalUserAttributes({'name' : displayName})
  channel = await rtmclient.createChannel(roomId)
  await channel.join()
  channel.on('MemberJoined',handleMemberJoined)
  channel.on('MemberLeft', handleMemberLeft)
  channel.on('ChannelMessage', handleChannelMessage)
  getMembers()
  // addBotMessageToDom(`Welcome to the room! ${displayName}`)
  
  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  await client.join(APP_Id, roomId, token, uid);
  console.log("IN join Room Init", client, APP_Id, roomId, token, uid);

  const handleUserPublished = async (user, mediaType) => {

    remoteUsers[user.uid] = user;
    remoteUsers[user.uid].name = displayName

    await client.subscribe(user, mediaType);
    let player = document.getElementById(`user-container-${user.uid}`);
    if (player === null) {
      player = `<div class="video_container" id="user-container-${user.uid}">
                      <div class="video-player" id="user-${user.uid}"></div>
                      
                  </div>`;

                  console.log("user object is ",user,remoteUsers);
      document
        .getElementById("streams_container")
        .insertAdjacentHTML("beforeend", player);
      document
        .getElementById(`user-container-${user.uid}`)
        .addEventListener("click", expandVideoFrame);
    }

    if (mediaType === "video") {
      user.videoTrack.play(`user-${user.uid}`);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  }

  const handleUserLeft = async (user) => {
    delete remoteUsers[user.uid];
    let item = document.getElementById(`user-container-${user.uid}`);
    if (item) {
      item.remove();
    }

    if (userIdInDisplayFrame === `user-container-${user.uid}`) {
      displayFrame.style.display = null;
      let videoFrame = document.getElementsByClassName("video_container");
      for (let i = 0; videoFrame.length > i; i++) {
        videoFrame[i].style.width = "300px";
        videoFrame[i].style.height = "300px";
      }
    }
  };

  let displayFrame = document.getElementById('stream_box');
  let videoFrame = document.getElementsByClassName('video_container');

  let userIdInDisplayFrame = null;

  let expandVideoFrame = async (e) => {
    let child = displayFrame.children[0];
    if (child) {
      document.getElementById('streams_container').appendChild(child);
    }
    displayFrame.style.display = 'block';
    displayFrame.appendChild(e.currentTarget);
    userIdInDisplayFrame = e.currentTarget.id;

    for (let i = 0; videoFrame.length > i; i++) {
      if (videoFrame[i].id !== userIdInDisplayFrame) {
        videoFrame[i].style.height = '100px';
        videoFrame[i].style.width = '100px';
      }
    }
  };

  let hideDisplayFrame = () => {
    userIdInDisplayFrame = null;
    displayFrame.style.display = null;

    let child = displayFrame.children[0];
    document.getElementById('streams_container').appendChild(child);
    for (let i = 0; videoFrame.length > i; i++) {
      videoFrame[i].style.width = '300px';
      videoFrame[i].style.height = '300px';
    }
  }

  displayFrame.addEventListener('click', hideDisplayFrame);

  for (let i = 0; videoFrame.length > i; i++) {
    videoFrame[i].addEventListener('click', expandVideoFrame);
  }

  client.on("user-published", handleUserPublished);
  client.on("user-left", handleUserLeft);
  // addBotMessageToDom(`Welcome to the room! ${displayName}`)

  // Joining channel
  localTrack = await AgoraRTC.createMicrophoneAndCameraTracks(
    {},
    {
      encoderConfig: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
      },
    }
  );


  let player = `<div class="video_container" id="user-container-${uid}">
                    <div class="video-player" id="user-${uid}"></div>
                </div>`;


  document
    .getElementById("streams_container")
    .insertAdjacentHTML("beforeend", player);
  document
    .getElementById(`user-container-${uid}`)
    .addEventListener("click", expandVideoFrame);
  localTrack[1].play(`user-${uid}`);
  await client.publish([localTrack[0], localTrack[1]]);
  relclient = client;




}

export { relclient,joinRoomInit, localTrack, remoteUsers ,rtmclient,channel,displayName};
