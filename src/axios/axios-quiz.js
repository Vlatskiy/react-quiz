import axios from 'axios'

export default axios.create({
    baseURL: 'https://react-quiz-4fa41.firebaseio.com/'
})