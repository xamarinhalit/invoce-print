/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
import { dispatch} from '..'
import { actionTypes } from '../const'
import { styleToObject,  CalcLeftTop, NullCheck } from './convert'
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
    const $pcopy = document.querySelector('select[name="PageCopy"]')
    const $dcopy = document.querySelector('select[name="CopyDirection"]')
    $pcopy.onchange=(e)=>{
        if(NullCheck($pcopy)){
            if($pcopy.value=='1'){
                $dcopy.parentNode.parentNode.style.display='none'
            }else{
                $dcopy.parentNode.parentNode.style.display='block'
            }
        }else{
            $dcopy.parentNode.parentNode.style.display='none'
        }
    }
    const $hcopy = document.querySelector('input[name="PageWidth"]')
    const $pscopy = document.querySelector('select[name="PageSize"]')
    const $wcopy = document.querySelector('input[name="PageHeight"]')
    $pscopy.onchange=(e)=>{
        if( NullCheck($pscopy)){
            if( $pscopy.value!='Özel'){
                $wcopy.parentNode.parentNode.style.display='none'
                $hcopy.parentNode.parentNode.style.display='none'
            }else{
                $wcopy.parentNode.parentNode.style.display='block'
                $hcopy.parentNode.parentNode.style.display='block'
            }
        }else{
            $wcopy.parentNode.parentNode.style.display='none'
            $hcopy.parentNode.parentNode.style.display='none'
        }
    }
  
}
export const ChangeFontEvent = (state,payload)=>{
    if(NullCheck(payload.font)){
        if(NullCheck(payload.status)){
            const hasPixel =payload.input.indexOf('px')!=-1
            state.UI.SELECT.$font.style[payload.font]=hasPixel?payload.input:payload.input+'pt'
        }else if(payload.status==true)
            state.UI.SELECT.$font.style[payload.font]=payload.style
        else 
            state.UI.SELECT.$font.style[payload.font]=payload.defaultvalue
    }
}
const ChangeFontSize=(state,e)=>{
    $('.'+state.UI.FIELDCLASS+'.active').removeClass('active')
    state.UI.SELECT.$font=e.currentTarget
    if(NullCheck(state.UI.SELECT.$font))
        state.UI.SELECT.$font.classList.add('active')
    
    dispatch({type:actionTypes.CLONE.FONT_ITEM_SELECT,payload:{element:state.UI.SELECT.$font}})
}
const DefaultFontSize= (element,style)=>{
    if(NullCheck(style)){
        element.style.fontSize='10pt'
        element.style.fontStyle='normal'
        element.style.fontWeight='normal'
    }
}
const UICloneText = (state,menuitem,payload)=>{
    return new Promise((resolve,reject)=>{
        const {value,element,ToolValue,Index } =menuitem
        const TYPE_TEXT = state.Clone.Type.TEXT
        const _Clone_Index = state.Clone.Index
        _Clone_Index.Index++
        const textclone= document.createElement('div')
        textclone.classList.add(value[TYPE_TEXT.ITEMKEY])
        textclone.classList.add(state.UI.FIELDCLASS)
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
        if(NullCheck(value.Format)){
            textclone.innerHTML=value[TYPE_TEXT.VALUE]
            dispatch({type:actionTypes.CLONE.FORMAT_CHANGE,payload:{element:textclone,value:value}})
        }else{
            textclone.innerHTML=value[TYPE_TEXT.VALUE]
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
            const style =styleToObject(cloneItem.element)
            // eslint-disable-next-line require-atomic-updates
            cloneItem.value.Style = style
        }
        const { left,top} = payload
       
        state.UI.$CONTENT.append(cloneItem.element)
        
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
        if(NullCheck(payload.text) && NullCheck(payload.text.style)){
            $(cloneItem.element).css(payload.text.style)
        }else{
            if(NullCheck(cloneItem.value.Style))
                $(cloneItem.element).css(cloneItem.value.Style)
        }
        if(NullCheck(payload.Style)){
            $(cloneItem.element).css(payload.Style)
        }
        extractCss()
        resolve(cloneItem)
    })
}

