
import '../css/bootstrap.min.css';
import '../css/mycss.css';
import '../css/jq-ui.css';
import '../css/font-awesome.min.css';
import '../css/jquery-ui.min.css';
// import '../scss/efar.scss';
import '../scss/mydrop.scss';
require('webpack-jquery-ui');
require('webpack-jquery-ui/css');
import { makeDraggable,makeDraggables} from './elements';
    (function () {

// require('./elements/tools');

 
    function Init(){
            $(document).ready(function () {
                makeDraggable();
                makeDraggables(".m-Template-Page-Area");
                $("#print").click(function(){
                    $(this).makePrint();
                });
                $("#loadprint").click(function(){
                    $(this).loadPrint();
                });
            });
           
        //     require('./plugins/index');
            // Tools();
            
    }
   
    Init();
   
  
   
})();
