import React from 'react';
import { Container, Row, Col, Button, Modal} from 'react-bootstrap';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/map.js'
import '../scss/table.scss';

class DeleteModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      product: this.props.product,
      show: this.props.show,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.show !== prevProps.show) {
      this.setState(() => ({
        show: this.props.show
      }))
    }
  }

  handleSubmit(){
    const product = this.state.product;
    fetch('/api/query', {
      method: 'DELETE',
      body: JSON.stringify({
        pid: product.pid,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json())
    .then(msg => {
      alert(msg.msg)
      this.setState(() => ({show: false}), () => this.props.reRender(!this.props.renderFlag))
    })
    .catch(err => {
      console.log('delete error: ', err);
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
        <Row className="justify-content-center">delete this product ?</Row>
        <Row className="justify-content-center btn-stack">
          <Button variant="light" onClick={this.props.onHide}>Cancel</Button>
          <Button variant="info" onClick={this.handleSubmit}>Confirm</Button>
        </Row>
      </Modal.Body>
    </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);
