import React, {useState}from 'react';
import './OkrHeader.css';
import CompanyOKR from '../CompanyOkr/CompanyOkr';
import TeamOKR from '../TeamOkr/TeamOkr';
import SubTeamOKR from '../SubTeamOkr/SubTeamOkr';
import Header from '../Header/Header'

function OKRHeader() {
    const [dropdownValue, setDropdownValue] = useState(''); // State to hold the dropdown value

    // Callback function to update the state
    const handleDropdownChange = (value) => {
        setDropdownValue(value);
    };
    return (
        <div>
            <Header onDropdownChange={handleDropdownChange} />
            <div className='inHeader'>
                <div className='component'>
                    <div className="okr-header">
                        <div className="okr-item">
                            <strong>Company OKRs</strong>
                        </div>
                        <div className='okr-separator'></div>
                    </div>
                    <div className='w-100'>
                       <CompanyOKR dropdownValue={dropdownValue}/>
                    </div>
                </div>
                <div className='component'>
                    <div className="okr-header">
                        <div className="okr-item">
                            <strong>Team OKRs</strong>
                        </div>
                        <div className='okr-separator'></div>

                    </div>
                    <div className='w-100'>
                       <TeamOKR/>
                    </div>
                </div>
                <div className='component'>
                    <div className="okr-header p11">
                        <div className="okr-item">
                            <strong>Sub-Team OKRs</strong>
                        </div>
                    </div>
                    <div className='w-100'>
                       <SubTeamOKR/>
                    </div>
                </div>

            </div>



        </div>
    );
}

export default OKRHeader;
