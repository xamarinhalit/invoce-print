/* eslint-disable no-undef */
$.fn.extend({
    ReloadPanel: function(options, e,state) {
        // const { up, down, extclass, activeClass } = options
        const { up, down } = options
        let $children = $(this)
        const ilist = []
        for (let i = 0; i < $children.length; i++) {
            const v = $children[i]
            if (v != undefined) {
                if (e != null) {
                    const _$ul =$(e.querySelector('ul'))
                    state.UI.PANEL.Menu.forEach(item => {
                        if(ilist.indexOf(item.Sort)==-1){
                            const $ul =$(item.element.parentNode)
                            const $i =$($ul[0].previousSibling.querySelector('i'))
                            if($ul[0].className == _$ul[0].className){
                                if($i.hasClass(down))
                                {
                                    $ul.css('display','none')
                                    $i.removeClass(down)
                                    $i.addClass(up)
                                }else{
                                    $ul.css('display','block')
                                    $i.removeClass(up)
                                    $i.addClass(down)
                                }
                                ilist.push(item.Sort)
                            }else if($i.hasClass(down))
                            {
                                $ul.css('display','none')
                                $i.removeClass(down)
                                $i.addClass(up)
                                ilist.push(item.Sort)
                            }
                        }
                    })
                } else {
                    state.UI.PANEL.Menu.forEach(item => {
                        if(ilist.indexOf(item.Sort)==-1){
                            const $ul =$(item.element.parentNode)
                            const $i =$($ul[0].previousSibling.querySelector('i'))
                            $ul[0].style.display='none'
                            if($i.hasClass(down))
                            {
                                $i.addClass(up)
                                $i.removeClass(down)
                                ilist.push(item.Sort)
                            }
                        }
                    })
                }
            }
        }
    },
    PanelGroup: function(options,state) {
        let $t = $(this)
        $t.ReloadPanel(options,null,state)
        $t.find('h2').click(function(e) {
            let $el=$(e.currentTarget)
            let $ed=$el.parents('div.m-Tool')
            $t.ReloadPanel(options,$ed[0],state)
        })
    }
})
