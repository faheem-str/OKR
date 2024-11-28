/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState,useMemo } from 'react'
import './Header.css'
import apiService from '../../ApiService/service'
import { useNavigate } from 'react-router-dom';

export default function Header({ onDropdownChange,setsetValue }) {
  const navigate = useNavigate();

    const [data,setData]=useState('')
    const [viewOpen, setViewOpen] = useState(false);
    const [completionOpen, setCompletionOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [teamOpen, setTeamOpen] = useState(false);
    const [checkinOpen, setCheckinOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [groups,setGroups]=useState([])
    const [selectedView, setSelectedView] = useState('Compact'); // For storing the selected view

    useEffect(() => {
        const storedData = sessionStorage.getItem('userData');
        if (storedData) {
            setData(JSON.parse(storedData)); // Parse the data if it's in JSON format
            console.log('User data:', JSON.parse(storedData));
        }
    }, []);
    useEffect(() => {
     if(setsetValue){
      setSelectedView(setsetValue)
      console.log('working')
     }
    }, [setsetValue])
    

    // Memoizing the API call to prevent re-fetching groups on every render
    const getGroupName = useMemo(() => {
        return async () => {
            try {
                const response = await apiService.get('objectives/ldap/groups');
                setGroups(response.data.groups);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };
    }, []); // Only recreate the function on mount (empty dependency array)

    useEffect(() => {
        getGroupName(); // Call the memoized function to fetch groups data
    }, [getGroupName]); // This effect will only run once
  


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
    const handleRadioChange = (event) => {
      setSelectedView(event.target.value); // Update selected view
      onDropdownChange(event.target.value)
    };
    const logOut = ()=>{
      sessionStorage.removeItem('authToken');
      navigate('/login');

    }
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
    <li className="dropdown-header drop-Name">Action</li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
    <input
      checked={selectedView === 'Compact'}
     onChange={handleRadioChange}
     value="Compact"
     className="form-check-input custom-sizeCheckbox" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
   Compact
  </label>
    </li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
    <input
    checked={selectedView === 'Detailed'}
    onChange={handleRadioChange}
    value="Detailed"
    className="form-check-input custom-sizeCheckbox" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
  <label className="form-check-label" for="flexRadioDefault2">
    Detailed
  </label>
    </li>
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
  <ul className="dropdown-menu pb0" aria-labelledby="dropdownMenu2">
    <li className="dropdown-header drop-Name">Completion</li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
    <input className="form-check-input custom-sizeCheckbox" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
   All
  </label>
    </li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2 onTrackBg'>
    <input className="form-check-input custom-sizeCheckbox" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
    On Track
  </label>
    </li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2 needAttentionBg'>
    <input className="form-check-input custom-sizeCheckbox" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
  Needs Attention
  </label>
    </li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2 highPriorityBg'>
    <input className="form-check-input custom-sizeCheckbox" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
  High Priority
  </label>
    </li>
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
    <li className="dropdown-header drop-Name">Objective Type</li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
    <input className="form-check-input custom-sizeCheckbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
   All
  </label>
    </li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
    <input className="form-check-input custom-sizeCheckbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
    L - Learning
  </label>
    </li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
    <input className="form-check-input custom-sizeCheckbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
  C - Committed
  </label>
    </li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
    <input className="form-check-input custom-sizeCheckbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
  A - Aspirational
  </label>
    </li>
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
  <ul className="dropdown-menu width625" aria-labelledby="dropdownMenu2">
    <li className="dropdown-header drop-Name">By Team</li>
    <div className='d-flex flex-wrap'>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2 w250'>
    <input className="form-check-input custom-sizeCheckbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
   All
  </label>
    </li>
    {
        groups && groups.map((items,i)=>(
            <li key={i} className='dropdown-item d-flex align-items-center gap-1 p-2 w250'>
            <input className="form-check-input custom-sizeCheckbox" type="checkbox" name="flexRadioDefault" id="flexRadioDefault1" />
          <label className="form-check-label" for="flexRadioDefault1">
            {items}
          </label>
            </li>
        ))
    }
    </div>
   
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
    <li className="dropdown-header drop-Name">Checkin</li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
    <input className="form-check-input custom-sizeCheckbox" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
   Check-in
  </label>
    </li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
    <input className="form-check-input custom-sizeCheckbox" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
  <label className="form-check-label" for="flexRadioDefault1">
    Not Check-in
  </label>
    </li>
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
  <ul className="dropdown-menu w424" aria-labelledby="dropdownMenu2">
    <li className="dropdown-header drop-Name">Sort By</li>
    <div className='d-flex justify-content-between align-items-center'>
  <div className='form-check m0'>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
      <input className="form-check-input custom-sizeCheckbox" type="radio" name="checkInGroup" id="checkIn1" />
      <label className="form-check-label" htmlFor="checkIn1">
      Date: Earliest to Latest
      </label>
    </li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
      <input className="form-check-input custom-sizeCheckbox" type="radio" name="checkInGroup" id="notCheckIn1" />
      <label className="form-check-label" htmlFor="notCheckIn1">
      Date: Most Recent to Earliest
      </label>
    </li>
  </div>
  <div className='form-check m0'>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
      <input className="form-check-input custom-sizeCheckbox" type="radio" name="checkInGroup2" id="checkIn2" />
      <label className="form-check-label" htmlFor="checkIn2">
      Progress: Earliest to Latest
      </label>
    </li>
    <li className='dropdown-item d-flex align-items-center gap-1 p-2'>
      <input className="form-check-input custom-sizeCheckbox" type="radio" name="checkInGroup2" id="notCheckIn2" />
      <label className="form-check-label" htmlFor="notCheckIn2">
      Progress: Most Recent First
      </label>
    </li>
  </div>
</div>

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
        <a id="log_out" title="Logout" onClick={logOut}> <i className=" text-dark fa fa-sign-out"></i> </a>
        </div>
    </div>
  </nav>
  )
}
