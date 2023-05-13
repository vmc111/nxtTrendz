import {Component} from 'react'
import Cookies from 'js-cookie'

import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import Loader from 'react-loader-spinner'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const statusObject = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default class ProductItemDetails extends Component {
  state = {
    productDetailsObject: '',

    cartValue: 1,

    apiStatus: statusObject.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: statusObject.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken)

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    // console.log(this.props)

    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)
    const url = `https://apis.ccbp.in/products/${id}`

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      // console.log(data)

      const frontEndData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(product => ({
          availability: product.availability,
          brand: product.brand,
          description: product.description,
          id: product.id,
          imageUrl: product.image_url,
          price: product.price,
          rating: product.rating,
          style: product.style,
          title: product.title,
          totalReviews: product.total_reviews,
        })),
      }
      // console.log(frontEndData)

      this.setState({
        productDetailsObject: frontEndData,
        apiStatus: statusObject.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: statusObject.failure,
      })
    }
  }

  onIncrement = () => {
    this.setState(prevValue => ({
      cartValue: prevValue.cartValue + 1,
    }))
  }

  onDecrement = () => {
    const {cartValue} = this.state

    if (cartValue > 1) {
      this.setState(prevValue => ({
        cartValue: prevValue.cartValue - 1,
      }))
    }
  }

  renderProductsView = () => {
    const {productDetailsObject, cartValue, apiStatus} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetailsObject

    console.log(apiStatus)

    return (
      <div className="product-and-similar-products-container">
        <div className="product-container">
          <div>
            <img className="product-image" alt="product" src={imageUrl} />
          </div>
          <div className="product-details-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-cost">Rs {price}/- </p>

            <div className="rating-and-reviews-container">
              <div className="ratings-container">
                <p>{rating}</p>
                <img
                  className="star-image"
                  alt="star"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                />
              </div>

              <div className="reviews-container">
                <p>{totalReviews} Reviews</p>
              </div>
            </div>
            <p className="description">{description}</p>

            <div className="availability-container">
              <p>Available:</p>
              <p className="data">{availability}</p>
            </div>

            <div className="availability-container">
              <p>Brand:</p>
              <p className="data">{brand}</p>
            </div>

            <hr />

            <div className="plus-minus-buttons-container">
              <button
                data-testid="minus"
                onClick={this.onDecrement}
                className="cart-button"
                type="button"
              >
                <BsDashSquare className="plus-button" />
              </button>
              <p className="cart-value">{cartValue}</p>
              <button
                data-testid="plus"
                onClick={this.onIncrement}
                className="cart-button"
                type="button"
              >
                <BsPlusSquare className="plus-button" />
              </button>
            </div>
            <button className="add-to-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>

        <h1 className="similar-main-heading">Similar Products</h1>

        <ul className="similar-productss-container">
          {productDetailsObject.similarProducts.map(similarProduct => (
            <SimilarProductItem
              key={similarProduct.id}
              similarProduct={similarProduct}
            />
          ))}
        </ul>
      </div>
    )
  }

  continueShopping = () => {
    const jwtToken = Cookies.get('jwt_token')
    const {history} = this.props
    if (jwtToken !== undefined) {
      history.replace('/products')
    } else if (jwtToken === undefined) {
      history.replace('/login')
    }
  }

  renderFailureView = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    return (
      <div className="failure-container">
        <img
          className="failure-image"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
        />
        <h1>Product Not Found</h1>
        <button
          onClick={this.continueShopping}
          className="failure-button"
          type="button"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  loader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  switchMethod = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case statusObject.inProgress:
        return this.loader()

      case statusObject.success:
        return this.renderProductsView()

      case statusObject.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {productDetailsObject} = this.state
    console.log(productDetailsObject)
    return (
      <div>
        <Header />
        <div className="bg-container">{this.switchMethod()}</div>
      </div>
    )
  }
}
