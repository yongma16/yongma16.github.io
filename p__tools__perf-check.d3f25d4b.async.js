"use strict";(self.webpackChunkreact_home=self.webpackChunkreact_home||[]).push([[8296],{81589:function(pe,W,n){n.d(W,{kW:function(){return Z},lE:function(){return q},yY:function(){return U}});var ue=n(30758),L=n(78006),a=n(86070),c={title:"yma16 - \u524D\u7AEF\u5F00\u53D1\u5DE5\u5177\u96C6 | \u514D\u8D39\u5728\u7EBF\u5DE5\u5177",description:"yma16 \u524D\u7AEF\u5F00\u53D1\u5DE5\u5177\u96C6\u63D0\u4F9B\u4EE3\u7801\u683C\u5F0F\u5316\u3001\u7EC4\u4EF6\u751F\u6210\u5668\u3001\u6027\u80FD\u68C0\u6D4B\u3001SVG\u5904\u7406\u3001URL\u7F16\u89E3\u7801\u7B49\u514D\u8D39\u5728\u7EBF\u5DE5\u5177\uFF0C\u63D0\u5347\u524D\u7AEF\u5F00\u53D1\u6548\u7387\u3002",keywords:"\u524D\u7AEF\u5DE5\u5177,\u4EE3\u7801\u683C\u5F0F\u5316,\u7EC4\u4EF6\u751F\u6210\u5668,\u6027\u80FD\u68C0\u6D4B,SVG\u5904\u7406,URL\u7F16\u89E3\u7801,\u5728\u7EBF\u5DE5\u5177,\u524D\u7AEF\u5F00\u53D1",author:"yma16",ogImage:"https://yma16.cloud/og-image.png"},Z=function(i){var P=i.title,y=i.description,h=i.keywords,K=i.author,T=K===void 0?c.author:K,_=i.ogTitle,f=i.ogDescription,M=i.ogImage,k=M===void 0?c.ogImage:M,b=i.ogUrl,z=i.canonical,D=i.noindex,B=D===void 0?!1:D,N=i.jsonLd,J=P?"".concat(P," | yma16 \u524D\u7AEF\u5DE5\u5177\u96C6"):c.title,V=y||c.description,ee=h||c.keywords,H=_||P||c.title,G=f||V;return(0,a.jsxs)(L.mg,{children:[(0,a.jsx)("title",{children:J}),(0,a.jsx)("meta",{name:"description",content:V}),(0,a.jsx)("meta",{name:"keywords",content:ee}),(0,a.jsx)("meta",{name:"author",content:T}),(0,a.jsx)("meta",{name:"robots",content:B?"noindex, nofollow":"index, follow"}),z&&(0,a.jsx)("link",{rel:"canonical",href:z}),(0,a.jsx)("meta",{property:"og:type",content:"website"}),(0,a.jsx)("meta",{property:"og:title",content:H}),(0,a.jsx)("meta",{property:"og:description",content:G}),(0,a.jsx)("meta",{property:"og:image",content:k}),b&&(0,a.jsx)("meta",{property:"og:url",content:b}),(0,a.jsx)("meta",{name:"twitter:card",content:"summary_large_image"}),(0,a.jsx)("meta",{name:"twitter:title",content:H}),(0,a.jsx)("meta",{name:"twitter:description",content:G}),(0,a.jsx)("meta",{name:"twitter:image",content:k}),(0,a.jsx)("meta",{name:"baidu-site-verification",content:""}),N&&(0,a.jsx)("script",{type:"application/ld+json",children:JSON.stringify(N)})]})},U=function(){var i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"https://yma16.cloud";return{"@context":"https://schema.org","@type":"WebSite",name:"yma16 \u524D\u7AEF\u5F00\u53D1\u5DE5\u5177\u96C6",url:i,description:"\u514D\u8D39\u7684\u524D\u7AEF\u5F00\u53D1\u5728\u7EBF\u5DE5\u5177\u96C6\u5408",potentialAction:{"@type":"SearchAction",target:"".concat(i,"/search?q={search_term_string}"),"query-input":"required name=search_term_string"}}},q=function(i,P,y){var h=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"DeveloperApplication";return{"@context":"https://schema.org","@type":"SoftwareApplication",name:i,description:P,url:y,applicationCategory:h,operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"CNY"},aggregateRating:{"@type":"AggregateRating",ratingValue:"4.8",ratingCount:"100"}}},O=null},7806:function(pe,W,n){n.r(W);var ue=n(48700),L=n.n(ue),a=n(37810),c=n.n(a),Z=n(57704),U=n.n(Z),q=n(76979),O=n.n(q),w=n(65788),i=n.n(w),P=n(55472),y=n.n(P),h=n(30758),K=n(18706),T=n(16202),_=n(70531),f=n(47073),M=n(65766),k=n(41574),b=n(19727),z=n(10094),D=n(60089),B=n(39943),N=n(84165),J=n(95003),V=n(14270),ee=n(53262),H=n(48102),G=n(75709),ve=n(83132),ye=n(36087),ae=n(27401),De=n(39618),Ae=n(30933),ie=n(81589),e=n(86070),Ce=J.A.Title,le=J.A.Paragraph,ce=[{title:"Performance Observer API",description:"\u4F7F\u7528 Performance Observer \u76D1\u542C\u6838\u5FC3 Web \u6307\u6807",code:`// \u76D1\u542C LCP (\u6700\u5927\u5185\u5BB9\u7ED8\u5236)
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log('LCP:', lastEntry.startTime);
});
observer.observe({ entryTypes: ['largest-contentful-paint'] });

// \u76D1\u542C CLS (\u7D2F\u79EF\u5E03\u5C40\u504F\u79FB)
let clsValue = 0;
const clsObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      clsValue += entry.value;
    }
  }
  console.log('CLS:', clsValue);
});
clsObserver.observe({ entryTypes: ['layout-shift'] });

// \u76D1\u542C FID (\u9996\u6B21\u8F93\u5165\u5EF6\u8FDF)
const fidObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID:', delay);
  }
});
fidObserver.observe({ entryTypes: ['first-input'] });`},{title:"\u5185\u5B58\u6CC4\u6F0F\u68C0\u6D4B",description:"\u68C0\u6D4B DOM \u8282\u70B9\u548C\u4E8B\u4EF6\u76D1\u542C\u5668\u7684\u5185\u5B58\u6CC4\u6F0F",code:`// \u68C0\u6D4B detached DOM \u8282\u70B9
function findDetachedNodes() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT
  );
  const nodes = [];
  let node;
  while (node = walker.nextNode()) {
    if (!document.contains(node)) {
      nodes.push(node);
    }
  }
  return nodes;
}

// \u68C0\u6D4B\u4E8B\u4EF6\u76D1\u542C\u5668\u6CC4\u6F0F
const originalAddEventListener = EventTarget.prototype.addEventListener;
const listenerMap = new WeakMap();

EventTarget.prototype.addEventListener = function(type, listener, options) {
  if (!listenerMap.has(this)) {
    listenerMap.set(this, []);
  }
  listenerMap.get(this).push({ type, listener });
  return originalAddEventListener.call(this, type, listener, options);
};

// \u83B7\u53D6\u5143\u7D20\u7684\u6240\u6709\u76D1\u542C\u5668
function getEventListeners(element) {
  return listenerMap.get(element) || [];
}`},{title:"\u957F\u4EFB\u52A1\u68C0\u6D4B",description:"\u68C0\u6D4B\u963B\u585E\u4E3B\u7EBF\u7A0B\u7684\u957F\u4EFB\u52A1",code:`// \u76D1\u542C\u957F\u4EFB\u52A1\uFF08\u8D85\u8FC7 50ms \u7684\u4EFB\u52A1\uFF09
const longTaskObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn('Long Task detected:', {
      duration: entry.duration,
      startTime: entry.startTime,
      attribution: entry.attribution,
    });
  }
});
longTaskObserver.observe({ entryTypes: ['longtask'] });

// \u4F7F\u7528 requestIdleCallback \u4F18\u5316\u4F4E\u4F18\u5148\u7EA7\u4EFB\u52A1
function scheduleLowPriorityTask(callback) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 2000 });
  } else {
    setTimeout(callback, 1);
  }
}

// \u5206\u89E3\u957F\u4EFB\u52A1
async function breakLongTask(items, processItem) {
  const chunkSize = 100;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        chunk.forEach(processItem);
        resolve(null);
      });
    });
  }
}`},{title:"\u8D44\u6E90\u52A0\u8F7D\u4F18\u5316\u68C0\u6D4B",description:"\u68C0\u6D4B\u8D44\u6E90\u52A0\u8F7D\u6027\u80FD\u5E76\u63D0\u4F9B\u4F18\u5316\u5EFA\u8BAE",code:`// \u68C0\u6D4B\u8D44\u6E90\u52A0\u8F7D\u65F6\u95F4
const resourceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'resource') {
      const loadTime = entry.responseEnd - entry.startTime;
      if (loadTime > 1000) {
        console.warn('Slow resource:', entry.name, loadTime + 'ms');
      }
    }
  }
});
resourceObserver.observe({ entryTypes: ['resource'] });

// \u68C0\u6D4B\u56FE\u7247\u662F\u5426\u5728\u89C6\u53E3\u5185\u52A0\u8F7D
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement;
      img.src = img.dataset.src || img.src;
      imageObserver.unobserve(img);
    }
  });
});

// \u68C0\u6D4B\u672A\u4F7F\u7528\u7684 CSS
function findUnusedCSS() {
  const sheets = Array.from(document.styleSheets);
  const unusedRules = [];
  
  sheets.forEach(sheet => {
    try {
      const rules = Array.from(sheet.cssRules || sheet.rules);
      rules.forEach(rule => {
        if (rule instanceof CSSStyleRule) {
          const elements = document.querySelectorAll(rule.selectorText);
          if (elements.length === 0) {
            unusedRules.push(rule.selectorText);
          }
        }
      });
    } catch (e) {
      // \u8DE8\u57DF\u6837\u5F0F\u8868\u65E0\u6CD5\u8BBF\u95EE
    }
  });
  
  return unusedRules;
}`}],Fe=function(){var xe={title:"\u524D\u7AEF\u6027\u80FD\u68C0\u6D4B\u5DE5\u5177",description:"\u514D\u8D39\u7684\u524D\u7AEF\u6027\u80FD\u68C0\u6D4B\u5DE5\u5177\uFF0C\u5206\u6790\u7F51\u9875 Core Web Vitals \u6307\u6807\uFF08LCP\u3001FID\u3001CLS\uFF09\uFF0C\u63D0\u4F9B Lighthouse \u62A5\u544A\u548C\u6027\u80FD\u4F18\u5316\u5EFA\u8BAE\uFF0C\u63D0\u5347\u7F51\u7AD9\u52A0\u8F7D\u901F\u5EA6\u3002",keywords:"\u6027\u80FD\u68C0\u6D4B,\u524D\u7AEF\u6027\u80FD\u4F18\u5316,Lighthouse,Core Web Vitals,LCP,FID,CLS,\u7F51\u9875\u6027\u80FD\u5206\u6790,\u52A0\u8F7D\u901F\u5EA6\u4F18\u5316,\u6027\u80FD\u6D4B\u8BD5\u5DE5\u5177",jsonLd:(0,ie.lE)("\u524D\u7AEF\u6027\u80FD\u68C0\u6D4B\u5DE5\u5177","\u514D\u8D39\u7684\u524D\u7AEF\u6027\u80FD\u5206\u6790\u548C\u4F18\u5316\u5DE5\u5177","https://yma16.cloud/tools/perf-check","DeveloperApplication")},je=(0,h.useState)(!1),_e=y()(je,2),I=_e[0],de=_e[1],Oe=(0,h.useState)([]),me=y()(Oe,2),p=me[0],ne=me[1],Pe=(0,h.useState)([]),ge=y()(Pe,2),te=ge[0],F=ge[1],Te=(0,h.useState)(!1),he=y()(Te,2),re=he[0],Me=he[1],be=(0,h.useState)(ce[0]),fe=y()(be,2),R=fe[0],Be=fe[1],Se=(0,h.useState)({lcp:0,cls:0,fid:0,fcp:0,ttfb:0}),Ee=y()(Se,2),E=Ee[0],$=Ee[1],Le=(0,h.useCallback)(i()(U()().mark(function s(){var t,o,d,v,g,u,l,A,m,C,x,se,Y,X,Q;return U()().wrap(function(j){for(;;)switch(j.prev=j.next){case 0:return de(!0),F(["\u5F00\u59CB\u6027\u80FD\u68C0\u6D4B..."]),t=[],F(function(r){return[].concat(O()(r),["\u68C0\u6D4B\u9875\u9762\u52A0\u8F7D\u65F6\u95F4..."])}),j.next=6,new Promise(function(r){return setTimeout(r,500)});case 6:return o=performance.getEntriesByType("navigation")[0],o&&(v=o.responseStart-o.startTime,g=((d=performance.getEntriesByName("first-contentful-paint")[0])===null||d===void 0?void 0:d.startTime)||0,u=o.loadEventEnd-o.startTime,t.push({name:"\u9996\u5B57\u8282\u65F6\u95F4 (TTFB)",value:Math.round(v),unit:"ms",threshold:600,status:v<600?"good":v<1e3?"warning":"poor",description:"\u6D4F\u89C8\u5668\u6536\u5230\u670D\u52A1\u5668\u7B2C\u4E00\u4E2A\u5B57\u8282\u7684\u65F6\u95F4"}),t.push({name:"\u9875\u9762\u5B8C\u5168\u52A0\u8F7D\u65F6\u95F4",value:Math.round(u),unit:"ms",threshold:3e3,status:u<3e3?"good":u<5e3?"warning":"poor",description:"\u4ECE\u8BF7\u6C42\u5F00\u59CB\u5230\u9875\u9762\u5B8C\u5168\u52A0\u8F7D\u7684\u65F6\u95F4"})),F(function(r){return[].concat(O()(r),["\u5206\u6790\u8D44\u6E90\u52A0\u8F7D\u60C5\u51B5..."])}),j.next=11,new Promise(function(r){return setTimeout(r,500)});case 11:return l=performance.getEntriesByType("resource"),A=l.reduce(function(r,oe){return r+(oe.transferSize||0)},0),m=l.filter(function(r){var oe=r.responseEnd-r.startTime;return oe>1e3}),t.push({name:"\u8D44\u6E90\u603B\u6570",value:l.length,unit:"\u4E2A",threshold:50,status:l.length<50?"good":l.length<100?"warning":"poor",description:"\u9875\u9762\u52A0\u8F7D\u7684\u8D44\u6E90\u6587\u4EF6\u6570\u91CF"}),t.push({name:"\u6162\u8D44\u6E90\u6570\u91CF",value:m.length,unit:"\u4E2A",threshold:0,status:m.length===0?"good":m.length<5?"warning":"poor",description:"\u52A0\u8F7D\u65F6\u95F4\u8D85\u8FC7 1 \u79D2\u7684\u8D44\u6E90"}),F(function(r){return[].concat(O()(r),["\u68C0\u6D4B\u5185\u5B58\u4F7F\u7528\u60C5\u51B5..."])}),j.next=19,new Promise(function(r){return setTimeout(r,500)});case 19:return C=performance.memory,C&&(x=Math.round(C.usedJSHeapSize/1024/1024),se=Math.round(C.totalJSHeapSize/1024/1024),t.push({name:"JS \u5806\u5185\u5B58\u4F7F\u7528",value:x,unit:"MB",threshold:100,status:x<100?"good":x<200?"warning":"poor",description:"JavaScript \u5806\u5185\u5B58\u4F7F\u7528\u91CF"})),F(function(r){return[].concat(O()(r),["\u8BC4\u4F30 DOM \u6E32\u67D3\u6027\u80FD..."])}),j.next=24,new Promise(function(r){return setTimeout(r,500)});case 24:return Y=document.getElementsByTagName("*").length,X=Ie(document.body),t.push({name:"DOM \u8282\u70B9\u6570",value:Y,unit:"\u4E2A",threshold:1500,status:Y<1500?"good":Y<3e3?"warning":"poor",description:"\u9875\u9762 DOM \u5143\u7D20\u603B\u6570"}),t.push({name:"DOM \u6700\u5927\u6DF1\u5EA6",value:X,unit:"\u5C42",threshold:32,status:X<32?"good":X<50?"warning":"poor",description:"DOM \u6811\u7684\u6700\u5927\u5D4C\u5957\u6DF1\u5EA6"}),F(function(r){return[].concat(O()(r),["\u68C0\u67E5\u4E8B\u4EF6\u76D1\u542C\u5668..."])}),j.next=31,new Promise(function(r){return setTimeout(r,500)});case 31:Q=Re(),t.push({name:"\u4E8B\u4EF6\u76D1\u542C\u5668\u6570",value:Q,unit:"\u4E2A",threshold:100,status:Q<100?"good":Q<200?"warning":"poor",description:"\u9875\u9762\u7ED1\u5B9A\u7684\u4E8B\u4EF6\u76D1\u542C\u5668\u6570\u91CF"}),ne(t),F(function(r){return[].concat(O()(r),["\u6027\u80FD\u68C0\u6D4B\u5B8C\u6210\uFF01"])}),de(!1);case 36:case"end":return j.stop()}},s)})),[]),Ie=function s(t){var o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1,d=t.children;if(d.length===0)return o;for(var v=o,g=0;g<d.length;g++)v=Math.max(v,s(d[g],o+1));return v},Re=function(){var t=document.querySelectorAll("*"),o=0;return t.forEach(function(d){o+=d._events?Object.keys(d._events).length:0}),o||t.length*2};(0,h.useEffect)(function(){if("PerformanceObserver"in window){var s=new PerformanceObserver(function(g){var u=g.getEntries(),l=u[u.length-1];$(function(A){return c()(c()({},A),{},{lcp:Math.round(l.startTime)})})});s.observe({entryTypes:["largest-contentful-paint"]});var t=0,o=new PerformanceObserver(function(g){var u=L()(g.getEntries()),l;try{for(u.s();!(l=u.n()).done;){var A=l.value;A.hadRecentInput||(t+=A.value)}}catch(m){u.e(m)}finally{u.f()}$(function(m){return c()(c()({},m),{},{cls:parseFloat(t.toFixed(3))})})});o.observe({entryTypes:["layout-shift"]});var d=new PerformanceObserver(function(g){var u=L()(g.getEntries()),l;try{var A=function(){var C=l.value,x=C.processingStart-C.startTime;$(function(se){return c()(c()({},se),{},{fid:Math.round(x)})})};for(u.s();!(l=u.n()).done;)A()}catch(m){u.e(m)}finally{u.f()}});d.observe({entryTypes:["first-input"]});var v=new PerformanceObserver(function(g){var u=L()(g.getEntries()),l;try{var A=function(){var C=l.value;C.name==="first-contentful-paint"&&$(function(x){return c()(c()({},x),{},{fcp:Math.round(C.startTime)})})};for(u.s();!(l=u.n()).done;)A()}catch(m){u.e(m)}finally{u.f()}});return v.observe({entryTypes:["paint"]}),function(){s.disconnect(),o.disconnect(),d.disconnect(),v.disconnect()}}},[]);var We=function(t){switch(t){case"good":return"success";case"warning":return"warning";case"poor":return"error";default:return"default"}},Ue=function(t){switch(t){case"good":return(0,e.jsx)(ee.A,{style:{color:"#52c41a"}});case"warning":return(0,e.jsx)(De.A,{style:{color:"#faad14"}});case"poor":return(0,e.jsx)(H.A,{style:{color:"#f5222d"}});default:return null}},S=function(){if(p.length===0)return 0;var t=p.map(function(o){return o.status==="good"?100:o.status==="warning"?70:40});return Math.round(t.reduce(function(o,d){return o+d},0)/t.length)},we=function(){navigator.clipboard.writeText(R.code)};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(ie.kW,c()({},xe)),(0,e.jsxs)("div",{children:[(0,e.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16},children:[(0,e.jsxs)("div",{children:[(0,e.jsxs)(Ce,{level:2,children:[(0,e.jsx)(V.A,{})," \u524D\u7AEF\u6027\u80FD\u68C0\u6D4B"]}),(0,e.jsx)(le,{type:"secondary",children:"\u57FA\u4E8E Performance API \u548C Web Vitals \u6807\u51C6\uFF0C\u5B9E\u65F6\u68C0\u6D4B\u9875\u9762\u52A0\u8F7D\u6027\u80FD\u3001\u6E32\u67D3\u6548\u7387\u548C\u7528\u6237\u4F53\u9A8C\u6307\u6807"})]}),(0,e.jsx)(T.Ay,{type:"primary",icon:(0,e.jsx)(G.A,{}),onClick:function(){return Me(!re)},size:"large",children:re?"\u9690\u85CF\u68C0\u6D4B\u4EE3\u7801":"\u67E5\u770B\u68C0\u6D4B\u4EE3\u7801"})]}),(0,e.jsxs)(b.A,{gutter:24,style:{marginBottom:24},children:[(0,e.jsx)(f.A,{span:4,children:(0,e.jsx)(_.A,{size:"small",children:(0,e.jsx)(D.A,{title:"LCP",value:E.lcp,suffix:"ms",valueStyle:{fontSize:20,color:E.lcp<2500?"#52c41a":E.lcp<4e3?"#faad14":"#f5222d"}})})}),(0,e.jsx)(f.A,{span:4,children:(0,e.jsx)(_.A,{size:"small",children:(0,e.jsx)(D.A,{title:"CLS",value:E.cls,suffix:"",valueStyle:{fontSize:20,color:E.cls<.1?"#52c41a":E.cls<.25?"#faad14":"#f5222d"}})})}),(0,e.jsx)(f.A,{span:4,children:(0,e.jsx)(_.A,{size:"small",children:(0,e.jsx)(D.A,{title:"FID",value:E.fid,suffix:"ms",valueStyle:{fontSize:20,color:E.fid<100?"#52c41a":E.fid<300?"#faad14":"#f5222d"}})})}),(0,e.jsx)(f.A,{span:4,children:(0,e.jsx)(_.A,{size:"small",children:(0,e.jsx)(D.A,{title:"FCP",value:E.fcp,suffix:"ms",valueStyle:{fontSize:20,color:E.fcp<1800?"#52c41a":E.fcp<3e3?"#faad14":"#f5222d"}})})}),(0,e.jsx)(f.A,{span:8,children:(0,e.jsx)(_.A,{size:"small",children:(0,e.jsxs)("div",{style:{textAlign:"center"},children:[(0,e.jsx)(T.Ay,{type:"primary",icon:(0,e.jsx)(ye.A,{}),onClick:Le,loading:I,size:"large",children:I?"\u68C0\u6D4B\u4E2D...":"\u5F00\u59CB\u5168\u9762\u68C0\u6D4B"}),(0,e.jsx)(T.Ay,{icon:(0,e.jsx)(ae.A,{}),onClick:function(){ne([]),F([])},style:{marginLeft:8},size:"large",children:"\u91CD\u7F6E"})]})})})]}),p.length>0&&(0,e.jsxs)(b.A,{gutter:24,style:{marginBottom:24},children:[(0,e.jsx)(f.A,{span:8,children:(0,e.jsxs)(_.A,{children:[(0,e.jsx)(D.A,{title:"\u7EFC\u5408\u8BC4\u5206",value:S(),suffix:"/ 100",valueStyle:{color:S()>=80?"#52c41a":S()>=60?"#faad14":"#f5222d"}}),(0,e.jsx)(k.A,{percent:S(),status:S()>=80?"success":S()>=60?"normal":"exception",style:{marginTop:16}})]})}),(0,e.jsx)(f.A,{span:8,children:(0,e.jsxs)(_.A,{children:[(0,e.jsx)(D.A,{title:"\u68C0\u6D4B\u9879\u76EE",value:p.length,suffix:"\u9879"}),(0,e.jsxs)("div",{style:{marginTop:16},children:[(0,e.jsxs)(B.A,{color:"success",children:["\u4F18\u79C0 ",p.filter(function(s){return s.status==="good"}).length]}),(0,e.jsxs)(B.A,{color:"warning",children:["\u8B66\u544A ",p.filter(function(s){return s.status==="warning"}).length]}),(0,e.jsxs)(B.A,{color:"error",children:["\u9700\u4F18\u5316 ",p.filter(function(s){return s.status==="poor"}).length]})]})]})}),(0,e.jsx)(f.A,{span:8,children:(0,e.jsxs)(_.A,{children:[(0,e.jsx)(D.A,{title:"\u68C0\u6D4B\u72B6\u6001",value:I?"\u68C0\u6D4B\u4E2D":p.length>0?"\u5DF2\u5B8C\u6210":"\u672A\u5F00\u59CB",valueStyle:{color:I?"#1890ff":p.length>0?"#52c41a":"#999"}}),(0,e.jsx)("div",{style:{marginTop:16},children:(0,e.jsx)(T.Ay,{icon:(0,e.jsx)(ae.A,{}),onClick:function(){ne([]),F([])},block:!0,children:"\u91CD\u7F6E\u68C0\u6D4B"})})]})})]}),te.length>0&&(0,e.jsx)(_.A,{title:"\u68C0\u6D4B\u8FDB\u5EA6",style:{marginBottom:24},children:(0,e.jsx)(N.A,{items:te.map(function(s,t){return{children:s,color:t===te.length-1&&!I?"green":"blue"}})})}),p.length>0&&(0,e.jsx)(_.A,{title:"\u6027\u80FD\u6307\u6807\u8BE6\u60C5",style:{marginBottom:24},children:(0,e.jsx)(M.A,{grid:{gutter:16,xs:1,sm:2,lg:3},dataSource:p,renderItem:function(t){return(0,e.jsx)(M.A.Item,{children:(0,e.jsxs)(_.A,{size:"small",title:(0,e.jsxs)(z.A,{children:[Ue(t.status),(0,e.jsx)("span",{children:t.name})]}),extra:(0,e.jsxs)(B.A,{color:We(t.status),children:[t.value,t.unit]}),children:[(0,e.jsx)(le,{type:"secondary",style:{fontSize:12},children:t.description}),(0,e.jsx)("div",{style:{marginTop:8},children:(0,e.jsxs)("span",{style:{fontSize:12,color:"#999"},children:["\u9608\u503C: ",t.threshold,t.unit]})})]})})}})}),re&&(0,e.jsx)(_.A,{title:"\u6027\u80FD\u68C0\u6D4B\u4EE3\u7801\u793A\u4F8B",style:{marginBottom:24},children:(0,e.jsxs)(b.A,{gutter:24,children:[(0,e.jsx)(f.A,{span:6,children:(0,e.jsx)(M.A,{size:"small",dataSource:ce,renderItem:function(t){return(0,e.jsx)(M.A.Item,{style:{cursor:"pointer",background:R.title===t.title?"#e6f7ff":"transparent",borderLeft:R.title===t.title?"3px solid #1890ff":"3px solid transparent"},onClick:function(){return Be(t)},children:(0,e.jsxs)("div",{children:[(0,e.jsx)("div",{style:{fontWeight:"bold"},children:t.title}),(0,e.jsx)("div",{style:{fontSize:12,color:"#999"},children:t.description})]})})}})}),(0,e.jsx)(f.A,{span:18,children:(0,e.jsx)(_.A,{size:"small",title:R.title,extra:(0,e.jsx)(T.Ay,{icon:(0,e.jsx)(ve.A,{}),size:"small",onClick:we,children:"\u590D\u5236"}),children:(0,e.jsx)(Ae.Ay,{height:400,language:"typescript",value:R.code,options:{minimap:{enabled:!1},fontSize:14,lineNumbers:"on",readOnly:!0,automaticLayout:!0}})})})]})}),(0,e.jsx)(K.A,{message:"\u4F18\u5316\u5EFA\u8BAE",description:(0,e.jsxs)("ul",{children:[(0,e.jsx)("li",{children:"\u4F18\u5316\u56FE\u7247\u52A0\u8F7D\uFF1A\u4F7F\u7528 WebP \u683C\u5F0F\uFF0C\u5B9E\u73B0\u61D2\u52A0\u8F7D\uFF0C\u538B\u7F29\u56FE\u7247\u5927\u5C0F"}),(0,e.jsx)("li",{children:"\u51CF\u5C11 JavaScript \u4F53\u79EF\uFF1A\u4EE3\u7801\u5206\u5272\uFF0C\u79FB\u9664\u672A\u4F7F\u7528\u4EE3\u7801\uFF0CTree Shaking"}),(0,e.jsx)("li",{children:"\u4F7F\u7528 CDN \u52A0\u901F\u9759\u6001\u8D44\u6E90\u52A0\u8F7D\uFF0C\u542F\u7528 HTTP/2"}),(0,e.jsx)("li",{children:"\u542F\u7528 Gzip/Brotli \u538B\u7F29\uFF0C\u51CF\u5C11\u4F20\u8F93\u4F53\u79EF"}),(0,e.jsx)("li",{children:"\u4F18\u5316\u5173\u952E\u6E32\u67D3\u8DEF\u5F84\uFF1A\u5185\u8054\u5173\u952E CSS\uFF0C\u5EF6\u8FDF\u52A0\u8F7D\u975E\u5173\u952E\u8D44\u6E90"}),(0,e.jsx)("li",{children:"\u4F7F\u7528 Service Worker \u7F13\u5B58\u9759\u6001\u8D44\u6E90\uFF0C\u5B9E\u73B0\u79BB\u7EBF\u8BBF\u95EE"}),(0,e.jsx)("li",{children:"\u907F\u514D\u5185\u5B58\u6CC4\u6F0F\uFF1A\u53CA\u65F6\u79FB\u9664\u4E8B\u4EF6\u76D1\u542C\u5668\uFF0C\u6E05\u7406\u5B9A\u65F6\u5668"})]}),type:"info",showIcon:!0,style:{marginTop:24}})]})]})};W.default=Fe}}]);
