module.exports=function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(n){return e[n]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=2)}([function(e){e.exports=require("electron")},function(e){e.exports=require("path")},function(e,n,t){"use strict";function r(){(a=new o.BrowserWindow({height:563,useContentSize:!0,width:1e3,webPreferences:{javascript:!0,plugins:!0,nodeIntegration:!0,webSecurity:!1,preload:u.a.join(__dirname,"../renderer/index.js")}})).loadURL(l),a.on("closed",(function(){a=null}))}t.r(n);var o=t(0),i=(t.n(o),t(1)),u=t.n(i);global.__static=t(1).join(__dirname,"/static").replace(/\\/g,"\\\\");var a=void 0,l="file://"+__dirname+"/index.html";o.app.on("ready",r),o.app.on("window-all-closed",(function(){"darwin"!==process.platform&&o.app.quit()})),o.app.on("activate",(function(){null===a&&r()}))}]);