/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
import { dispatch } from '..'
import { actionTypes } from '../const'
import { styleToObject, GetFormat } from './convert'
import { PixelToPoint } from './print-settings'
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
const CalcLeftTop = (uioffset ,mainoffset)=>{
    const { left: uleft, top: utop } =uioffset
    const { left: mleft, top: mtop } = mainoffset
    let left = uleft - mleft
    let top = utop - mtop
    if (top < 0) top = 0
    if (left < 0) left = 0
    return {
        left,top
    }
}
export const SetConfig = (state, _data) => {
    state.UI.$CONTENT
        .droppable({
            accept: '.' + state.UI.DRAGCLASS + '>li',
            classes: {
                'ui-droppable-active': 'ui-state-active',
                'ui-droppable-hover': 'ui-state-hover'
            },
            drop: (event, ui) => {
                const {left,top } =CalcLeftTop(ui.offset,state.UI.$CONTENT.offset())
                dispatch({
                    type: actionTypes.CLONE.ADD_CLONEITEM,
                    payload:{
                        Index:ui.helper[0].dataset.Index,
                        left,top
                    }
                })
            }
        })
        .disableSelection()
        //.css({ margin: '2px' })
    state.UI.$FONTWEIGHT=document.querySelector('select[name="fontweight"]')
    state.UI.$FONTWEIGHT.addEventListener('change',(e)=>{
        const _target =e.currentTarget
        if(_target !=undefined && _target.value!=''){
            state.UI.SELECT.$font.style.fontWeight=_target.value
            $( state.UI.SELECT.$font).trigger('change')
        }
    })
    state.UI.$FONTSTYLE=document.querySelector('select[name="fontstyle"]')
    state.UI.$FONTSTYLE.addEventListener('change',(e)=>{
        const _target =e.currentTarget
        if(_target !=undefined && _target.value!=''){
            state.UI.SELECT.$font.style.fontStyle=_target.value
            $( state.UI.SELECT.$font).trigger('change')
        }
    })
    state.UI.$FONTSIZE= document.querySelector('input[name="fontsize"]')
    state.UI.$FONTSIZE.addEventListener('keyup',(e)=>{
        const _target =e.currentTarget
        if(_target !=undefined && _target.value!=''){
            state.UI.SELECT.$font.style.fontSize=_target.value+'pt'
            $( state.UI.SELECT.$font).trigger('change')
        }
    })
    const $pcopy = document.querySelector('select[name="PageCopy"]')
    const $dcopy = document.querySelector('select[name="CopyDirection"]')
    $pcopy.onchange=(e)=>{
        const $t = e.currentTarget
        if($t.value=='1'){
            $dcopy.parentNode.parentNode.style.display='none'
        }else{
            $dcopy.parentNode.parentNode.style.display='block'
        }
    }
    const $hcopy = document.querySelector('input[name="PageWidth"]')
    const $pscopy = document.querySelector('select[name="PageSize"]')
    const $wcopy = document.querySelector('input[name="PageHeight"]')
    $pscopy.onchange=(e)=>{
        const $t = e.currentTarget
        if($t.value!='Özel'){
            $wcopy.parentNode.parentNode.style.display='none'
            $hcopy.parentNode.parentNode.style.display='none'
        }else{
            $wcopy.parentNode.parentNode.style.display='block'
            $hcopy.parentNode.parentNode.style.display='block'
        }
    }
  
}
export const ChangeFontEvent = (state,payload)=>{
    if(payload.font!=undefined){
        if(payload.status==true)
            state.UI.SELECT.$font.style[payload.font]=payload.style
        else 
            state.UI.SELECT.$font.style[payload.font]=payload.defaultvalue
    }
}
const ChangeFontSize=(state,e)=>{
    state.UI.SELECT.$font=e.currentTarget
    const fsize=state.UI.SELECT.$font.style.fontSize
    if(fsize!=''){
        if(fsize.indexOf('pt')>-1){
            state.UI.$FONTSIZE.value=fsize.replace('pt','')
        }else if(fsize.indexOf('px')){
            state.UI.$FONTSIZE.value=PixelToPoint(fsize.replace('px',''))
        }
    }else{
        state.UI.$FONTSIZE.value='' 
    }
    const $ffsize =$('.p-font-block')
    if(!$ffsize.hasClass('p-active')){
        $ffsize.addClass('p-active')
    }
    state.UI.$FONTSTYLE.value=state.UI.SELECT.$font.style.fontStyle
    state.UI.$FONTWEIGHT.value=state.UI.SELECT.$font.style.fontWeight
}
const DefaultFontSize= (element,style)=>{
    if(style==''){
        element.style.fontSize='10pt'
        element.style.fontStyle='normal'
        element.style.fontWeight='normal'
    }
}
export const SwapTableItem = (state,payload,success)=>{
    const { drop,swap} = payload
    const {item:dropitem}= SearchMenuItem(state.UI.PANEL.Menu,drop.Index)
    let dleft = dropitem.element.style.left
    const {item:swapitem}= SearchMenuItem(state.UI.PANEL.Menu,swap.Index)
    let sleft = swapitem.element.style.left
    dropitem.element.style.left=sleft
    swapitem.element.style.left=dleft
    success(null)
}
const UICloneText = (state,menuitem,payload)=>{
    return new Promise((resolve,reject)=>{
        const {value,element,ToolValue,Index } =menuitem
        const TYPE_TEXT = state.Clone.Type.TEXT
        const _Clone_Index = state.Clone.Index
        _Clone_Index.Index++
        const textclone= document.createElement('div')
        textclone.classList.add(TYPE_TEXT.FIELD)
        textclone.classList.add('efar-field')
        textclone.dataset.cloneId = _Clone_Index.Index
        const textremove = document.createElement('i')
        textremove.className='fa fa-times Remove'
        textremove.onclick=(e)=>{
            const { cloneId } = textclone.dataset
            dispatch({
                type: actionTypes.CLONE.REMOVE_CLONEITEM,
                payload: cloneId
            })
        }
        if(value.ItemType==TYPE_TEXT.CUSTOMTEXT || value.ItemType==TYPE_TEXT.CUSTOMIMAGE){
            textclone.innerHTML= value[TYPE_TEXT.VALUE]
        }
        else{
            if(value.Format!=''){
                textclone.innerText=GetFormat(value[TYPE_TEXT.VALUE],value.Format)
            }else{
                textclone.innerText=value[TYPE_TEXT.VALUE]
            }

        }
        textclone.appendChild(textremove)
        DefaultFontSize(textclone,value.Style)
       
        textclone.onclick=(e)=>ChangeFontSize(state,e)

        const cloneItem = {
            Index: _Clone_Index.Index,
            element: textclone,
            value,
            ToolValue,
            menuindex:Index,
            menuelement:element
        }
        state.Clone.Items.Clons.push(cloneItem)

        const extractCss=()=>{
            const style =styleToObject(cloneItem.element,state.UI.$CONTENT[0])
            // eslint-disable-next-line require-atomic-updates
            cloneItem.value.Style = style
        }
        let { left,top} = payload
        state.UI.$CONTENT.append(cloneItem.element)
        
        if(payload.text!=undefined && payload.text!=null && payload.text.style!=undefined &&  payload.text.style!=''){
            $(cloneItem.element).css(payload.text.style)
        }else{
            if(cloneItem.value.Style!='')
                cloneItem.element.style.cssText=cloneItem.value.Style
        }
        $(cloneItem.element)
            .css({ position: 'absolute' })
            .width(cloneItem.value.Width)
            .height(cloneItem.value.Height)
            .offset({ left: left, top: top })
            .draggable({
                containment: state.UI.DROPID,
                cursorAt: {
                    top: cloneItem.element.offsetY,
                    left: cloneItem.element.offsetX
                },
                cursor: 'move',
                drag: extractCss
            })
            .resizable({
                minHeight: cloneItem.value.Height,
                minWidth:cloneItem.value.Width
            })
            .on('resize', extractCss)
            .css({ border: 'none', left: left + 'px', top: top + 'px' })
            .disableSelection()
        extractCss()
        resolve(cloneItem)
    })
}

