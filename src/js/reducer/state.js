const State ={
    UI:{ //UISELECT
        DRAGCLASS: 'm-drag-ul',
        ACCORDIONID: '#accordion',
        DROPID: '',
        $CONTENT: null,
        screen: {
            width: {
                big: 0,
                medium: 0.0,
                smal: 0,
                bigpercent: 0,
                smallpercent: 0
            },
            height: {
                big: 0,
                medium: 0.0,
                smal: 0,
                bigpercent: 0,
                smallpercent: 0
            }
        }
    },
    Clone:{
        Type: {
            TEXT: {
                FIELD: 'Field',
                GROUPNAME: 'Field',
                VALUE: 'ItemValue',
                ITEMKEY: 'ItemKey',
                ITEMTITLE: 'ItemTitle'
            },
            TABLE: {
                DEFAULT: 'Table',
                FIELD: 'TableField',
                VALUE: 'ItemValue',
                ITEMKEY: 'ItemKey',
                ITEMTITLE: 'ItemTitle',
                SUBITEMKEY: 'SubItemKey',
                ITEMCOLUM: 'RowGroup'
            }
        },
        SelectElement: {
            DragSelect: 'm-drag-ul',
            TEXT: '#TextField',
            TABLE: '#TableField' /* It must be 'div' element */
        },
        Index: {
            Index: 0,
            Table: {
                RowGroup: {},
                $RowGroup: {},
                CloneId: -1
            }
        },
        Items: {
            Clons:[],
            StaticItems:[]
        },
        GroupItems: {}
    },

}
export default State