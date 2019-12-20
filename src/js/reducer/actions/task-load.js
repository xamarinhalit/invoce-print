/* eslint-disable no-undef */
import { dispatch } from '../index'
import { actionTypes} from '../const'
import {CalcWidthHeight,cmToPixel ,copyObject} from './convert'
import { AddCloneItemAsync } from './add-clone'
export const JsonToHtmlPrint = (payload)=>{
    return new Promise((resolve,reject)=>{
        let value
        if(payload && typeof payload === 'object' && payload.constructor === Array){
            value=payload[0]
        }else if(payload && typeof payload === 'object' && payload.constructor === Object){
            value=payload
        }
        let datacount =GetRowCount(value.data,value.config)
        let pagecount =parseInt(value.Print.PageProduct)
        SetTableRowTo(value,{pagecount,datacount},(temp)=>{
            if(temp.Pages!=undefined){
                const ob = {
                    element:document.createElement('div'),
                    hbodystyle:'',
                    pagestyle:''
                }
                for (const key in temp.Pages) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (temp.Pages.hasOwnProperty(key)) {
                        const page =Object.assign({}, temp.Pages[key])
                        page.element.classList.add('pagebreakline')
                        ob.element.appendChild(page.element)
                        ob.hbodystyle=page.hbodystyle
                        ob.pagestyle=page.pagestyle
                    }
                }
                resolve(ob)
            }else{
                reject()
            }
        })
    })
}
const SetTableRowTo =(value,
    {datacount=0,pagecount=0},success,temp={},tempindex=0,startindex=0,endindex=0)=>{
    endindex=startindex+pagecount
    if(datacount==endindex){
        SetTableRow(value,{startindex,endindex}).then((tempdata)=>{
            JsonAddCloneItemAsync(tempdata).then((data)=>{
                temp[tempindex]=Object.assign({},data)
                tempindex++
                success({Pages:temp})
            })
        })
    }else if(datacount<endindex){
        SetTableRow(value,{startindex,endindex}).then((tempdata)=>{
            JsonAddCloneItemAsync(tempdata).then((data)=>{
                temp[tempindex]=Object.assign({},data)
                tempindex++
                success({Pages:temp})
            })
        })
    }else{
        SetTableRow(value,{startindex,endindex}).then((tempdata)=>{
            JsonAddCloneItemAsync(tempdata).then((data)=>{
                temp[tempindex]=Object.assign({},data)
                tempindex++
                startindex=endindex
              SetTableRowTo(value,{datacount,pagecount},success,temp,tempindex,startindex,endindex)
            })
        })
    }




    // if(datacount>pagecount){
    //     SetTableRow(value,{startindex,endindex}).then((tempdata)=>{
    //         JsonAddCloneItemAsync(tempdata).then((data)=>{
    //             temp[tempindex]=Object.assign({},data)
    //             tempindex++
    //             datacount=datacount-pagecount
    //             startindex+=pagecount
    //             SetTableRowTo(value,{datacount,pagecount},success,temp,tempindex,startindex,endindex)
    //         })
    //     })
    // }else if(datacount==pagecount){
    //     SetTableRow(value).then((tempdata)=>{
    //         JsonAddCloneItemAsync(tempdata).then((data)=>{
    //             temp[tempindex]=Object.assign({},data)
    //             tempindex++
    //             success({Pages:temp})
    //         })
    //     })
    // }else{
    //     if(datacount>-1){
    //         SetTableRow(value).then((tempdata)=>{
    //             JsonAddCloneItemAsync(tempdata).then((data)=>{
    //                 temp[tempindex]=Object.assign({},data)
    //                 tempindex++
    //                 success({Pages:temp})
    //             })
    //         })
    //     }else{
    //         success({Pages:temp})
    //     }
      
    // }
    
}
export const JsonAddCloneItemAsync = (payload) =>{
    return new Promise((resolve)=>{
        AddCloneItem (payload,(data)=>{
            resolve(data)
        })
    })
}
const SetPrintInit = ({Print,content,config})=> {
    return new Promise((resolve)=>{
        let hbodystyle= `<style>
        @page{
            size:${Print.PageSize.toLowerCase()} ${Print.PageType=='Dikey'?'portrait':'landscape'};
             padding:0cm;
             margin:0cm;
         }
        body {
            padding:0;
            margin:0;
        }
        .pagebreakline{
            page-break-after:always;
            position:relative;
        }
         .${config.UI.TABLEMAINCLASS} .${config.UI.TABLEROWCLASS} {
            display: -webkit-inline-box;
            display: -ms-inline-flexbox;
            display: inline-flex;
          }
         .${config.UI.TABLEMAINCLASS} .${config.UI.TABLEROWCLASS} .${config.UI.TABLECOLUMNCLASS} {
              border: none;
          }
        </style>`
        let hstyle= `<style>
            @page{
                size:${Print.PageSize.toLowerCase()} ${Print.PageType=='Dikey'?'portrait':'landscape'};
                padding:0cm;
                margin:0cm;
            }
            body{
                padding:0cm;
                margin:0cm;
            }
            .pagebreakline{
                page-break-after:always;
                position:relative;
            }
            .${config.UI.TABLEMAINCLASS}>.${config.UI.TABLEROWCLASS} {
                display: -webkit-inline-box;
                display: -ms-inline-flexbox;
                display: inline-flex;
              }
             .${config.UI.TABLEMAINCLASS} .${config.UI.TABLEROWCLASS} .${config.UI.TABLECOLUMNCLASS} {
                  border: none;
              }
        </style>`
        let clnode = content.cloneNode(true)
        clnode.removeAttribute('id')
        let _div = null
        const {_width,_height,width,height} = CalcWidthHeight(Print,true)
        let pageCopy =parseInt(Print.PageCopy)
        if(pageCopy>1){
            _div=document.createElement('div')
            _div.style.display='flex'
            _div.style.margin='0'
            _div.style.padding='0'
            let size =`${Print.PageSize.toLowerCase()} ${Print.PageType=='Dikey'?'portrait':'landscape'}`
            _div.style.size=size
            if(Print.PageType=='Dikey'){
                _div.style.width=width+'px'
                _div.style.height=height+'px'
                if(Print.CopyDirection=='Yanyana'){
                    _div.style.flexDirection='row'
                }else{
                    _div.style.flexDirection='column'
                }
            }else{
                _div.style.height=height+'px'
                _div.style.width=width+'px'
                if(Print.CopyDirection=='Yanyana'){
                    _div.style.flexDirection='row'
                }else{
                    _div.style.flexDirection='column'
                }
            }
            let cw ={
                width:'',
                height:''
            }
            cw.width = _width
            for (let i = 0; i < parseInt(Print.PageCopy); i++) {
                const cl2 =clnode.cloneNode(true)
                cl2.style.position='absolute'
                if(Print.CopyDirection=='Yanyana'){
                    if(Print.PageType=='Yatay'){
                        cw.height =_height
                        cw.width =_width
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.left= cw.width*i+'px'
                        cl2.style.top= '0px'
                    }else{
                        cw.height =_height-1
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.left=cw.width*i +'px'
                        cl2.style.top= '0px'
                    }
                }else{
                    if(Print.PageType=='Yatay'){
                        cw.height =_height-1
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.top= cw.height*i+'px'
                    }else{
                        cw.height =_height
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.top= cw.height*i+'px'
                    }
                }
                _div.appendChild(cl2)
            }
            
            resolve({element:_div,hbodystyle:hbodystyle,pagestyle:hstyle})
        }else{
            clnode.style.margin='0'
            clnode.style.padding='0'
            let size =`${Print.PageSize.toLowerCase()} ${Print.PageType=='Dikey'?'portrait':'landscape'}`
            clnode.style.size=size
            let cw ={
                width:'',
                height:''
            }
            cw.width = _width
            cw.height =_height-1
            clnode.style.width=cw.width + 'px'
            clnode.style.height=cw.height+'px'
            clnode.style.left= '0px'
            clnode.style.top= '0px'
            resolve({element:clnode,hbodystyle:hbodystyle,pagestyle:hstyle})
        }
       
    })
}
const GetRowCount = (data,config)=>{
    let ocount=-1
    data.map((value)=>{
        if(value!=undefined && config.TABLE.FIELD==value.ItemType){
            let rowindex=parseInt(value.RowIndex)
            if(rowindex>ocount)
                ocount=rowindex
        }
    })
    return ocount+1
}
const SetTableRow = ({Clons,Print,config,data},indexParam=null)=>{
    return new Promise((resolve)=>{
         const nClons= Clons.slice()
         let productcount=parseInt(Print.PageProduct)
         let startindex=0,endindex=0
         if(indexParam!=null){
            endindex=indexParam.endindex
            startindex=indexParam.startindex
         }else{
            endindex=productcount
         }
        const newAddClone=[]
        let StartId=1000
        for (let i = 0; i < nClons.length; i++) {
            const clone =Object.assign({}, nClons[i])
            let cloneid= clone.id
            if(clone!=undefined){
                if(clone.value.ItemType==config.TABLE.FIELD && clone.value.RowIndex==0){
                    for (var j = startindex; j < endindex; j++) {
                        data.filter(x=>{
                            if(x.ItemType==config.TABLE.FIELD && x.RowIndex==j && clone.value.ItemKey==x.ItemKey){
                                const dt = {
                                    id:''+StartId,
                                    value:{}
                                }
                                for (const key in clone.value) {
                                    if (clone.value.hasOwnProperty(key)) {
                                        const el = clone.value[key]
                                        if(x[key]!=undefined){
                                            dt.value[key]=x[key]
                                        }else{
                                            dt.value[key]=el
                                        }
                                    }
                                }
                                newAddClone.push(dt)
                                StartId++
                            }
                        })
                    }
                    Clons =Clons.filter(x=>x.id!=cloneid)
                }else if(clone.value.ItemType!=config.TABLE.DEFAULT){
                    data.filter(x=>{
                        if(x.ItemType!=config.TABLE.FIELD && x.ItemType!=config.TABLE.DEFAULT && clone.value.ItemKey==x.ItemKey){
                            const dt = {
                                id:''+StartId,
                                value:{}
                            }
                            for (const key in clone.value) {
                                if (clone.value.hasOwnProperty(key)) {
                                    const el = clone.value[key]
                                    if(x[key]!=undefined){
                                        dt.value[key]=x[key]
                                    }else{
                                        dt.value[key]=el
                                    }
                                }
                            }
                            newAddClone.push(dt)
                            StartId++
                            Clons =Clons.filter(x=>x.id!=cloneid)
                        }
                    })
                }
            }
        }
        for (let i = 0; i < newAddClone.length; i++) {
            if(newAddClone[i]!=undefined){
                Clons.push(newAddClone[i])
            }
        }
        resolve({Clons,Print,config,data})
    })
}

