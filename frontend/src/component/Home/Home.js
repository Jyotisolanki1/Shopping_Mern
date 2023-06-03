import React, { Fragment ,useEffect} from "react";
import {CgMouse} from 'react-icons/cg';
import Product from './Product.js';
import './Home.css';
import MetaData from "../layout/MetaData.js";
import { getProduct } from "../../actions/productAction.js";
import {useSelector,useDispatch} from 'react-redux';
import Loader from "../layout/Loader/Loader.js";


const Home = () =>{
  const dispatch = useDispatch();
  const {loading,products} = useSelector(
    (state)  => state.products,
  )
  useEffect(()=>{
    dispatch(getProduct());
  },[dispatch]);
 return (
  <Fragment>
     {loading ? (<Loader />):(
       <Fragment>
       <MetaData title="Ecommerrce"/>
        <div className="banner">
           <p>Welcome to ecommerce</p>
           <h1>FIND AMAZINF PRODUCTS BELOW</h1>
           <a href="#container">
               <button>Scroll<CgMouse /></button>
           </a>
        </div>
        <h2 className="homeHeading">Feature product</h2>
        <div className="container" id="container">
       
         {products && products.map((product) =>
           <Product product={product} />
       )}
                 
        </div>
      </Fragment>
     )}
  </Fragment>
 );
}
export default Home;