import React, { Component } from 'react'
import classes from './Auth.module.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import is from 'is_js'
import axios from 'axios'

export default class Auth extends Component {

    state = {
        isFormValid: false,
        formControls: {
            email: {
                value: '',
                type: 'email',
                label: 'Email',
                errorMessage: 'Введите корректный E-mail',
                valid: false,
                touched: false, //Был ли затронут input
                validation: {
                    required: true,
                    email: true
                } // Правила валидации
            },
            password: {
                value: '',
                type: 'password',
                label: 'Пароль',
                errorMessage: 'Введите корректный пароль',
                valid: false,
                touched: false, 
                validation: {
                    required: true,
                    minLength: 6
                }
            }
        }
    }

    loginHandler = async () => {
        const authData = {
            email: this.state.formControls.email.value,
            password: this.state.formControls.password.value,
            returnSecureToken: true
        }
        try {
            const response = await axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyD5Ug9o2ENZz1kuP3JpQqB7WJhGiLIdpz8', authData)
            console.log(response.data)
        } catch(e) {
            console.log(e)
        }
    }

    registerHandler = async () => {
        const authData = {
            email: this.state.formControls.email.value,
            password: this.state.formControls.password.value,
            returnSecureToken: true
        }
        try {
            const response = await axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyD5Ug9o2ENZz1kuP3JpQqB7WJhGiLIdpz8', authData)
            console.log(response.data)
        } catch(e) {
            console.log(e)
        }
    }
    
    submitHandler = (event) => {
        event.preventDefault()
    }

    /*  
        Функция валидации введенного в input значения. 
        Принимает значение input и объект с правилами валидации 
    */
    validateControl = (value, validation) => {
        if (!validation) {
            return true
        }

        let isValid = true

        if (validation.required){
            isValid = value.trim() !== '' && isValid
        }
        if (validation.email){
            isValid = is.email(value) && isValid
        }
        if (validation.minLength){
            isValid = value.length >= validation.minLength && isValid
        }

        return isValid
    }

    /*
        Функция изменения State, вызываемая на изменения в Input
    */
    onChangeHandler = (event,controlName) => {
        const formControls = { ...this.state.formControls } // Копия state для исключения мутации
        const control = { ...formControls[controlName]}

        control.value = event.target.value
        control.touched = true
        control.valid = this.validateControl(control.value, control.validation) // Валидация input

        formControls[controlName] = control // Присвоение локальной копии измененных значений

        let isFormValid = true

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })

        this.setState({
            formControls, isFormValid
        })

    }

    /* 
        Функция создания Input со свойствами из State
    */
    renderInputs = () => {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName] // Объект с контролом 
            return (
                <Input
                    key={controlName + index}
                    type={control.type}
                    value={control.value}
                    valid={control.valid}
                    touched={control.touched}
                    label={control.label}
                    errorMessage={control.errorMessage}
                    shouldValidate={!!control.validation}
                    onChange={event => this.onChangeHandler(event, controlName)}
                />
            )  
        })
    }

    render() {
        return (
            <div className={classes.Auth}>
                <div>
                    <h1>Авторизация</h1>

                    <form onSubmit={this.submitHandler} className={classes.AuthForm}>
                        
                        { this.renderInputs() }

                        <Button 
                            type="success"
                            onClick={this.loginHandler}
                            disabled={!this.state.isFormValid}
                        >
                            Войти
                        </Button>
                        <Button 
                            type="primary"
                            onClick={this.registerHandler}
                            disabled={!this.state.isFormValid}
                        >
                            Зарегистрироваться
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
}