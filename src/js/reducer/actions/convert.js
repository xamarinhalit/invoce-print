/* eslint-disable no-undef */
export const CalcLeftTop = (uioffset ,mainoffset)=>{
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
export const NullCheck = (value)=>{
    if(value == null || value == undefined || value =='')
        return false
    return true
}
export const CalC_Table = (elt,state)=>{
    let elx =null
    if(elt.length==undefined)
        elx= $(elt)
    else
        elx=elt
  let x_width = 0
    let _leng = elx.length
    let $_el = elx.find('div.'+state.UI.TABLEROWCLASS)
    const _el =$_el.first()
    if(_leng>0 && elx[0].children.length>0){
        x_width=_el[0].offsetWidth
    }
    if(x_width!=0){
        elx.width(x_width+($_el.length*5))
        elx.height($_el.height()*$_el.length)
    }
}
export const styleToObject = (element)=>{
    const out={}
    const elementStyle = element.style
    for (const prop of elementStyle) {
        if(prop!=undefined){
            const el =elementStyle[prop]
            out[prop]=el
        }
    }
    return out
}
export const stylePxToViewPortObject = (element,$root)=>{
    return new Promise((resolve)=>{
        const out={}
        const elementStyle = element.style
        for (const prop of elementStyle) {
            if(prop!=undefined){
                const el =elementStyle[prop]
                switch (prop) {
                case 'top':
                    out[prop]=PixelTo($root,el,'vh')
                    break
                case 'height':
                    out[prop]=PixelTo($root,el,'vh')
                    break
                case 'width' :
                    out[prop]=PixelTo($root,el,'vw')
                    break
                case 'left' :
                    out[prop]=PixelTo($root,el,'vw')
                    break
                default:
                    out[prop]=el
                    break
                }
            }
        }
        resolve(out)
    })
}

const PixelTo = ($root,pixel,types)=>{
    let pix  = pixel.replace('px','')
    let size
    if(pix==0)
        return 0 + types
    switch (types) {
    case 'vh':
        return (pix/$root.clientHeight*100).toFixed(4) + 'vh'
    case 'vw':
        return (pix/$root.clientWidth*100).toFixed(4) + 'vw'
    case 'em':
        size = getComputedStyle($root).fontSize
        if (size != undefined) {
            size = size.replace('px', '')
            size = parseFloat(size)
            if (size < 11) size = 16
        } else {
            size = 16
        }
        return (pix/ size) + 'em'
    default:
        break
    }

}

// const ToPixel = ($root,pixel,types)=>{
//     let pix  = pixel.replace(types,'')
//     let size
//     if(pix==0)
//         return 0 + 'px'
//     switch (types) {
//     case 'vh':
//         return (pix*$root.clientHeight/100).toFixed(2) + 'px'
//     case 'vw':
//         return (pix*$root.clientWidth/100).toFixed(2) + 'px'
//     case 'em':
//         size = getComputedStyle($root).fontSize
//         if (size != undefined) {
//             size = size.replace('px', '')
//             size = parseFloat(size)
//             if (size < 11) size = 16
//         } else {
//             size = 16
//         }
//         return (pix* size) + 'px'
//     default:
//         break
//     }

// }

// const PixeltoEm=(pixcel)=> {
//     let size = getComputedStyle(document.documentElement).fontSize
//     if (size != undefined) {
//         size = size.replace('px', '')
//         size = parseFloat(size)
//         if (size < 11) size = 16
//     } else {
//         size = 16
//     }
//     return (pixcel/ size)
// }


export const CalcWidthHeight=(_Print)=>{
    const {width,height} =setPageSize(_Print)
    const pcopy =SetPageCopy(_Print)

    const _width=Math.floor(width/pcopy.width)
    const _height =Math.floor(height/pcopy.height)
    return {_width,_height};
}
/* eslint-disable no-undef */
export const cmToPixel = (cm)=>{
    return cm * 37.7952755906
}
const setPageSize = (_print) => {
    let width,height,_width,_height
    if(_print.PageType=='Dikey'){
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
    }else{
        switch (_print.PageSize) {
        case 'A4':
            _height=21.0
            _width=29.7
            break
        case 'A5':
            _height=14.85
            _width=21.0
            break
        default: // ÖZEL
            _height=_print.PageWidth
            _width=_print.PageHeight
            break
        }
    }
   
    width=cmToPixel(_width)
    height=cmToPixel(_height)

    return SetRuler({
        width,
        height,
        _width ,
        _height 
    })
}
const SetPageCopy = (_Print)=>{
    const { PageCopy,CopyDirection,PageType} = _Print
    let width=1
    let height=1
    if(PageType=='Dikey'){
        if(PageCopy>1){
            if(CopyDirection=='Yanyana'){
                width=parseInt(PageCopy)
            }else{
                height=parseInt(PageCopy)
            }
        }
    }else{
        if(PageCopy>1){
            if(CopyDirection=='Yanyana'){
                width=parseInt(PageCopy)
            }else{
                height=parseInt(PageCopy)
            }
        }
    }
  
    return {
        height,width
    }
}
const SetRuler = ({ width,height,_width, _height})=>{
    const $rulerTop= $('.m-Ruler-Top')
    const _wCount =_width
    const _wstyle=width/_wCount
    $rulerTop.width(width+_wstyle).html('')
    const ultop = document.createElement('ul')
    ultop.style.width=width+_wstyle+'px'
    for (let i = 0; i < _wCount; i++) {
        const li = document.createElement('li')
        const span = document.createElement('span')
        span.innerText=i
        li.appendChild(span)
        li.style.width=_wstyle+'px'
        ultop.appendChild(li)
    }
    $rulerTop.append(ultop)
    const $rulerLeft= $('.m-Ruler-Left')
    const _hCount =_height
    const _hstyle=height/_hCount
    $rulerLeft.height(height+_hstyle).html('')
    const ulleft = document.createElement('ul')
    ulleft.style.height=height+_hstyle+'px'
    for (let i = 0; i < _hCount; i++) {
        const li = document.createElement('li')
        const span = document.createElement('span')
        span.innerText=i
        li.appendChild(span)
        li.style.height=_hstyle+'px'
        ulleft.appendChild(li)
    }
    $rulerLeft.append(ulleft)
    return {
        width,height
    }
}