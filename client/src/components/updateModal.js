import React from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/map.js'
import '../scss/table.scss';

class UpdateModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      product: this.props.product,
      show: this.props.show,
      validated: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleScoreChange = this.handleScoreChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.show !== prevProps.show) {
      this.setState(() => ({
        show: this.props.show
      }))
    }
  }

  handleScoreChange(event){
    this.setState({ score: event.target.value })
  }

  handleSubmit(event){
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({ validated: true });
      return;
    }
    if(Number(this.element.value) < 0){
      event.preventDefault();
      alert("price cannot be less than $0")
    } else {
      event.preventDefault();
      const product = this.state.product;
      const price = Number(this.element.value);
      fetch('/api/updateQuery', {
        method: 'PUT',
        body: JSON.stringify({
          pid: product.pid,
          price: price,
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())
      .then(msg => {
        alert(msg.msg)
        this.props.reRender(!this.props.renderFlag)
      })
      .catch(err => {
        alert('update error: ', err);
      })
    }
  }
  render(){
    return(
      <Modal
        {... this.props}
        show={this.state.show}
        onHide={this.props.onHide}
        centered
      >

      <Modal.Body>
        <Container fluid>
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={e => this.handleSubmit(e)}>
            <Form.Label>Price ($)</Form.Label>
            <Form.Group>
              <Form.Control
                aria-describedby="updated-price"
                placeholder="example: 3.33"
                name='price'
                type='number'
                step='0.01'
                ref={el => this.element = el}
                required
               />
               <Form.Control.Feedback type="invalid">
                 Please provide a valid price
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="justify-content-center btn-stack">
              <Button variant="light" onClick={this.props.onHide}>Cancel</Button>
              <Button variant="info" type="submit">Confirm</Button>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateModal);
