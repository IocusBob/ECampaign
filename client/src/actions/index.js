import axios from 'axios';
import { FETCH_USER } from './types'

// Check out the fetchUser() commented out function below to see the EXACT same function without ES2015 syntax
export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user')
    dispatch({type: FETCH_USER, payload: res.data})
}

export const handleToken = (token) => async dispatch => {
    const res = await axios.post('/api/stripe', token)
    dispatch({type: FETCH_USER, payload: res.data})
};

export const submitSurvey = formValues => async dispatch => {
    const res = await axios.post('/apis/surveys', formValues)
    dispatch({type: FETCH_USER, payload: res.data})
}


// export const fetchUser = () => {
//     // We have redux-thunk middleware installed so that will clal the function inside of an action and pass in the dispatch argument
//     return function(dispatch){
//         axios.get('/api/current_user')
//             .then(res => dispatch({type: FETCH_USER, payload: res}))
//     } 
// };

