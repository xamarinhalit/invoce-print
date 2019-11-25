import {  CalcWidthHeight } from '../convert'
/* eslint-disable no-undef */
export const JsonToHtmlPrint = (payload)=>{
    return new Promise((resolve)=>{
        let value
        if(payload && typeof payload === 'object' && payload.constructor === Array){
            value=payload[0]
        }else if(payload && typeof payload === 'object' && payload.constructor === Object){
            value=payload
        }
        SetTableRow(value).then((temp)=>{
            AddCloneItemAsync(temp).then((data)=>{
                resolve(data)
            })
        })
       
        

    })
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
                //console.log(cl2.outerHTML)
                cl2.style.position='absolute'
                if(Print.CopyDirection=='Yanyana'){
                    if(Print.PageType=='Yatay'){
                        cw.height =_height
                        cw.width =_width
                        cl2.style.width=cw.width + 'px'
                        cl2.style.height=cw.height+'px'
                        cl2.style.left= cw.width*i+'px'
                        cl2.style.top= '0px'
                        //console.log(cw)
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
// const ClonsMerge = (clone,data,config)=>{
//     let _value={
//         IsTable:false,
//         IsDefault:true,
//         data:null
//     }
//     const count=[]
//     for (let j = 0; j < data.length; j++) {
//         const item=data[j]
//         if(item!=undefined && item!=null && item.value.ItemKey==clone.value.ItemKey)
//             switch (item.value.ItemType) {
//             case config.TEXT.FIELD:
//                 _value.data={...clone,...item}
//                 _value.IsDefault=false
//                 break
//             case config.TEXT.CUSTOMTEXT:
//                 _value.data={...clone,...item}
//                 _value.IsDefault=false
//                 break
//             case config.TEXT.CUSTOMIMAGE:
//                 _value.data={...clone,...item}
//                 _value.IsDefault=false
//                 break
//             case config.TABLE.FIELD:
//                 if(item.value.TableKey==clone.value.TableKey && item.value.RowIndex==clone.value.RowIndex && item.value.ColumnIndex==clone.value.ColumnIndex){
//                     _value.data={...clone,...item}
//                     _value.IsTable=true
//                     _value.data.id=clone.id
//                     _value.IsDefault=false
//                     count.push(_value)
//                 }
//                 break
//             default:
//                 break
//             }
//     }
//     return _value
// }
// const DataMerge = ({Clons,data,config,Print})=>{
//     return new Promise((resolve)=>{
//         for (let i = 0; i < Clons.length; i++) {
//             let _data=null
//             _data=ClonsMerge(Clons[i],data,config)
//             if(_data.IsDefault==false){
//                 if(_data.IsTable==true){
//                     Clons[i]=_data.data
//                 }else{
//                     Clons[i]=_data.data
//                 }
                
//             }
                
//         }
//         resolve({Clons,data,config,Print})
//     })
// }
const GetValue = (data,item,isTable=false)=>{
    const _item=Object.assign({},item)
    for (let i = 0; i < data.length; i++) {
        const clone = data[i]
        if(_item!=undefined && _item!=null && clone!=undefined && clone!=null && item.value.ItemKey==clone.value.ItemKey){
            console.log('\nitem',_item)
            console.log('\nclone',clone)
            if(isTable==true){
                if(_item.value.RowIndex==clone.value.RowIndex){
                    _item.value.ItemValue=clone.value.ItemValue
                    return _item
                }
            }else{
                _item.value.ItemValue=clone.value.ItemValue
                return _item
            }
            // _item.value.ItemValue=clone.ItemValue
            console.log('\nitem',_item)
           
        }
    }
    console.log('\nitem',item)
    return item
}
const SetTableRow = ({Clons,Print,config,data})=>{
    return new Promise((resolve)=>{
        let productcount=parseInt(Print.PageProduct)
        if(productcount>1){
            const newAddClone=[]
            let StartId=1000
            for (let i = 0; i < Clons.length; i++) {
                const clone =Object.assign({}, Clons[i])
                if(clone!=undefined){
                    if(clone.value.ItemType==config.TABLE.FIELD && clone.value.RowIndex==0){
                        for (var j = 0; j < productcount; j++) {
                            const newclone = Object.assign({},clone)
                            console.log('\nnewclone',newclone)
                            newclone.value.RowIndex =j
                            newclone.id =''+StartId
                            const dataclone =Object.assign({},GetValue(data,newclone,true))
                            console.log('\ndataclone',dataclone)
                            if(j==0){
                                Clons[i].value=Object.assign({},dataclone.value)
                            }else{
                                newAddClone.push(dataclone)
                                StartId++
                            }
                          
                        }
                    }else{
                        Clons[i] = Object.assign({},GetValue(data,clone,false))
                    }
                }
            }
            for (let i = 0; i < newAddClone.length; i++) {
                if(newAddClone[i]!=undefined){
                    Clons.push(newAddClone[i])
                }
            }
            resolve({Clons,Print,config,data})
        }else{
            resolve({Clons,Print,config,data})
        }
    })
}

const AddCloneItem= async (payload,success)=>{
    if(payload!=undefined){
        const {Print,Clons,config } =  payload
        const content =document.createElement('div')
       
        for (let i = 0; i < Clons.length; i++) {
            const item = Clons[i]
            let items =null
            switch (item.value.ItemType) {
            case config.TEXT.FIELD:
                items =Object.assign({},await AddCloneTextItem(item,config))
                content.appendChild(items.element)
                break
            case config.TEXT.CUSTOMTEXT:
                items =Object.assign({},await AddCloneTextItem(item,config))
                content.appendChild(items.element)
                break
            case config.TEXT.CUSTOMIMAGE:
                items =Object.assign({},await AddCloneTextItem(item,config))
                content.appendChild(items.element)
                break
            case config.TABLE.DEFAULT:
                items =Object.assign({},await AddCloneTable(item,config))
                content.appendChild(items.element)
                break
            default:
                break
            }
        }
        AddCloneTableItem(Clons,content,config,async ()=>{
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
        const item=items[i]
        if(item.value.ItemType==config.TABLE.FIELD){
            const $table = $(content).find('.table-'+item.value.TableKey).first()
            let rowQuery='div[data--row-index="'+item.value.RowIndex+'"]'
            let _divrow
            const _divcolumn = document.createElement('div')
            _divcolumn.classList.add(config.UI.TABLECOLUMNCLASS)
            _divcolumn.innerHTML=item.value.ItemValue
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
        AddCloneTableItemTo(items,i,content,config,success)
    }else{
        success()
    }
    
}
const AddCloneTable = (menuitem,config)=>{
    return new Promise((resolve)=>{
        const { value}=menuitem
        const _div = document.createElement('div')
        _div.classList.add(config.UI.TABLEMAINCLASS)
        _div.classList.add('table-'+value.TableKey)
        _div.style.position='absolute'
        const $div =$(_div)
        $div.css(value.Style)
        resolve({element:_div})
    })
}
const AddCloneTextItem= (menuitem)=>{
    return new Promise((resolve)=>{
        const {value} =menuitem
        const textclone= document.createElement('div')
        textclone.innerHTML= value.ItemValue
        if(value.Style!='' && value.Style!=undefined && value.Style!=null)
            $(textclone).css(value.Style)
        resolve({element:textclone})
    })
}