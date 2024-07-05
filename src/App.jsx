import { useState } from 'react'
           

import './App.css'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import sideContext  from './context/index'
import chatContext from './context/chats'



function App() {

  const [side,setSide]=useState(false);
  const [chats,setChats]=useState(false);
return (
   <sideContext.Provider value={{
    side,
    setSide
  }}>
    <chatContext.Provider value={{
      chats,
      setChats
    }}>
<div className='overflow-hidden scrollbar-none'>
    <Header/>
    <main className='min-h-[calc(100vh)] bg-slate-300 pt-16 '>
      <Outlet/>
    </main>
  </div>
  </chatContext.Provider>
  </sideContext.Provider>
)
}

export default App
