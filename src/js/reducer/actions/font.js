import { NullCheck, styleToObject } from './convert'
import { dispatch } from '..'
import { actionTypes } from '../const'
/* eslint-disable no-undef */
export const StyleParamClick = ({selector,readselector,defaultvalue})=>{
    $('li[data-'+selector+']').click((e)=>{
        $('li[data-'+selector+']').each((i,ele)=>{
            if(ele!=undefined && e.currentTarget!= ele){
                if(ele.classList.contains('active')){
                    ele.classList.remove('active')
                }
            }
        })
        e.currentTarget.classList.toggle('active')
        const elactive = e.currentTarget.classList.contains('active')
        dispatch({type:actionTypes.CLONE.FONT_CHANGE,payload:{ font:selector,style:e.currentTarget.dataset[readselector],status:elactive,defaultvalue}})
    })
}
const GetCloneItem = (state,cloneId)=>{
    const _item ={
        item:null
    }
    for (let i = 0; i < state.Clone.Items.Clons.length; i++) {
        const item = state.Clone.Items.Clons[i]
        if(item!=undefined && item.Index==cloneId){
            _item.item=item
            break
        }
        
    }
    return _item
}
export const ChangeFontEvent = (state,payload)=>{
    if(NullCheck(payload.font)){
        if(!NullCheck(payload.status)){
            state.UI.SELECT.$font.style[payload.font]=payload.input
        }else if(payload.status==true && NullCheck(payload.style))
            state.UI.SELECT.$font.style[payload.font]=payload.style
        else 
            state.UI.SELECT.$font.style[payload.font]=payload.defaultvalue
        if( NullCheck(state.UI.SELECT.$font)){
            const parent =$(state.UI.SELECT.$font).parents('.'+state.UI.TABLEMAINCLASS)
            if(parent.length==0){
                const { cloneId } =  state.UI.SELECT.$font.dataset
                const { item } = GetCloneItem(state,cloneId)
                item.value.Style=styleToObject( state.UI.SELECT.$font)
            }else{
                const className='.'+ state.UI.SELECT.$font.className
                    .replace(' '+state.UI.FIELDCLASS,'').replace(' '+state.UI.TABLECOLUMNCLASS,' ')
                    .replace(' ui-resizable active','').replace(' ','.')
                parent.find(className).each((ii,ix)=>{
                    if(ix!=undefined){
                        const { cloneId } = ix.dataset
                        const { item } = GetCloneItem(state,cloneId)
                        ix.style.cssText=state.UI.SELECT.$font.style.cssText
                        item.value.Style=styleToObject(ix)
                    }
                })
            }
          

        }
    }
}
export const ChangeFontSize=(state,e,value)=>{
    $('.'+state.UI.FIELDCLASS+'.active').removeClass('active')
    state.UI.SELECT.$font=e.currentTarget
    if(NullCheck(state.UI.SELECT.$font))
        state.UI.SELECT.$font.classList.add('active')
    state.UI.FontSelects.forEach((v,i)=>{
        const d = $('li[data-'+v.selector+']')
        const v2=state.UI.SELECT.$font.style[v.selector]
        d.each((ii,ix)=>{
            if(ix!=undefined){
                const $ix=$(ix)
                const v1=$ix.data(v.readselector)
                if(v2==v1){
                    if(!$ix.hasClass('active'))
                        $ix.addClass('active')
                }else{
                    if($ix.hasClass('active'))
                        $ix.removeClass('active')
                }
            }
        })
    })
    dispatch({type:actionTypes.CLONE.FONT_ITEM_SELECT,payload:{element:state.UI.SELECT.$font,value:value}})
}
export const DefaultFontSize= (element,style)=>{
    if(NullCheck(style)){
        element.style.fontSize='10pt'
        element.style.fontStyle='normal'
        element.style.fontWeight='normal'
    }
}