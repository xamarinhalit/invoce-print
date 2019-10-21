import AddCloneItem, { GetPrintInit} from  './add-html-clone'

const cmToPixel = (cm)=>{
    return cm * 37.7952755906
}
const SetPageCopy = (pcopy,copyd)=>{
    let width=1
    let height=1
    if(pcopy>1){
        if(copyd=='Yanyana'){
            width=parseInt(pcopy)
        }else{
            height=parseInt(pcopy)
        }
    }
    return {
        height,width
    }
}
const setPageSize = (_print) => {
    let width,height,_width,_height
    switch (_print.PageSize) {
    case 'A4':
        _width=21.0
        _height=29.7
        break
    case 'A5':
        _width=14.85
        _height=21.0
        break
    default: // ÖZEL
        _width=_print.PageWidth
        _height=_print.PageHeight
        break
    }
    width=cmToPixel(_width)
    height=cmToPixel(_height)
    _print.PageHeight=_height
    _print.PageWidth=_width
    if(_print.PageType == 'Yatay'){
        return {
            width:height,
            height:width,
            _width : _height,
            _height : _width
        }
    }else{
        return {
            width,
            height,
            _width ,
            _height 
        }
    }
}
const PrintSetting= (state,payload,success)=>{
    state.Print={...payload}
    state.Clone.Items.Clons=[]
    state.Clone.Items.Tables=[]
    state.Clone.Index.Index=0
    const $content =$(state.UI.$CacheContent)
    $content.html('')
    // eslint-disable-next-line no-undef
    const {width,height} =setPageSize(state.Print)
    const pcopy =SetPageCopy(state.Print.PageCopy,state.Print.CopyDirection)

    const _width=width/pcopy.width
    const _height =height/pcopy.height
    // state.Cache.Print.width=_width//ihtiyaç yok
    // state.Cache.Print.height=_height//ihtiyac yok
    $content.width(_width).height(_height)
    success(null)
}
const SetMenuItem = (Menu,menuindex,ColumnIndex,tablekey)=>{
    for (let i = 0; i < Menu.length; i++) {
        const item = Menu[i]
        if(item!=undefined &&item.value.ColumnIndex!=undefined && item.value.TableKey!=undefined){
            if(parseInt(item.value.ColumnIndex)==parseInt(ColumnIndex) &&  item.value.TableKey==tablekey){
                if(menuindex!=item.Index){
                    let oldindex =Menu[menuindex].value.ColumnIndex
                    item.value.ColumnIndex=oldindex
                    Menu[menuindex].value.ColumnIndex=ColumnIndex
                }
            }
        }
        
    }
}
const AddChildItemTo = (children,style,i,state,success)=>{
    if(i<children.length){
        const clonetext = children[i]
        if(clonetext!=undefined){
            console.log(clonetext)
        }
        const { menuindex,value}= clonetext
        AddCloneItem(
            {
                Table:{
                    Style:style
                },
                Column:{
                    Style:value.Style
                },
                Index:menuindex,
                MenuValue:value,
                load:true
            },state,()=>{
                i++
                AddChildItemTo (children,style,i,state,success)
            }
        )
    }else{
        success()
    }
}
const AddTablesTo = (Tables,i,state,success)=>{
    if(i<Tables.length){
        const table = Tables[i]
        const {Style}= table
        let j =0

        AddChildItemTo(table.children,Style,j,state,()=>{
            i++
            AddTablesTo(Tables,i,state,success)
        })
    }else{
        success()
    }
}
const AddCloneItemTo = (Clons,state,i,success)=>{
    if(i<Clons.length){
        const clonetext = Clons[i]
        const { menuindex}= clonetext
        const {left,top } =clonetext.value.Style
        AddCloneItem({
            Index:menuindex,
            left:left.replace('px',''),
            top:top.replace('px',''),
            Style:clonetext.value.Style,
            MenuValue:clonetext.value,
            load:true
        },state,()=>{
            i++
            if(i<Clons.length){
                AddCloneItemTo(Clons,state,i,success)
            }else{
                success()
            }
        })
    }else{
        success()
    }
   
}
const JsonToHtml = (state,payload,success)=>{
    let value
    if(payload && typeof payload === 'object' && payload.constructor === Array){
        value=payload[0]
    }else if(payload && typeof payload === 'object' && payload.constructor === Object){
        value=payload
    }
    if(value!=undefined){
        state.UI.PANEL.Menu=value.Menu
        state.UI.$CacheContent=document.createElement('div')
        state.UI.$CacheContent.classList.add('m-Template-Page-Area')
        for (let i = 0; i < value.Tables.length; i++) {
            const table = value.Tables[i]
            for (let j = 0; j < table.children.length; j++) {
                const clonetext = table.children[j]
                SetMenuItem(state.UI.PANEL.Menu,clonetext.menuindex,clonetext.value.ColumnIndex,clonetext.value.TableKey)
            }
        }
    
        // eslint-disable-next-line no-unused-vars
        PrintSetting(state,value.Print,(_data)=>{
            const Clons =value.Clons
            const Tables = value.Tables
            state.Clone.Items.Clons=[]
            state.Clone.Items.Tables=[]
            state.Clone.Index.Index=0
            let i =0
            AddCloneItemTo(Clons,state,i,()=>{
                let j=0
                AddTablesTo(Tables,j,state,()=>{
                    GetPrintInit(state).then((_prints)=>{
                        success(_prints)
                    })
                })
            })
        })
    }
}
export default JsonToHtml