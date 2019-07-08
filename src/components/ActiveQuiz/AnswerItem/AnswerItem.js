import React from 'react'
import classes from './AnswerItem.module.css'

const AnswersItem = props => {
    //Стилизация тэга li при правильном/неправильном ответе
    const cls = [classes.AnswerItem]
    
    if (props.state) {
        cls.push(classes[props.state])
    }

    return (
        <li 
            className={cls.join(' ')}
            onClick={()=> props.onAnswerClick(props.answer.id)}
        >
            { props.answer.text }
        </li>
    )
}

export default AnswersItem