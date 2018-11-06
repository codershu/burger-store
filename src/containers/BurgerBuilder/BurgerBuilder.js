import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actionType from '../../store/actions';

class BurgerBuilder extends Component{
    // constructor(props){
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        // ingredients: null,
        // totalPrice: 4, //basic price
        // purchasable: false,
        checkingout: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        console.log(this.props)
        // axios.get('https://burger-store-f0b80.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data})
        //     })
        //     .catch(err => {
        //         console.log(err)
        //         this.setState({error: true})
        //     })
    }

    checkoutHandler = () => {
        this.setState({checkingout: true})
    }

    cancelCheckoutHandler = () => {
        this.setState({checkingout: false})
    }

    continueCheckoutHandler = () => {
        // alert('Continue here!')
        // const queryParams = [];
        // for(let i in this.state.ingredients){
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');

        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: queryString
        // });

        this.props.history.push('/checkout');
    }

    updatePurchaseState(ingredients){
        const totalNum = Object.keys(ingredients).map(key => {
            return ingredients[key]
        }).reduce((sum, el) => {
            return sum + el
        }, 0)

        return totalNum > 0
    }

    // add ingredient and update the price and count of ingredients
    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
        
    //     this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
    //     this.updatePurchaseState(updatedIngredients)
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount === 0) return
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredients[type] = updatedCount;
    //     const priceReduced = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceReduced;

    //     this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
    //     this.updatePurchaseState(updatedIngredients)
    // }

    render(){
        const disableInfo = {
            ...this.props.ings
        }

        for(let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients cannot be loaded!</p> : <Spinner />;

        if(this.props.ings){
            orderSummary = <OrderSummary 
                            ingredients={this.props.ings} 
                            totalPrice={this.props.price}
                            cancelCheckout={this.cancelCheckoutHandler}
                            continueCheckout={this.continueCheckoutHandler}/>
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded} 
                        ingredientRemoved={this.props.onIngredientRemoved} 
                        disabled={disableInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        price={this.props.price}
                        checkout={this.checkoutHandler}/>
                </Aux>
            )
        }
        if(this.state.loading){
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.checkingout} modalClosed={this.cancelCheckoutHandler}>
                    {orderSummary}
                </Modal>
                {burger}

            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionType.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionType.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));