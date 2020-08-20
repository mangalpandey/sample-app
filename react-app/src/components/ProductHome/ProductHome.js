import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  customerData,
  addProduct,
  getAllProducts,
} from "../../reducers/reducer";
import "./ProductHome.css";

function ProductHome(props) {
  const [state, setState] = useState({
    name: "",
    price: "",
    shopName: "",
    status: "",
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const handleSearchChange = (e) => {
    const { id, value } = e.target;
    props.getAllProducts(value);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    props.addProduct(state.name, state.price, state.shopName, state.status);
  };

  useEffect(() => {
    if (props.customer) {
      console.log("Home screen is visible");
      props.getAllProducts("");
    } else if (!props.customer) {
      props.customerData();
    }
    console.log("props.isProductAdded", props.isProductAdded);
    if (props.isProductAdded) {
      setState({
        name: "",
        price: "",
        shopName: "",
        status: "",
      });
    }
  }, [props.customer, props.isProductAdded, props.isProductAdding]);

  function redirectToLogin() {
    props.history.push("/login");
  }
  function getFormatedDate(oldDate) {
    var date = new Date(oldDate);
    var newDate =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    return newDate;
  }
  return (
    <div>
      <div className="row parent">
        <div className="card child col-sm-8">
          <div className="search">
            <input
              type="text"
              id="search"
              aria-describedby="emailHelp"
              placeholder="Search"
              onChange={handleSearchChange}
            />
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {props.productsData &&
                props.productsData.products &&
                props.productsData.products.map((rowData, index) => (
                  <tr key={rowData._id}>
                    <td>{rowData.name}</td>
                    <td>{rowData.status}</td>
                    <td>{getFormatedDate(rowData.createdAt)}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
        <div className="card child col-sm-4">
          <div className="card  login-card card-margin">
            <form>
              <div className="form-group text-left">
                <label>NAME</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  aria-describedby="emailHelp"
                  placeholder="Enter Name"
                  value={state.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group text-left">
                <label>PRICE</label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  aria-describedby="emailHelp"
                  placeholder="Enter Price"
                  value={state.price}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group text-left">
                <label>SHOP NAME:</label>
                <input
                  type="text"
                  className="form-control"
                  id="shopName"
                  aria-describedby="emailHelp"
                  placeholder="Enter Shop Name"
                  value={state.shopName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group text-left">
                <label>STATUS:</label>
                <textarea
                  rows="4"
                  cols="50"
                  type="richtext"
                  className="form-control"
                  id="status"
                  placeholder="Status"
                  value={state.status}
                  onChange={handleChange}
                />
              </div>
              <div className="form-check"></div>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmitClick}
                disabled={props.isProductAdding}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    customer: state.customer,
    isProductAdding: state.isProductAdding,
    isProductAdded: state.isProductAdded,
    productsData: state.productsData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllProducts: (searchText) => dispatch(getAllProducts(searchText)),
    customerData: () => dispatch(customerData()),
    addProduct: (name, price, shopName, status) =>
      dispatch(addProduct(name, price, shopName, status)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductHome)
);
