/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import './Header.css'
export default function Header() {
    const [data,setData]=useState('')
    useEffect(() => {
        const storedData = sessionStorage.getItem('userData');
    if (storedData) {
      setData( JSON.parse(storedData)); // Parse the data if it's in JSON format
      console.log(JSON.parse(storedData))
      console.log('hello')
    }
    }, [])
    
  return (
    <nav className="navbar navbar-light bg-white p-2 px-3">
    <div className="m-0 d-flex w-100 m-0 justify-content-between align-items-center">
      <a className="navbar-brand p-2 px-3 m-0" href="#">
        <img src={require('../../assest/Images/logo-ct-dark.png')} alt="" width="32"  />
        {/* <img src="" alt="" /> */}
      </a>
        <div className='d-flex justify-content-center align-items-center'>
        <p className='userName m-0 p-0 px-2 mr-2 text-dark'>
        {data.display_name}
      </p>
        <a href="#" id="log_out" title="Logout"> <i className=" text-dark fa fa-sign-out"></i> </a>
        </div>
     
    </div>
  </nav>
  )
}
