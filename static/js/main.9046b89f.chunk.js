(this.webpackJsonpsstock=this.webpackJsonpsstock||[]).push([[0],{18:function(e,t,a){},22:function(e,t,a){e.exports=a(40)},27:function(e,t,a){},39:function(e,t,a){},40:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(20),l=a.n(o),c=(a(18),a(2)),s=a(3),i=a(15),u=a(5),m=a(4),d=(a(27),a(28),a(29),{}),p=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state=d,n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props,t=e.record,a=e.index;return r.a.createElement("tr",null,r.a.createElement("th",{scope:"row"},a),r.a.createElement("td",null,t.account_record_Money),r.a.createElement("td",null,t.account_record_Stock),r.a.createElement("td",null,t.transferOut),r.a.createElement("td",null,t.transferOutTime),r.a.createElement("td",null,t.transferIn),r.a.createElement("td",null,t.transferInTime),r.a.createElement("td",null,t.source))}}]),a}(n.Component),f=a(11),h={isMobile:function(){var e,t=!1;return e=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/i.test(e.substr(0,4)))&&(t=!0),/\(macintosh; intel mac os x 10_15\)/i.test(e)&&(t=!0),t}},b=a(7),v=a.n(b),g=a(8),k=a(12),E=(a(41),a(32),a(34),a(36),[31,28,31,30,31,30,31,31,30,31,30,31]),S={dateFormat:function(e){var t=e.getFullYear(),a=("0"+(e.getMonth()+1)).slice(-2),n=("0"+(new Date).getDate()).slice(-2);return console.log(t+"-"+a+"-"+n),t+"-"+a+"-"+n},toDualDigit:function(e){return e<10?"0"+e:e},days:function(e,t){return console.log(e,t),(e%4===0&&e%100!==0||e%400===0)&&2===t?29:E[t]}};k.initializeApp({apiKey:"AIzaSyCHZGM1JyAUp_8_lm4OQFLviuiXFJJto5o",authDomain:"stock-f7053.firebaseapp.com",databaseURL:"https://stock-f7053.firebaseio.com",projectId:"stock-f7053",storageBucket:"stock-f7053.appspot.com",messagingSenderId:"1056992757888",appId:"1:1056992757888:web:2067426b1bcf54fd7c3e65",measurementId:"G-V0QBQ3VNJF"}),k.analytics();var y,w=k.database().ref("/stockInfo"),O=k.database().ref("/account"),x=k.database().ref("/accountRecord"),C={getAllData:function(){return Object(g.a)(v.a.mark((function e(){return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w.once("value").then((function(e){var t=[];e.forEach((function(e){t.unshift(e.val())}));var a=t.sort((function(e,t){return e.date<t.date?1:-1})),n=a.filter((function(e){return"sale"!==e.status})).sort((function(e,t){return e.date<t.date?1:-1})),r=a.filter((function(e){return"sale"===e.status})).sort((function(e,t){return e.sale_date<t.sale_date?1:-1}));if(t){var o=0,l=0,c=0;for(var s in t)o+="unsale"===t[s].status?t[s].cost:0;for(var i in t)l+="sale"===t[i].status?t[i].income:0,c+="sale"===t[i].status?t[i].cost:0;y={showStocks:t,allStocks:t,saleStocks:r,unSaleStocks:n,totalCost:o,profitAndLoss:l,saleCost:c,profit:(l/c*100).toFixed(2)}}}));case 2:return e.abrupt("return",y);case 3:case"end":return e.stop()}}),e)})))()},insertNewData:function(e){return Object(g.a)(v.a.mark((function t(){var a,n;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=Math.floor(Date.now()/1e3),n=Math.round(1e3*e.price*e.sheet*1.001425),t.next=4,w.child(a.toString()).set({timestamp:a,date:e.date,name:e.name,number:e.number,price:e.price,sheet:e.sheet,cost:n,income:0,sale_cost:0,sale_date:0,sale_price:0,sale_sheet:0,status:"unsale"}).then((function(){console.log("\u65b0\u589ePost\u6210\u529f")})).catch((function(e){console.error("\u65b0\u589ePost\u932f\u8aa4\uff1a",e)}));case 4:case"end":return t.stop()}}),t)})))()},deleteStock:function(e){return Object(g.a)(v.a.mark((function t(){return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:w.child("".concat(e)).remove().then((function(){console.log("\u522a\u9664\u6210\u529f")})).catch((function(e){console.error("\u522a\u9664\u932f\u8aa4\uff1a",e)}));case 1:case"end":return t.stop()}}),t)})))()},updateStock:function(e,t,a){return Object(g.a)(v.a.mark((function n(){var r,o,l;return v.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r=Math.round(1e3*e*t-1e3*e*t*.004425-a.cost),o=Math.round(1e3*e*t-1e3*e*t*.004425),l=S.dateFormat(new Date),n.next=5,w.child(a.timestamp).update({income:r,sale_cost:o,sale_date:l,sale_price:e,sale_sheet:t,status:"sale"});case 5:case"end":return n.stop()}}),n)})))()},getAccount:function(){return Object(g.a)(v.a.mark((function e(){var t;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=[],e.next=3,O.once("value").then((function(e){t=e.val()}));case 3:return e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)})))()},getAccountRecord:function(){return Object(g.a)(v.a.mark((function e(){var t;return v.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=[],e.next=3,x.once("value").then((function(e){e.forEach((function(e){t.unshift(e.val())}))}));case 3:return e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)})))()},tradeForAccount:function(e){return Object(g.a)(v.a.mark((function t(){var a,n,r,o,l,c,s;return v.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=[],n=0,r=S.dateFormat(new Date),o=Math.floor(Date.now()/1e3),t.next=6,O.once("value").then((function(e){a=e.val()}));case 6:return n="transferOut"===e.transferStatus?-1*parseInt(e.price):parseInt(e.price),l=parseInt(a.accountMoney)+n,c=parseInt(a.accountStock),s=l+c,t.next=12,O.update({accountMoney:l,accountStock:c,summary:s});case 12:return t.next=14,x.child(o.toString()).set({timestamp:o,account_record_Money:l,account_record_Stock:c,source:e.source,transferIn:"transferIn"===e.transferStatus?e.price:"",transferInTime:"transferIn"===e.transferStatus?r:"",transferOut:"transferOut"===e.transferStatus?e.price:"",transferOutTime:"transferOut"===e.transferStatus?r:""});case 14:return t.abrupt("return");case 15:case"end":return t.stop()}}),t)})))()},updateAccountRecord:function(e,t){return Object(g.a)(v.a.mark((function a(){var n,r,o,l,c,s;return v.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return n=Math.floor(Date.now()/1e3),r=[],a.next=4,O.once("value").then((function(e){r=e.val()}));case 4:return o=0,l=0,c=Math.round(1e3*e.price*e.sheet*1.001425),s=Math.round(1e3*e.price*e.sheet-1e3*e.price*e.sheet*.004425),t?(o=parseInt(r.accountMoney)-c,l=parseInt(r.accountStock)+c):(o=parseInt(r.accountMoney)+s,l=parseInt(r.accountStock)-s),a.next=11,O.update({accountMoney:o,accountStock:l,summary:o+l});case 11:return a.next=13,x.child(n.toString()).set({timestamp:n,account_record_Money:o,account_record_Stock:l,source:"\u80a1\u7968",transferIn:"",transferInTime:"",transferOut:"",transferOutTime:""});case 13:return a.abrupt("return");case 14:case"end":return a.stop()}}),a)})))()}},N=(a(16),{date:new Date,price:"",transferStatus:"transferIn",source:""}),D=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).inputSource=function(e){n.setState({source:e})},n.submitTrade=function(){var e=n.state,t=e.price,a=e.transferStatus,r=e.source;if(!a||!r||isNaN(t))return alert("\u4e0d\u8a31\u6709\u4efb\u4f55\u4e00\u500b\u70ba\u7a7a");var o=n.props,l={price:t,transferStatus:a,source:r};C.tradeForAccount(l).then((function(){o.callback()})),n.setState({price:"",source:""})},n.getStyleOfButton=function(){return h.isMobile()?{margin:"4px  0px"}:{margin:"0px  0px"}},n.handleChange=function(e){n.setState({price:e})},n.getTransferOptions=function(e){return n.setState({transferStatus:e.target.value})},n.state=N,n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{style:{margin:"5px 5px"}},r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"col"},r.a.createElement("input",{type:"text",className:"form-control",placeholder:"\u91d1\u984d",onChange:function(t){return e.handleChange(t.target.value)},value:this.state.price})),r.a.createElement("div",{className:"from-group col-md-2 input-sale-frame"},r.a.createElement("input",{type:"text",className:"form-control",placeholder:"\u4f86\u6e90",onChange:function(t){return e.inputSource(t.target.value)},value:this.state.source})),r.a.createElement("div",{className:"btn-group btn-group-toggle from-group col-md-2","data-toggle":"buttons",style:Object(f.a)({},this.getStyleOfButton())},r.a.createElement("label",{className:"btn btn-warning active",onClick:this.getTransferOptions},r.a.createElement("input",{type:"radio",name:"stockOption",id:"individual",value:"transferIn",autoComplete:"off"})," \u8f49\u5165"),r.a.createElement("label",{className:"btn btn-warning",onClick:this.getTransferOptions},r.a.createElement("input",{type:"radio",name:"stockOption",id:"mutual",value:"transferOut",autoComplete:"off"})," \u8f49\u51fa")),r.a.createElement("button",{style:{borderRadius:"5px",margin:"auto 5px"},className:"btn btn-primary from-group col-md-2 input-sale-frame",type:"submit",onClick:this.submitTrade},"\u78ba\u8a8d\u9001\u51fa")))}}]),a}(n.Component),j={acTime:"",acMoney:"",acStock:"",acSummary:"",records:[]},M=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).updateAccount=function(){C.getAccount().then((function(e){n.setState({acTime:e.accountTime,acMoney:e.accountMoney,acStock:e.accountStock,acSummary:e.summary})})),C.getAccountRecord().then((function(e){n.setState({records:e})}))},n.state=j,n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){this.updateAccount()}},{key:"render",value:function(){var e=this.state,t=e.acTime,a=e.acMoney,n=e.acStock,o=e.acSummary,l=e.records;return r.a.createElement("div",null,r.a.createElement(D,{callback:this.updateAccount}),r.a.createElement("div",{className:"container"},r.a.createElement("table",{className:"table table-striped"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"\u5275\u5efa\u6642\u9593"),r.a.createElement("th",null,"\u5e33\u6236\u91d1\u984d"),r.a.createElement("th",null,"\u80a1\u7968\u5e33\u6236"),r.a.createElement("th",null,"\u7e3d\u91d1\u984d"))),r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("td",null,t),r.a.createElement("td",null,a),r.a.createElement("td",null,n),r.a.createElement("td",null,o))))),r.a.createElement("div",{className:"table-responsive"},r.a.createElement("table",{className:"table"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{scope:"col"},"#"),r.a.createElement("th",{scope:"col"},"\u5e33\u6236\u91d1\u984d"),r.a.createElement("th",{scope:"col"},"\u80a1\u7968\u91d1\u984d"),r.a.createElement("th",{scope:"col"},"\u8f49\u51fa\u91d1\u984d"),r.a.createElement("th",{scope:"col"},"\u8f49\u51fa\u6642\u9593"),r.a.createElement("th",{scope:"col"},"\u8f49\u5165\u91d1\u984d"),r.a.createElement("th",{scope:"col"},"\u8f49\u5165\u6642\u9593"),r.a.createElement("th",{scope:"col"},"\u4f86\u6e90"))),r.a.createElement("tbody",null,l&&l.map((function(e,t){return r.a.createElement(p,{ket:t,record:e,index:t})}))))))}}]),a}(n.Component),I=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).getActiveStyle=function(){return h.isMobile()&&"summary"===n.props.route?{marginTop:"5px",background:"rgb(232 232 232)"}:"summary"===n.props.route?{cursor:"pointer",background:"rgb(232 232 232)",borderRadius:"10px"}:void 0},n.getComputeStyleForMobile=function(){return h.isMobile()?{flexBasis:"100%",flexGrow:"1",alignItems:"center",color:"#ed2a2a",fontSize:"18px",fontWeight:"bold"}:{color:"#ed2a2a",fontSize:"18px",fontWeight:"bold"}},n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this.props,t=e.saleCost,a=e.profitAndLoss,n=e.profit,o=e.totalCost,l=e.route,c=e.changeRoute;return r.a.createElement("div",null,r.a.createElement("nav",{className:"navbar navbar-expand-md navbar-light ",style:{backgroundColor:"rgb(52 149 220)",cursor:"pointer"}},r.a.createElement("a",{className:"navbar-brand",onClick:function(e){return c("home")}},"Freedom of wealth"),r.a.createElement("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarCollapse","aria-controls":"navbarCollapse","aria-expanded":"false","aria-label":"Toggle navigation"},r.a.createElement("span",{className:"navbar-toggler-icon"})),r.a.createElement("div",{className:"collapse navbar-collapse",id:"navbarCollapse"},r.a.createElement("ul",{className:"navbar-nav mr-auto"},r.a.createElement("li",{className:"nav-item",style:Object(f.a)({},this.getActiveStyle())},r.a.createElement("a",{className:"nav-link",onClick:function(e){return c("summary")}},"\u6b77\u53f2\u7d00\u9304 ",r.a.createElement("span",{className:"sr-only"}))),r.a.createElement("li",{className:"nav-item"},r.a.createElement("a",{className:"nav-link",onClick:function(e){return c("account")}},"\u6211\u7684\u5e33\u6236")))),r.a.createElement("div",{style:Object(f.a)({display:"inherit"},this.getComputeStyleForMobile())},"summary"===l&&r.a.createElement("div",{style:{display:"flex"}},r.a.createElement("div",null,"\u6295\u5165\u6210\u672c:",t,"\u5143"),r.a.createElement("div",null,"\u7e3d\u640d\u76ca: ",a,"\u5143"),r.a.createElement("div",null,"\u6295\u6b96\u5229\u7387: ",n,"%")),"home"===l&&r.a.createElement("div",null,"\u7e3d\u6210\u672c: ",o,"\u5143"))))}}]),a}(n.Component),A={date:new Date,name:"",number:"",price:"",sheet:"",datePickerDate:new Date},_=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).inputDate=function(e){n.setState({date:e})},n.inputName=function(e){n.setState({name:e})},n.inputNumber=function(e){n.setState({number:e})},n.inputPrice=function(e){n.setState({price:e})},n.inputSheet=function(e){n.setState({sheet:e})},n.submitStock=function(){var e=n.state,t=e.date,a=e.name,r=e.number,o=e.price,l=e.sheet;if(!(t&&a&&r)||isNaN(o)||isNaN(l))return alert("\u4e0d\u8a31\u6709\u4efb\u4f55\u4e00\u500b\u70ba\u7a7a");var c={date:t,name:a,number:r,price:o,sheet:l};C.updateAccountRecord(c,!0),n.props&&n.props.callback(c),n.setState({name:"",number:"",price:"",sheet:""})},n.handleChange=function(e){n.setState({date:e,datePickerDate:e})},n.state=A,n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){this.setState({date:S.dateFormat(new Date),datePickerDate:S.dateFormat(new Date)})}},{key:"render",value:function(){var e=this,t=this.state.datePickerDate;return r.a.createElement("div",{style:{margin:"5px 5px"}},r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"col"},r.a.createElement("input",{type:"date",className:"form-control",placeholder:"\u65e5\u671f",onChange:function(t){return e.handleChange(t.target.value)},value:t})),r.a.createElement("div",{className:"from-group col-md-2 input-sale-frame"},r.a.createElement("input",{type:"text",className:"form-control",placeholder:"\u80a1\u7968\u540d\u7a31",onChange:function(t){return e.inputName(t.target.value)},value:this.state.name})),r.a.createElement("div",{className:"from-group col-md-2 input-sale-frame"},r.a.createElement("input",{type:"text",className:"form-control",placeholder:"\u7de8\u865f",onChange:function(t){return e.inputNumber(t.target.value)},value:this.state.number})),r.a.createElement("div",{className:"from-group col-md-2 input-sale-frame"},r.a.createElement("input",{type:"text",className:"form-control",placeholder:"\u55ae\u50f9",onChange:function(t){return e.inputPrice(t.target.value)},value:this.state.price})),r.a.createElement("div",{className:"from-group col-md-2 input-sale-frame"},r.a.createElement("input",{type:"text",className:"form-control",placeholder:"\u5f35\u6578",onChange:function(t){return e.inputSheet(t.target.value)},value:this.state.sheet})),r.a.createElement("button",{className:"btn btn-primary from-group col-md-2 input-sale-frame",type:"submit",onClick:this.submitStock},"\u78ba\u8a8d\u9001\u51fa")))}}]),a}(n.Component),F={},R=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).updateStockStatus=function(){var e=n.props.stock,t=parseInt(n.price.value);e.sheet<n.sheet.value||isNaN(t)||!t?alert("\u8ce3\u51fa\u5f35\u6578\u932f\u8aa4"):(n.props.stockSaleCallback(n.price.value,n.sheet.value,e),n.price.value="",n.sheet.value="")},n.deleteStock=function(){var e=n.props.stock;n.props.delete(e.timestamp)},n.state=F,n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){}},{key:"render",value:function(){var e=this,t=this.props,a=t.stock,n=t.saleStatus,o=t.index,l=t.route,c=(1.001425*a.price).toFixed(3),s=1e3*a.price*a.sheet*.001424<20?20:Math.round(1e3*a.price*a.sheet*.001424);return console.log(a.status),r.a.createElement("tr",null,r.a.createElement("th",{scope:"row"},o),!this.props.hideFiled&&r.a.createElement("td",{key:o},r.a.createElement("button",{type:"button",className:"btn btn-info","data-toggle":"modal","data-target":"#modal-".concat(o)},"\u8ce3\u51fa"),r.a.createElement("div",null,r.a.createElement("div",{className:"modal fade",id:"modal-".concat(o),tabIndex:"-1",role:"dialog","aria-labelledby":"exampleModalLabel","aria-hidden":"true"},r.a.createElement("div",{className:"modal-dialog",role:"document"},r.a.createElement("div",{className:"modal-content"},r.a.createElement("div",{className:"modal-header"},r.a.createElement("h5",{className:"modal-title",style:{color:"black"},id:"exampleModalLabel"},"\u8ce3\u51fa\u8cc7\u8a0a"),r.a.createElement("button",{type:"button",className:"close","data-dismiss":"modal","aria-label":"Close"},r.a.createElement("span",{"aria-hidden":"true"},"\xd7"))),r.a.createElement("div",{className:"modal-body"},r.a.createElement("div",{className:"form-group"},r.a.createElement("label",{key:"price"+o,htmlFor:"price-name-".concat(o),className:"col-form-label"},"\u8ce3\u51fa\u55ae\u50f9:"),r.a.createElement("input",{type:"text",className:"form-control",id:"price-name-".concat(o),ref:function(t){e.price=t}})),r.a.createElement("div",{className:"form-group"},r.a.createElement("label",{key:"sheet"+o,htmlFor:"sheet-name-".concat(o),className:"col-form-label"},"\u8ce3\u51fa\u5f35\u6578:"),r.a.createElement("input",{type:"text",className:"form-control",id:"sheet-name-".concat(o),ref:function(t){e.sheet=t}}))),r.a.createElement("div",{className:"modal-footer"},r.a.createElement("button",{type:"button",className:"btn btn-primary","data-dismiss":"modal","aria-label":"Close",onClick:this.updateStockStatus},"\u78ba\u8a8d",a.name))))))),"sale"===n&&r.a.createElement("td",null,a.sale_date),"unsale"===n&&r.a.createElement("td",null,a.date),"home"!==l&&"all"===n&&("sale"===a.status?r.a.createElement("td",null,a.sale_date):r.a.createElement("td",null)),"home"!==l&&"all"===n&&("unsale"===a.status?r.a.createElement("td",null,a.date):r.a.createElement("td",null)),r.a.createElement("td",null,a.name),r.a.createElement("td",null,a.number),r.a.createElement("td",null,c),r.a.createElement("td",null,a.sheet),r.a.createElement("td",null,s.toFixed(0)),r.a.createElement("td",null,a.cost.toFixed(0)),r.a.createElement("td",null,"unsale"===a.status?"\u672a\u8ce3\u51fa":"\u5df2\u8ce3\u51fa"),r.a.createElement("td",null,a.sale_cost.toFixed(2)),r.a.createElement("td",{style:{color:a.income<0?"#30ff30":"rgb(255 19 19)"}},a.income.toFixed(2)),r.a.createElement("td",null,r.a.createElement("button",{type:"button",className:"btn btn-danger",onClick:this.deleteStock},"\u522a\u9664")))}}]),a}(n.Component),T=(a(39),{startStandardDate:"",endStandardDate:"",dateRegion1:"",dateRegion2:"",saleStatus:"all",stockStatus:"individual"}),z=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).queryRegion=function(){var e=n.state,t=e.dateRegion1,a=e.dateRegion2,r=e.saleStatus,o=e.stockStatus;if(!(t&&a&&r&&o))return alert("\u4e0d\u8a31\u6709\u4efb\u4f55\u4e00\u500b\u70ba\u7a7a");var l={dateRegion1:t,dateRegion2:a,saleStatus:r,stockStatus:o};n.props&&n.props.callback(l),n.setState({date:"",name:"",number:"",price:"",sheet:""})},n.handleStartDateChange=function(e){return n.setState({startStandardDate:e,dateRegion1:e})},n.handleEndDateChange=function(e){return n.setState({endStandardDate:e,dateRegion2:e})},n.getSaleOptions=function(e){return n.setState({saleStatus:e.target.value})},n.getStockOptions=function(e){return n.setState({stockStatus:e.target.value})},n.getMobileStyleOfButton=function(){return{margin:"3px 0px"}},n.state=T,n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){this.setState({date:S.dateFormat(new Date),dateRegion1:S.dateFormat(new Date),dateRegion2:S.dateFormat(new Date),startStandardDate:S.dateFormat(new Date),endStandardDate:S.dateFormat(new Date)})}},{key:"render",value:function(){var e=this,t=this.state,a=t.startStandardDate,n=t.endStandardDate,o=h.isMobile();return r.a.createElement("div",null,r.a.createElement("div",{className:"form-row",style:{margin:"5px",overflowY:o?"scroll":"unset"}},r.a.createElement("button",{type:"button",className:"btn btn-info from-group col-md-2",style:{margin:"3px 5px"},onClick:this.props.resetCallBack},"\u986f\u793a\u5168\u90e8 Stock "),r.a.createElement("div",{style:{margin:"5px",float:"left",display:"flex",alignItems:"center",width:h.isMobile()?"100%":"auto"}},r.a.createElement("div",null,"\u8d77\u59cb\u5340\u9593:"),r.a.createElement("div",{className:"col"},r.a.createElement("input",{type:"date",className:"form-control",placeholder:"\u65e5\u671f",onChange:function(t){return e.handleStartDateChange(t.target.value)},value:a}))),r.a.createElement("div",{style:{margin:"5px",float:"left",display:"flex",alignItems:"center",width:h.isMobile()?"100%":"auto"}},r.a.createElement("div",null,"\u7d50\u675f\u5340\u9593:"),r.a.createElement("div",{className:"col"},r.a.createElement("input",{type:"date",className:"form-control",placeholder:"\u65e5\u671f",onChange:function(t){return e.handleEndDateChange(t.target.value)},value:n}))),r.a.createElement("div",{className:"btn-group btn-group-toggle"+(o?" from-group col-md-6":" from-group col-md-2"),"data-toggle":"buttons",style:Object(f.a)({margin:"0px 10px",zIndex:0},this.getMobileStyleOfButton())},r.a.createElement("label",{className:"btn btn-secondary active",onClick:this.getSaleOptions},r.a.createElement("input",{type:"radio",name:"saleOption",id:"saleOption1",value:"all",autoComplete:"off"})," \u5168\u90e8"),r.a.createElement("label",{className:"btn btn-secondary",onClick:this.getSaleOptions},r.a.createElement("input",{type:"radio",name:"saleOption",id:"saleOption2",value:"sale",autoComplete:"off"})," \u5df2\u8ce3\u51fa"),r.a.createElement("label",{className:"btn btn-secondary",onClick:this.getSaleOptions},r.a.createElement("input",{type:"radio",name:"saleOption",id:"saleOption3",value:"unsale",autoComplete:"off"})," \u672a\u8ce3\u51fa")),r.a.createElement("div",{className:"btn-group btn-group-toggle from-group col-md-2","data-toggle":"buttons",style:Object(f.a)({margin:"0px 10px",zIndex:0},this.getMobileStyleOfButton())},r.a.createElement("label",{className:"btn btn-warning active",onClick:this.getStockOptions},r.a.createElement("input",{type:"radio",name:"stockOption",id:"individual",value:"individual",autoComplete:"off"})," \u500b\u5225\u80a1")),r.a.createElement("button",{className:"btn btn-primary "+(o?" from-group col-md-2":" from-group col-md-1"),type:"submit",style:{margin:"3px 5px"},onClick:this.queryRegion},"\u67e5\u8a62\u9001\u51fa")))}}]),a}(n.Component),B={allData:[],allStocks:"",isQueryOpen:!1},Q=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).queryData=function(e){return n.props.queryDataCallback(e)},n.isQueryOpen=function(e){return n.setState({isQueryOpen:e})},n.getQueryStatus=function(){return!h.isMobile()||n.state.isQueryOpen},n.state=B,n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var e=this.props;e&&this.setState({allStocks:e})}},{key:"render",value:function(){var e=this,t=this.props,a=t.allStocks,n=t.deleteCallback,o=t.queryDataCallback,l=t.saleStockCallback,c=t.resetCallBack,s=t.hideFiled,i=t.saleStatus,u=t.route,m=this.state.isQueryOpen,d=h.isMobile();return console.log("sale"===i&&"all"!==i),r.a.createElement("div",null,"summary"===u&&!m&&d&&r.a.createElement("button",{className:"btn btn-warning from-group col-md-2",type:"submit",onClick:function(){return e.isQueryOpen(!0)}},"\u67e5\u8a62\u6642\u5340"),"summary"===u&&m&&d&&r.a.createElement("button",{className:"btn btn-secondary from-group col-md-2",type:"submit",onClick:function(){return e.isQueryOpen(!1)}},"\u96b1\u85cf"),"summary"===u&&this.getQueryStatus()&&r.a.createElement(z,{callback:o,resetCallBack:c}),r.a.createElement("div",{style:{overflowY:h.isMobile()?"scroll":"unset"}},r.a.createElement("table",{className:"table table-dark"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{scope:"col"},"#"),!s&&r.a.createElement("th",{scope:"col"},"\u8ce3\u51fa"),"all"!==i&&("sale"===i?r.a.createElement("th",{scope:"col"},"\u8ce3\u51fa\u65e5\u671f"):r.a.createElement("th",{scope:"col"},"\u8cfc\u8cb7\u65e5\u671f")),"all"===i&&"home"!==u&&r.a.createElement("th",{scope:"col"},"\u8ce3\u51fa\u65e5\u671f"),"all"===i&&r.a.createElement("th",{scope:"col"},"\u8cfc\u8cb7\u65e5\u671f"),r.a.createElement("th",{scope:"col"},"\u80a1\u7968\u540d\u7a31"),r.a.createElement("th",{scope:"col"},"\u7de8\u865f"),r.a.createElement("th",{scope:"col"},"\u5e73\u5747\u55ae\u50f9"),r.a.createElement("th",{scope:"col"},"\u5f35\u6578"),r.a.createElement("th",{scope:"col"},"\u624b\u7e8c\u8cbb"),r.a.createElement("th",{scope:"col"},"\u8cfc\u8cb7\u6210\u672c"),r.a.createElement("th",{scope:"col"},"\u72c0\u614b"),r.a.createElement("th",{scope:"col"},"\u8ce3\u51fa\u7e3d\u50f9"),r.a.createElement("th",{scope:"col"},"\u640d\u76ca"),r.a.createElement("th",{scope:"col"},"\u522a\u9664"))),r.a.createElement("tbody",null,0!==a.length&&a.map((function(e,t){return r.a.createElement(R,{hideFiled:s,saleStatus:i,key:e.number+t,stock:e,index:t+1,route:u,stockSaleCallback:l,delete:function(e){return n(e)}})}))))))}}]),a}(n.Component),L={inputData:[],unSaleStocks:[],saleStocks:[],allStocks:[],showStocks:[],totalCost:0,route:"home",profitAndLoss:0,profit:0,saleCost:0,saleIsOpen:!1,saleStatus:"all"},q=function(e){Object(u.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).updateAllData=function(){C.getAllData().then((function(e){n.setState({saleStatus:"all",showStocks:e.showStocks,allStocks:e.allStocks,saleStocks:e.saleStocks,unSaleStocks:e.unSaleStocks,totalCost:e.totalCost,profitAndLoss:e.profitAndLoss,saleCost:e.saleCost,profit:(e.profitAndLoss/e.saleCost*100).toFixed(2)})}))},n.inputData=function(e){var t=Object(i.a)(n);C.insertNewData(e).then((function(){t.updateAllData()}))},n.deleteStock=function(e){C.deleteStock(e).then((function(){return n.updateAllData()}))},n.saleStock=function(e,t,a){console.log(e,t,a),C.updateStock(e,t,a).then((function(){n.updateAllData()}))},n.changeRoute=function(e){return n.setState({route:e})},n.updateQueryData=function(e){var t=n.state,a=t.allStocks,r=t.unSaleStocks,o=t.saleStocks,l=e.dateRegion1,c=e.dateRegion2,s=0,i=0,u=0,m="";if(console.log(a),n.setState({saleStatus:e.saleStatus}),"individual"===e.stockStatus){switch(e.saleStatus){case"all":m=(m=a.filter((function(e){return l<=e.date&&e.date<=c}))).concat(a.filter((function(e){return l<=e.sale_date&&e.sale_date<=c})));break;case"sale":m=o.filter((function(e){return l<=e.sale_date&&e.sale_date<=c}));break;case"unsale":m=r.filter((function(e){return l<=e.date&&e.date<=c}))}for(var d in m)u+=m[d].income,i+=m[d].sale_cost;s=(u/i*100).toFixed(2),n.setState({showStocks:m,profit:s,saleCost:i,profitAndLoss:u})}else e.stockStatus},n.reset=function(){return n.updateAllData()},n.saleIsOpen=function(){return n.setState({saleIsOpen:!n.state.saleIsOpen})},n.getSaleIsStatus=function(){return!h.isMobile()||n.state.saleIsOpen},n.state=L,n}return Object(s.a)(a,[{key:"componentDidMount",value:function(){this.updateAllData()}},{key:"render",value:function(){var e=this,t=this.state.inputData,a=this.state.unSaleStocks,n=this.state.showStocks;return r.a.createElement("div",{className:"App",style:{height:window.innerHeight,margin:"0 auto"}},r.a.createElement(I,{totalCost:this.state.totalCost,profitAndLoss:this.state.profitAndLoss,route:this.state.route,changeRoute:this.changeRoute,profit:this.state.profit,saleCost:this.state.saleCost}),h.isMobile()&&!this.state.saleIsOpen&&"home"===this.state.route&&r.a.createElement("button",{className:"btn btn-warning from-group col-md-2 input-sale-frame",type:"submit",onClick:function(){return e.saleIsOpen(!0)}},"\u8cb7\u5165"),h.isMobile()&&this.state.saleIsOpen&&"home"===this.state.route&&r.a.createElement("button",{className:"btn btn-secondary from-group col-md-2 input-sale-frame",type:"submit",onClick:function(){return e.saleIsOpen(!1)}},"\u96b1\u85cf"),this.getSaleIsStatus()&&"home"===this.state.route&&r.a.createElement(_,{callback:this.inputData}),"home"===this.state.route&&r.a.createElement(Q,{hideFiled:!1,saleStatus:this.state.saleStatus,inputData:t,allStocks:a,deleteCallback:this.deleteStock,saleStockCallback:this.saleStock,route:this.state.route}),"summary"===this.state.route&&r.a.createElement(Q,{hideFiled:!0,saleStatus:this.state.saleStatus,inputData:t,allStocks:n,deleteCallback:this.deleteStock,saleStockCallback:this.saleStock,route:this.state.route,queryDataCallback:this.updateQueryData,resetCallBack:this.reset}),"account"===this.state.route&&r.a.createElement(M,null))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(q,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[22,1,2]]]);
//# sourceMappingURL=main.9046b89f.chunk.js.map