const AddCloneItem= async (payload,success)=>{
    if(payload!=undefined){
        const {Print,Clons,config } =  payload
        const content =document.createElement('div')
        const nClons =Clons.slice()
        for (let i = 0; i < nClons.length; i++) {
            const item = nClons[i]
            var items =null
            switch (item.value.ItemType) {
            case config.TEXT.FIELD:
                items =AddCloneTextItem(item,config)
                content.appendChild(items.element)
                break
            case config.TEXT.CUSTOMTEXT:
                items =AddCloneTextItem(item,config)
                content.appendChild(items.element)
                break
            case config.TEXT.CUSTOMIMAGE:
                items =AddCloneTextItem(item,config)
                content.appendChild(items.element)
                break
            case config.TABLE.DEFAULT:
                items =AddCloneTable(item,config)
                content.appendChild(items.element)
                break
            default:
                break
            }
        }
        AddCloneTableItem(Clons,content,config, ()=>{
            SetPrintInit({Print,content,config}).then(({element,hbodystyle,pagestyle})=>{
                success({element,hbodystyle,pagestyle})
            })

        })
    }
}
const AddCloneTableItem = (items,content,config,success)=>{
    AddCloneTableItemTo(items,0,content,config,success)
}

const AddCloneTableItemTo = (items,i,content,config,success)=>{
    if(items.length>i){
        const nClons =items.slice()
        const item=nClons[i]
        if(item!=undefined && item.value.ItemType==config.TABLE.FIELD){
            const $table = $(content).find('.table-'+item.value.TableKey)
            const tempElement= document.createElement('div')
            dispatch({type:actionTypes.CLONE.FORMAT_CHANGE,payload:{element:tempElement,value:item.value}})
            debugger
            for (let i = 0; i < $table.length; i++) {
                    const table = $table[i]
                    if(table!=undefined){
                        let rowQuery='div[data--row-index="'+item.value.RowIndex+'"]'
                        let _divrow
                        const _divcolumn = document.createElement('div')
                        _divcolumn.classList.add(config.UI.TABLECOLUMNCLASS)
                        _divcolumn.innerHTML=tempElement.innerHTML
                        _divcolumn.dataset.ColumnIndex=item.value.ColumnIndex
                        $(_divcolumn).css(item.value.Style)
                
                        const _divrow0 = table.querySelector(rowQuery)
                        if(_divrow0==null){
                            _divrow= document.createElement('div')
                            _divrow.classList.add(config.UI.TABLEROWCLASS)
                            _divrow.dataset.RowIndex=item.value.RowIndex
                            _divrow.appendChild(_divcolumn)
                            // $table[0].appendChild(_divrow)
                            table.appendChild(_divrow)
                        }else{
                            _divrow0.appendChild(_divcolumn)
                        }
                    }
            }
        }       
        i++
        AddCloneTableItemTo(nClons,i,content,config,success)
    }else{
        success()
    }
    
}
const AddCloneTable = (menuitem,config)=>{
        const { value}=menuitem
        const _div = document.createElement('div')
        _div.classList.add(config.UI.TABLEMAINCLASS)
        _div.classList.add('table-'+value.TableKey)
        _div.style.position='absolute'
        const $div =$(_div)
        $div.css(value.Style)
        return {element:_div}
}
const AddCloneTextItem= (menuitem)=>{
        const {value} =menuitem
        const textclone= document.createElement('div')
        dispatch({type:actionTypes.CLONE.FORMAT_CHANGE,payload:{element:textclone,value:menuitem.value}})
        debugger
        // textclone.innerHTML= value.ItemValue
        if(value.Style!='' && value.Style!=undefined && value.Style!=null)
            $(textclone).css(value.Style)
        return {element:textclone}
}
const setResetInputChecked = (state)=>{
    for (let i = 0; i < state.UI.PANEL.Menu.length; i++) {
        const item = state.UI.PANEL.Menu[i]
        if(item!=undefined && item.value.ItemType==state.Clone.Type.TABLE.FIELD){
            if(item.element.classList.contains('active'))
                item.element.classList.remove('active')
            item.element.querySelector('input').checked=false
        }
    }
}
const setInputChecked = ({id,checked},state)=>{
    let _item
    
    for (let i = 0; i < state.UI.PANEL.Menu.length; i++) {
        const item = state.UI.PANEL.Menu[i]
        if(item!=undefined){
            if(item.id==id){
                if(checked==true){
                    // if(!item.element.classList.contains('active'))
                    item.element.classList.add('active')
                    item.element.querySelector('input').checked=true
                }else{
                    if(item.element.classList.contains('active'))
                        item.element.classList.remove('active')
                    item.element.querySelector('input').checked=false
                }
                _item=item
                break
            }
        }
    }
    return _item
}
const setChangeColumn = ({columnIndex,item},state)=>{
    return new Promise((resolve)=>{
        let _item
        for (let i = 0; i < state.UI.PANEL.Menu.length; i++) {
            const menuitem = state.UI.PANEL.Menu[i]
            if(menuitem!=undefined){
                if(menuitem.value.ColumnIndex==columnIndex && columnIndex!=undefined && menuitem.id!=item.id && menuitem.value.TableKey==item.value.TableKey){
                    let oldindex =menuitem.element.dataset.columnIndex
                    item.element.dataset.columnIndex=oldindex
                    item.value.ColumnIndex=oldindex
                    menuitem.element.dataset.columnIndex=columnIndex
                    menuitem.value.ColumnIndex=columnIndex
                    const citem = document.createElement('li')
                    $(item.element.parentNode).prepend(citem)
                    $(item.element).detach().insertBefore(menuitem.element)
                    $(menuitem.element).detach().insertBefore(citem)
                    citem.parentNode.removeChild(citem)
                    _item=item
                    break
                }
            }
        }
        resolve( _item)
    })
   
}
const LoadAddCloneItemTo = (Clons,state,i)=>{
    return new Promise((resolve)=>{
        if(i.i<Clons.length){
            const clonetext = Clons[i.i]
            const { id,value}= clonetext
            const {left,top } =value.Style
            let clLeft={}
            if(left!=undefined){
                clLeft={
                    Index:id,
                    left:left.replace('px',''),
                    top:top.replace('px',''),
                    Style:value.Style,
                    MenuValue:clonetext,
                    load:true
                }
            }else{
                clLeft={
                    Index:id,
                    Column:{Style:value.Style},
                    MenuValue:clonetext,
                    load:true
                }
            }
            AddCloneItemAsync(clLeft,state).then((_data)=>{
                i.i++
                if(_data!=undefined && _data!=null && _data.value.ItemType==state.Clone.Type.TABLE.FIELD){
                    const {value,id }= _data
                    const { RowIndex,ColumnIndex } = value
                    const _menuitem =setInputChecked({id,checked:true },state)
                    setChangeColumn({ rowIndex:RowIndex,columnIndex:ColumnIndex,item:_menuitem},state).then(()=>{
                        if(i.i<Clons.length){
                            LoadAddCloneItemTo(Clons,state,i).then(()=>{
                                resolve()
                            })
                        }
                    })
                }else if(i.i<Clons.length){
                    LoadAddCloneItemTo(Clons,state,i).then(()=>{
                        resolve()
                    })
                }
            })
        }
    })
}

