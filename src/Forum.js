import React, { Component } from 'react';
import { Col, Row, Container, Input, InputGroup, Form } from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/database';
import Flippy, { FrontSide, BackSide } from 'react-flippy';

export class Forum extends Component {
    constructor(props) {
        super(props);
        this.setKeyWord = this.setKeyWord.bind(this);
        this.state = {
            keyWord: '',
            inputValue: '',
            posts: {}
        };
    }

    componentDidMount() {
        this.postsRef = firebase.database().ref('posts');
        this.postsRef.on('value', (snapshot) => {
            let posts = snapshot.val();
            this.setState({ posts: posts });
        });
    }

    setKeyWord(keyword) {
        this.setState({ keyWord: keyword })
    }
    handleChange = (event) => {
        let newValue = event.target.value
        this.setState({ inputValue: newValue })
    }

    render() {
        let currentHouse = [];

        let posts = this.state.posts;
        let postsKeys = Object.keys(posts);
        if (this.state.keyWord === '') {
                postsKeys.map((d) => {
                    currentHouse.push(posts[d]);
                })
        } else {
                postsKeys.map((d) => {
                    if (posts[d].school.toLowerCase() === this.state.keyWord.toLowerCase() || posts[d].city.toLowerCase() === this.state.keyWord.toLowerCase() || posts[d].sta.toLowerCase() === this.state.keyWord.toLowerCase()) {
                        currentHouse.push(posts[d]);
                    }
                })
        }
        return (
            <div>
                <header id="searchSection">
                    <div>
                        <UserInput inputValue={this.state.inputValue} callback={this.setKeyWord} handleChange={(evt) => { this.handleChange(evt) }} />
                    </div>
                </header>

                <main>
                    <section className="bedroom_information">
                        <Container>
                            <House houseList={currentHouse} callback={this.setDetails} />
                        </Container>
                    </section>
                </main>
            </div>

        )
    }
}

class House extends Component {
    render() {
        return (
            <Row>
                {this.props.houseList.map((d) => {
                    return (
                        <Col key={d.email} xs='12' md='6' xl='4'>
                            <Flippy flipOnHover={false} flipOnClick={true} flipDirection="horizontal" ref={(r) => this.flippy = r} style={{ height: '650px' }}>
                                <FrontSide>
                                    <ul className="bedroom_features">
                                        <li><img src={d.img} alt="bedroom"></img></li>
                                        <li><i className="fas fa-dollar-sign" aria-label="price" ></i> {d.price}</li>
                                        <li><i className="fas fa-map-marker-alt" aria-label="location"></i> {d.city}, {d.sta}</li>
                                        <li><i className="fas fa-users" aria-label="family_member"></i> {d.family}</li>
                                        <li><i className="fas fa-school" aria-label="affliated_school"></i> {d.school}</li>

                                    </ul>
                                </FrontSide>
                                <BackSide>
                                    <div>
                                        <li className="bedroom_img"><img src={d.img} alt="bedroom"></img></li>
                                        <li>Host Name: {d.name}</li>
                                        <li>Email: {d.email}</li>
                                        <li>School: {d.school}</li>
                                        <li>Family: {d.family}</li>
                                        <li>Price: {d.price}</li>
                                        <li>Address: {d.street}, {d.city}, {d.sta}</li>
                                        <li>House Description: {d.description}</li>
                                    </div>
                                </BackSide>
                            </Flippy>
                        </Col>
                    )
                })}
            </Row>
        )
    }
}

class UserInput extends Component {
    handleClick = (event) => {
        let inputValue = this.props.inputValue;
        this.props.callback(inputValue)
    }

    render() {
        let handleChange = this.props.handleChange;

        return (
            <div>
                <img src="img/bg2.jpg" alt="firendly family"/>
                <div id="input_group">
                    <h2>Search unique homes and experiences.</h2>
                    <Form className="searchbox" role="search" onSubmit={this.handleClick}>
                        <div>
                            <InputGroup>
                                <Input type="text" placeholder="Search city, state or school" aria-label="enter texts for search" onChange={handleChange} />
                                <button aria-label="search" onClick={this.handleClick}><i className="fa fa-search"></i></button>
                            </InputGroup>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}






