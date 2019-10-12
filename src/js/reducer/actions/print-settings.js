const cmToPixel = (cm)=>{
    return cm * 37.7952755906
}
// const pixelToCm = (pixel)=>{
//     return pixel / 37.7952755906
// }
export const PixelToPoint =(pixel)=>{
    return pixel*0.75
}
// const PointToPixel= (pt)=>{
//     return pt*1.3333333333
// }
/** 72 ppi */
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
        _width=_w
        _height=_h
        break
    }
    width=cmToPixel(_width)
    height=cmToPixel(_height)
    _print.PageHeight=_height
    _print.PageWidth=_width
    if(_print.PageType == 'Yatay'){
        return SetRuler({
            width:height,
            height:width,
            _width : _height,
            _height : _width
        })
    }else{
        return SetRuler({
            width,
            height,
            _width ,
            _height 
        })
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
const PrintSetting= (state,payload,success)=>{
    state.Print={...payload}
    const $imagecopy = document.querySelector('div[name="image-preview"]')
    $imagecopy.style.backgroundImage='url('+state.Print.ImageUrl+')'
    const $imageurl = document.querySelector('input[name="ImageUrl"]')
    $imageurl.value=state.Print.ImageUrl
    document.querySelector('.m-Ruler-Top').style.display='block'
    document.querySelector('.m-Ruler-Left').style.display='block'
    const {width,height} =setPageSize(state.Print)
    const pcopy =SetPageCopy(state.Print.PageCopy,state.Print.CopyDirection)

    const _width=width/pcopy.width
    const _height =height/pcopy.height
    state.Cache.Print.width=_width
    state.Cache.Print.height=_height
    $(state.UI.$CONTENT[0]).width(_width).height(_height)
    state.UI.$CONTENT[0].style.backgroundImage='url('+state.Print.ImageUrl+')'
    success(null)
}
export default PrintSetting
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