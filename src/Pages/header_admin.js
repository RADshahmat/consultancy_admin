import '../Styles/header.css';

import React from 'react';


const Header = () => {
  return (
    <header className="header">
      <div className="logo"><img src={`${process.env.PUBLIC_URL}/logo2.png`} /></div>
      <div className='logout-container'>
        <button className='logout'>Logout</button>
      </div>
    </header>
  );
};

export default Header;





