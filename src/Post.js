import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'firebase/auth';
import 'firebase/database';
import { Col } from 'reactstrap';


import Flippy, { FrontSide, BackSide } from 'react-flippy';

// Create a functional component to return the HTMl that looks like a post
function Post(d) {
    /* Return a div that contains the following information:
        - An unordered list of price, city, family, and affiliated school at the front side of the post card
        - A div of list of image, host name, email, school .etc (comprehensive information) at the back side of the post card
    */
    return (
        <Col key={d.info.id} xs='12' md='4'>
            <Flippy flipOnHover={false} flipOnClick={true} flipDirection="horizontal" style={{ height: '400px' }}>
                <FrontSide>
                <ul className="bedroom_features">
                    <li><img src={d.info.img} alt="bedroom"></img></li>
                    <li><i className="fas fa-dollar-sign" aria-label="price" ></i> {d.info.price}</li>
                    <li><i className="fas fa-map-marker-alt" aria-label="location"></i> {d.info.city}, {d.info.sta}</li>
                    <li><i className="fas fa-users" aria-label="family_member"></i> {d.info.family}</li>
                    <li><i className="fas fa-school" aria-label="affliated_school"></i> {d.info.school}</li>
                </ul>
                </FrontSide>
                <BackSide>
                    <div>
                        <li className="bedroom_img"><img src={d.info.img} alt="bedroom"></img></li>
                        <li>Host Name: {d.info.name}</li>
                        <li>Email: {d.info.email}</li>
                        <li>School: {d.info.school}</li>
                        <li>Family: {d.info.family}</li>
                        <li>Price: {d.info.price}</li>
                        <li>Address: {d.info.street}, {d.info.city}, {d.info.sta}</li>
                        <li>House Description: {d.info.description}</li>
                    </div>
                </BackSide>
            </Flippy>
        </Col>
        
        )
}
export default Post;
