import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.8
}

class BurgerBuilder extends Component{
    // constructor(props){
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4, //basic price
        purchasable: false,
        checkingout: false,
        loading: false
    }

    checkoutHandler = () => {
        this.setState({checkingout: true})
    }

    cancelCheckoutHandler = () => {
        this.setState({checkingout: false})
    }

    continueCheckoutHandler = () => {
        // alert('Continue here!')
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice, // in real project, this price should be calculated from backend
            customer: {
                name: 'Shu',
                address: {
                    street: '12639 Coit Road',
                    zip: '75251',
                    country: 'US'
                },
                email: 'codershuhan@gmail.com'
            },
            deliveryMethod: 'express'
        }
        axios.post('/orders', order)
            .then(response => {
                // console.log(response)
                this.setState({loading: false, checkingout: false})
            })
            .catch(err => {
                // console.log(err)
                this.setState({loading: false, checkingout: false})
            });
    }

    updatePurchaseState(ingredients){
        const totalNum = Object.keys(ingredients).map(key => {
            return ingredients[key]
        }).reduce((sum, el) => {
            return sum + el
        }, 0)

        this.setState({purchasable: totalNum > 0})
    }

    // add ingredient and update the price and count of ingredients
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
        this.updatePurchaseState(updatedIngredients)
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount === 0) return
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceReduced = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceReduced;

        this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
        this.updatePurchaseState(updatedIngredients)
    }

    render(){
        const disableInfo = {
            ...this.state.ingredients
        }

        for(let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0
        }

        let orderSummary = <OrderSummary 
                            ingredients={this.state.ingredients} 
                            totalPrice={this.state.totalPrice}
                            cancelCheckout={this.cancelCheckoutHandler}
                            continueCheckout={this.continueCheckoutHandler}/>
        if(this.state.loading){
            orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.checkingout} modalClosed={this.cancelCheckoutHandler}>
                    {orderSummary}
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler} 
                    disabled={disableInfo}
                    purchasable={this.state.purchasable}
                    price={this.state.totalPrice}
                    checkout={this.checkoutHandler}/>

            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);