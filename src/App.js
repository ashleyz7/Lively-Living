import React, { Component } from 'react';
import { HashRouter as Router, Route } from "react-router-dom";
import { Nav, Navbar, NavItem, NavbarToggler, Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import { NavHashLink  } from 'react-router-hash-link';
import 'firebase/auth';
import './App.css';
import { Home} from "./Home"
import { Forum } from "./Forum"
import { Landing } from "./my-page"

export class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
          <Router>
            <React.Fragment>
              <Navbar className="navbar-expand-lg navbar-light">
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="mr-auto" navbar>
                    <NavItem>
                      <NavHashLink id="website_name" className="nav-text normal-link" to="/" replace>Lively Living</NavHashLink > 
                    </NavItem>
                      <NavItem>
                        <NavHashLink className="nav-text normal-link" to="/" replace>Home</NavHashLink > 
                      </NavItem>
                      <NavItem>
                        <NavHashLink className="nav-text normal-link" to="/Forum" replace>Forum</NavHashLink > 
                      </NavItem>
                      <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>My Page</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>
                            <NavHashLink className="nav-text dropdown-link" smooth to="/Landing#newPost" replace>Become a Host</NavHashLink >
                          </DropdownItem>
                          <DropdownItem>
                            <NavHashLink className="nav-text dropdown-link" smooth to="/Landing#history" replace>History Posts</NavHashLink >
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                      <NavItem>
                        <NavHashLink className="nav-text normal-link" smooth to="/#international_student_information" replace>Information</NavHashLink> 
                      </NavItem>
                  </Nav>
                </Collapse>
            </Navbar> 
              <Route path="/Forum" component={Forum}></Route>
              <Route path="/Landing" component={Landing}></Route>
              <Route exact path="/" component={Home}></Route>
            </React.Fragment>
          </Router>
        </div>
    );
  }
}

export default App;
