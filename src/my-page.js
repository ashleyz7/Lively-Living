import React, { Component } from 'react';
import { Button, Form, Input, Row, Container } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import Auth from './Auth';
import Post from './Post';

export class Landing extends Component {
    constructor(props) {
        super(props);
        // use state to keep track of user input
        this.state = {
            user: null,
            posts: {},
            postText: '',
            name: '',
            email: '',
            family: '',
            price: '',
            school: '',
            street: '',
            city: '',
            sta: '',
            zip: '',
            description: '',
            imgs: {},
            img: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    // update state based on user input
    handleChange(event) {
        let field = event.target.name; // which input
        let value = event.target.value; // what value

        let changes = {}; // object to hold changes
        changes[field] = value; // change this field
        this.setState(changes); // update state
    }


    componentDidMount() {
        // Listen to state authentication state change
        firebase.auth().onAuthStateChanged((user) => {
            // If there is a user, set the state of `user`
            if (user) {
                this.setState({
                    user: user
                });
            } else {
                this.setState({
                    user: null
                });
            }
        });
        this.postsRef = firebase.database().ref('posts');
        this.postsRef.on('value', (snapshot) => {
            let posts = snapshot.val();
            this.setState({ posts: posts });
        });

    }
    handleSignOut() {
        // Sign out the user -- this will trigger the onAuthStateChanged() method
        firebase.auth().signOut()
            .catch((err) => {
                this.setState({ errorMessage: err.message });
            });
    }

    render() {
        // use the callBack function to update state in child components
        let callBack = (name, value) => {
            let changes = {}; // object to hold changes
            changes[name] = value; // change this field
            this.setState(changes);
        }
        return (
            <div>
                {/* Only display the auth if there is *not* a user */
                    !this.state.user && <Auth />}
                {/* Only display the twitter content if there *is* a user */
                    this.state.user &&
                    <div>
                        <button className="btn btn-danger mr-2" onClick={() => this.handleSignOut()}>
                            Sign Out
                        </button>
                        <img src="img/form.jpg" alt="fill in the form" />
                        <Container>
                            <MyForm img={this.state.img} callBack={callBack} imgs={this.state.imgs} name={this.state.name} email={this.state.email} family={this.state.family} price={this.state.price} school={this.state.school} street={this.state.street} city={this.state.city} sta={this.state.sta} zip={this.state.zip} description={this.state.description} posts={this.state.posts} handleChange={(evt) => this.handleChange(evt)} />
                            <HistoryPost imgs={this.state.imgs} posts={this.state.posts} />
                        </Container>
                    </div>}
            </div>

        )
    }
}

// input form
class MyForm extends Component {
    componentDidMount() {
        // make a reference to posts in firebase database
        this.postsRef = firebase.database().ref('posts');
        // listen to the changes of posts
        this.postsRef.on('value', (snapshot) => {
            let posts = snapshot.val();
            this.props.callBack("posts", posts);
        });
        // make a reference to images in firebase database
        this.dataRef = firebase.database().ref('imgs');
        // make a reference to posts in firebase storage
        this.storageRef = firebase.storage().ref('imgs');
        // listen to the changes of images
        this.dataRef.on('value', (snapshot) => {
            let imgs = snapshot.val();
            this.props.callBack("imgs", imgs);
        });
    }
    // Event when the input changes
    fileChange(event) {
        let name = event.target.files[0].name;
        let file = event.target.files[0];
        // Create a new child reference (on storage) for the image using its name
        let imgRef = this.storageRef.child(name);
        // `put` the file contents. then()
        // get the URL of snapshot
        // then() push a new element into 
        // the database `img` reference
        // and update state.img's value: the 
        // url of the img
        imgRef.put(file).then((snapshot) => {
            return snapshot.ref.getDownloadURL()
        }).then((snapshot) => {
            let img = {
                url: snapshot
            }
            this.dataRef.push(img);
            this.props.callBack("img", snapshot)
        })
    }
    // Method to push a post to the firebase database
    sendPost() {
        // Construct `post` object to push to firebase
        // Include the user's name, email, imgage of 
        // user's house .etc (user input information)
        let post = {
            name: this.props.name,
            email: this.props.email,
            family: this.props.family,
            price: this.props.price,
            school: this.props.school,
            street: this.props.street,
            city: this.props.city,
            sta: this.props.sta,
            zip: this.props.zip,
            description: this.props.description,
            img: this.props.img,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            userid: firebase.auth().currentUser.uid
        }
        let haveEmpty = false;

        Object.values(post).map((d) => {
            if (d === '') {
                haveEmpty = true;
            }
        })

        if (!haveEmpty) {
            this.postsRef.push(post).catch((d) => console.log("error", d))
            toast.info("Hooray! Input received! We will contact you as soon as possible via your provided email address!", {
                position: toast.POSITION.TOP_CENTER
            });
        } else {
            toast.error("Please fill out all the information", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    render() {
        let handleChange = this.props.handleChange;
        return (
            <div id="newPost">
                <h2 className="historyPropmt">List Your Place </h2>
                <p>(Please fill out everything in order to submit!)</p>
                <Form className="container" onSubmit={this.handleClearForm}>
                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <Input type={'text'}
                                title={'Name'}
                                aria-label={'Name'}
                                name={'name'}
                                value={this.props.name}
                                placeholder={'Please provide a valid name.'}
                                onChange={(e) => handleChange(e)} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-12 mb-3">
                            <Input type={'text'}
                                title={'Email'}
                                aria-label={'Email'}
                                name={'email'}
                                value={this.props.email}
                                placeholder={'Please provide a valid email.'}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="col-12 mb-3">
                            <Input type={'text'}
                                aria-label={'Family'}
                                title={'Family'}
                                name={'family'}
                                value={this.props.family}
                                placeholder={'Please provide a valid family memeber list.'}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="col-md-12 mb-3">
                            <Input type={'text'}
                                aria-label={'Monthly price'}
                                title={'Price'}
                                name={'price'}
                                value={this.props.price}
                                placeholder={'Please provide a valid monthly price.'}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="col-md-12 mb-3">
                            <Input type={'text'}
                                aria-label={'Affiliated School'}
                                title={'School'}
                                name={'school'}
                                value={this.props.school}
                                placeholder={'Please provide a valid affiliated school name.'}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-md-6 mb-3">
                            <Input type={'text'}
                                aria-label={'Street'}
                                title={'Street'}
                                name={'street'}
                                value={this.props.street}
                                placeholder={'Please provide a valid street address'}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <Input type={'text'}
                                aria-label={'City'}
                                title={'City'}
                                name={'city'}
                                value={this.props.city}
                                placeholder={'Please provide a valid city.'}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <Input type={'text'}
                                aria-label={'State'}
                                title={'State'}
                                name={'sta'}
                                value={this.props.sta}
                                placeholder={'Please provide a valid state.'}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <Input type={'text'}
                                aria-label={'Zip Code'}
                                title={'Zipcode'}
                                name={'zip'}
                                value={this.props.zip}
                                placeholder={'Please provide a valid zipcode.'}
                                onChange={(e) => handleChange(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="mb-3">
                            <Input type={'text'}
                                aria-label={'Description'}
                                title={'Description'}
                                name={'description'}
                                value={this.props.description}
                                placeholder={'Additional description for your house.'}
                                onChange={(e) => handleChange(e)} />
                        </div>
                    </div>
                    {/* make a file input button */}
                    {<input type="file" onChange={(e) => this.fileChange(e)} />}
                    {/* make a new post by clicking the button, then user can view the new post below the form
                        and in Forum page */}
                    <Button className="btn btn-outline-info submit_button" type="submit" onClick={(e) => {
                        e.preventDefault();
                        this.sendPost()
                    }}>Submit Form</Button>

                </Form>
            </div>
        )
    }
}

// shows the new post in this section
export class HistoryPost extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let posts = this.props.posts;
        let postsKeys = Object.keys(posts);
        return (
            <div id="history">
                <h2 className="historyPropmt">You will be able to see your post history below.</h2>
                <Container>
                    <Row>
                        {/* For each key in postsKeys, return a <Post /> */}
                        {postsKeys.map((d) => {
                            if (posts[d].userid === firebase.auth().currentUser.uid) {
                                return <Post id={d} key={d} info={posts[d]}></Post>
                            } 
                        })}
                        
                    </Row>
                </Container>
            </div>
        );
    }
}