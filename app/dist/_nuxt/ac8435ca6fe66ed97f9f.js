(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{143:function(t,e,r){var content=r(150);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(47).default)("1f2ba836",content,!0,{sourceMap:!1})},144:function(t,e,r){var content=r(152);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(47).default)("36873827",content,!0,{sourceMap:!1})},145:function(t,e,r){"use strict";var n=r(7),o=r(146)(5),c=!0;"find"in[]&&Array(1).find(function(){c=!1}),n(n.P+n.F*c,"Array",{find:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}}),r(66)("find")},146:function(t,e,r){var n=r(25),o=r(63),c=r(26),l=r(17),d=r(147);t.exports=function(t,e){var r=1==t,f=2==t,h=3==t,m=4==t,v=6==t,x=5==t||v,k=e||d;return function(e,d,y){for(var w,_,S=c(e),j=o(S),J=n(d,y,3),N=l(j.length),P=0,C=r?k(e,N):f?k(e,0):void 0;N>P;P++)if((x||P in j)&&(_=J(w=j[P],P,S),t))if(r)C[P]=_;else if(_)switch(t){case 3:return!0;case 5:return w;case 6:return P;case 2:C.push(w)}else if(m)return!1;return v?-1:h||m?m:C}}},147:function(t,e,r){var n=r(148);t.exports=function(t,e){return new(n(t))(e)}},148:function(t,e,r){var n=r(8),o=r(92),c=r(2)("species");t.exports=function(t){var e;return o(t)&&("function"!=typeof(e=t.constructor)||e!==Array&&!o(e.prototype)||(e=void 0),n(e)&&null===(e=e[c])&&(e=void 0)),void 0===e?Array:e}},149:function(t,e,r){"use strict";var n=r(143);r.n(n).a},150:function(t,e,r){(t.exports=r(46)(!1)).push([t.i,'.toggle-button[data-v-a56a1990]{align-items:center;justify-content:center;display:inline-flex}.toggle[data-v-a56a1990]{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:50px;height:25px;background:#eee;border:none;border-radius:20px;box-shadow:2px 2px 2px #e0e0e0;margin-left:.5rem;position:relative}.toggle[data-v-a56a1990]:after{content:"";position:absolute;width:18px;height:18px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);left:5px;transition:all .2s ease;background:#fff;border-radius:50%}.toggle.checked[data-v-a56a1990]{background:#90ee90}.toggle.checked[data-v-a56a1990]:after{left:27px}',""])},151:function(t,e,r){"use strict";var n=r(144);r.n(n).a},152:function(t,e,r){(t.exports=r(46)(!1)).push([t.i,".container{margin:0 auto;min-height:100vh;padding:2rem 0;display:flex;justify-content:flex-start;align-items:center;text-align:center;flex-direction:column}.container>input[type=text]{padding:.75rem 1rem;border-radius:20px;width:75%;border:0;background-color:#eee;color:#333;outline:0}.container>input[type=text]:focus{box-shadow:0 0 1px #00f}.cards{width:100%;padding:0 1rem;display:flex;flex-wrap:wrap;justify-content:space-between}.card,.cards{max-width:100%}.card{margin:.75rem;border:1px solid #efefef;box-shadow:1px 1px 2px #e0e0e0;border-radius:5px;padding:1rem;text-align:left;flex-grow:1;flex-shrink:1;flex-basis:1;overflow:scroll}.card h1{font-size:1.5rem;color:#333;margin-bottom:1rem}.card h1 small{font-size:.75rem;color:#dfdfdf;display:block;margin-top:.5rem}.card h1,.card h1 small{word-wrap:break-word}.card ul{list-style:none;margin:0;padding:0}.card ul li{margin-bottom:.5rem}.card .stdout{background-color:#0c1022;border-radius:7px;box-shadow:inset 0 0 2px #333;max-height:0;max-width:100%;overflow:scroll;padding:0;color:#fff;transition:all .2s ease;margin:0}.card .stdout.active{max-height:250px;padding:.75rem;margin:.75rem 0}",""])},153:function(t,e,r){"use strict";r.r(e);var n={name:"toggle-button",props:{value:Boolean},methods:{toggle:function(){this.$emit("input",!this.value)}}},o=(r(149),r(23)),component=Object(o.a)(n,function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"toggle-button"},[this._t("default"),this._v(" "),e("input",{staticClass:"toggle",class:this.value?"checked":"not-checked",attrs:{type:"checkbox"},domProps:{value:this.value},on:{change:this.toggle}})],2)},[],!1,null,"a56a1990",null);e.default=component.exports},154:function(t,e,r){"use strict";r.r(e);r(48);var n=r(6),o=(r(93),r(12));r(145),r(64),r(65),r(49);function c(t){return function(t){if(Array.isArray(t)){for(var i=0,e=new Array(t.length);i<t.length;i++)e[i]=t[i];return e}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var l={components:{ToggleButton:r(153).default},methods:{newSocket:function(){var t=this;this.socket=new WebSocket("ws://localhost:1338"),this.socket.onopen=function(){console.log("[NCP] Socket open"),t.socket.onmessage=function(e){var r=JSON.parse(e.data),n=r.action,l=r.payload;switch(console.log(l),n){case"init":t.folderList=[].concat(c(t.folderList),c(l));break;case"searchResult":var d=!0,f=!1,h=void 0;try{for(var m,v=function(){var e=m.value;if(!t.folderList.find(function(t){return t.folderPath===e.folderPath})){for(var r in e.packageJson.scripts)e.packageJson.scripts[r]={script:e.packageJson.scripts[r],name:r,launched:!0===e.packageJson.scripts[r],stdout:[],stderr:[]};t.folderList=[].concat(c(t.folderList),[Object(o.a)({},e,{searchTerm:t.search})])}},x=l.folders[Symbol.iterator]();!(d=(m=x.next()).done);d=!0)v()}catch(t){f=!0,h=t}finally{try{d||null==x.return||x.return()}finally{if(f)throw h}}break;case"projects":break;case"childStdout":t.folderList.find(function(t){return t.folderPath===l.project}).packageJson.scripts[l.scriptName].stdout.push(l.stdout);break;case"childStderr":t.folderList.find(function(t){return t.folderPath===l.project}).packageJson.scripts[l.scriptName].stdout.push(l.stderr);break;case"childStop":t.folderList.find(function(t){return t.folderPath===l.project}).packageJson.scripts[l.scriptName].stdout.push("Exited with code: ".concat(l.code)),t.folderList.find(function(t){return t.folderPath===l.project}).packageJson.scripts[l.scriptName].launched=!1}},t.socket.onclose=function(){console.log("[NCP] Socket closed"),setTimeout(t.newSocket,500)}}},sendUrl:function(){this.socket.send(JSON.stringify({action:"search",payload:this.search}))},toggleScript:function(){var t=Object(n.a)(regeneratorRuntime.mark(function t(e,r,n){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:n?this.socket.send(JSON.stringify({action:"stopScript",payload:{project:e,scriptName:r}})):this.socket.send(JSON.stringify({action:"startScript",payload:{project:e,scriptName:r}})),this.folderList.find(function(t){return t.folderPath===e}).packageJson.scripts[r].launched=!n;case 2:case"end":return t.stop()}},t,this)}));return function(e,r,n){return t.apply(this,arguments)}}()},data:function(){return{folderList:[],search:"",socket:null}},computed:{folders:function(){var t=this;return this.folderList.filter(function(e){return e.searchTerm===t.search})}},created:function(){console.log("[NCP] Welcome to the NCP Dev Console! Feel free to look around, and enjoy yourself! 👋"),this.newSocket()}},d=(r(151),r(23)),component=Object(d.a)(l,function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("section",{staticClass:"container"},[r("input",{directives:[{name:"model",rawName:"v-model",value:t.search,expression:"search"}],attrs:{type:"text"},domProps:{value:t.search},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.sendUrl(e)},input:function(e){e.target.composing||(t.search=e.target.value)}}}),t._v(" "),r("div",{staticClass:"cards"},t._l(t.folders,function(e){return r("div",{staticClass:"card"},[r("h1",[t._v("\n\t\t\t\t"+t._s(e.projectName)+"\n\t\t\t\t"),r("small",[t._v(t._s(e.folderPath))])]),t._v(" "),r("ul",t._l(e.packageJson.scripts,function(script){return r("li",[r("toggle-button",{attrs:{value:script.launched},on:{input:function(r){return t.toggleScript(e.folderPath,script.name,script.launched)}}},[r("pre",[t._v(t._s(script.name))])]),t._v(" "),r("div",{staticClass:"stdout",class:{active:script.stdout.length>0}},t._l(script.stdout,function(e){return r("pre",[t._v("                            "+t._s(e)+"\n                        ")])}),0)],1)}),0)])}),0)])},[],!1,null,null,null);e.default=component.exports}}]);