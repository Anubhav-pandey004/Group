import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react'
import { useForm} from 'react-hook-form'


const Lobby = () => {
    const navigate = useNavigate()


    const {
        handleSubmit,
        register,
        formState:{errors},
    } = useForm();

    const onSubmit = (data) => {
    sessionStorage.setItem('display_name', data.name)
    let inviteCode = data.room

    if(!inviteCode){
        inviteCode = String(Math.floor(Math.random() * 10000))
    }
    // window.location = `room.html?room=${inviteCode}`
    navigate(`/room/${inviteCode}`)
    }


  return (
    <div className=' container flex justify-center items-center min-h-[calc(100vh-65px)] top-0 min-w-full overflow-hidden'>
       <main id="room__lobby__container" className='container bg-violet-950 rounded-lg md:w-[40%] '>
        <div id="form__container" className='flex-col justify-center mx-auto'>
             <div id="form__container__header" className='w-full bg-violet-800 flex justify-center h-10 items-center text-lg font-semibold text-white'>
                 <p>👋 Create or Join Room</p>
             </div>
 
 
            <form id="lobby__form" className='p-5 text-white w-[60%] mx-auto' onSubmit={handleSubmit(onSubmit)}>
 
                 <div  className='form__field__wrapper flex justify-between flex-wrap my-4 '>
                     <label className='w-full'>Your Name</label>
                     <input className='w-full p-2 rounded-md bg-violet-300 text-violet-800' type="text" {
                        ...register('name',{required:{value:true ,message:"Name is Required"}})
                     } placeholder="Enter your display name..." />
                 </div>
 
                 <div  className='form__field__wrapper flex justify-between flex-wrap my-4 '>
                     <label className='w-full'>Room Name</label>
                     <input className='w-full p-2 rounded-md bg-violet-300 text-violet-800' type="text" {
                        ...register('room', {required:{value:true, message:"Room Name or Number is Required"}})
                     } placeholder="Enter room name..." />
                 </div>
 
                 <div  className='form__field__wrapper flex justify-between flex-wrap my-4 '>
                     <button  className='bg-violet-800 p-2 rounded-md text-white w-full flex justify-center items-center ' type="submit">Go to Room 
                         <svg className='ml-4 text-white'  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
                    </button>
                 </div>
            </form>
        </div>
     </main>
    </div>
  )
}

export default Lobby
