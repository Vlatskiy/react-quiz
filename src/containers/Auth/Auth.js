import React, { Component } from 'react'
import classes from './Auth.module.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import is from 'is_js'

export default class Auth extends Component {

    state = {
        isFromValid: false,
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

    loginHandler = () => {
        
    }
    registerHandler = () => {

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
    onChangeHandler = (event,controlName) => {
        const formControls = { ...this.state.formControls } // Копия state для исключения мутации
        const control = { ...formControls[controlName]}

        control.value = event.target.value
        control.touched = true
        control.valid = this.validateControl(control.value, control.validation) // Валидация input

        formControls[controlName] = control //Присвоение локальной копии измененных значений

        let isFormValid = true

        Object.keys(formControls).forEach(name => {
            isFormValid = formControls[name].valid && isFormValid
        })

        this.setState({
            formControls, isFormValid
        })

    }
    renderInputs = () => {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]
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
                            disabled={!this.isFromValid}
                        >
                            Войти
                        </Button>
                        <Button 
                            type="primary"
                            onClick={this.registerHandler}
                            disabled={!this.isFromValid}
                        >
                            Зарегистрироваться
                        </Button>
                    </form>
                </div>
            </div>
        )
    }
}