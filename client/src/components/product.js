import React from 'react';
import { Container, Row, Col, Table, Modal, Button, ButtonGroup } from 'react-bootstrap';
import DeleteModal from './deleteModal.js'
import InsertModal from './insertModal.js'
import UpdateModal from './updateModal.js'
import '../scss/table.scss';

class Product extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      product: this.props.product,
      showManufacturer: this.props.showManufacturer,
      infoModalShow: false,
    }

    this.handleRowClick = this.handleRowClick.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.showManufacturer !== prevProps.showManufacturer) {
      this.setState(() => ({
        showManufacturer: this.props.showManufacturer
      }))
    }

  }

  handleRowClick (event) {
    event.preventDefault();
    this.setState({ infoModalShow: true })
  }

  render(){
    const { product } = this.state;
    let infoModalClose = () => this.setState({ infoModalShow: false })
    return (
        <tr>
          <td onClick={this.handleRowClick}>{product.pid}</td>
          <td className="left-align" onClick={this.handleRowClick}>{product.pname}</td>
          <td onClick={this.handleRowClick}>
            ${product.price}
          </td>
          { this.state.showManufacturer? <td>{product.manufacturer_name}</td>: null}
          <td onClick={this.handleRowClick}>{product.cat_title}</td>
          <td onClick={this.handleRowClick}>{product.subcat_title}</td>
          <td onClick={this.handleRowClick}>{product.average_review_rating}</td>
          <td>
            <InfoModal
              product={product}
              show={this.state.infoModalShow}
              onHide={infoModalClose}
              />
          </td>
        </tr>
    )
  }
}

class InfoModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      product: this.props.product,
      deleteModalShow: false,
      insertModalShow: false,
      updateModalShow: false,
    }

    this.handleDeleteShow = this.handleDeleteShow.bind(this);
    this.handleInsertShow = this.handleInsertShow.bind(this);
    this.handleUpdateShow = this.handleUpdateShow.bind(this);
  }

  handleDeleteShow() {
    this.setState({ deleteModalShow: true });
  }

  handleInsertShow() {
    this.setState({ insertModalShow: true });
  }

  handleUpdateShow() {
    this.setState({ updateModalShow: true });
  }

  render() {
    let deleteModalClose = () => this.setState({ deleteModalShow: false })
    let insertModalClose = () => this.setState({ insertModalShow: false })
    let updateModalClose = () => this.setState({ updateModalShow: false })
    const { product } = this.state
    return(
      <Modal
        size="lg"
        {...this.props}
        aria-labelledby = "info-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Product Info
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row className="justify-content-center product-header-id">{product.pid}</Row>
            <Row className="justify-content-center product-header-name">{product.pname}</Row>
            <Row>
              <Col className="product-title">
                Description
              </Col>
            </Row>
            <Row>
              <Col className="product-text">
                &emsp;{product.description}
              </Col>
            </Row>
            <Row>
              <Col className="product-title">
                Price
              </Col>
            </Row>
            <Row>
              <Col className="product-text">
                &emsp;${product.price}
              </Col>
            </Row>
            <Row>
              <Col className="product-title">
                Manufacturer
              </Col>
            </Row>
            <Row>
              <Col className="product-text">
                &emsp;{product.manufacturer_name}
              </Col>
            </Row>
            <Row>
              <Col className="product-title">
                Category
              </Col>
            </Row>
            <Row>
              <Col className="product-text">
                &emsp;{product.cat_title} -> {product.subcat_title}
              </Col>
            </Row>
            <div className="spacer" />
            <Row className="justify-content-center">
              <ButtonGroup>
                <Button variant="outline-info" onClick={this.handleUpdateShow}>Edit</Button>
                <Button variant="outline-info" onClick={this.handleInsertShow}>Review</Button>
                <Button variant="outline-dark" onClick={this.handleDeleteShow}>Delete</Button>
              </ButtonGroup>
            </Row>
            <div className="spacer" />
            <DeleteModal
              product={product}
              show={this.state.deleteModalShow}
              onHide={deleteModalClose}
            />
            <InsertModal
              product={product}
              show={this.state.insertModalShow}
              onHide={insertModalClose}
            />
          <UpdateModal
              product={product}
              show={this.state.updateModalShow}
              onHide={updateModalClose}
            />
          </Container>
        </Modal.Body>
      </Modal>
    );
  }
}


export default Product;
