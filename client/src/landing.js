import React from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Dropdown, DropdownButton, FormControl } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import QueryTable from './components/queryTable.js';
import './scss/landing.scss';

library.add(faCheck);

const QUERY_TYPE = ['Product Name', 'Product ID', 'Manufacturer Name'];
class Landing extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      queryType: 'Product Name',
      showManufacturer: false,
      query: '',
      searchkey: '',
      searched: false,
    }

    this.handleSelect = this.handleSelect.bind(this);
    this.handleOptions = this.handleOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleSelect (eventKey, event) {
    if(eventKey === 'Manufacturer'){
      this.setState({showManufacturer: true, queryType: eventKey});
    } else {
      this.setState({queryType: eventKey});
    }
  }

  handleOptions (eventKey, event) {
    this.setState({ showManufacturer: !this.state.showManufacturer });
  }

  handleChange (event) {
    this.setState({ [event.target.name]: event.target.value})
  }

  handleSubmit (event) {
    event.preventDefault();
    if(this.element.value === ''){
      alert("search key cannot be empty!")
    } else {
      this.setState({ query: this.element.value, searched: true });
    }
  }

  handleKeyPress(target) {
    if(target.charCode===13){
      this.handleSubmit(target);
    }
  }

  render(){
    return(
      <Container fluid className="page-wrapper">
        <Row>
          <Col className="title-wrap">
            <div className="custom-title-orange">Amazon</div>
            <div className="custom-title-black">&nbsp;Product&nbsp;Database</div>
          </Col>
        </Row>

        {/*Searchbar Component*/}
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <InputGroup className="mb-3">

              <DropdownButton
                as={InputGroup.Prepend}
                variant="outline-secondary"
                title={this.state.queryType}
                id="query-type"
              >
                <Dropdown.Header>search by</Dropdown.Header>
                <Dropdown.Item eventKey='Product Name' onSelect={this.handleSelect}>Product Name</Dropdown.Item>
                <Dropdown.Item eventKey='Product ID' onSelect={this.handleSelect}>Product ID</Dropdown.Item>
                <Dropdown.Item eventKey='Manufacturer' onSelect={this.handleSelect}>Manufacturer</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>options</Dropdown.Header>
                <Dropdown.Item eventKey='Show Manufacturer' onSelect={this.handleOptions}>
                  { this.state.showManufacturer? <FontAwesomeIcon icon="check" style={{marginRight: "5px"}}/> : ''}
                  Show Manufacturer
                </Dropdown.Item>
              </DropdownButton>
              <FormControl
                aria-describedby="search-keyword"
                placeholder="type a keyword here..."
                name='searchkey'
                ref={el => this.element = el}
                onKeyPress={this.handleKeyPress}
                 />
              <InputGroup.Append>
                <Button variant="outline-secondary" type="submit" onClick={this.handleSubmit}>Search</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>

        <div className="spacer" />

        {/*Result Component*/}
        { this.state.searched ? (
          <Container fluid>
            <Row className="justify-content-center">
              <Col>
                <QueryTable query={this.state.query}
                  queryType={this.state.queryType}
                  showManufacturer={this.state.showManufacturer}
                  searched={this.state.searched}
                  />
              </Col>
            </Row>
          </Container>
        ) : (
          <Container>
            <div className="spacer" />
            <div className="spacer" />
            <div className="spacer" />
            <Row className="justify-content-center">
              <div className="get-started">search to get started</div>
            </Row>
          </Container>
        )}
      </Container>
  );
  }
}

export default Landing;
