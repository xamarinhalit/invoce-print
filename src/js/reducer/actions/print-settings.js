const cmToPixel = (cm)=>{
    return cm * 37.7952755906
}
const pixelToCm = (pixel)=>{
    return pixel / 37.7952755906
}
export const PixelToPoint =(pixel)=>{
    return pixel*0.75
}
export const PointToPixel= (pt)=>{
    return pt*1.3333333333
}
/** 72 ppi */
const setPageSize = (size,land,_w=0,_h=0) => {
    let width,height,_width,_height
    switch (size) {
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
    if(land == 'Yatay')
        return SetRuler({
            width:height,
            height:width,
            _width : _height,
            _height : _width
        })
    else{
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
const PrintSetting= (state,payload,success)=>{
    state.Print={...payload}
    const {PageSize,PageType,PageWidth,PageHeight,PageProduct,CopyDirection} =state.Print
    const {width,height} =setPageSize(PageSize,PageType,PageWidth,PageHeight)
    state.Print.Width=width
    state.Print.Height=height
    $(state.UI.$CONTENT[0].parentNode).width(width).height(height)
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