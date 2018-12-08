import React from 'react';
import { Container, Row, Col, Table, Form } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/map.js';
import ResultTable from './resultTable.js'
import '../scss/table.scss';

class QueryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      query: this.props.query,
      queryType: this.props.queryType,
      showManufacturer: this.props.showManufacturer,
      products: {},
      filter: [],
      categoryList: {},
      ratingFilter: null,
    };

    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.query !== prevProps.query) {
      this.setState(() => ({
        loaded: false,
        query: this.props.query,
        queryType: this.props.queryType,
        showManufacturer: this.props.showManufacturer,
        ratingFilter: null,
      }), () => this.fetchData())
    }

    if (this.props.queryType !== prevProps.queryType) {
      this.setState(() => ({
        loaded: false,
        query: this.props.query,
        queryType: this.props.queryType,
        showManufacturer: this.props.showManufacturer,
        ratingFilter: null,
      }), () => this.fetchData())
    }

    if (this.props.renderFlag !== prevProps.renderFlag) {
      this.setState(() => ({
        loaded: false,
        ratingFilter: null,
      }), () => this.fetchData())
    }

    if (this.props.showManufacturer !== prevProps.showManufacturer) {
      this.setState(() => ({
        showManufacturer: this.props.showManufacturer
      }), () => this.fetchData())
    }

  }

  componentDidMount(){
    this.fetchData();
  }


  fetchData() {
    var categoryList = {}
    if(!this.state.query){
      fetch('/api/products')
        .then(res => res.json())
        .then(products =>{
          this.setState({ products: products, categoryList: categoryList, loaded: true })}
        ).catch(err => {
          console.log('fetch error: ', err);
      })
    } else {
      const self = this;
      fetch('/api/query', {
        method: 'POST',
        body: JSON.stringify({
          queryType: self.state.queryType,
          query: self.state.query,
          filter: [],
          ratingFilter: null,
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())
      .then(products => {
        Object.keys(products).forEach(function(key) {
            const cat = products[key].cat_title;
            if(categoryList[cat]!== undefined && categoryList[cat]){
              categoryList[cat] = categoryList[cat]+1
            } else {
              categoryList[cat] = 1;
            }
        })

        var sorted = Object.keys(categoryList)
          .sort(function(a,b) { return +categoryList[b] - +categoryList[a] })
          .map(k => ({key: k, value: categoryList[k]}));

        this.setState({ products: products, categoryList: sorted, loaded: true })
      }).catch(err => {
        console.log('fetch error: ', err);
      })
    }
  }

  handleCheckbox (event) {
    var filter = this.state.filter;
    const index = filter.indexOf(event.target.value);
    if(index > -1){
      filter.splice(index, 1)
    } else {
      filter.push(event.target.value)
    }

    this.setState(() => ({ filter: filter, loaded: false }));
    this.fetchData();
  }

  handleRadio (event) {
    const value = event.target.value;
    this.setState(() => ({ ratingFilter: value}))
    this.fetchData();
  }

  fetchData() {
    var categoryList = {}
    if(!this.state.query){
      fetch('/api/products')
        .then(res => res.json())
        .then(products =>{
          this.setState({ products: products, categoryList: categoryList, loaded: true })}
        ).catch(err => {
          console.log('fetch error: ', err);
      })
    } else {
      const self = this;
      fetch('/api/query', {
        method: 'POST',
        body: JSON.stringify({
          queryType: self.state.queryType,
          query: self.state.query,
          filter: [],
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())
      .then(products => {
        Object.keys(products).forEach(function(key) {
            const cat = products[key].cat_title;
            if(categoryList[cat]!== undefined && categoryList[cat]){
              categoryList[cat] = categoryList[cat]+1
            } else {
              categoryList[cat] = 1;
            }
        })

        var sorted = Object.keys(categoryList)
          .sort(function(a,b) { return +categoryList[b] - +categoryList[a] })
          .map(k => ({key: k, value: categoryList[k]}));

        this.setState({ products: products, categoryList: sorted, loaded: true })
      }).catch(err => {
        console.log('fetch error: ', err);
      })
    }
  }

  render() {
    const self = this;
    const { loaded, query, queryType, showManufacturer, products, filter, categoryList, ratingFilter } = this.state;
    const ratingListOnly = ['Only 5 ✩ reviews', 'Only > 4 ✩ reviews'];
    const ratingList = ['Average > 4 ✩', 'Average > 3 ✩', 'Average > 2 ✩']
    if(loaded){
      if(false){
        return(
          <Table responsive size="sm" striped hover>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Subcategory</th>
                <th>Rating</th>
              </tr>
            </thead>
          </Table>
        );
      } else {
        return(
          <Row>
            <Col xs={12} md={2}>
              {/*Rating Filter*/}
              <div className="filter-wrap">
                <Form>
                  <Row className="justify-content-center filter-title">
                    Rating
                  </Row>
                  <Row>
                    <Col className="filter-subtitle">
                      Absolute
                    </Col>
                  </Row>
                  <Row>
                      {
                        ratingListOnly.map(function(key) {
                          return <Form.Check
                            custom
                            type="radio"
                            checked = {(self.state.ratingFilter === key? true:false)}
                            id={`custom-radio-${key}`}
                            name = "rating"
                            value={key}
                            onChange={self.handleRadio}
                            label={key}
                          />
                        })
                      }
                  </Row>
                  <Row className="justify-content-center">
                    <div className="custom-divider" />
                  </Row>
                  <Row>
                    <Col className="filter-subtitle">
                      Average
                    </Col>
                  </Row>
                  <Row>
                      {
                        ratingList.map(function(key) {
                          return <Form.Check
                            custom
                            type="radio"
                            checked = {(self.state.ratingFilter === key? true:false)}
                            id={`custom-radio-${key}`}
                            name = "rating"
                            value={key}
                            onChange={self.handleRadio}
                            label={key}
                          />
                        })
                      }
                  </Row>
                </Form>
              </div>

              <div className="spacer" />

              {/*Category Filter*/}
              <div className="filter-wrap">
                <Row className="justify-content-center filter-title">
                  Category
                </Row>
                <Row>
                  <Form>
                    {
                      Object.keys(categoryList).map(function(key) {
                        return <Form.Check
                          custom
                          type="checkbox"
                          checked = {(filter.indexOf(categoryList[key].key) > -1) ? true:false}
                          id={`custom-checkbox-${key}`}
                          value={categoryList[key].key}
                          onChange={self.handleCheckbox}
                          label={`${categoryList[key].key} (${categoryList[key].value})`}
                        />
                      })
                    }
                  </Form>
                </Row>
              </div>
            </Col>
            { Object.keys(products).length ? (
              <ResultTable query={query} queryType={queryType} filter={filter} ratingFilter={ratingFilter} showManufacturer={showManufacturer} />
            ): (
              <Col xs={12} md={10}>
                <div className="spacer" />
                <div className="spacer" />
                <div className="spacer" />
                <Row className="justify-content-center">
                  <div className="not-found">result not found :(</div>
                </Row>
              </Col>
            )}
          </Row>
        )
      }
    } else {
      return(null);
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(QueryTable);
