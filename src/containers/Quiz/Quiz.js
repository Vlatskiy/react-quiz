import React, { Component } from 'react'
import classes from './Quiz.module.css'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'

class Quiz extends Component {
    state = {
        activeQuestion: 0,
        quiz: [
            {
                id: 1,
                question: 'Какого цвета небо?',
                answers: [
                    {text:'Ответ 1', id: 1},
                    {text:'Ответ 2', id: 2},
                    {text:'Ответ 3', id: 3},
                    {text:'Ответ 4', id: 4}
                ],
                rightAnswerId: 2
            },
            {
                id: 2,
                question: 'В каком году основали Санкт-Петербург?',
                answers: [
                    {text:'1700', id: 1},
                    {text:'1706', id: 2},
                    {text:'1703', id: 3},
                    {text:'1710', id: 4}
                ],
                rightAnswerId: 3
            },
        ]
    }

    onAnswerClickHandler = (answerId) => {
        console.log('Answer Id:', answerId)

        this.setState({
            activeQuestion: this.state.activeQuestion + 1
        })
    }

    render(){
        return (
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Ответьте на все вопросы</h1>
                    <ActiveQuiz 
                        answers={this.state.quiz[this.state.activeQuestion].answers}
                        question={this.state.quiz[this.state.activeQuestion].question}
                        onAnswerClick={this.onAnswerClickHandler}
                        quizLength={this.state.quiz.length}
                        answerNumber={this.state.activeQuestion + 1}
                    />
                </div>
            </div>
        )
    }
}

export default Quiz