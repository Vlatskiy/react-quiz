import axios from '../../axios/axios-quiz'
import {
    FETCH_QUIZES_START, 
    FETCH_QUIZES_SUCCESS, 
    FETCH_QUIZES_ERROR, 
    FETCH_QUIZ_SUCCESS,
    QUIZ_SET_STATE,
    FINISH_QUIZ,
    QUIZ_NEXT_QUESTION,
    QUIZ_RETRY
} from './actionTypes'

export function fetchQuizes() {
    return async dispatch => {
        dispatch(fetchQuizesStart())
        try{
            const response = await axios.get('/quizes.json')

            const quizes = []
            Object.keys(response.data).forEach((key, index) => {
                quizes.push({
                    id: key,
                    name: `Тест № ${index + 1}`
                })
            })
            dispatch(fetchQuizesSucces(quizes))
        } catch(e) {
            dispatch(fetchQuizesError(e))
        }
    }
}

export function fetchQuizById(quizId) {
    return async dispatch => {
        dispatch(fetchQuizesStart())

        try {
            const response = await axios.get(`/quizes/${quizId}.json`)
            const quiz = response.data

            dispatch(fetchQuizSuccess(quiz))
        } catch(e) {
            dispatch(fetchQuizesError(e))
        }
    }
}

export function fetchQuizSuccess(quiz) {
    return {
        type: FETCH_QUIZ_SUCCESS,
        quiz
    }
}

export function fetchQuizesStart() {
    return {
        type: FETCH_QUIZES_START
    }
}

export function fetchQuizesSucces(quizes) {
    return {
        type: FETCH_QUIZES_SUCCESS,
        quizes
    }
}

export function fetchQuizesError(e){
    return {
        type: FETCH_QUIZES_ERROR,
        error: e
    }
}

export function quizSetState (answerState, results) {
    return {
        type: QUIZ_SET_STATE,
        answerState,
        results
    }
}

export function finishQuiz(){
    return {
        type: FINISH_QUIZ
    }
}

export function quizNextQuestion(number){
    return {
        type: QUIZ_NEXT_QUESTION,
        number
    }
}

// Action creator. Обработчик клика на вариант ответа в тесте
export function quizAnswerClick(answerId) {
    return (dispatch, getState) => {
        const state = getState().quiz

         //Проверка state для исключения двойного клика
         if (state.answerState) {
            const key = Object.keys(state.answerState)[0]
            if (state.answerState[key] === 'success') {
                return
            }
        }

        const question = state.quiz[state.activeQuestion]
        const results = state.results
        
        //Проверка правильности ответа и переход к след.вопросу
        if (question.rightAnswerId === answerId){
            if(!results[question.id]) {
                results[question.id] = 'success'
            }

            dispatch(quizSetState({[answerId]:'success'}, results))
            
            // Задержка перед переходом к следующему вопросу
            const timeout = window.setTimeout(() => {
                if(isQuizFinished(state)){
                    dispatch(finishQuiz())
                } else {
                    dispatch(quizNextQuestion(state.activeQuestion + 1))
                }
                window.clearTimeout(timeout)
            }, 1000);

        } else {
            results[question.id] = 'error'
            dispatch(quizSetState({[answerId]:'error'}, results))
        }
    }
}
// Функция проверки окончания теста
function isQuizFinished(state) {
    return state.activeQuestion + 1 === state.quiz.length
}

// Action creator. Функция возвращающая State к первоначальным значениям после клика на "Повторить" 
export function retryQuiz() {
    return {
        type: QUIZ_RETRY
    }
}