const UICloneCreateTable = (state,tablekey,payload)=>{
    return new Promise((resolve)=>{
        const extractCss=(_$div)=>{
            return styleToObject ( _$div[0])
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
        if(!NullCheck(_table)){
            Index.Index++
            const _div = document.createElement('div')
            _div.classList.add(state.UI.TABLEMAINCLASS)
            _div.style.position='absolute'
            const $div =$(_div)
            $div.prop('id','table-'+tablekey).data('cloneId',Index.Index)
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
                RowIndex:-1
            }
            // .resizable()
            $div
                .on('resize', function(_e) {
                    _table.Style=extractCss($div)
                })
                .draggable({
                    containment: DROPID,
                    cursor: 'move',
                    addClasses: false,
                    drag: function(_el, _ui) {
                        _table.Style=extractCss($div)
                    },
                })
            if(NullCheck(payload.Table) && NullCheck(payload.Table.Style)){
                $div.css(payload.Table.Style)
            }else{
                $div.css({ top:'500px', left: '20px' })
            }
            _table.Style=extractCss($div)
            Items.Tables.push(_table)
        }
        resolve(_table)
    })
}
const UICloneTable = (state,menuitem,payload)=>{

    return new Promise((resolve,_reject)=>{
        const {value,element,ToolValue,Index } =menuitem
        UICloneCreateTable(state,value.TableKey,payload).then((_divtable)=>{
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
            if(state.UI.PANEL.config.defaultRow==true){
                value.RowIndex='0'
            }
            let rowQuery='div[data--row-index="'+value.RowIndex+'"]'
            let _divrow
            const _divrow0 = _divtable.element[0].querySelector(rowQuery)
            _Clone_Index.Index++
            if(!NullCheck(_divrow0)){
                _divrow= document.createElement('div')
                _divrow.classList.add(state.UI.TABLEROWCLASS)
                _divrow.dataset.RowIndex=value.RowIndex
                _divtable.element[0].appendChild(_divrow)
            }else{
                _divrow=_divrow0
            }
            const _divcolumn = document.createElement('div')
            _divcolumn.classList.add(state.UI.TABLECOLUMNCLASS)
            _divcolumn.classList.add(state.UI.FIELDCLASS)
            _divcolumn.classList.add(value[TYPE_TABLE.ITEMKEY])
            _divcolumn.dataset.cloneId=_Clone_Index.Index
            DefaultFontSize(_divcolumn,value.Style)
            $(_divcolumn).width(value.Width).height(value.Height)
            if(payload.load!=true){
                if(NullCheck(payload.Column) && NullCheck(payload.Column.Style)){
                    $(_divcolumn).css(payload.Column.Style)
                }else if (NullCheck(value.Style)){
                    $(_divcolumn).css(value.Style)
                }
            }else{
                $(_divcolumn).css(payload.Column.Style)
            }
            _divcolumn.dataset.columnIndex =value.ColumnIndex
            _divcolumn.dataset.RowIndex=value.RowIndex
            _divcolumn.style.order=value.ColumnIndex
            _divcolumn.style.transition='order 1s'
            
            if(NullCheck(value.Format)){
                _divcolumn.innerHTML= value[TYPE_TABLE.VALUE]
                dispatch({type:actionTypes.CLONE.FORMAT_CHANGE,payload:{element:_divcolumn,value:value}})
            }else{
                _divcolumn.innerHTML= value[TYPE_TABLE.VALUE]
            }
            _divcolumn.onclick=(e)=>ChangeFontSize(state,e)
            _divrow.appendChild(_divcolumn)

            const elements = {
                Index: _Clone_Index.Index,
                element: _divcolumn,
                value:value,
                RowIndex:value.RowIndex,
                ColumnIndex:value.ColumnIndex,
                ToolValue,
                menuindex:Index,
                menuelement:element
            }
            const $colres=$(_divcolumn)
            $colres.resizable({
                grid: [1, state.UI.$CONTENT.width()]
            })
           
            $colres.on('resize',  function(_e) {
                let style = styleToObject (_divcolumn)
                if(NullCheck(style.width)){
                    CalC_Table()
                    elements.value.Style=styleToObject ( _divcolumn)
                }else{
                    elements.value.Style= style
                }
                _divcolumn.parentNode.parentNode.querySelectorAll('[class="'+state.UI.TABLEROWCLASS+'"]').forEach((celement)=>{
                    if(NullCheck(celement)){
                        const ccolumn=$(celement).find('.'+value.ItemKey).first()
                        ccolumn[0].style.width=elements.value.Style.width
                    }
                })
            })
            _divcolumn.removeChild(_divcolumn.querySelector('.ui-resizable-s'))
            _divcolumn.removeChild(_divcolumn.querySelector('.ui-resizable-se'))
            _divtable.children.push(elements)
            _divtable.childIndex.push(elements.menuindex)
            CalC_Table()
            elements.value.Style=styleToObject (_divcolumn)
            if(state.UI.PANEL.config.defaultRow==true){//DEFAULT
                const ccopySize =parseInt(state.Print.PageProduct)
                const dchildren=_divtable.element[0].querySelectorAll('div[class="'+state.UI.TABLEROWCLASS+'"]')
                for (let i = 1; i < dchildren.length; i++) {
                    const cchildren = dchildren[i]
                    if(NullCheck(cchildren)){
                        _divtable.element[0].removeChild(cchildren)
                    }
                }
                if(ccopySize>1){
                    for (let i =0; i < ccopySize; i++) {
                        const cloneCopy = dchildren[0].cloneNode(true)
                        if(NullCheck(cloneCopy)){
                            cloneCopy.dataset.RowIndex =i
                            $(cloneCopy).find('.'+state.UI.TABLECOLUMNCLASS).removeClass(state.UI.FIELDCLASS)
                            $(cloneCopy).find('.'+state.UI.TABLECOLUMNCLASS+'>.ui-resizable-e').remove()
                            _divtable.element[0].appendChild(cloneCopy)
                        }
                    }
                }
            }
            
            resolve(elements)
            
        })
    })
}
const SearchMenuItem = (Menu,Index)=>{
    const _xitem ={}
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
    let itemValue=null
    if(NullCheck(payload.MenuValue)){
        itemValue =payload.MenuValue
    }
    const _xitem = SearchMenuItem(state.UI.PANEL.Menu,payload.Index)
    const { item } = _xitem
    if (NullCheck(item) && NullCheck(payload.Index)) {
        if(NullCheck(itemValue))
            item.value=itemValue
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
export default AddCloneItem