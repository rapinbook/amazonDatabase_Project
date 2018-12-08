import React from 'react';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import Product from './product.js';
import '../scss/table.scss';


class ResultTable extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      filter: this.props.filter,
      products: {},
      query: this.props.query,
      queryType: this.props.queryType,
      ratingFilter: this.props.ratingFilter,
      showManufacturer: this.props.showManufacturer,
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.filter !== prevProps.filter) {
      this.setState(() => ({
        filter: this.props.filter,
        loaded: false,
      }), () => this.fetchData())
    }

    if (this.props.ratingFilter !== prevProps.ratingFilter) {
      this.setState(() => ({
        ratingFilter: this.props.ratingFilter,
        loaded: false,
      }), () => this.fetchData())
    }

    if (this.props.showManufacturer !== prevProps.showManufacturer) {
      this.setState(() => ({
        showManufacturer: this.props.showManufacturer,
      }), () => this.fetchData())
    }
  }

    componentDidMount(){
      this.fetchData();
    }

    fetchData() {
      const self = this;
      fetch('/api/query', {
        method: 'POST',
        body: JSON.stringify({
          queryType: self.state.queryType,
          query: self.state.query,
          filter: self.state.filter,
          ratingFilter: self.state.ratingFilter,
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())
      .then(products => {
        this.setState({ products: products, loaded: true })
      }).catch(err => {
        console.log('fetch error: ', err);
      })
    }


  render(){
    if(this.state.loaded){
      return(
        <Col xs={12} md={10}>
          <Table responsive size="sm" striped hover>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                {this.state.showManufacturer ? <th>Manufacturer</th>:null}
                <th>Category</th>
                <th>Subcategory</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              { this.state.products.map(product =>
                <Product product={product} showManufacturer={this.state.showManufacturer}/>
              )}
            </tbody>
          </Table>
        </Col>
      )
    } else {
      return(null);
    }
  }
}

export default ResultTable;
