require('webpack-jquery-ui')
import { dispatch,subscribe } from '../reducer'
import { actionTypes } from '../reducer/const'

const Init = function (payload) {
    dispatch({ type: actionTypes.INIT.FETCHED, payload })
}
window.$_FATURA={ Init ,actionTypes,dispatch,subscribe}
export { Init ,actionTypes,dispatch,subscribe}