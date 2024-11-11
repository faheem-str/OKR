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

            <div className="okr-header">
                <CompanyOKR />
                <div className="okr-separator"></div>
                <TeamOKR />
                <div className="okr-separator"></div>
                <SubTeamOKR />
            </div>
        </div>
    );
}

export default OKRHeader;
