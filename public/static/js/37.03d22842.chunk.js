webpackJsonp([37],{411:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(134);n.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},u=r.default.filter(function(n){return n.name===e}),i=n?Object.keys(n):[],l=t?Object.keys(t):[];if(u.length){var o=u[0].path,a=l.map(function(e){return e+"="+t[e]}).join("&");return i.forEach(function(e){o=o.replace(":"+e,n[e]||"undef")}),l.length?o+"?"+a:o}return null}}});