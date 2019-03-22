import React, { Component } from 'react';
import * as d3 from 'd3';
import { Button, Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption, Card, CardImg, CardText, CardBody, Container, Row, Col } from 'reactstrap';
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import { Forum } from "./Forum";

let items = [{
    src: 'img/student.jpg',
    altText: 'international students',
    caption: 'Nowadays, the amount of international students come to the US for high school has largely increased. Among those international students, significant portion of them have no relatives living in the US, and thus some of them choose to live in the school dorm while most of them may choose to stay with some local family, as in such way they could learn more about the local culture and improve their English.'
},
{
    src: 'img/cozy.jpg',
    altText: 'cozy host family',
    caption: 'We aim to solve homestay problem for both host family and students. Using our forum, host families will be able to post their introduction, and students will be able to scan through those posts to choose a suitable homestay and comment about their previous homestay experience with a specific host. We also encourage students and hosts talk about their expectations through our platform or offline in person, ensuring it will be a perfect match for both sides.'
},
{
    src: 'img/transparency.jpg',
    altText: 'unique feature of transparency',
    caption: 'Transparency is the major quality we value. Therefore, instead of making two different platforms for host family and students, we combine them into one so that both sides could get more knowledge about how our application works.'
}
];


export class Home extends Component {
    
    render() {
        return (
            <div>
                <main>
                    <LargeScreenIntro />
                    <MobileScreenIntro info={items} />
                    <Information />
                </main>

                <footer>
                    <p>
                        Resource <cite><a href="https://www.migrationpolicy.org/article/international-students-united-states"><i>International
                        Students in the United States</i></a> by Jie Zong and Jeanne Batalova</cite>. Contact: zhouy58@uw.edu, manjic@uw.edu, kecheng@uw.edu, changl28@uw.edu
                    </p>
                </footer>
            </div>
        )
    }
}

export class Information extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    };
    
    componentDidMount() {
        d3.csv('data/internationalStudentData.csv').then((d) => {
            this.setState({ data: d });
        });
    };

    render() {
        let firstPieData = {
            labels: this.state.data.map((d) => {return d.states}),
            datasets: [{
                data: this.state.data.map((d) => {return parseInt(d.statePopulation)}),
                backgroundColor: ['#D78B90', '#C7CBC9', '#4CB1C8', '#E8D794', '#91CCB6', '#EB9760', '#264F82', '#CEB39E', '#8E5553', '#7A578E'],
                borderColor: 'rgba(255, 255, 255, 0)',
            }]
        };
        
        let secondPieData = {
            labels: this.state.data.map((d) => {return d.country}),
            datasets: [{
                data: this.state.data.map((d) => {return parseInt(d.countryPopulation)}),
                backgroundColor: ['#91CCB6', '#EB9760', '#264F82', '#CEB39E', '#8E5553', '#A3C3D8', '#D78B90', '#C7CBC9', '#4CB1C8', '#E8D794'],
                borderColor: 'rgba(255, 255, 255, 0)',
            }]
        };
        return (
            <div>
                <section id="international_student_information">
                    <h1>Why Choose Lively Living?</h1>
                    <Container>
                        <h2>International Student Trend</h2>
                        <p>Being the country with the largest number of enrolled international students, the United States
                            hosts nearly 24% of international students worldwide nowadays. Since 1950s, the amount of
                            international students enrolled in the US colleges kept increasing and reach the amount of 1.1
                            million in 2017. Based on NAFSA estimates, international students have brought about $37
                                billion to the US economy and have supported over 450,000 jobs. </p>
                    </Container>

                    <Container>
                        <Row>
                            <Col md="6">
                                <div className="card-body">
                                    <h2>States with Most Amount of International Students</h2>
                                    <Chart data={firstPieData} />
                                </div>
                            </Col>
                            <Col md="6">
                                <div className="card-body">
                                    <h2>2016-2017 Top International Students Origin Countries</h2>
                                    <Chart data={secondPieData} />
                                </div>
                            </Col>
                        </Row>
                    </Container>

                    <div className="quick_forum_access">
                        <Button outline color="info" block>
                            <Router>
                                <div>
                                    <Link to='/Forum'>Enter Lively Living Forum to See More</Link>
                                    <Route path="/Forum" component={Forum}></Route>
                                </div>
                            </Router>
                        </Button>{' '}
                    </div>
                </section>
            </div>
        )
    }
}

class LargeScreenIntro extends Component {
    constructor(props) {
        super(props);
        this.state = { activeIndex: 0 };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
    }

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        let nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        let nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    render() {
        let { activeIndex } = this.state;
        let slides = items.map((item) => {
            return (
                <CarouselItem onExiting={this.onExiting} onExited={this.onExited} key={item.src}>
                    <img src={item.src} alt={item.altText} />
                    <CarouselCaption captionText={item.caption} />
                </CarouselItem>);
        });

        return (
            <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
                <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                {slides}
                <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
            </Carousel>
        );
    }
}

class MobileScreenIntro extends Component {
    render() {
        let card = this.props.info.map((d) => {
            return (<Card key={d.altText}>
                <CardImg top width="100%" src={d.src} alt={d.altText} />
                <CardBody>
                    <CardText>{d.caption}</CardText>
                </CardBody>
            </Card>
            )
        })

        return (
            <Container className='mobile_screen'>
                {card}
            </Container>
        )
    }
}

class Chart extends Component {
    render() {
        return (
            <Pie data={this.props.data} width={200} height={200} />
        )
    }
}




