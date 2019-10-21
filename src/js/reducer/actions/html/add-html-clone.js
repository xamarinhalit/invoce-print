/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
import { dispatch} from '../..'
import { actionTypes } from '../../const'
import { styleToObject,  NullCheck } from './../convert'
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
        if(NullCheck(value.Format)){
            textclone.innerHTML=value[TYPE_TEXT.VALUE]
            dispatch({type:actionTypes.CLONE.FORMAT_CHANGE,payload:{element:textclone,value:value}})
        }else{
            textclone.innerHTML=value[TYPE_TEXT.VALUE]
        }
        DefaultFontSize(textclone,value.Style)
        const cloneItem = {
            Index: _Clone_Index.Index,
            element: textclone,
            value,
            ToolValue,
            menuindex:Index,
            menuelement:element
        }
        const extractCss=()=>{
            const style =styleToObject(cloneItem.element)
            // eslint-disable-next-line require-atomic-updates
            cloneItem.value.Style = style
        }
        const { left,top} = payload
       
        state.UI.$CacheContent.append(cloneItem.element)
        
        $(cloneItem.element)
            .css({ position: 'absolute' })
            .width(cloneItem.value.Width)
            .height(cloneItem.value.Height)
            .offset({ left: left, top: top })
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
export const GetPrintInit = (state)=> {
    return new Promise((resolve)=>{
        let hbstyle='body {'
        hbstyle+='size: '+state.Print.PageSize+ ' '
        hbstyle+=state.Print.PageType=='Dikey'?'landscape':'portrait' +';'
        hbstyle+='padding:0;margin:0cm;}'
        let hstyle= '<style>'
        hstyle+='@page {'
        hstyle+='size: '+state.Print.PageSize+ ' '
        hstyle+=state.Print.PageType=='Dikey'?'landscape':'portrait' +';'
        hstyle+='padding:0;margin:0cm;}</style>'
        let clnode = state.UI.$CacheContent
        clnode.removeAttribute('id')
        let _div = null
        if(state.Print.PageCopy>1){
            _div=document.createElement('div')
            _div.style.display='flex'
            if(state.Print.CopyDirection=='Yanyana'){
                _div.style.flexDirection='row'
            }else{
                _div.style.flexDirection='column'
            }
            for (let i = 0; i < parseInt(state.Print.PageCopy); i++) {
                const cl2 =clnode.cloneNode(true)
                cl2.style.position='absolute'
                if(state.Print.CopyDirection=='Yanyana'){
                    let cw = $(cl2).width()
                    cl2.style.width=cw + 'px'
                    cl2.style.left=cw*i +'px'
                }else{
                    let cw = $(cl2).height()
                    cl2.style.height=cw + 'px'
                    cl2.style.top=cw*i +'px'
                }
                _div.appendChild(cl2)
            }
            resolve({element:_div,hstyle,hbstyle})
        }else{
            resolve({element:clnode,hstyle,hbstyle})
        }
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
            const $DROID=state.UI.$CacheContent
            $DROID.appendChild($div[0])
            _table={
                Index:Index.Index,
                key:tablekey,
                element:$div,
                children:[],
                childIndex:[],
                Style:'',
                RowIndex:-1
            }
            
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
        value.ColumnIndex=parseInt(value.ColumnIndex)
        value.RowIndex=parseInt(value.RowIndex)
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
            _divtable.children.push(elements)
            _divtable.childIndex.push(elements.menuindex)
            CalC_Table()
            elements.value.Style=styleToObject (_divcolumn)
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