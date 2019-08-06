import React, { Component } from 'react'
import classes from './QuizCreator.module.css'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Select from '../../components/UI/Select/Select'
import {createControl, validateInput, validateForm} from '../../form/formFramework'
import { connect } from 'react-redux'
import {createQuizQuestion, finishCreateQuiz} from '../../store/actions/create'

// Функция для создания опций контролов
function createOptionControl (number) {
    return createControl({
        label: `Вариант ${number}`,
        errorMessage: 'Значение не может быть пустым',
        id: number
    }, {required: true})
}

/*  
    При добавлении вопроса необходимо обнулить state
    Функция для обнуления state (возвращение к начальному состоянию)
*/
function createFormControls() {
    return {
      question: createControl({
        label: 'Введите вопрос',
        errorMessage: 'Вопрос не может быть пустым'
      }, {required: true}),
      option1: createOptionControl(1),
      option2: createOptionControl(2),
      option3: createOptionControl(3),
      option4: createOptionControl(4)
    }
  }

class QuizCreator extends Component {
    state= {
        isFormValid: false,
        rightAnswerId: 1,
        formControls: createFormControls()
    }

    sibmitHandler = event => {
        event.preventDefault()
    }

    // Добавление теста в State при клике на кнопку 'Добавить вопрос'
    addQuestionHandler = event => {
        event.preventDefault()
        
        // Копия state для исключения мутации

        const {question, option1, option2, option3, option4} = this.state.formControls
        const questionItem = {
            question: question.value,
            id: this.props.quiz.length +1,
            rightAnswerId: this.state.rightAnswerId,
            answers: [
                {text: option1.value, id: option1.id},
                {text: option2.value, id: option2.id},
                {text: option3.value, id: option3.id},
                {text: option4.value, id: option4.id}
            ]
        }

        this.props.createQuizQuestion(questionItem)

        this.setState({
            isFormValid: false,
            rightAnswerId: 1,
            formControls: createFormControls()
        })
    }

    // Отправка теста в базу данных при клике на кнопку 'Создать вопрос'
    createQuizHandler = event => {
        event.preventDefault()

        this.setState({
            isFormValid: false,
            rightAnswerId: 1,
            formControls: createFormControls()
        })
        this.props.finishCreateQuiz()
    }

    /*
        Обработка события на Input
        Валидация ввёденного значения
    */
    changeHandler = (value, controlName) => {
        const formControls = { ...this.state.formControls } // Копия state для исключения мутации
        const control = { ...formControls[controlName] }

        control.touched = true
        control.value = value
        control.valid = validateInput(control.value, control.validation)

        formControls[controlName] = control

        this.setState({
            formControls,
            isFormValid: validateForm(formControls)
        })
    }

    /*
        Перебор объекта с контролами и конфигурациями.
        Возвращает Input с набором свойств.
    */ 
    renderControls = () => {
        return Object.keys(this.state.formControls).map((controlName, index) => {
            const control = this.state.formControls[controlName]

            return (
                <React.Fragment key={controlName + index}>
                    <Input
                        label={control.label}
                        value={control.value}
                        valid={control.valid}
                        shouldValidate={!!control.validation}
                        touched={control.touched}
                        errorMessage={control.errorMessage}
                        onChange={event => this.changeHandler(event.target.value, controlName)}
                    />
                        { index === 0 ? <hr /> : null }
                </React.Fragment>
            )
        })
    }

    // Выбор правильного вариванта ответа
    selectChangeHandler = event => {
        this.setState({
            rightAnswerId: +event.target.value
        })
    }

    render() {
        return (
            <div className={classes.QuizCreator}>
                <div>
                    <h1>Создание теста</h1>

                    <form onSubmit={this.submitHandler}>

                        { this.renderControls() }

                        <Select
                            label="Выберите правильный ответ"
                            value={this.state.rightAnswerId}
                            onChange={this.selectChangeHandler}
                            options={[
                                {text:'1', value: 1},
                                {text:'2', value: 2},
                                {text:'3', value: 3},
                                {text:'4', value: 4}
                            ]}
                        />

                        <Button
                            type="primary"
                            onClick={this.addQuestionHandler}
                            disabled={!this.state.isFormValid}
                        >
                            Добавить вопрос
                        </Button>

                        <Button
                            type="success"
                            onClick={this.createQuizHandler}
                            disabled={this.props.quiz.length === 0}
                        >
                            Создать тест
                        </Button>

                    </form>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        quiz: state.create.quiz
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createQuizQuestion: item => dispatch(createQuizQuestion(item)),
        finishCreateQuiz: () => dispatch(finishCreateQuiz())

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(QuizCreator)