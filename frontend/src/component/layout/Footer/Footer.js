import React from "react";
import './footer.css';
import logo from '../../../images/app-store-google-play-logo.png';

const Footer = () =>{
    return (
    <footer id="footer">
        <div className="leftFooter">
            <h4>DOWNLOAD OUR AP4</h4>
            <p>Download App for Android and IOS mobile phone</p>
            <div id="play"></div>
            <img src={logo} id="app" alt="Appstore"/>
        </div>
        <div className="midFooter">
            <h1>ECOMMERCE.</h1>
            <p>High Quality is our first priority</p>
            <p>CopyRights 2021 &copy; JyotiRajput</p>
        </div>
        <div className="rightFooter">
            <h4>FOLLOW US</h4>
            <a href="..">Instagram</a>
            <a href="..">Youtube</a>
            <a href="..">Facebook</a>
        </div>
    </footer>
    );
};
export default Footer;