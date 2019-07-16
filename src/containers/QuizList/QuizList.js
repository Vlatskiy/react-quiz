import React, { Component } from 'react'
import classes from './QuizList.module.css'
import { NavLink } from 'react-router-dom'
import Loader from '../../components/UI/Loader/Loader'
import axios from '../../axios/axios-quiz';

export default class QuizList extends Component {
    state = {
        quizes:[],
        loading: true
    }

    // Метод возвращающий список тестов, полученный из базы данных
    renderQuizes = () => {
        return this.state.quizes.map((quiz)=>{
            return (
                <li key={quiz.id}>
                    <NavLink to={'/quiz/' + quiz.id}>
                        {quiz.name}
                    </NavLink>
                </li>
            )
        })
    }

    /* 
        Запрос к базе данных за списком тестов
        Добавление списка тестов в State
    */
    async componentDidMount() {
        try{
            const response = await axios.get('/quizes.json')

            const quizes = []
            Object.keys(response.data).forEach((key, index) => {
                quizes.push({
                    id: key,
                    name: `Тест № ${index + 1}`
                })
            })

            this.setState({
                quizes,
                loading: false
            })
        } catch(e) {
            console.log(e)
        }
    }

    render() {
        return (
            <div className={classes.QuizList}>
                <div>
                    <h1>Список тестов</h1>

                    { this.state.loading
                        ? <Loader />
                        : <ul>
                            {this.renderQuizes()}
                        </ul>
                    }
                    
                </div>
            </div>
        )
    }
}