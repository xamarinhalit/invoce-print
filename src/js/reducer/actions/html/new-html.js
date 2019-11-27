import {  CalcWidthHeight } from '../convert'
/* eslint-disable no-undef */
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
            AddCloneItemAsync(tempdata).then((data)=>{
                temp[tempindex]=Object.assign({},data)
                tempindex++
                success({Pages:temp})
            })
        })
    }else if(datacount<endindex){
        SetTableRow(value,{startindex,endindex}).then((tempdata)=>{
            AddCloneItemAsync(tempdata).then((data)=>{
                temp[tempindex]=Object.assign({},data)
                tempindex++
                success({Pages:temp})
            })
        })
    }else{
        SetTableRow(value,{startindex,endindex}).then((tempdata)=>{
            AddCloneItemAsync(tempdata).then((data)=>{
                temp[tempindex]=Object.assign({},data)
                tempindex++
                startindex=endindex
              SetTableRowTo(value,{datacount,pagecount},success,temp,tempindex,startindex,endindex)
            })
        })
    }




    // if(datacount>pagecount){
    //     SetTableRow(value,{startindex,endindex}).then((tempdata)=>{
    //         AddCloneItemAsync(tempdata).then((data)=>{
    //             temp[tempindex]=Object.assign({},data)
    //             tempindex++
    //             datacount=datacount-pagecount
    //             startindex+=pagecount
    //             SetTableRowTo(value,{datacount,pagecount},success,temp,tempindex,startindex,endindex)
    //         })
    //     })
    // }else if(datacount==pagecount){
    //     SetTableRow(value).then((tempdata)=>{
    //         AddCloneItemAsync(tempdata).then((data)=>{
    //             temp[tempindex]=Object.assign({},data)
    //             tempindex++
    //             success({Pages:temp})
    //         })
    //     })
    // }else{
    //     if(datacount>-1){
    //         SetTableRow(value).then((tempdata)=>{
    //             AddCloneItemAsync(tempdata).then((data)=>{
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
export const AddCloneItemAsync = (payload) =>{
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
        if(Print.PageCopy>1){
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
    data.map(({value})=>{
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
                            if(x.value.ItemType==config.TABLE.FIELD && x.value.RowIndex==j && clone.value.ItemKey==x.value.ItemKey){
                                const dt = {
                                    id:''+StartId,
                                    value:{}
                                }
                                for (const key in clone.value) {
                                    if (clone.value.hasOwnProperty(key)) {
                                        const el = clone.value[key]
                                        if(x.value[key]!=undefined){
                                            dt.value[key]=x.value[key]
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
            const $table = $(content).find('.table-'+item.value.TableKey).first()
            let rowQuery='div[data--row-index="'+item.value.RowIndex+'"]'
            let _divrow
            const _divcolumn = document.createElement('div')
            _divcolumn.classList.add(config.UI.TABLECOLUMNCLASS)
            _divcolumn.innerHTML=item.value.ItemValue
            _divcolumn.dataset.ColumnIndex=item.value.ColumnIndex
            $(_divcolumn).css(item.value.Style)
    
            const _divrow0 = $table[0].querySelector(rowQuery)
            if(_divrow0==null){
                _divrow= document.createElement('div')
                _divrow.classList.add(config.UI.TABLEROWCLASS)
                _divrow.dataset.RowIndex=item.value.RowIndex
                _divrow.appendChild(_divcolumn)
                $table[0].appendChild(_divrow)
            }else{
                _divrow0.appendChild(_divcolumn)
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
        textclone.innerHTML= value.ItemValue
        if(value.Style!='' && value.Style!=undefined && value.Style!=null)
            $(textclone).css(value.Style)
        return {element:textclone}
}