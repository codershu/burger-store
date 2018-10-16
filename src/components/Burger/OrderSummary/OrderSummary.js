import React from 'react';
import Aux from '../../../hoc/Aux';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients).map(key => {
        return <li key={key}><span style={{textTransform: 'capitalize'}}>{key}</span>: {props.ingredients[key]}</li>;
    })

    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: $ {props.totalPrice.toFixed(2)}</strong></p>
            <p>Continue to checkout?</p>
            <Button clicked={props.cancelCheckout} btnType="Danger">Cancel</Button>
            <Button clicked={props.continueCheckout} btnType="Success">Continue</Button>
        </Aux>
    )
}

export default orderSummary;