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
    const [viewOpen, setViewOpen] = useState(false);
    const [completionOpen, setCompletionOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [teamOpen, setTeamOpen] = useState(false);
    const [checkinOpen, setCheckinOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);


    const viewDrop = () => {
        setViewOpen(!viewOpen);
    };
    const completionDrop = () => {
        setCompletionOpen(!completionOpen);
    };
    const typeDrop = () => {
        setTypeOpen(!typeOpen);
    };
    const teamDrop = () => {
        setTeamOpen(!teamOpen);
    };
    const checkinDrop = () => {
        setCheckinOpen(!checkinOpen);
    };
    const sortDrop = () => {
        setSortOpen(!sortOpen);
    };
    
  return (
    <nav className="navbar p-2 px-3">
    <div className="m-0 d-flex w-100 m-0 justify-content-between align-items-center custom-height">
      <a className="navbar-brand p-2 px-3 m-0" href="#">
        <img src={require('../../assest/Images/logo-ct-dark.png')} alt="" width="32"  />
        {/* <img src="" alt="" /> */}
      </a>
      <div className='d-flex  align-items-center gap-2'>
      <div className="dropdown">
  <button
    className="btn btn-secondary dropdown-toggle"
    type="button"
    id="dropdownMenu2"
    aria-expanded={viewOpen}
    data-bs-toggle="dropdown"
    onClick={viewDrop}
  >
    <img className='eyeIcon' src={require('../../assest/Images/Eye.png')} alt="" />
    View Mode
    <i className={`fas ${viewOpen ? 'fa-chevron-up' : 'fa-chevron-down'} ms-2`}></i> {/* Toggle icon */}
  </button>
  <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
    <li><button className="dropdown-item" type="button">Action</button></li>
    <li><button className="dropdown-item" type="button">Another action</button></li>
    <li><button className="dropdown-item" type="button">Something else here</button></li>
  </ul>
</div>
<div className="dropdown">
  <button
    className="btn btn-secondary dropdown-toggle"
    type="button"
    id="dropdownMenu2"
    aria-expanded={completionOpen}
    data-bs-toggle="dropdown"
    onClick={completionDrop}
  >
    <img className='eyeIcon' src={require('../../assest/Images/Percent.png')} alt="" />
   Completion
    <i className={`fas ${completionOpen ? 'fa-chevron-up' : 'fa-chevron-down'} ms-2`}></i> {/* Toggle icon */}
  </button>
  <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
    <li><button className="dropdown-item" type="button">Action</button></li>
    <li><button className="dropdown-item" type="button">Another action</button></li>
    <li><button className="dropdown-item" type="button">Something else here</button></li>
  </ul>
</div>
<div className="dropdown">
  <button
    className="btn btn-secondary dropdown-toggle"
    type="button"
    id="dropdownMenu2"
    aria-expanded={typeOpen}
    data-bs-toggle="dropdown"
    onClick={typeDrop}
  >
    <img className='eyeIcon' src={require('../../assest/Images/ob.png')} alt="" />
   Type
    <i className={`fas ${typeOpen ? 'fa-chevron-up' : 'fa-chevron-down'} ms-2`}></i> {/* Toggle icon */}
  </button>
  <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
    <li><button className="dropdown-item" type="button">Action</button></li>
    <li><button className="dropdown-item" type="button">Another action</button></li>
    <li><button className="dropdown-item" type="button">Something else here</button></li>
  </ul>
</div>
<div className="dropdown">
  <button
    className="btn btn-secondary dropdown-toggle"
    type="button"
    id="dropdownMenu2"
    aria-expanded={teamOpen}
    data-bs-toggle="dropdown"
    onClick={teamDrop}
  >
    <img className='eyeIcon' src={require('../../assest/Images/Users.png')} alt="" />
   By Team
    <i className={`fas ${teamOpen ? 'fa-chevron-up' : 'fa-chevron-down'} ms-2`}></i> {/* Toggle icon */}
  </button>
  <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
    <li><button className="dropdown-item" type="button">Action</button></li>
    <li><button className="dropdown-item" type="button">Another action</button></li>
    <li><button className="dropdown-item" type="button">Something else here</button></li>
  </ul>
</div>
<div className="dropdown">
  <button
    className="btn btn-secondary dropdown-toggle"
    type="button"
    id="dropdownMenu2"
    aria-expanded={checkinOpen}
    data-bs-toggle="dropdown"
    onClick={checkinDrop}
  >
    <img className='eyeIcon' src={require('../../assest/Images/Checks.png')} alt="" />
   Checkin
    <i className={`fas ${checkinOpen ? 'fa-chevron-up' : 'fa-chevron-down'} ms-2`}></i> {/* Toggle icon */}
  </button>
  <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
    <li><button className="dropdown-item" type="button">Action</button></li>
    <li><button className="dropdown-item" type="button">Another action</button></li>
    <li><button className="dropdown-item" type="button">Something else here</button></li>
  </ul>
</div>
<div className="dropdown position-relative">
  <button
    className="btn btn-secondary dropdown-toggle"
    type="button"
    id="dropdownMenu2"
    aria-expanded={sortOpen}
    data-bs-toggle="dropdown"
    onClick={sortDrop}
  >
    <img className='eyeIcon' src={require('../../assest/Images/Sortdescending.png')} alt="" />
   Sort
    <i className={`fas ${sortOpen ? 'fa-chevron-up' : 'fa-chevron-down'} ms-2`}></i> {/* Toggle icon */}
  </button>
  <ul className="dropdown-menu dropdown-menu-custom" aria-labelledby="dropdownMenu2">
    <li className="dropdown-header">Action</li>
    <li><button className="dropdown-item" type="button">Another action</button></li>
    <li><button className="dropdown-item" type="button">Something else here</button></li>
  </ul>
</div>
<button
    className="btn btn-secondary dropdown-toggle"
    type="button"
  > Clear</button>
      </div>
     
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
