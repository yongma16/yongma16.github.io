"use strict";(self.webpackChunkreact_home=self.webpackChunkreact_home||[]).push([[88],{47872:function(Q,x,t){t.r(x);var S=t(48305),E=t.n(S),C=t(75271),j=t(84970),d=t(77196),P=t(94553),c=t(91518),D=t(76162),A=t(23668),y=t(828),O=t(28559),M=t(48982),m=t(25418),v=t(78172),F=t(59560),L=t(63054),I=t(16432),R=t(52388),e=t(52676),U=j.Z.Title,b=j.Z.Paragraph,a=d.Z.Option,X=P.Z.TextArea,K=function(){var W=c.Z.useForm(),k=E()(W,1),H=k[0],G=(0,C.useState)(""),T=E()(G,2),p=T[0],V=T[1],w=(0,C.useState)("component"),Z=E()(w,2),q=Z[0],ee=Z[1],N=function(u){var l=u.name,h=u.framework,f=u.language,r=u.styleType,s=u.props,o=u.useHooks,B=u.withTypes,ne=u.withStorybook,te=u.withTests,n="";if(h==="react"){var _=["React"];o!=null&&o.includes("useState")&&_.push("useState"),o!=null&&o.includes("useEffect")&&_.push("useEffect"),o!=null&&o.includes("useCallback")&&_.push("useCallback"),o!=null&&o.includes("useMemo")&&_.push("useMemo"),n+="import ".concat(_.length>1?"{ ".concat(_.join(", ")," }"):"React",` from 'react';
`),r==="styled"&&(n+=`import styled from 'styled-components';
`),n+=`
`,B&&f==="ts"&&(n+="interface ".concat(l,`Props {
`),s==null||s.forEach(function(i){n+="  ".concat(i,`: string;
`)}),n+=`}

`);var J=B&&f==="ts"?": ".concat(l,"Props"):"";n+="const ".concat(l).concat(J," = ({ ").concat((s==null?void 0:s.join(", "))||"",` }) => {
`),o!=null&&o.includes("useState")&&(n+=`  const [count, setCount] = useState(0);
`),o!=null&&o.includes("useEffect")&&(n+=`  useEffect(() => {
    console.log('Component mounted');
  }, []);
`),n+=`
  return (
`,r==="styled"?n+=`    <StyledContainer>
`:n+='    <div className="'.concat(l.toLowerCase(),`">
`),n+="      <h2>".concat(l,` Component</h2>
`),n+="      {".concat((s==null?void 0:s[0])||"children",`}
`),r==="styled"?n+=`    </StyledContainer>
`:n+=`    </div>
`,n+=`  );
};

`,r==="styled"&&(n+=`const StyledContainer = styled.div\`
  padding: 20px;
  border-radius: 8px;
  background: #f5f5f5;
\`;

`),n+="export default ".concat(l,`;
`)}else n+=`<template>
`,n+='  <div class="'.concat(l.toLowerCase(),`">
`),n+="    <h2>".concat(l,` Component</h2>
`),s==null||s.forEach(function(i){n+="    <p>{{ ".concat(i,` }}</p>
`)}),n+=`  </div>
`,n+=`</template>

`,f==="ts"?(n+=`<script setup lang="ts">
`,n+=`interface Props {
`,s==null||s.forEach(function(i){n+="  ".concat(i,`: string;
`)}),n+=`}

`,n+=`defineProps<Props>();
`):(n+=`<script setup>
`,n+=`defineProps({
`,s==null||s.forEach(function(i){n+="  ".concat(i,`: String,
`)}),n+=`});
`),n+=`<\/script>

`,r!=="none"&&(n+="<style scoped".concat(r!=="css"?' lang="'.concat(r,'"'):"",`>
`),n+=".".concat(l.toLowerCase(),` {
`),n+=`  padding: 20px;
`,n+=`  border-radius: 8px;
`,n+=`}
`,n+=`</style>
`);V(n),D.ZP.success("\u7EC4\u4EF6\u4EE3\u7801\u751F\u6210\u6210\u529F\uFF01")},$=function(){navigator.clipboard.writeText(p),D.ZP.success("\u4EE3\u7801\u5DF2\u590D\u5236")},z=function(){var u=new Blob([p],{type:"text/plain"}),l=URL.createObjectURL(u),h=document.createElement("a");h.href=l,h.download="Component.tsx",h.click(),URL.revokeObjectURL(l)};return(0,e.jsxs)("div",{children:[(0,e.jsxs)(U,{level:2,children:[(0,e.jsx)(F.Z,{})," \u7EC4\u4EF6\u751F\u6210\u5668"]}),(0,e.jsx)(b,{type:"secondary",children:"\u5FEB\u901F\u751F\u6210 React/Vue \u7EC4\u4EF6\u4EE3\u7801\u6A21\u677F\uFF0C\u652F\u6301 TypeScript\u3001\u6837\u5F0F\u914D\u7F6E\u548C\u5E38\u7528 Hooks"}),(0,e.jsxs)(A.Z,{gutter:24,children:[(0,e.jsx)(y.Z,{span:10,children:(0,e.jsx)(O.Z,{title:"\u7EC4\u4EF6\u914D\u7F6E",children:(0,e.jsxs)(c.Z,{form:H,layout:"vertical",onFinish:N,initialValues:{framework:"react",language:"ts",styleType:"css",withTypes:!0},children:[(0,e.jsx)(c.Z.Item,{label:"\u7EC4\u4EF6\u540D\u79F0",name:"name",rules:[{required:!0,message:"\u8BF7\u8F93\u5165\u7EC4\u4EF6\u540D\u79F0"}],children:(0,e.jsx)(P.Z,{placeholder:"\u4F8B\u5982\uFF1AUserCard"})}),(0,e.jsx)(c.Z.Item,{label:"\u6846\u67B6",name:"framework",children:(0,e.jsxs)(d.Z,{children:[(0,e.jsx)(a,{value:"react",children:"React"}),(0,e.jsx)(a,{value:"vue",children:"Vue 3"})]})}),(0,e.jsx)(c.Z.Item,{label:"\u8BED\u8A00",name:"language",children:(0,e.jsxs)(d.Z,{children:[(0,e.jsx)(a,{value:"ts",children:"TypeScript"}),(0,e.jsx)(a,{value:"js",children:"JavaScript"})]})}),(0,e.jsx)(c.Z.Item,{label:"\u6837\u5F0F\u7C7B\u578B",name:"styleType",children:(0,e.jsxs)(d.Z,{children:[(0,e.jsx)(a,{value:"css",children:"CSS"}),(0,e.jsx)(a,{value:"less",children:"Less"}),(0,e.jsx)(a,{value:"scss",children:"SCSS"}),(0,e.jsx)(a,{value:"styled",children:"Styled Components"}),(0,e.jsx)(a,{value:"none",children:"\u65E0\u6837\u5F0F"})]})}),(0,e.jsx)(c.Z.Item,{label:"Props",name:"props",children:(0,e.jsxs)(d.Z,{mode:"tags",placeholder:"\u8F93\u5165 props \u540D\u79F0",children:[(0,e.jsx)(a,{value:"title",children:"title"}),(0,e.jsx)(a,{value:"content",children:"content"}),(0,e.jsx)(a,{value:"onClick",children:"onClick"}),(0,e.jsx)(a,{value:"children",children:"children"})]})}),(0,e.jsx)(c.Z.Item,{label:"Hooks",name:"useHooks",children:(0,e.jsxs)(d.Z,{mode:"multiple",placeholder:"\u9009\u62E9\u9700\u8981\u7684 Hooks",children:[(0,e.jsx)(a,{value:"useState",children:"useState"}),(0,e.jsx)(a,{value:"useEffect",children:"useEffect"}),(0,e.jsx)(a,{value:"useCallback",children:"useCallback"}),(0,e.jsx)(a,{value:"useMemo",children:"useMemo"})]})}),(0,e.jsx)(c.Z.Item,{children:(0,e.jsxs)(M.Z,{children:[(0,e.jsx)(m.Z,{checked:!0,children:"\u751F\u6210\u7C7B\u578B\u5B9A\u4E49"}),(0,e.jsx)(m.Z,{children:"\u751F\u6210 Storybook"}),(0,e.jsx)(m.Z,{children:"\u751F\u6210\u6D4B\u8BD5\u6587\u4EF6"})]})}),(0,e.jsx)(c.Z.Item,{children:(0,e.jsx)(v.ZP,{type:"primary",htmlType:"submit",block:!0,icon:(0,e.jsx)(F.Z,{}),children:"\u751F\u6210\u7EC4\u4EF6"})})]})})}),(0,e.jsx)(y.Z,{span:14,children:(0,e.jsx)(O.Z,{title:"\u751F\u6210\u7ED3\u679C",extra:(0,e.jsxs)(M.Z,{children:[(0,e.jsx)(v.ZP,{icon:(0,e.jsx)(L.Z,{}),onClick:$,children:"\u590D\u5236"}),(0,e.jsx)(v.ZP,{icon:(0,e.jsx)(I.Z,{}),onClick:z,children:"\u4E0B\u8F7D"})]}),children:(0,e.jsx)(R.ZP,{height:600,language:"typescript",value:p,options:{minimap:{enabled:!1},fontSize:14,lineNumbers:"on",readOnly:!0,automaticLayout:!0}})})})]})]})};x.default=K}}]);
