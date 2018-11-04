import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component{
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        console.log("orderHandler", this.props.ingredients)
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.props.price, // in real project, this price should be calculated from backend
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
        axios.post('/orders.json', order)
            .then(response => {
                // console.log(response)
                this.setState({loading: false})
                this.props.history.push('/');
            })
            .catch(err => {
                // console.log(err)
                this.setState({loading: false})
            });
    }

    render(){
        let form = (<form>
            <input className={classes.Input} type="text" name="name" placeholder="Your name" />
            <input className={classes.Input} type="email" name="email" placeholder="Your email" />
            <input className={classes.Input} type="text" name="street" placeholder="Your street" />
            <input className={classes.Input} type="text" name="postal" placeholder="Your postal" />
            <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
        </form>);
        if(this.state.loading){
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;