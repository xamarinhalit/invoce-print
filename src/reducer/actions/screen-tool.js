export const CalcW80To100= (left, width,screen) =>{
    //   if(width=='')
    //     width='1';
    const { smallpercent, bigpercent } = screen.width
    let value = parseInt(left.replace('px', ''))
    let _width = parseInt(width.replace('px', ''))
    if (value < 0) value = 0
    let smalbody = value / smallpercent
    let largprint = bigpercent * smalbody
    let smalwidth = _width / smallpercent
    let largwidth = smalwidth * bigpercent
    if (smalwidth + smalbody >= 100) {
        return {
            left: 99 - smalwidth,
            width: smalwidth
        }
    }
    return {
        left: smalbody,
        width: smalwidth
    }
}
export const CalcH70To100= (top, height,screen) =>{
    // if(height=='')
    //     height='1';
    const { smallpercent, bigpercent, big } = screen.height
    let value = parseInt(top.replace('px', ''))
    let _height = parseInt(height.replace('px', ''))
    let smalbody = value / smallpercent
    let largprint = bigpercent * smalbody
    let smalheight = _height / smallpercent
    let largheight = smalheight * bigpercent
    if (smalheight + smalbody >= 99) {
        return {
            top: 99 - smalheight,
            height: smalheight
        }
    }
    return {
        top: smalbody,
        height: smalheight
    }
}


const vwTOpx=(value)=> {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        // eslint-disable-next-line no-unused-vars
        y = w.innerHeight || e.clientHeight || g.clientHeight

    var result = (x * value) / 100
    return result
}
  
const vhTOpx = (value) => {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        // eslint-disable-next-line no-unused-vars
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight

    var result = (y * value) / 100
    return result
}
export const GetInitCalc = (state)=> {
    return new Promise((resolve)=>{
        const { height, width } = state.UI.screen
        let { width: medwidth,height: medheight} = state.UI.$CONTENT[0].getClientRects()[0]
        width.big = vwTOpx('98')
        width.medium = medwidth / 100
        width.smal = vwTOpx('80')
        width.smallpercent = width.smal / 100
        width.bigpercent = width.big / 100
        height.big = vhTOpx('98')
        height.medium = medheight / 100
        height.smal = vhTOpx('70')
        height.smallpercent = height.smal / 100
        height.bigpercent = height.big / 100
        resolve()
    })
}
