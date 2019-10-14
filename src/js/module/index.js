import { dispatch,addReducer, StyleParamClick } from '../reducer'
import { actionTypes } from '../reducer/const'
const { subscribe }  = addReducer
const Init = function (payload,fontSelects) {
    for (let i = 0; i < fontSelects.length; i++) {
        StyleParamClick(fontSelects[i])
    }
    dispatch({ type: actionTypes.INIT.FETCHED, payload })
}

export { Init ,actionTypes,dispatch,subscribe}