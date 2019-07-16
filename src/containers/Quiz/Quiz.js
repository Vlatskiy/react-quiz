import React, { Component } from 'react'
import classes from './Quiz.module.css'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'
import axios from '../../axios/axios-quiz'
import Loader from '../../components/UI/Loader/Loader'

class Quiz extends Component {
    state = {
        results: {}, // {[id] : success-error}
        isFinished:false,
        activeQuestion: 0,
        answerState: null, // {[id] : success-error}
        quiz: [],
        loading: true
    }

    // Обработчик клика на вариант ответа в тесте
    onAnswerClickHandler = answerId => {
        //Проверка state для исключения двойного клика
        if (this.state.answerState) {
            const key = Object.keys(this.state.answerState)[0]
            if (this.state.answerState[key] === 'success') {
                return
            }
        }

        const question = this.state.quiz[this.state.activeQuestion]
        const results = this.state.results
        
        //Проверка правильности ответа и переход к след.вопросу
        if (question.rightAnswerId === answerId){
            if(!results[question.id]) {
                results[question.id] = 'success'
            }

            this.setState({
                answerState:{[answerId]:'success'},
                results
            })
            
            // Задержка перед переходом к следующему вопросу
            const timeout = window.setTimeout(() => {
                if(this.isQuizFinished()){
                    this.setState({
                        isFinished:true
                    })
                } else {
                    this.setState({
                        activeQuestion: this.state.activeQuestion + 1,
                        answerState: null
                    })
                }
                window.clearTimeout(timeout)
            }, 1000);

        } else {
            results[question.id] = 'error'
            this.setState({
                answerState:{[answerId]:'error'},
                results
            })
        }
    }

    // Функция проверки окончания теста
    isQuizFinished = () => {
        return this.state.activeQuestion + 1 === this.state.quiz.length
    }

    // Функция возвращающая State к первоначальным значениям 
    retryHandler = () => {
        this.setState({
            activeQuestion: 0,
            answerState: null,
            isFinished: false,
            results: {}
        })
    }

    async componentDidMount() {
        console.log(this.props)
        try {
            const response = await axios.get(`/quizes/${this.props.match.params.id}.json`)
            const quiz = response.data

            this.setState({
                quiz,
                loading:false
            })
        } catch(e) {

        }
    }

    render(){
        return (
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Ответьте на все вопросы</h1>

                    { this.state.loading 
                        ? <Loader />
                        :   this.state.isFinished 
                            // Тест окончен -> рендер компонента с итогами
                            ?   <FinishedQuiz
                                    results={this.state.results}
                                    quiz={this.state.quiz}
                                    onRetry={this.retryHandler}
                                />
                            // Тест не окончен -> рендер компонента с вопросами
                            :   <ActiveQuiz 
                                    answers={this.state.quiz[this.state.activeQuestion].answers}
                                    question={this.state.quiz[this.state.activeQuestion].question}
                                    onAnswerClick={this.onAnswerClickHandler}
                                    quizLength={this.state.quiz.length}
                                    answerNumber={this.state.activeQuestion + 1}
                                    state={this.state.answerState}
                                />
                    }
                </div>
            </div>
        )
    }
}

export default Quiz