const State ={
    Clone:{
        Type: {
            TEXT: {
                FIELD: "Field",
                GROUPNAME: "Field",
                VALUE: "ItemValue",
                ITEMKEY: "ItemKey",
                ITEMTITLE: "ItemTitle"
            },
            TABLE: {
                DEFAULT: "Table",
                FIELD: "TableField",
                VALUE: "ItemValue",
                ITEMKEY: "ItemKey",
                ITEMTITLE: "ItemTitle",
                SUBITEMKEY: "SubItemKey",
                ITEMCOLUM: "RowGroup"
            }
        },
        SelectElement: {
            DragSelect: "m-drag-ul",
            TEXT: "#TextField",
            TABLE: "#TableField" /* It must be 'div' element */
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
export default State;