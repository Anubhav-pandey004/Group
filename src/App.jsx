import { useState } from 'react'
           

import './App.css'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'


function App() {
return (
  <div className='overflow-hidden'>
    <Header/>
    <main className='min-h-[calc(100vh)] bg-slate-300 pt-16'>
      <Outlet/>
    </main>
  </div>
)
}

export default App
