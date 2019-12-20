/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
import { dispatch} from '..'
import { actionTypes } from '../const'
import { styleToObject,  CalcLeftTop, NullCheck, CalC_Table } from './convert'
import {  ChangeFontSize, DefaultFontSize } from './font'

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

const UICloneText = (state,menuitem,payload)=>{
    return new Promise((resolve,reject)=>{
        const {value,ToolValue,id:Index } =menuitem
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
        
        textclone.onclick=(e)=>ChangeFontSize(state,e,value)
      
        const cloneItem = {
            Index: _Clone_Index.Index,
            element: textclone,
            value:{...value},
            ToolValue,
            id:Index,
        }
        if(value[TYPE_TEXT.ITEMTYPE]==TYPE_TEXT.CUSTOMTEXT){
            textclone.contentEditable=true
            textclone.addEventListener('input',()=>{
                if(textclone.innerText.length==0){
                    const { cloneId } = textclone.dataset
                    dispatch({
                        type: actionTypes.CLONE.REMOVE_CLONEITEM,
                        payload: cloneId
                    })
                }else{
                    cloneItem.value[TYPE_TEXT.VALUE]=textclone.innerText
                }
            })
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
const UICloneCreateTable = (state,menuitem,payload,Items)=>{
    return new Promise((resolve)=>{
        const extractCss=(_$div)=>{
            return styleToObject ( _$div[0])
        }
        const { ToolValue,value,id}=menuitem
        const { DROPID } = state.UI
        const { Index } = state.Clone
        // let $_table = state.UI.$CONTENT.find('#table-'+value.TableKey)
        let $_table = state.UI.$CONTENT.find('.table-'+value.TableKey)
        if($_table.length==0){
            const {clientHeight, clientWidth } = state.UI.$CONTENT[0]
            Index.Index++
            const _div = document.createElement('div')
            _div.classList.add(state.UI.TABLEMAINCLASS)
            _div.style.position='absolute'
            const $div =$(_div)
            // $div.prop('id','table-'+value.TableKey).data('cloneId',Index.Index)
            $div.addClass('table-'+value.TableKey)
            $div.data('cloneId',Index.Index)
            const button = document.createElement('i')
            button.className='fa fa-times Remove'
            button.style.right='-15px'
            $div.prepend(button)
            button.onclick=_e=> {
                dispatch({type:actionTypes.CLONE.REMOVE_TABLE,payload:{table:{Index:$div.data('cloneId')}}})
            }
            $(DROPID).append($div)
            const _table={
                ToolValue,
                Index:$div.data('cloneId'),
                element:_div,
                value:{
                    TableKey:value.TableKey,
                    ItemType:state.Clone.Type.TABLE.DEFAULT,
                    Style:null
                },
            }
            $div
                .on('resize', function(_e) {
                    _table.value.Style=extractCss($div)
                })
                .draggable({
                    containment: DROPID,
                    cursor: 'move',
                    addClasses: false,
                    drag: function(_el, _ui) {
                        _table.value.Style=extractCss($div)
                    },
                })
            if(value.ItemType==state.Clone.Type.TABLE.DEFAULT){
                $div.css(value.Style)
            }else if(NullCheck(payload.Table) && NullCheck(payload.Table.Style)){
                $div.css(payload.Table.Style)
            }else{
                if(clientHeight!=undefined&& clientWidth!=undefined){
                    if(clientHeight>=clientWidth){
                        $div.css({ top:parseInt(clientHeight/2) + 'px', left: '20px' })    
                    }else{
                        $div.css({ top:'0px', left:parseInt(clientWidth/2)+'px'  })
                    }
                }else{
                    $div.css({ top:'500px', left: '20px' })
                }
            }
           
            _table.value.Style=extractCss($div)
            Items.Clons.push(_table)
            if(value.ItemType==state.Clone.Type.TABLE.DEFAULT)
                resolve(_table)
            else
                resolve($div)
        }else{
            if(value.ItemType==state.Clone.Type.TABLE.DEFAULT)
                resolve(_table)
            else
                resolve($_table)
        }
    })
}

const UICloneTable = (state,menuitem,payload)=>{
    return new Promise((resolve,_reject)=>{
        const {value,ToolValue,id } =menuitem
        UICloneCreateTable(state,menuitem,payload,state.Clone.Items).then((_divtable)=>{
            const TYPE_TABLE = state.Clone.Type.TABLE
            const _Clone_Index = state.Clone.Index
            if(state.Print.DefaultRow==true || state.Print.DefaultRow=='true'){
                value.RowIndex=0
            }
            let rowQuery='div[data--row-index="'+value.RowIndex+'"]'
            let _divrow
            const _divrow0 = _divtable[0].querySelector(rowQuery)
            _Clone_Index.Index++
            if(!NullCheck(_divrow0)){
                _divrow= document.createElement('div')
                _divrow.classList.add(state.UI.TABLEROWCLASS)
                _divrow.dataset.RowIndex=value.RowIndex
                _divtable[0].appendChild(_divrow)
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
                $(_divcolumn).css(value.Style)
            }
            _divcolumn.dataset.columnIndex =value.ColumnIndex
            _divcolumn.dataset.rowIndex=value.RowIndex
            _divcolumn.style.order=value.ColumnIndex
            _divcolumn.style.transition='order 1s'
            
            if(NullCheck(value.Format)){
                _divcolumn.innerHTML= value[TYPE_TABLE.VALUE]
                dispatch({type:actionTypes.CLONE.FORMAT_CHANGE,payload:{element:_divcolumn,value:value}})
            }else{
                _divcolumn.innerHTML= value[TYPE_TABLE.VALUE]
            }
            _divcolumn.onclick=(e)=>ChangeFontSize(state,e,value)
            _divrow.appendChild(_divcolumn)

            const elements = {
                Index: _Clone_Index.Index,
                id,
                ToolValue,
                value,
                element: _divcolumn
            }
            const $colres=$(_divcolumn)
            $colres.resizable({
                grid: [1, state.UI.$CONTENT.width()]
            })
           
            $colres.on('resize',  function(_e) {
                let style = styleToObject (_divcolumn)
                if(NullCheck(style.width)){
                    CalC_Table(_divtable,state)
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
            CalC_Table(_divtable,state)
            elements.value.Style=styleToObject (_divcolumn)
            if(state.Print.DefaultRow==true || state.Print.DefaultRow=='true'){//DEFAULT
                const ccopySize =parseInt(state.Print.PageProduct)
                const dchildren=_divtable[0].querySelectorAll('div[class="'+state.UI.TABLEROWCLASS+'"]')
                for (let i = 1; i < dchildren.length; i++) {
                    const cchildren = dchildren[i]
                    if(NullCheck(cchildren)){
                        _divtable[0].removeChild(cchildren)
                    }
                }
                if(ccopySize>1){
                    for (let i =1; i < ccopySize; i++) {
                        const cloneCopy = dchildren[0].cloneNode(true)
                        if(NullCheck(cloneCopy)){
                            cloneCopy.dataset.RowIndex =i
                            const $fields =$(cloneCopy).find('.'+state.UI.TABLECOLUMNCLASS)
                            $fields.each((ii,vv)=>{
                                if(vv!=undefined){
                                    vv.dataset.RowIndex =i
                                }
                            })
                            $(cloneCopy).find('.'+state.UI.TABLECOLUMNCLASS).removeClass(state.UI.FIELDCLASS)
                            $(cloneCopy).find('.'+state.UI.TABLECOLUMNCLASS+'>.ui-resizable-e').remove()
                            _divtable[0].appendChild(cloneCopy)
                        }
                    }
                }
            }
            state.Clone.Items.Clons.push(elements)
            resolve(elements)
            
        })
    })
}
const SearchMenuItem = (Menu,Index,menuitem)=>{
    const _xitem ={}
    for (let ii = 0; ii < Menu.length; ii++) {
        const item = Menu[ii]
        if(item.id==parseInt(Index)){
            if(NullCheck(menuitem)){
                Menu[ii]={...menuitem,element:item.element}
                _xitem.item =Menu[ii]
            }else{
                _xitem.item = item
            }
            break
        }
    }
    return _xitem
}
export const AddCloneItemAsync = (payload,state) =>{
    return new Promise((resolve)=>{
        AddCloneItem (payload,state,(data)=>{
            resolve(data)
        })
    })
}
const AddCloneItem= (payload,state,success) =>{
    let itemValue=null
    if(NullCheck(payload.MenuValue)){
        itemValue =payload.MenuValue
    }
    const _xitem = {}
    if(NullCheck(itemValue)){
        if(itemValue.value.ItemType!= state.Clone.Type.TABLE.DEFAULT){
            const _x0item=  SearchMenuItem(state.UI.PANEL.Menu,payload.Index,itemValue)
            _xitem.item=_x0item.item
        }else{
            _xitem.item=itemValue
        }
    }else{
        const _x0item=  SearchMenuItem(state.UI.PANEL.Menu,payload.Index,null)
        _xitem.item=_x0item.item
    }
    const { item } = _xitem
    if (NullCheck(item) && NullCheck(payload.Index)) {
        switch (item.value.ItemType) {
        case state.Clone.Type.TEXT.FIELD:
            UICloneText(state,item,payload).then((_data)=>{
                success(_data)
            })
            break
        case state.Clone.Type.TABLE.FIELD:
            item.value.ColumnIndex=NullCheck(item.value.ColumnIndex) ?parseInt(item.value.ColumnIndex):item.value.ColumnIndex
            item.value.RowIndex=NullCheck(item.value.RowIndex)?parseInt(item.value.RowIndex):item.value.RowIndex
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
        case state.Clone.Type.TABLE.DEFAULT:
            UICloneCreateTable(state,item,payload,state.Clone.Items).then((_$table)=>{
                success(_$table)
            })
            break
        default:
          
            break
        }
    }
}