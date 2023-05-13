// Write your code here
import {Component} from 'react'

import './index.css'

export default class SimilarProductItem extends Component {
  render() {
    const {similarProduct, key} = this.props
    const {imageUrl, title, brand, price, rating} = similarProduct
    return (
      <li className="similar-product-container" key={key}>
        <img
          className="similar-product-image"
          alt={`similar product ${title}`}
          src={imageUrl}
        />
        <h1 className="similar-title">{title}</h1>
        <p>by {brand}</p>
        <div className="price-rating-container">
          <p className="similar-price">Rs {price}/- </p>
          <div className="ratingss-container">
            <p>{rating}</p>
            <img
              className="similar-star"
              alt="star"
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            />
          </div>
        </div>
      </li>
    )
  }
}
