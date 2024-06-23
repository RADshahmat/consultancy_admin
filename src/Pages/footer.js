import React from "react";
import "../Styles/footer.css";

const Footer = () => {

  return (
    <footer className="footer">
      
      <div className="footer-content">
        <div>
        <p>ADDRESS</p>
        <address>
          <p>5th Floor, House 7, Road 2/C, Block J</p>
          <p>Baridhara, Gulshan, Dhaka - 1212</p>
        </address>
        <a href="">Open In Maps</a>
        </div>
        
      </div><br></br>
      <div className="extraSection">
       <h3>&copy;2024 Huraira Consultancy All Rights Reserved</h3>
       <p><a>Privacy Policy</a> <a>Resources</a></p>
       <p>All Concern of Butterfly Lighthouse</p>
      </div>
    </footer>
  );
};

export default Footer;
