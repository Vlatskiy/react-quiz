import React, { Component } from 'react'
import classes from './Quiz.module.css'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'
import Loader from '../../components/UI/Loader/Loader'
import { connect } from 'react-redux'
import {fetchQuizById, quizAnswerClick, retryQuiz} from '../../store/actions/quiz'

class Quiz extends Component {

    componentDidMount() {
       this.props.fetchQuizById(this.props.match.params.id)
    }

    //Обнуление стэйта при закрытии компонента (выход из теста не окончив его)
    componentWillMount() {
        this.props.retryQuiz()
    }

    render(){
        return (
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Ответьте на все вопросы</h1>

                    { this.props.loading || !this.props.quiz
                        ? <Loader />
                        :   this.props.isFinished
                            // Тест окончен -> рендер компонента с итогами
                            ?   <FinishedQuiz
                                    results={this.props.results}
                                    quiz={this.props.quiz}
                                    onRetry={this.props.retryQuiz}
                                />
                            // Тест не окончен -> рендер компонента с вопросами
                            :   <ActiveQuiz 
                                    answers={this.props.quiz[this.props.activeQuestion].answers}
                                    question={this.props.quiz[this.props.activeQuestion].question}
                                    onAnswerClick={this.props.quizAnswerClick}
                                    quizLength={this.props.quiz.length}
                                    answerNumber={this.props.activeQuestion + 1}
                                    state={this.props.answerState}
                                />
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        results: state.quiz.results, // {[id] : success-error}
        isFinished: state.quiz.isFinished,
        activeQuestion: state.quiz.activeQuestion,
        answerState: state.quiz.answerState, // {[id] : success-error}
        quiz: state.quiz.quiz,
        loading: state.quiz.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchQuizById: id => dispatch(fetchQuizById(id)),
        quizAnswerClick: answerId => dispatch(quizAnswerClick(answerId)),
        retryQuiz: () => dispatch(retryQuiz())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quiz)