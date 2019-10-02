
import '../css/bootstrap.min.css';
import '../css/mycss.css';
import '../css/jq-ui.css';
import '../css/font-awesome.min.css';
import '../css/jquery-ui.min.css';
// import '../scss/efar.scss';
import '../scss/mydrop.scss';
require('webpack-jquery-ui');
//require('webpack-jquery-ui/css');
import { makeDraggable} from './elements';

(function () {
    $(document).ready(function () {
        makeDraggable(".m-Template-Page-Area");
        $("#print").click(function(){
            $(this).makePrint();
        });
        $("#loadprint").click(function(){
            $(this).loadPrint();
        });
    });
})();
