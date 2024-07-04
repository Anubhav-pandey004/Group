
const toggleCamera = async (e,localTrack,remoteUsers) => {
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

  export default toggleCamera;