const UICloneCreateTable = (state,tablekey,payload)=>{
    return new Promise((resolve)=>{
        const extractCss=(_$div)=>{
            return styleToObject ( _$div[0],state.UI.$CONTENT[0].parentNode)
        }
        const Items = state.Clone.Items
        const { DROPID } = state.UI
        const { Index } = state.Clone

        let _table = null
        for (let i = 0; i < Items.Tables.length; i++) {
            const el = Items.Tables[i]
            if(el.key==tablekey){
                _table=el
            }
        }
        if(_table==null){
            Index.Index++
            const _div = document.createElement('div')
            _div.classList.add('p-main')
            _div.style.position='absolute'
            const $div =$(_div)
            $div.prop('id','table-'+tablekey)
            $div.data('cloneId',Index.Index)
            if(payload.table!= undefined && payload.table!=null && payload.table.style!=undefined && payload.table.style!= ''){
                $div.css(payload.table.style)
            }else{
                $div.offset({ top: 500, left: 0 })
            }
            const button = document.createElement('i')
            button.className='fa fa-times Remove'
            button.onclick=_e=> {
                dispatch({type:actionTypes.CLONE.REMOVE_TABLE,payload:{table:_table}})
            }
            $div.prepend(button)
            $(DROPID).append($div)
            _table={
                Index:Index.Index,
                key:tablekey,
                element:$div,
                children:[],
                childIndex:[],
                Style:'',
                ColumIndex:-1,
                RowIndex:-1
            }
            
            $div
                .resizable()
                .on('resize',  function(_e) {
                    _table.Style=extractCss($div)
                })
                .draggable({
                    containment: DROPID,
                    cursor: 'move',
                    addClasses: false,
                    drag: function(el, ui) {
                        _table.Style=extractCss($div)
                    },
                })
            _table.Style=extractCss($div)
            Items.Tables.push(_table)
        }
        resolve(_table)
    })
}
const UICloneTable = (state,menuitem,payload)=>{
    return new Promise((resolve,_reject)=>{
        const {value,element,ToolValue,Index } =menuitem
        UICloneCreateTable(state,menuitem.value.TableKey,payload).then((_divtable)=>{
            const CalC_Table = ()=>{
                let x_width = 0
                let leng = _divtable.children.length
                if(leng>0){
                    const _el = _divtable.children[0]
                    x_width=_el.element.parentNode.offsetWidth
                }
                if(x_width!=0){
                    _divtable.element.width(x_width+(leng*7))
                }
    
            }
            const TYPE_TABLE = state.Clone.Type.TABLE
            const _Clone_Index = state.Clone.Index
            let _divrow = null
            _Clone_Index.Index++
            if(_divtable.RowIndex==-1){
                _divtable.RowIndex++   
                _divrow= document.createElement('div')
                _divrow.classList.add(state.UI.TABLEROWCLASS)
                _divrow.dataset.RowIndex=_divtable.RowIndex
                _divtable.element[0].appendChild(_divrow)
            }else{
                _divrow= _divtable.element[0].querySelector('div[data--row-index=\''+_divtable.RowIndex+'\']')
            }
            if(payload.row!=undefined && payload.row!=null && payload.row.style!=undefined &&  payload.row.style!=''){
                $(_divrow).css(payload.row.style)
            }
            const _divcolumn = document.createElement('div')
            _divcolumn.classList.add(state.UI.TABLECOLUMNCLASS)
            _divcolumn.classList.add(value[TYPE_TABLE.ITEMKEY])
            _divcolumn.dataset.columnIndex =menuitem.element.dataset.columnIndex
            _divcolumn.dataset.cloneId=_Clone_Index.Index
            if(payload.column!=undefined && payload.column!=null && 
                 payload.column.style!=undefined && payload.column.style!=null){
                $(_divcolumn).css(payload.column.style)
            }else if (value.Style!=undefined && value.Style!=null && value.Style!=''){
                $(_divcolumn).css(value.Style)
            }
            _divcolumn.style.order=menuitem.element.dataset.columnIndex
            _divcolumn.style.transition='order 1s'
            DefaultFontSize(_divcolumn,value.Style)
            $(_divcolumn).width(value.Width).height(value.Height)
            if(value.Format!=''){
                _divcolumn.innerHTML= GetFormat(value[TYPE_TABLE.VALUE])
            }else{
                _divcolumn.innerHTML= value[TYPE_TABLE.VALUE]
            }
            _divcolumn.onclick=(e)=>ChangeFontSize(state,e)
            _divrow.appendChild(_divcolumn)
            const $colres=$(_divcolumn)
            $colres.resizable({
                grid: [1, state.UI.$CONTENT.width()]
            })
            _divcolumn.removeChild(_divcolumn.querySelector('.ui-resizable-s'))
            _divcolumn.removeChild(_divcolumn.querySelector('.ui-resizable-se'))
            const elements = {
                Index: _Clone_Index.Index,
                element: _divcolumn,
                value,
                RowIndex:_divrow.dataset.RowIndex,
                ToolValue,
                menuindex:Index,
                menuelement:element
            }
            $colres.on('resize',  function(_e) {
                let style = styleToObject ( $colres[0],state.UI.$CONTENT[0])
                if(style ==null)
                    return false
                if(style.width!=undefined){
                    CalC_Table()
                }
                elements.value.Style= style
            })
            _divtable.children.push(elements)
            _divtable.childIndex.push(elements.Index)
            CalC_Table()
            resolve(elements)
        })
    })
}
const SearchMenuItem = (Menu,Index)=>{
    const _xitem ={

    }
    for (let ii = 0; ii < Menu.length; ii++) {
        const item = Menu[ii]
        if(item.Index==parseInt(Index)){
            _xitem.item = item
            break
        }
    }
    return _xitem
}
const AddCloneItem= (payload,state,success) =>{
    const _xitem = SearchMenuItem(state.UI.PANEL.Menu,payload.Index)
    
    const { item } = _xitem
    if (item && payload.Index) {
        switch (item.value.ItemType) {
        case state.Clone.Type.TEXT.FIELD:
            UICloneText(state,item,payload).then((_data)=>{
                success(_data)
            })
            break
        case state.Clone.Type.TABLE.FIELD:
            UICloneTable(state,item,payload).then((_data)=>{
                success(_data)
            })
            break
        case state.Clone.Type.TEXT.CUSTOMTEXT:
            UICloneText(state,item,payload).then((_data)=>{
                success(_data)
            })
            break
        case state.Clone.Type.TEXT.CUSTOMIMAGE:
            UICloneText(state,item,payload).then((_data)=>{
                success(_data)
            })
            break
        default:
            break
        }
       
    }
}
const AddCloneItemWithLoad= (payload,state,success) =>{
    const _xitem = {}
    for (let ii = 0; ii < state.UI.PANEL.Menu.length; ii++) {
        const element = state.UI.PANEL.Menu[ii]
        if(element.Index==parseInt(payload.Index)){
            _xitem.item = element
            break
        }
    }
    const { item } = _xitem
    if (item && payload.Index) {
        switch (item.value.ItemType) {
        case state.Clone.Type.TEXT.FIELD:
            UICloneText(state,item,payload).then((_data)=>{
                success(_data)
            })
            break
        case state.Clone.Type.TABLE.FIELD:
            UICloneTable(state,item).then((_data)=>{
                success(_data)
            })
            break
        case state.Clone.Type.TABLE.DEFAULT:
            UICloneTable(state,item,item.value.Style).then((_data)=>{
                success(_data)
            })
            break
        default:
            break
        }
       
    }
}
export default AddCloneItem