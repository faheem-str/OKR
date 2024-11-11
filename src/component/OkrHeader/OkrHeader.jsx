import React from 'react';
import './OkrHeader.css';
import CompanyOKR from '../CompanyOkr/CompanyOkr';
import TeamOKR from '../TeamOkr/TeamOkr';
import SubTeamOKR from '../SubTeamOkr/SubTeamOkr';
import Header from '../Header/Header'

function OKRHeader() {
    return (
        <div>
            <Header />
            <div className='inHeader'>
                <div className='component'>
                    <div className="okr-header">
                        <div className="okr-item">
                            <strong>Company OKRs</strong>
                        </div>
                        <div className='okr-separator'></div>
                    </div>
                    <div>
                       <CompanyOKR/>
                    </div>
                </div>
                <div className='component'>
                    <div className="okr-header">
                        <div className="okr-item">
                            <strong>Team OKRs</strong>
                        </div>
                        <div className='okr-separator'></div>

                    </div>
                    <div>
                       <TeamOKR/>
                    </div>
                </div>
                <div className='component'>
                    <div className="okr-header p11">
                        <div className="okr-item">
                            <strong>Sub-Team OKRs</strong>
                        </div>
                    </div>
                    <div>
                       <SubTeamOKR/>
                    </div>
                </div>

            </div>



        </div>
    );
}

export default OKRHeader;