const LoadJson = (state,payload,success)=>{
    let value
    if(payload && typeof payload === 'object' && payload.constructor === Array){
        value=payload[0]
    }else if(payload && typeof payload === 'object' && payload.constructor === Object){
        value=payload
    }
    if(value!=undefined){
        const i ={
            i:0
        }
        // eslint-disable-next-line no-unused-vars
        PrintSetting(state,value.Print,(_data)=>{
            const Clons =value.Clons
            state.Clone.Items.Clons=[]
            state.Clone.Index.Index=0
            setResetInputChecked(state)
            LoadAddCloneItemTo(Clons,state,i).then((value)=>{
                success(value)
            })
        })
    }
}
const SetJsonData = (state,payload,success)=>{
    let Items =copyObject(state,true)
    let JsonData={}
    if(payload!=undefined && payload!=null && payload.data!=undefined && payload.data!=null){
        JsonData=payload.data
    }

    JsonData.Print = Items.Print
    let tablesinc =0
    const incTables= ()=>{
        tablesinc--
        return tablesinc
    }
    JsonData.Clons =Items.Clone.Items.Clons.map(x=>{
        return {
            id:x.id!=undefined?x.id:incTables(),
            ToolValue:x.ToolValue,
            value:x.value,
        }
    })
    success(JsonData)
}
const GetPrintInit = (state)=> {
    return new Promise((resolve)=>{
        let hstyle=`<style>
            @page {
                size:${state.Print.PageSize.toLowerCase()} ${state.Print.PageType=='Dikey'?'portrait':'landscape'};
                padding:0cm;
                margin:0cm;
            }
            body{
                margin:0;
                padding:0;
            }
        }</style>`
        let clnode = $(state.UI.DROPID)[0].cloneNode(true)
        clnode.removeAttribute('id')
        let _div = null
        if(state.Print.PageCopy>1){
            _div=document.createElement('div')
            _div.style.display='flex'
            _div.style.margin='0'
            _div.style.padding='0'
            let size =`${state.Print.PageSize.toLowerCase()} ${state.Print.PageType=='Dikey'?'portrait':'landscape'}`
            _div.style.size=size
            if(state.Print.PageType=='Dikey'){
                _div.style.width=Math.floor(cmToPixel(state.Print.PageWidth))+'px'
                _div.style.height=Math.floor(cmToPixel(state.Print.PageHeight))+'px'
                if(state.Print.CopyDirection=='Yanyana'){
                    _div.style.flexDirection='row'
                }else{
                    _div.style.flexDirection='column'
                }
            }else{
                _div.style.height=Math.floor(cmToPixel(state.Print.PageWidth))+'px'
                _div.style.width=Math.floor(cmToPixel(state.Print.PageHeight))+'px'
                if(state.Print.CopyDirection=='Yanyana'){
                    _div.style.flexDirection='row'
                }else{
                    _div.style.flexDirection='column'
                }
            }
            const {_width,_height} = CalcWidthHeight(state.Print)
            let cw ={
                width:'',
                height:''
            }
            cw.width = _width
            for (let i = 0; i < parseInt(state.Print.PageCopy); i++) {
                const cl2 =clnode.cloneNode(true)
                cl2.style.position='absolute'
                if(state.Print.CopyDirection=='Yanyana'){
                    if(state.Print.PageType=='Yatay'){
                        cw.height =_height-1
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.left= cw.width*i+'px'
                        cl2.style.top= '0px'
                    }else{
                        cw.height =_height
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.left=cw.width*i +'px'
                        cl2.style.top= '0px'
                    }
                }else{
                    if(state.Print.PageType=='Yatay'){
                        cw.height =_height
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.top= cw.height*i+'px'
                    }else{
                        cw.height =_height
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.top= cw.height*i+'px'
                    }
                }
                _div.appendChild(cl2)
            }
            $(_div.innerHTML).printThis({
                debug: false, // show the iframe for debugging
                importCSS: true, // import parent page css
                importStyle: true, // import style tags
                printContainer: true, // print outer container/$.selector
                pageTitle: '', // add title to print page
                removeInline: false, // remove inline styles from print elements
                removeInlineSelector: '*', // custom selectors to filter inline styles. removeInline must be true
                printDelay: 0, // variable print delay
                header:hstyle, // prefix to html
                footer: null, // postfix to html
                base: false, // preserve the BASE tag or accept a string for the URL
                formValues: true, // preserve input/form values
                canvas: false, // copy canvas content
                removeScripts: false, // remove script tags from print content
                copyTagClasses: true, // copy classes from the html & body tag
                beforePrintEvent: null, // function for printEvent in iframe
                beforePrint: null, // function called before iframe is filled
                afterPrint: null // function called before iframe is removed
            })
        }else{
            const {_width,_height} = CalcWidthHeight(state.Print)
            clnode.style.margin='0'
            clnode.style.padding='0'
            let size =`${state.Print.PageSize.toLowerCase()} ${state.Print.PageType=='Dikey'?'portrait':'landscape'}`
            clnode.style.size=size
            let cw ={
                width:'',
                height:''
            }
            cw.width = _width
            cw.height =_height-1
            clnode.style.width=cw.width + 'px'
            clnode.style.height=cw.height+'px'
            clnode.style.left= '0px'
            clnode.style.top= '0px'
            $(clnode).printThis({
                debug: false, // show the iframe for debugging
                importCSS: true, // import parent page css
                importStyle: true, // import style tags
                printContainer: true, // print outer container/$.selector
                pageTitle: '', // add title to print page
                removeInline: false, // remove inline styles from print elements
                removeInlineSelector: '*', // custom selectors to filter inline styles. removeInline must be true
                printDelay: 0, // variable print delay
                header:hstyle, // prefix to html
                footer: null, // postfix to html
                base: false, // preserve the BASE tag or accept a string for the URL
                formValues: true, // preserve input/form values
                canvas: false, // copy canvas content
                removeScripts: false, // remove script tags from print content
                copyTagClasses: true, // copy classes from the html & body tag
                beforePrintEvent: null, // function for printEvent in iframe
                beforePrint: null, // function called before iframe is filled
                afterPrint: null // function called before iframe is removed
            })
        }
        
        resolve()
    })
}
const PrintSetting= (state,payload,success)=>{
    state.Print={...payload}
    state.Clone.Items.Clons=[]
    state.Clone.Index.Index=0
    const $content =$(state.UI.$CONTENT[0])
    $content.html('')
    // eslint-disable-next-line no-undef
    $('.p-font-block.p-active').removeClass('p-active')
    const $imageurl = document.querySelector('input[name="ImageUrl"]')
    $imageurl.value=state.Print.ImageUrl
    document.querySelector('.m-Ruler-Top').style.display='block'
    document.querySelector('.m-Ruler-Left').style.display='block'
    const {_width,_height}=CalcWidthHeight(state.Print)
    $content.width(_width).height(_height)
    state.UI.$CONTENT[0].style.backgroundImage='url('+state.Print.ImageUrl+')'
    const $tools =$(state.UI.PANEL.config.container)
    if(!$tools.hasClass('active')){
        $tools.addClass('active')
    }
    for (let i = 0; i < state.UI.PANEL.Menu.length; i++) {
        const menuitem = state.UI.PANEL.Menu[i]
        const { element } = menuitem
        const $element = $(element)
        if($element.hasClass('active')){
            $element.removeClass('active')
            const $input = $(element).find('input').first()
            $input.prop('checked',false)
        }
    }
    success(null)
}
export {
    LoadJson,SetJsonData,GetPrintInit,PrintSetting
}

/*
    CopyDirection-> Altalta Yanyana
    PageProduct -> table row sayısı
    A8 Boyutları = 52*74 mm
    A7 Boyutları = 74*105 mm
    A6 Boyutları = 148.5*105 mm
    A5 Boyutları = 210*148.5 mm
    A4 Boyutları = 297*210 mm
    A3 Boyutları = 420*297 mm
    A2 Boyutları = 594*420 mm
    A1 Boyutları = 840*594 mm
    A0 Boyutları = 1188*840 mm
*/