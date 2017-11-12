webpackJsonp([39],{426:function(e,t,o){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function a(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i=o(0),s=o.n(i),l=o(1),u=o.n(l),c=function(){function e(e,t){for(var o=0;o<t.length;o++){var r=t[o];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,o,r){return o&&e(t.prototype,o),r&&e(t,r),t}}(),p=function(e){return Object.keys(e).map(function(t){return e[t]})},f={PNG:"png",PNG32:"png32",GIF:"gif",JPG:"jpg",JPG_BASELINE:"jpg-baseline"},m={ROADMAP:"roadmap",SATELLITE:"satellite",TERRAIN:"terrain",HYBRID:"hybrid"},d=p(f),y=p(m),h=function(e){function t(){var e,o,a,i;r(this,t);for(var s=arguments.length,l=Array(s),u=0;u<s;u++)l[u]=arguments[u];return o=a=n(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(l))),a.state={loading:!0,coords:{latitude:14.1249952,longitude:-89.4984326},url:"",willUnmount:!1},a.RootUrl="http://maps.googleapis.com/maps/api/staticmap",a.ImageFormats=f,a.MapTypes=m,a.staticMapUrl=function(){var e=a.props,t=e.address,o=e.zoom,r=e.size,n=e.scale,i=e.format,s=e.mapType,l=r.width,u=r.height,c=a.RootUrl,p=function(e){var t=e.latitude,r=e.longitude;return c+"?center="+t+","+r+"&zoom="+o+"&scale="+n+"&size="+l+"x"+u+"&maptype="+s+"&format="+i+"&markers=color:green|"+t+","+r+"&"+a.apiKeyParam()},f=new google.maps.Geocoder,m=0;!function e(o){f.geocode({address:o},function(o,r){if("OK"===r){var n=o[0].geometry.location.lat(),i=o[0].geometry.location.lng();a.setState(function(e){return e.willUnmount?{}:{loading:!1,coords:{latitude:n,longitude:i},url:p({latitude:n,longitude:i})}})}else m<t.length&&(m++,e(t[m]))})}(t[0])},a.apiKeyParam=function(){return"key=AIzaSyBcCAMUx2XoTD4elmb09j2EliOq11w9nI0"},i=o,n(a,i)}return a(t,e),c(t,[{key:"componentWillMount",value:function(){var e=this,t=this.props,o=t.zoom,r=t.size,n=t.scale,a=t.format,i=t.mapType,s=t.address,l=r.width,u=r.height,c=this.RootUrl;this.setState({url:function(t){var r=t.addr;return c+"?center="+r+"&zoom="+o+"&scale="+n+"&size="+l+"x"+u+"&maptype="+i+"&format="+a+"&"+e.apiKeyParam()}({addr:s[0]})})}},{key:"componentDidMount",value:function(){this.staticMapUrl()}},{key:"componentWillUnmount",value:function(){this.setState({willUnmount:!0})}},{key:"render",value:function(){var e=this.state.url,t=this.props,o=t.address,r=t.style;return s.a.createElement("img",{alt:"user location: "+o[0],style:r,src:e})}}]),t}(i.Component);h.propTypes={address:u.a.array.isRequired,size:u.a.shape({width:u.a.number.isRequired,height:u.a.number.isRequired}),style:u.a.object,zoom:u.a.number.isRequired,scale:u.a.number,format:u.a.oneOf(d),mapType:u.a.oneOf(y),hasCenterMarker:u.a.bool},h.defaultProps={format:f.PNG,mapType:m.ROADMAP,hasCenterMarker:!0,scale:1},t.default=h}});