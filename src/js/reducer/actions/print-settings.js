import {CalcWidthHeight} from './convert'

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