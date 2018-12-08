import React from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/map.js'
import '../scss/table.scss';

class InsertModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      product: this.props.product,
      show: this.props.show,
      score: 1,
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
    event.preventDefault();
    const product = this.state.product;
    const score = this.state.score;
    const text = this.element.value;
    fetch('/api/query', {
      method: 'PUT',
      body: JSON.stringify({
        pid: product.pid,
        content: text,
        score: score,
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
      alert('insert error: ', err);
    })
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
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Score</Form.Label>
              <Form.Control as="select" required>
                <option value="1">1 ✩</option>
                <option value="2">2 ✩</option>
                <option value="3">3 ✩</option>
                <option value="4">4 ✩</option>
                <option value="5">5 ✩</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
              Please choose your score
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Label>Review</Form.Label>
            <Form.Group>
              <Form.Control
                aria-describedby="review-content"
                as = "textarea"
                rows = "5"
                placeholder="type your review here..."
                name='review'
                type='text'
                ref={el => this.element = el}
                required
               />
               <Form.Control.Feedback type="invalid">
                 Please provide a review
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

export default connect(mapStateToProps, mapDispatchToProps)(InsertModal);
