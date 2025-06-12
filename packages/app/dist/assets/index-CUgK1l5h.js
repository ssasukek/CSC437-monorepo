(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var We;class ut extends Error{}ut.prototype.name="InvalidTokenError";function vr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function br(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return vr(t)}catch{return atob(t)}}function $s(i,t){if(typeof i!="string")throw new ut("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new ut(`Invalid token specified: missing part #${e+1}`);let r;try{r=br(s)}catch(n){throw new ut(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new ut(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const _r="mu:context",ce=`${_r}:change`;class $r{constructor(t,e){this._proxy=wr(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class pe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new $r(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ce,t),t}detach(t){this.removeEventListener(ce,t)}}function wr(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let p=new CustomEvent(ce,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(p,{property:r,oldValue:l,value:n}),t.dispatchEvent(p)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function xr(i,t){const e=ws(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function ws(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return ws(i,r.host)}class kr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function xs(i="mu:message"){return(t,...e)=>t.dispatchEvent(new kr(e,i))}class fe{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Er(i){return t=>({...t,...i})}const he="mu:auth:jwt",ks=class Es extends fe{constructor(t,e){super((s,r)=>this.update(s,r),t,Es.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(Sr(s)),re(r);case"auth/signout":return e(Pr()),re(this._redirectForLogin);case"auth/redirect":return re(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ks.EVENT_TYPE="auth:message";let As=ks;const Ss=xs(As.EVENT_TYPE);function re(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class Ar extends pe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:tt.authenticateFromLocalStorage()})}connectedCallback(){new As(this.context,this.redirect).attach(this)}}class X{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(he),t}}class tt extends X{constructor(t){super();const e=$s(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new tt(t);return localStorage.setItem(he,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(he);return t?tt.authenticate(t):new X}}function Sr(i){return Er({user:tt.authenticate(i),token:i})}function Pr(){return i=>{const t=i.user;return{user:t&&t.authenticated?X.deauthenticate(t):t,token:""}}}function Tr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function Cr(i){return i.authenticated?$s(i.token||""):{}}const me=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:tt,Provider:Ar,User:X,dispatch:Ss,headers:Tr,payload:Cr},Symbol.toStringTag,{value:"Module"}));function de(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function Ye(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const Or=new DOMParser;function Et(i,...t){const e=i.map((o,l)=>l?[t[l-1],o]:[o]).flat().join(""),s=Or.parseFromString(e,"text/html"),r=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...r),n}function Yt(i){const t=i.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(r,n={mode:"open"}){const o=r.attachShadow(n);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const Ps=class Ts extends HTMLElement{constructor(){super(),this._state={},Yt(Ts.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),de(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},Ur(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};Ps.template=Et`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;let Rr=Ps;function Ur(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const Nr=Object.freeze(Object.defineProperty({__proto__:null,Element:Rr},Symbol.toStringTag,{value:"Module"})),Cs=class Os extends fe{constructor(t){super((e,s)=>this.update(e,s),t,Os.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(Lr(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(jr(s,r));break}}}};Cs.EVENT_TYPE="history:message";let ge=Cs;class Ke extends pe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=Mr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ye(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ge(this.context).attach(this)}}function Mr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function Lr(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function jr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const ye=xs(ge.EVENT_TYPE),Rs=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ke,Provider:Ke,Service:ge,dispatch:ye},Symbol.toStringTag,{value:"Module"}));class R{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Je(this._provider,t);this._effects.push(r),e(r)}else xr(this._target,this._contextLabel).then(r=>{const n=new Je(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Je{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const Us=class Ns extends HTMLElement{constructor(){super(),this._state={},this._user=new X,this._authObserver=new R(this,"blazing:auth"),Yt(Ns.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;zr(r,this._state,e,this.authorization).then(n=>lt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},lt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ge(this.src,this.authorization).then(e=>{this._state=e,lt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ge(this.src,this.authorization).then(r=>{this._state=r,lt(r,this)});break;case"new":s&&(this._state={},lt({},this));break}}};Us.observedAttributes=["src","new","action"];Us.template=Et`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Ge(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function lt(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function zr(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const Ms=class Ls extends fe{constructor(t,e){super(e,t,Ls.EVENT_TYPE,!1)}};Ms.EVENT_TYPE="mu:message";let js=Ms;class Dr extends pe{constructor(t,e,s){super(e),this._user=new X,this._updateFn=t,this._authObserver=new R(this,s)}connectedCallback(){const t=new js(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Hr=Object.freeze(Object.defineProperty({__proto__:null,Provider:Dr,Service:js},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,ve=Ct.ShadowRoot&&(Ct.ShadyCSS===void 0||Ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,be=Symbol(),Ze=new WeakMap;let zs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==be)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ve&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ze.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ze.set(e,t))}return t}toString(){return this.cssText}};const Ir=i=>new zs(typeof i=="string"?i:i+"",void 0,be),qr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new zs(e,i,be)},Fr=(i,t)=>{if(ve)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Ct.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Qe=ve?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ir(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Br,defineProperty:Vr,getOwnPropertyDescriptor:Wr,getOwnPropertyNames:Yr,getOwnPropertySymbols:Kr,getPrototypeOf:Jr}=Object,et=globalThis,Xe=et.trustedTypes,Gr=Xe?Xe.emptyScript:"",ts=et.reactiveElementPolyfillSupport,pt=(i,t)=>i,Rt={toAttribute(i,t){switch(t){case Boolean:i=i?Gr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},_e=(i,t)=>!Br(i,t),es={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:_e};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),et.litPropertyMetadata??(et.litPropertyMetadata=new WeakMap);let G=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=es){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Vr(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Wr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??es}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;const t=Jr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){const e=this.properties,s=[...Yr(e),...Kr(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Qe(r))}else t!==void 0&&e.push(Qe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Fr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Rt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Rt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??_e)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[pt("elementProperties")]=new Map,G[pt("finalized")]=new Map,ts==null||ts({ReactiveElement:G}),(et.reactiveElementVersions??(et.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ut=globalThis,Nt=Ut.trustedTypes,ss=Nt?Nt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ds="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,Hs="?"+T,Zr=`<${Hs}>`,q=document,gt=()=>q.createComment(""),yt=i=>i===null||typeof i!="object"&&typeof i!="function",Is=Array.isArray,Qr=i=>Is(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",ie=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,rs=/-->/g,is=/>/g,j=RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ns=/'/g,os=/"/g,qs=/^(?:script|style|textarea|title)$/i,Xr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),ht=Xr(1),st=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),as=new WeakMap,D=q.createTreeWalker(q,129);function Fs(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ss!==void 0?ss.createHTML(t):t}const ti=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":"",o=ct;for(let l=0;l<e;l++){const a=i[l];let p,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ct?f[1]==="!--"?o=rs:f[1]!==void 0?o=is:f[2]!==void 0?(qs.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=j):f[3]!==void 0&&(o=j):o===j?f[0]===">"?(o=r??ct,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?j:f[3]==='"'?os:ns):o===os||o===ns?o=j:o===rs||o===is?o=ct:(o=j,r=void 0);const h=o===j&&i[l+1].startsWith("/>")?" ":"";n+=o===ct?a+Zr:d>=0?(s.push(p),a.slice(0,d)+Ds+a.slice(d)+T+h):a+T+(d===-2?l:h)}return[Fs(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};let ue=class Bs{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=ti(t,e);if(this.el=Bs.createElement(p,s),D.currentNode=this.el.content,e===2){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=D.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(Ds)){const c=f[o++],h=r.getAttribute(d).split(T),u=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:u[2],strings:h,ctor:u[1]==="."?si:u[1]==="?"?ri:u[1]==="@"?ii:Kt}),r.removeAttribute(d)}else d.startsWith(T)&&(a.push({type:6,index:n}),r.removeAttribute(d));if(qs.test(r.tagName)){const d=r.textContent.split(T),c=d.length-1;if(c>0){r.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],gt()),D.nextNode(),a.push({type:2,index:++n});r.append(d[c],gt())}}}else if(r.nodeType===8)if(r.data===Hs)a.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(T,d+1))!==-1;)a.push({type:7,index:n}),d+=T.length-1}n++}}static createElement(t,e){const s=q.createElement("template");return s.innerHTML=t,s}};function rt(i,t,e=i,s){var r,n;if(t===st)return t;let o=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=yt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=rt(i,o._$AS(i,t.values),o,s)),t}let ei=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??q).importNode(e,!0);D.currentNode=r;let n=D.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new $e(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new ni(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=D.nextNode(),o++)}return D.currentNode=q,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},$e=class Vs{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),yt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Qr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==_&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ue.createElement(Fs(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new ei(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=as.get(t.strings);return e===void 0&&as.set(t.strings,e=new ue(t)),e}k(t){Is(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new Vs(this.S(gt()),this.S(gt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Kt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=rt(this,t,e,0),o=!yt(t)||t!==this._$AH&&t!==st,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=rt(this,l[s+a],e,a),p===st&&(p=this._$AH[a]),o||(o=!yt(p)||p!==this._$AH[a]),p===_?t=_:t!==_&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!r&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},si=class extends Kt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},ri=class extends Kt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},ii=class extends Kt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??_)===st)return;const s=this._$AH,r=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},ni=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}};const ls=Ut.litHtmlPolyfillSupport;ls==null||ls(ue,$e),(Ut.litHtmlVersions??(Ut.litHtmlVersions=[])).push("3.1.3");const oi=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new $e(t.insertBefore(gt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Q=class extends G{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=oi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return st}};Q._$litElement$=!0,Q.finalized=!0,(We=globalThis.litElementHydrateSupport)==null||We.call(globalThis,{LitElement:Q});const cs=globalThis.litElementPolyfillSupport;cs==null||cs({LitElement:Q});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ai={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:_e},li=(i=ai,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function Ws(i){return(t,e)=>typeof e=="object"?li(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ys(i){return Ws({...i,state:!0,attribute:!1})}function ci(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function hi(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ks={};(function(i){var t=function(){var e=function(d,c,h,u){for(h=h||{},u=d.length;u--;h[d[u]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,u,g,m,v,Qt){var x=v.length-1;switch(m){case 1:return new g.Root({},[v[x-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[x-1],v[x]]);break;case 4:case 5:this.$=v[x];break;case 6:this.$=new g.Literal({value:v[x]});break;case 7:this.$=new g.Splat({name:v[x]});break;case 8:this.$=new g.Param({name:v[x]});break;case 9:this.$=new g.Optional({},[v[x-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let u=function(g,m){this.message=g,this.hash=m};throw u.prototype=Error,new u(c,h)}},parse:function(c){var h=this,u=[0],g=[null],m=[],v=this.table,Qt="",x=0,Fe=0,fr=2,Be=1,mr=m.slice.call(arguments,1),b=Object.create(this.lexer),M={yy:{}};for(var Xt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Xt)&&(M.yy[Xt]=this.yy[Xt]);b.setInput(c,M.yy),M.yy.lexer=b,M.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var te=b.yylloc;m.push(te);var gr=b.options&&b.options.ranges;typeof M.yy.parseError=="function"?this.parseError=M.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var yr=function(){var K;return K=b.lex()||Be,typeof K!="number"&&(K=h.symbols_[K]||K),K},w,L,k,ee,Y={},Pt,S,Ve,Tt;;){if(L=u[u.length-1],this.defaultActions[L]?k=this.defaultActions[L]:((w===null||typeof w>"u")&&(w=yr()),k=v[L]&&v[L][w]),typeof k>"u"||!k.length||!k[0]){var se="";Tt=[];for(Pt in v[L])this.terminals_[Pt]&&Pt>fr&&Tt.push("'"+this.terminals_[Pt]+"'");b.showPosition?se="Parse error on line "+(x+1)+`:
`+b.showPosition()+`
Expecting `+Tt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":se="Parse error on line "+(x+1)+": Unexpected "+(w==Be?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(se,{text:b.match,token:this.terminals_[w]||w,line:b.yylineno,loc:te,expected:Tt})}if(k[0]instanceof Array&&k.length>1)throw new Error("Parse Error: multiple actions possible at state: "+L+", token: "+w);switch(k[0]){case 1:u.push(w),g.push(b.yytext),m.push(b.yylloc),u.push(k[1]),w=null,Fe=b.yyleng,Qt=b.yytext,x=b.yylineno,te=b.yylloc;break;case 2:if(S=this.productions_[k[1]][1],Y.$=g[g.length-S],Y._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},gr&&(Y._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),ee=this.performAction.apply(Y,[Qt,Fe,x,M.yy,k[1],g,m].concat(mr)),typeof ee<"u")return ee;S&&(u=u.slice(0,-1*S*2),g=g.slice(0,-1*S),m=m.slice(0,-1*S)),u.push(this.productions_[k[1]][0]),g.push(Y.$),m.push(Y._$),Ve=v[u[u.length-2]][u[u.length-1]],u.push(Ve);break;case 3:return!0}}return!0}},p=function(){var d={EOF:1,parseError:function(h,u){if(this.yy.parser)this.yy.parser.parseError(h,u);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,u=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),u.length-1&&(this.yylineno-=u.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:u?(u.length===g.length?this.yylloc.first_column:0)+g[g.length-u.length].length-u[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var u,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],u=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),u)return u;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,u,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(u=this._input.match(this.rules[m[v]]),u&&(!h||u[0].length>h[0].length)){if(h=u,g=v,this.options.backtrack_lexer){if(c=this.test_match(u,m[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,u,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return d}();a.lexer=p;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof hi<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Ks);function J(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Js={Root:J("Root"),Concat:J("Concat"),Literal:J("Literal"),Splat:J("Splat"),Param:J("Param"),Optional:J("Optional")},Gs=Ks.parser;Gs.yy=Js;var di=Gs,ui=Object.keys(Js);function pi(i){return ui.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Zs=pi,fi=Zs,mi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Qs(i){this.captures=i.captures,this.re=i.re}Qs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var gi=fi({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(mi,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Qs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),yi=gi,vi=Zs,bi=vi({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),_i=bi,$i=di,wi=yi,xi=_i;At.prototype=Object.create(null);At.prototype.match=function(i){var t=wi.visit(this.ast),e=t.match(i);return e||!1};At.prototype.reverse=function(i){return xi.visit(this.ast,i)};function At(i){var t;if(this?t=this:t=Object.create(At.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=$i.parse(i),t}var ki=At,Ei=ki,Ai=Ei;const Si=ci(Ai);var Pi=Object.defineProperty,Xs=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Pi(t,e,r),r};class vt extends Q{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ht`
      <h1>Not Found</h1>
    `,this._cases=t.map(r=>({...r,route:new Si(r.path)})),this._historyObserver=new R(this,e),this._authObserver=new R(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ht`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(Ss(this,"auth/redirect"),ht`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):ht`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ht`
              <h1>Redirecting to ${s}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){ye(this,"history/redirect",{href:t})}}vt.styles=qr`
    :host,
    main {
      display: contents;
    }
  `;Xs([Ys()],vt.prototype,"_user");Xs([Ys()],vt.prototype,"_match");const Ti=Object.freeze(Object.defineProperty({__proto__:null,Element:vt,Switch:vt},Symbol.toStringTag,{value:"Module"})),Ci=class tr extends HTMLElement{constructor(){if(super(),Yt(tr.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ci.template=Et`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Oi=class er extends HTMLElement{constructor(){super(),this._array=[],Yt(er.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(sr("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Ye(t,"button.add")?de(t,"input-array:add"):Ye(t,"button.remove")&&de(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Ri(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Oi.template=Et`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style>
          :host {
            display: contents;
          }
          ul {
            display: contents;
          }
          button.add {
            grid-column: input / input-end;
          }
          ::slotted(label) {
            display: contents;
          }
        </style>
      </button>
    </template>
  `;function Ri(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(sr(e)))}function sr(i,t){const e=i===void 0?"":`value="${i}"`;return Et`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function rr(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Ui=Object.defineProperty,Ni=Object.getOwnPropertyDescriptor,Mi=(i,t,e,s)=>{for(var r=Ni(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ui(t,e,r),r};class E extends Q{constructor(t){super(),this._pending=[],this._observer=new R(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}Mi([Ws()],E.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=globalThis,we=Ot.ShadowRoot&&(Ot.ShadyCSS===void 0||Ot.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xe=Symbol(),hs=new WeakMap;let ir=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==xe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(we&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=hs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&hs.set(e,t))}return t}toString(){return this.cssText}};const Li=i=>new ir(typeof i=="string"?i:i+"",void 0,xe),U=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new ir(e,i,xe)},ji=(i,t)=>{if(we)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Ot.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},ds=we?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Li(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:zi,defineProperty:Di,getOwnPropertyDescriptor:Hi,getOwnPropertyNames:Ii,getOwnPropertySymbols:qi,getPrototypeOf:Fi}=Object,O=globalThis,us=O.trustedTypes,Bi=us?us.emptyScript:"",ne=O.reactiveElementPolyfillSupport,ft=(i,t)=>i,Mt={toAttribute(i,t){switch(t){case Boolean:i=i?Bi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ke=(i,t)=>!zi(i,t),ps={attribute:!0,type:String,converter:Mt,reflect:!1,useDefault:!1,hasChanged:ke};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),O.litPropertyMetadata??(O.litPropertyMetadata=new WeakMap);let Z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ps){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Di(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Hi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const l=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ps}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=Fi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,s=[...Ii(e),...qi(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(ds(r))}else t!==void 0&&e.push(ds(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ji(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Mt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n,o;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((n=l.converter)==null?void 0:n.fromAttribute)!==void 0?l.converter:Mt;this._$Em=r,this[r]=a.fromAttribute(e,l.type)??((o=this._$Ej)==null?void 0:o.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??ke)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};Z.elementStyles=[],Z.shadowRootOptions={mode:"open"},Z[ft("elementProperties")]=new Map,Z[ft("finalized")]=new Map,ne==null||ne({ReactiveElement:Z}),(O.reactiveElementVersions??(O.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,Lt=mt.trustedTypes,fs=Lt?Lt.createPolicy("lit-html",{createHTML:i=>i}):void 0,nr="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,or="?"+C,Vi=`<${or}>`,F=document,bt=()=>F.createComment(""),_t=i=>i===null||typeof i!="object"&&typeof i!="function",Ee=Array.isArray,Wi=i=>Ee(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",oe=`[ 	
\f\r]`,dt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ms=/-->/g,gs=/>/g,z=RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ys=/'/g,vs=/"/g,ar=/^(?:script|style|textarea|title)$/i,Yi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),y=Yi(1),it=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),bs=new WeakMap,H=F.createTreeWalker(F,129);function lr(i,t){if(!Ee(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return fs!==void 0?fs.createHTML(t):t}const Ki=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=dt;for(let l=0;l<e;l++){const a=i[l];let p,f,d=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===dt?f[1]==="!--"?o=ms:f[1]!==void 0?o=gs:f[2]!==void 0?(ar.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=z):f[3]!==void 0&&(o=z):o===z?f[0]===">"?(o=r??dt,d=-1):f[1]===void 0?d=-2:(d=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?z:f[3]==='"'?vs:ys):o===vs||o===ys?o=z:o===ms||o===gs?o=dt:(o=z,r=void 0);const h=o===z&&i[l+1].startsWith("/>")?" ":"";n+=o===dt?a+Vi:d>=0?(s.push(p),a.slice(0,d)+nr+a.slice(d)+C+h):a+C+(d===-2?l:h)}return[lr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class $t{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=Ki(t,e);if(this.el=$t.createElement(p,s),H.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(r=H.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const d of r.getAttributeNames())if(d.endsWith(nr)){const c=f[o++],h=r.getAttribute(d).split(C),u=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:u[2],strings:h,ctor:u[1]==="."?Gi:u[1]==="?"?Zi:u[1]==="@"?Qi:Jt}),r.removeAttribute(d)}else d.startsWith(C)&&(a.push({type:6,index:n}),r.removeAttribute(d));if(ar.test(r.tagName)){const d=r.textContent.split(C),c=d.length-1;if(c>0){r.textContent=Lt?Lt.emptyScript:"";for(let h=0;h<c;h++)r.append(d[h],bt()),H.nextNode(),a.push({type:2,index:++n});r.append(d[c],bt())}}}else if(r.nodeType===8)if(r.data===or)a.push({type:2,index:n});else{let d=-1;for(;(d=r.data.indexOf(C,d+1))!==-1;)a.push({type:7,index:n}),d+=C.length-1}n++}}static createElement(t,e){const s=F.createElement("template");return s.innerHTML=t,s}}function nt(i,t,e=i,s){var o,l;if(t===it)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=_t(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=nt(i,r._$AS(i,t.values),r,s)),t}class Ji{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??F).importNode(e,!0);H.currentNode=r;let n=H.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new St(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new Xi(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=H.nextNode(),o++)}return H.currentNode=F,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class St{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=nt(this,t,e),_t(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==it&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Wi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&_t(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=$t.createElement(lr(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new Ji(r,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=bs.get(t.strings);return e===void 0&&bs.set(t.strings,e=new $t(t)),e}k(t){Ee(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new St(this.O(bt()),this.O(bt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Jt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=nt(this,t,e,0),o=!_t(t)||t!==this._$AH&&t!==it,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=nt(this,l[s+a],e,a),p===it&&(p=this._$AH[a]),o||(o=!_t(p)||p!==this._$AH[a]),p===$?t=$:t!==$&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Gi extends Jt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Zi extends Jt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Qi extends Jt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=nt(this,t,e,0)??$)===it)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Xi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){nt(this,t)}}const ae=mt.litHtmlPolyfillSupport;ae==null||ae($t,St),(mt.litHtmlVersions??(mt.litHtmlVersions=[])).push("3.3.0");const tn=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new St(t.insertBefore(bt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=globalThis;class P extends Z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=tn(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return it}}var _s;P._$litElement$=!0,P.finalized=!0,(_s=I.litElementHydrateSupport)==null||_s.call(I,{LitElement:P});const le=I.litElementPolyfillSupport;le==null||le({LitElement:P});(I.litElementVersions??(I.litElementVersions=[])).push("4.2.0");const en={search:""};function sn(i,t,e){switch(i[0]){case"card/select":rn(i[1],e).then(s=>t(r=>({...r,card:s})));break;case"card/save":cr(i[1],e).then(s=>t(r=>({...r,card:s}))).then(()=>{const{onSuccess:s}=i[1];s&&s()}).catch(s=>{const{onFailure:r}=i[1];r&&r(s)});break;case"search/set":t(s=>({...s,search:i[1].term}));break;default:throw new Error(`Unhandled Auth message "${i[0]}"`)}}function rn({id:i},t){return fetch(`/api/cardDatas/${i}`,{headers:me.headers(t)}).then(async e=>{if(e.status===200)return e.json();if(e.status===404){const s={id:i,name:"",bio:"",tradingStyle:""};return console.warn(`Card not found for ${i}, creating new one...`),cr({id:i,card:s},t)}else throw new Error(`Unexpected status ${e.status}`)}).then(e=>{if(e)return console.log("cardData:",e),e})}function cr(i,t){const e={...i.card,id:i.id};return fetch(`/api/cardDatas/${i.id}`,{method:"PUT",headers:{"Content-Type":"application/json",...me.headers(t)},body:JSON.stringify(e)}).then(s=>{if(s.status===200)return s.json();throw new Error(`Failed to save card for ${t.username}`)}).then(s=>{if(s)return s})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nn={attribute:!0,type:String,converter:Mt,reflect:!1,hasChanged:ke},on=(i=nn,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.C(o,void 0,i,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function A(i){return(t,e)=>typeof e=="object"?on(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function W(i){return A({...i,state:!0,attribute:!1})}const hr=U`
  .profile {
    max-width: 600px;
    margin: 80px auto;
    padding: 2rem;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
    color: #ffffff;
    font-family: "Open Sans", sans-serif;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }

  .profile h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
    font-family: "Playfair Display", serif;
  }

  .profile p {
    font-size: 1rem;
    margin: 0.5rem 0;
  }

  .profile .edit-btn {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.5rem 1rem;
    background-color: #0077cc;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .profile .edit-btn:hover {
    background-color: #005fa3;
  }

  main {
    display: flex;
    justify-content: center;
    padding-top: 10rem;
  }

  mu-form {
    display: flex;
    width: 100%;
    max-width: 450px;
    margin: 80px auto;
    padding: 2rem;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
    color: #ffffff;
    font-family: "Open Sans", sans-serif;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }

  mu-form label {
    display: block;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  mu-form input,
  mu-form textarea {
    padding: 0.5rem;
    margin-top: 0.5rem;
    border-radius: 3px;
    font-family: inherit;
    font-size: 1rem;
    border: none;
    width: 100%;
  }
`;var an=Object.defineProperty,ln=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&an(t,e,r),r};const Pe=class Pe extends E{constructor(){super("blazing:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="user-id"&&e!==s&&s&&(!this.model.card||this.model.card.id!==s)&&this.dispatchMessage(["card/select",{id:s}])}render(){const t=this.model.card??{id:this.userid,name:"",bio:"",tradingStyle:""};return y`
      <section class="profile">
        <h2>${t.name}</h2>
        <p><strong>Bio:</strong> ${t.bio||"N/A"}</p>
        <p><strong>Trading Style:</strong> ${t.tradingStyle||"NA"}</p>
        <a class="edit-btn" href="/app/edit/${this.userid}">Edit Profile</a>
      </section>
    `}};Pe.styles=[hr];let wt=Pe;ln([A({attribute:"user-id"})],wt.prototype,"userid");customElements.define("profile-view",wt);var cn=Object.defineProperty,hn=Object.getOwnPropertyDescriptor,dr=(i,t,e,s)=>{for(var r=s>1?void 0:s?hn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&cn(t,e,r),r};const Wt=class Wt extends E{get card(){return this.model.card}connectedCallback(){super.connectedCallback(),this.userid&&this.dispatchMessage(["card/select",{id:this.userid}])}render(){var t,e,s;return y`
      <main>
        <mu-form
          .init=${this.card??{name:"",bio:"",tradingStyle:""}}
          @mu-form:submit=${this.handleSubmit}
        >
          <label>
            Name
            <input type="text" name="name" .value=${((t=this.card)==null?void 0:t.name)??""} />
          </label>
          <label>
            Bio
            <textarea name="bio" .value=${((e=this.card)==null?void 0:e.bio)??""}></textarea>
          </label>
          <label>
            Trading Style
            <input
              type="text"
              name="tradingStyle"
              .value=${((s=this.card)==null?void 0:s.tradingStyle)??""}
            />
          </label>
        </mu-form>
      </main>
    `}handleSubmit(t){console.log("Form submit:",t.detail);const e=this.userid??"";this.dispatchMessage(["card/save",{id:e,card:t.detail,onSuccess:()=>{this.dispatchMessage(["card/select",{id:e}]),Rs.dispatch(this,"history/navigate",{href:`/app/profile/${e}`})},onFailure:s=>console.log("Save Failed:",s)}])}};Wt.styles=[hr],Wt.uses=rr({"mu-form":Nr.Element});let ot=Wt;dr([A({attribute:"user-id"})],ot.prototype,"userid",2);dr([W()],ot.prototype,"card",1);customElements.define("card-edit-view",ot);const N=U`
  /*light background, not solid type of color, similar to a gradient type
    dark color, so like mix of black and blue blend
    cover page should be simple, aesthetic yet engaging*/

  /*color of background (header) & color of text in the header*/
  header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: var(--spacing-md) var(--spacing-lg);
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(6px);
  }

  body {
    background: var(--background-image1);
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    color: var(--color-text);
    font-family: var(--fon-body);
    font-size: var(--font-size-base);
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--color-link);
  }

  main {
    /* max-width: 960px; */
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100vw;
  }

  /*default color of text*/
  text {
    color: color-mix(in hsl shorter hue, color percentage, color percentage);
  }

  /*one or more accent colors, to use for links and/or headings*/
  link {
    color: aliceblue;
  }

  .main {
    grid-column: 4 / span 9;
  }

  .scroll-btn {
    font-size: 5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #888;
    transition: background-color 0.3s ease;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    z-index: 2;
    display: flex;
  }

  .scroll-btn:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .hero {
    background: none;
    padding: 4rem 2rem;
    text-align: center;
    min-height: 60vh;
  }

  /* in dark mode */
  body.dark-mode {
    background: var(--background-image2);
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

  .hero h1 {
    font-size: var(--font-size-xl);
    color: var(--gradient-hero);
    margin-bottom: var(--spacing-md);
  }

  .hero p {
    font-size: var(--font-size-lg);
    color: var(--gradient-hero);
  }

  .hero a {
    font-size: var(--font-size-sm);
    color: var(--gradient-hero);
  }

  .dropdown {
    position: relative;
  }

  .dropbtn {
    font-size: 1rem;
    line-height: 1;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    top: 100%;
    background: var(--color-text-inverted);
    border: 1px solid var(--color-border);
    border-radius: 5px;
    min-width: 150px;
    box-shadow: 0 3px 6px grey;
  }

  .dropdown-content a {
    display: block;
    padding: 0.5rem 1rem;
    text-decoration: none;
    // color: var(--color-text);
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .dropdown-content a:hover {
    background-color: var(--color-link-hover);
    color: var(--color-link);
  }

  .dropdown:hover .dropdown-content,
  .dropdown-content:hover {
    display: block;
  }

  .search-bar {
    background: transparent;
    border: none;
    border-bottom: 2px solid white;
    padding: 0.25rem 0.5rem;
    width: 300px;
    color: white;
    font-size: 1rem;
  }

  .search-bar::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .icon {
    display: inline;
    height: 10rem;
    width: 10rem;
    vertical-align: top;
    fill: currentColor;
  }

  .card-scroll {
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 10vw;
    overflow-x: auto;
    display: flex;
    gap: 2rem;
  }

  .card-scroll::-webkit-scrollbar {
    display: none;
  }

  .cards {
    position: relative;
    width: 100vw;
    max-width: 100%;
    overflow: hidden;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 0;
  }

  .dark-toggle {
    position: relative;
    margin-left: auto;
    margin-right: 0.5rem;

    display: flex;
    align-items: center;
    padding: 0.25rem;
  }

  .dark-checkbox {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-switch {
    position: relative;
    width: 50px;
    height: 24px;
    background: #888;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s;
  }
  .toggle-switch:hover {
    background: #999;
  }

  .toggle-switch::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    transition: left 0.25s;
  }

  .dark-checkbox:checked + .toggle-switch {
    background: #444;
  }
  .dark-checkbox:checked + .toggle-switch::after {
    left: calc(100% - 2px - 20px);
  }

  .login-btn {
    margin-right: 1rem;
    padding: 0.5rem 0.5rem;
    background-color: transparent;
    color: var(--color-link);
    font-weight: bold;
    text-decoration: none;
    border: 1px solid var(--color-link);
    border-radius: 1px;
  }

  .user-dropdown {
    position: relative;
    display: inline-block;
    margin-right: 1rem;
    font-weight: bold;
    font-family: var(--font-body, sans-serif);
    cursor: pointer;
    padding: 0.5rem 0.75rem;
  }

  .user-dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown-item {
    display: block;
    padding: 0.75rem 1rem;
    color: black;
    text-decoration: none;
    text-align: left;
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
  }
`,Te=class Te extends E{render(){return y`
      <main>
        <div class="grid-cont">
          <section id="sec1" class="hero">
            <svg class="icon">
              <use href="/icons/trading-icons.svg#icon-candlestick" />
            </svg>
            <h1>Welcome to Day Trades Overview</h1>
            <p>
              The ultimate resources in futher understand, execute and mastered
              the skill of day trading
            </p>
            <a href="/app/daytrades">Read More</a>
          </section>

          <div class="cards">
            <button class="scroll-btn left" @click=${this.scrollCLeft}>
              &#8678;
            </button>

            <section class="card-scroll" id="scroll-container">
              <trade-cards src="/data/trade-cards.json"></trade-cards>
            </section>

            <button class="scroll-btn right" @click=${this.scrollCRight}>
              &#8680;
            </button>
          </div>
        </div>
      </main>

      <footer>
        <p>2025 Day Trades Index. All Rights Reserved. Most infomation were obtained from Google and ChatGpt </p>
      </footer>
    `}scrollCRight(){var e;const t=(e=this.renderRoot)==null?void 0:e.querySelector("#scroll-container");t.scrollLeft+t.clientWidth>=t.scrollWidth-10?t.scrollTo({left:0,behavior:"smooth"}):t.scrollBy({left:350,behavior:"smooth"})}scrollCLeft(){var e;const t=(e=this.renderRoot)==null?void 0:e.querySelector("#scroll-container");t.scrollLeft<=10?t.scrollTo({left:t.scrollWidth,behavior:"smooth"}):t.scrollBy({left:-350,behavior:"smooth"})}};Te.styles=[N];let jt=Te;customElements.define("index-view",jt);var dn=Object.defineProperty,un=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&dn(t,e,r),r};const Ce=class Ce extends P{constructor(){super(...arguments),this.auth={user:{authenticated:!1,username:""}},this.sendSearch=t=>{},this.searchTerm="",this.authObserver=new R(this,"blazing:auth"),this.storeObserver=new R(this,"blazing:store")}dispatchSearch(t){this.searchTerm=t,this.sendSearch(t)}connectedCallback(){super.connectedCallback(),this.storeObserver.observe(({send:e})=>{this.sendSearch=s=>{e(["search/set",{term:s}])}}),this.authObserver.observe(e=>{this.auth=e}),localStorage.getItem("mode")==="dark"&&requestAnimationFrame(()=>{var s;const e=(s=this.shadowRoot)==null?void 0:s.querySelector(".dark-checkbox");e&&(e.checked=!0)})}render(){var s,r;const t=(s=this.auth.user)==null?void 0:s.authenticated,e=((r=this.auth.user)==null?void 0:r.username)??"Guest";return y`
      <header>
        <input
          type="text"
          class="search-bar"
          placeholder="Search..."
          @keydown=${n=>{const o=n.target;n.key==="Enter"&&this.dispatchSearch(o.value),n.key==="Escape"&&(o.value="",this.dispatchSearch(""))}}
        />

        <label class="dark-toggle">
          <span class="icon-sun">☀️</span>
          <input
            type="checkbox"
            class="dark-checkbox"
            @change=${n=>{const o=n.target.checked;this.dispatchEvent(new CustomEvent("darkmode:toggle",{bubbles:!0,composed:!0,detail:{checked:o}}))}}
          />
          <span class="toggle-switch"></span>
          <span class="icon-moon">🌙</span>
        </label>

        ${t?y`
              <div class="user-dropdown">
                <span class="user-name">${e}</span>
                <div class="dropdown-content">
                  <a href="/app/profile/${e}" class="dropdown-item">
                    Account Info
                  </a>
                  <button class="dropdown-item" @click=${this.signOut}>
                    Sign Out
                  </button>
                </div>
              </div>
            `:y`<a href="/app/login" class="login-btn">Login</a>`}

        <div class="dropdown">
          <button class="dropbtn" aria-label="Menu">☰</button>
          <div class="dropdown-content">
            <a href="/app">Home</a>
            <a href="/app/daytrades">Day Trades</a>
            <a href="/app/orders">Orders</a>
            <a href="/app/brokerageAcc">Brokerage Account</a>
            <a href="/app/strategies">Strategies</a>
            <a href="/app/assetTypes">Asset Type</a>
            <a href="/app/margins">Margins</a>
          </div>
        </div>
      </header>
    `}signOut(){this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signout"]}))}};Ce.styles=[N];let xt=Ce;un([W()],xt.prototype,"auth");customElements.define("t-header",xt);const Ae={styles:U`
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    img {
      max-width: 100%;
      display: block;
    }
    ul, ol, menu {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    body {
      line-height: 1.5;
    }
    svg {
      max-width: 100%;
    }
  `};var pn=Object.defineProperty,Se=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&pn(t,e,r),r};const Oe=class Oe extends P{constructor(){super(...arguments),this.title="",this.href="",this.linkText=""}render(){return y`
      <h1>${this.title}</h1>
      <p><slot></slot></p>
      <a href="${this.href}">${this.linkText}</a>
    `}};Oe.styles=[Ae.styles,U`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--card-bg);
        border-radius: 12px;
        padding: 4.5rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        color: black;
        min-width: 580px;
        height: 220px;
        text-align: left;
        transition: transform 0.2s ease;

        width: 90vw;
        max-width: 1100px;
        height: 400px;
        flex: 0 0 80vw;
        scroll-snap-align: center;
      }

      h1 {
        font-size: 3rem;
        font-family: var(--font-display);
        color: var(--color-link);
        margin-bottom: var(--spacing-sm);
      }

      p {
        font-size: 1.5rem;
        color: var(--color-text);
        margin-bottom: var(--spacing-md);
      }

      a {
        font-size: 1rem;
        color: var(--color-accent);
        text-decoration: none;
        font-weight: bold;
      }
      a:hover {
        text-decoration: underline;
      }
    `];let at=Oe;Se([A()],at.prototype,"title");Se([A()],at.prototype,"href");Se([A({attribute:"link-text"})],at.prototype,"linkText");var fn=Object.defineProperty,ur=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&fn(t,e,r),r};const Re=class Re extends P{constructor(){super(...arguments),this.src="",this.items=[],this._authObserver=new R(this,"blazing:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._token=t.token,this.src&&this.hydrate(this.src)}),this.src&&this.hydrate(this.src)}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._token}`}:void 0}async hydrate(t){try{const e=await fetch(t,{headers:this.authorization});if(!e.ok)throw new Error(`HTTP ${e.status}`);this.items=await e.json()}catch(e){console.error("Failed to load trade cards:",e)}}render(){return y`
      ${this.items.map(t=>y`
          <trade-card
            id=${t.id||""}
            title=${t.title}
            href=${t.href}
            link-text=${t.linkText}
          >
            ${t.description}
          </trade-card>
        `)}
    `}};Re.styles=U`
    :host {
      display: contents;
    }
  `;let kt=Re;ur([A()],kt.prototype,"src");ur([W()],kt.prototype,"items");var mn=Object.defineProperty,Gt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&mn(t,e,r),r};const Ue=class Ue extends P{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return y`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button
            ?disabled=${!this.canSubmit}
            type="submit">
            Login
          </button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,n=this.formData;switch(s){case"username":this.formData={...n,username:r};break;case"password":this.formData={...n,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}};Ue.styles=[Ae.styles,U`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
  `];let B=Ue;Gt([W()],B.prototype,"formData");Gt([A()],B.prototype,"api");Gt([A()],B.prototype,"redirect");Gt([W()],B.prototype,"error");const pr=U`
  .login-background {
    background: url("/styles/background/b2.png") no-repeat center center fixed;
    background-size: cover;
    font-family: var(--font-body);
    color: var(--color-text);
  }

  .login-cont {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
  }

  .login-card {
    backdrop-filter: blur(8px);
    border-radius: 24px;
    padding: 2rem 4rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .login-card h2 {
    font-family: var(--font-display);
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .login-card label {
    display: block;
    text-align: left;
    margin: 1rem 0 0.5rem;
  }

  .login-card input[type="user"],
  .login-card input[type="password"] {
    width: 100%;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  .login-options {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    margin: 1rem 0;
    margin-top: auto;
  }

  .signup-link {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
`,Ne=class Ne extends E{render(){return y`
          <main class="login-cont">
            <section class="login-card">
              <h2>User Login</h2>
              <login-form api="/auth/login" redirect="/app">
                <label>
                  <span>Username</span>
                  <input
                    type="user"
                    name="username"
                    autocomplete="off"
                    required
                  />
                </label>
                <label>
                  <span>Password</span>
                  <input type="password" name="password" required />
                </label>
                <div class="login-options">
                  <label><input type="checkbox" /> Remember me</label>
                  <a href="#">Forgot Password?</a>
                </div>
              </login-form>
              <p class="signup-link">
                Don't have an account? <a href="/app/register">Register</a>?
              </p>
            </section>
          </main>
    `}};Ne.styles=[pr];let zt=Ne;customElements.define("login-view",zt);var gn=Object.defineProperty,Zt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&gn(t,e,r),r};const Me=class Me extends P{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return y`
      <form
        @change=${t=>this.handleChange(t)}
        @submit=${t=>this.handleSubmit(t)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Register</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,n=this.formData;switch(s){case"username":this.formData={...n,username:r};break;case"password":this.formData={...n,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch("/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(!e.ok)throw"Register failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}};Me.styles=[Ae.styles,U`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `];let V=Me;Zt([W()],V.prototype,"formData");Zt([A()],V.prototype,"api");Zt([A()],V.prototype,"redirect");Zt([W()],V.prototype,"error");const Le=class Le extends E{render(){return y`
      <main class="login-cont">
        <section class="login-card">
          <h2>Create Account</h2>
          <register-form api="/auth/register" label="Register">
            <label>
              <span>Username</span>
              <input type="user" name="username" autocomplete="off" required />
            </label>
            <label>
              <span>Password</span>
              <input type="password" name="password" required />
            </label>
          </register-form>
        </section>
      </main>
    `}};Le.styles=[pr];let Dt=Le;customElements.define("register-view",Dt);const je=class je extends E{render(){return y`
      <main>
        <section>
          <h2>What are Day Trades?</h2>
          <p>
            - Day trading is the form of buying and selling, where there are
            short selling and buying to cover within the trading day. -
            Positions are usually closed before the market cloese to avoid
            overnight risk. - The objective of day trade is to profit from short
            term price fluctuations by executing quick trades throughout the
            day. - There are many different instrument to trade on, trader can
            work with stocks, options, futures, ETFs and even currencies. -
            There are risk when involve in day trades but it required strong
            emotional discipline, technical analysis and strick risk management
            for success.
          </p>
          <h2>Trading Environment</h2>
          <p>
            - Market Dynamic involves intraday volatility, liquidity, and price
            momentum which day trader use to exploits - There are various
            platform trader uses to analyze, real time market data and
            charting/technical analysis.
          </p>
        </section>

        <section>
          <h2>How Does it Work?</h2>
          <p>
            Day trading involves several key steps and tools that work together
            in a fast-paced environment:
          </p>
          <ul>
            <li>
              <strong>Real-time Data Monitoring:</strong> Traders continuously
              monitor live market data through trading platforms that offer
              real-time quotes, charts, and news feeds.
            </li>
            <li>
              <strong>Technical Analysis & Charting:</strong> Using technical
              indicators (such as moving averages, RSI, and Bollinger Bands),
              traders analyze chart patterns to identify entry and exit signals.
            </li>
            <li>
              <strong>Strategic Order Placement:</strong> Based on analysis,
              traders execute orders using various types such as market, limit,
              or stop orders. These tools help secure optimal entry points and
              manage risk through automated triggers like stop-loss orders.
            </li>
            <li>
              <strong>Risk Management:</strong> Effective risk management is
              essential. Traders set predefined risk levels, use stop-loss
              orders, and allocate only a portion of their capital to each trade
              to limit potential losses.
            </li>
            <li>
              <strong>Trade Execution & Monitoring:</strong> Once an order is
              placed, the trading system automatically executes the trade when
              conditions are met. Traders then monitor their open positions
              throughout the day, making adjustments based on market movement
              and new data.
            </li>
            <li>
              <strong>Closing Positions:</strong> All positions are closed
              before the market ends to avoid overnight exposure, ensuring that
              every trade concludes within the same day.
            </li>
          </ul>
        </section>
      </main>
    `}};je.styles=[N];let Ht=je;customElements.define("daytrades-view",Ht);const ze=class ze extends E{render(){return y`
      <main>
        <section>
          <h2>What is Margin?</h2>
          <p>
            In day trading, margin is borrowed money provided by your broker
            that allows you to buy more shares than you could with just your own
            capital.
          </p>
          <p>
            A margin account lets traders access leverage, which can amplify
            both gains and losses. You're required to deposit a minimum margin
            (initial margin) and maintain a certain equity (maintenance margin)
            in your account.
          </p>
        </section>

        <section>
          <h2>Leverage in Day Trading</h2>
          <p>
            Leverage is the use of borrowed funds to increase your position
            size. For example, with 4:1 leverage, a trader with $5,000 can trade
            up to $20,000 worth of stock during the day.
          </p>
          <p>
            While leverage boosts your buying power, it also increases exposure
            to risk. Even a small price movement in the wrong direction can lead
            to significant losses.
          </p>
        </section>

        <section>
          <h2>Risks of Margin Trading</h2>
          <ul>
            <li>
              <strong>Margin Calls:</strong> If your account value falls below
              the maintenance requirement, your broker may issue a margin call
              and force you to deposit more funds or sell positions.
            </li>
            <li>
              <strong>Amplified Losses:</strong> Losses are magnified because
              you're trading with borrowed funds. A 10% drop on a leveraged
              position could mean a 40% loss on your own capital.
            </li>
            <li>
              <strong>Liquidation Risk:</strong> Brokers can liquidate your
              assets without notice to cover margin deficiencies.
            </li>
          </ul>
        </section>

        <section>
          <h2>Tips for Using Margin Wisely</h2>
          <ul>
            <li>
              Use leverage only if you fully understand the risks involved.
            </li>
            <li>
              Set strict stop-losses to protect your account from margin calls.
            </li>
            <li>Monitor your buying power and account equity regularly.</li>
            <li>Notes: Don't use full leverage — leave a buffer in your account.</li>
            <li>
              Trade with a plan, not emotion — leverage can tempt overtrading.
            </li>
          </ul>
        </section>
      </main>
    `}};ze.styles=[N];let It=ze;customElements.define("margins-view",It);const De=class De extends E{render(){return y`
      <main>
        <section>
          <h2>Understanding Orders</h2>
          <p>
            In day trading, orders are the set of instructions you send to your
            broker to execute trades under specific conditions. They not only
            dictate how and when your trades are executed, but they also help
            you manage risk and seize short-term opportunities.
          </p>
          <p>
            Different order types provide you with varying levels of control
            over execution speed, price certainty, and overall trade management.
          </p>
        </section>

        <section>
          <h2>Types of Orders</h2>
          <p>
            <strong>Market Order:</strong> Executes immediately at the best
            available price. Fast but offers no price control.
          </p>
          <p>
            <strong>Limit Order:</strong> Executes only at a specified price or
            better. Great for controlling entry/exit prices, but may not fill.
          </p>
          <p>
            <strong>Stop Order:</strong> Becomes a market order once a trigger
            price is hit. Useful for stopping losses or entering breakouts.
          </p>
          <p>
            <strong>Stop-Limit Order:</strong> Similar to a stop order, but
            executes as a limit order after triggering. Gives control but may
            not fill in volatile markets.
          </p>
          <p>
            <strong>Trailing Stop:</strong> Automatically adjusts the stop price
            as the market moves in your favor. Locks in gains while limiting
            downside.
          </p>
        </section>

        <section>
          <h2>Order Execution & Management</h2>
          <p>
            Timing and liquidity impact whether your order fills. Limit orders
            may stay open or get partially filled depending on volume.
          </p>
          <p>
            Traders often combine orders (ex. bracket orders or
            OCO—one-cancels-other) to automate exit strategies for profit-taking
            and loss prevention.
          </p>
          <p>
            Platforms may also support conditional orders (ex. trigger only
            during market hours, or if another position changes).
          </p>
        </section>

        <section>
          <h2>Tips for Effective Order Use</h2>
          <ul>
            <li>
              Use limit orders when precision is more important than speed.
            </li>
            <li>
              Place stop-losses immediately after opening a trade to protect
              capital.
            </li>
            <li>
              Review order types supported by your broker—especially for
              after-hours or pre-market trading.
            </li>
            <li>
              Simulate your strategy before going live to test how different
              orders behave in volatile conditions.
            </li>
            <li>
              Use trailing stops in trending markets to protect gains without
              exiting too early.
            </li>
          </ul>
        </section>
      </main>
    `}};De.styles=[N];let qt=De;customElements.define("order-view",qt);const He=class He extends E{render(){return y`
      <main>
        <section>
          <h2>What is a Brokerage Account?</h2>
          <p>
            A brokerage account is a financial account that allows you to buy
            and sell securities such as stocks, ETFs, and options. It acts as a
            bridge between individual investors and the stock market.
          </p>
          <p>
            For day traders, the right brokerage account offers essential tools
            such as fast order execution, real-time data, and access to margin
            trading.
          </p>
        </section>

        <section>
          <h2>Types of Brokerage Accounts</h2>
          <p>
            <strong>Cash Account:</strong> You trade using only the funds
            deposited. No borrowing is allowed, which limits risk but also
            leverage.
          </p>
          <p>
            <strong>Margin Account:</strong> Allows you to borrow money from the
            broker to trade. This can amplify gains—but also losses. Margin
            accounts are required for short selling and pattern day trading.
          </p>
        </section>

        <section>
          <h2>Key Features for Day Traders</h2>
          <ul>
            <li>
              <strong>Low commissions and fees</strong> to reduce overhead on
              frequent trades
            </li>
            <li>
              <strong>Fast execution speeds</strong> to capitalize on short-term
              price movements
            </li>
            <li>
              <strong>Level II quotes and real-time data</strong> for better
              market insight
            </li>
            <li><strong>Advanced charting tools</strong> and hotkey support</li>
            <li>
              <strong>Mobile and desktop platforms</strong> for flexibility
            </li>
          </ul>
        </section>

        <section>
          <h2>Important Regulations</h2>
          <p>
            If you're flagged as a Pattern Day Trader (PDT), you're required to
            maintain a minimum account balance of $25,000 in a margin account.
            Brokers enforce this under FINRA rules.
          </p>
          <p>
            Violating PDT rules may result in account restrictions, including
            trade limitations or conversion to a cash account.
          </p>
        </section>

        <section>
          <h2>Tips for Choosing a Brokerage</h2>
          <ul>
            <li>Compare platforms for speed, reliability, and trading tools</li>
            <li>
              Choose brokers that support pre-market and after-hours trading
            </li>
            <li>Review margin rates and borrowing limits</li>
            <li>Start with a demo account if available to test features</li>
            <li>
              Check customer support availability, especially during market
              hours
            </li>
          </ul>
        </section>
      </main>
    `}};He.styles=[N];let Ft=He;customElements.define("brokerage-view",Ft);const Ie=class Ie extends E{render(){return y`
      <main>
        <section>
          <h2>List of Strategies</h2>
          <p>
            Day trading strategies are short-term approaches used to profit from
            price movements within the same trading day. The right strategy
            depends on market conditions, trader experience, risk tolerance, and
            personal style.
          </p>
        </section>

        <section>
          <h2>1. Scalping</h2>
          <p>
            Scalping involves making dozens or even hundreds of trades per day
            to profit from small price changes. Traders look for high liquidity
            and low spreads.
          </p>
          <ul>
            <li>Extremely short holding periods (seconds to minutes)</li>
            <li>Requires fast execution and minimal slippage</li>
            <li>Best for markets with high volume and low volatility</li>
          </ul>
        </section>

        <section>
          <h2>2. Momentum Trading</h2>
          <p>
            Momentum traders capitalize on strong price trends backed by volume.
            The idea is to “ride the wave” of a stock moving significantly in
            one direction.
          </p>
          <ul>
            <li>Focuses on news catalysts, earnings, or technical breakouts</li>
            <li>Entries based on trend confirmation, volume spikes, or RSI</li>
            <li>Quick exits when momentum fades</li>
          </ul>
        </section>

        <section>
          <h2>3. Breakout Trading</h2>
          <p>
            Breakout strategies seek to enter trades when a stock moves outside
            of a defined resistance or support level with increased volume.
          </p>
          <ul>
            <li>Looks for consolidation ranges or triangle patterns</li>
            <li>Requires confirmation with volume and price action</li>
            <li>Stop-loss often placed just inside the range</li>
          </ul>
        </section>

        <section>
          <h2>4. Reversal or Pullback Trading</h2>
          <p>
            Reversal strategies look for turning points when a price trend loses
            strength and reverses direction. Pullback traders enter during brief
            retracements in a trend.
          </p>
          <ul>
            <li>
              Uses support/resistance, candlestick patterns, or indicators
              (ex. MACD, RSI)
            </li>
            <li>Requires strong discipline and confirmation signals</li>
            <li>Higher risk but potentially larger reward</li>
          </ul>
        </section>

        <section>
          <h2>Tips for Choosing Strategy</h2>
          <ul>
            <li>Start with 1-2 strategies and master them before expanding</li>
            <li>Backtest and paper trade to build confidence</li>
            <li>Keep a trading journal to refine your edge</li>
            <li>Adapt to changing market volatility and news events</li>
          </ul>
        </section>
      </main>
    `}};Ie.styles=[N];let Bt=Ie;customElements.define("strategies-view",Bt);const qe=class qe extends E{render(){return y`
      <main>
        <section>
          <h2>What Are Asset Types?</h2>
          <p>
            An asset is any tradable financial instrument that has value. In day
            trading, traders focus on highly liquid assets that show volatility,
            allowing for profit within short timeframes.
          </p>
        </section>

        <section>
          <h2>Stocks (Equities)</h2>
          <p>
            Stocks represent ownership in a company. They are the most common
            asset type for day traders, especially small-cap and mid-cap stocks
            due to their volatility.
          </p>
          <ul>
            <li>High liquidity, especially in large-cap stocks</li>
            <li>Susceptible to news, earnings, and market sentiment</li>
            <li>Traded on major exchanges like NASDAQ and NYSE</li>
          </ul>
        </section>

        <section>
          <h2>ETFs (Exchange-Traded Funds)</h2>
          <p>
            ETFs are funds that track an index, sector, or commodity and trade
            like stocks. They provide diversification with the flexibility of
            intraday trading.
          </p>
          <ul>
            <li>Less volatile than individual stocks</li>
            <li>Useful for sector-based strategies or hedging</li>
            <li>Popular among swing and position traders as well</li>
          </ul>
        </section>

        <section>
          <h2>Options</h2>
          <p>
            Options give the right, but not the obligation, to buy or sell a
            stock at a specific price. They offer high leverage with limited
            upfront capital.
          </p>
          <ul>
            <li>Complex and risky — not recommended for beginners</li>
            <li>Popular among experienced traders for short-term plays</li>
            <li>Can be used for hedging or speculation</li>
          </ul>
        </section>

        <section>
          <h2>Futures</h2>
          <p>
            Futures are contracts to buy or sell an asset at a predetermined
            future date and price. They're often used to trade commodities,
            indexes, or currencies.
          </p>
          <ul>
            <li>High leverage and 24-hour trading access</li>
            <li>Popular in markets like E-mini S&P 500, crude oil, and gold</li>
            <li>Require deep knowledge and risk control</li>
          </ul>
        </section>

        <section>
          <h2>Cryptocurrencies</h2>
          <p>
            Digital assets like Bitcoin and Ethereum are known for extreme
            volatility and are traded on specialized exchanges.
          </p>
          <ul>
            <li>Trade 24/7 globally</li>
            <li>High risk and high reward potential</li>
            <li>Require different analysis tools and wallets</li>
          </ul>
        </section>
      </main>
    `}};qe.styles=[N];let Vt=qe;customElements.define("asset-view",Vt);const yn=[{path:"/app/profile/:id",view:i=>y`
      <mu-auth provides="blazing:auth" redirect="/app/login">
        <profile-view user-id=${i.id}></profile-view>
      </mu-auth>`},{path:"/app/edit/:id",view:i=>y`<card-edit-view user-id=${i.id}></card-edit-view>`},{path:"/",redirect:"/app"},{path:"/app/daytrades",view:()=>y`<daytrades-view></daytrades-view>`},{path:"/app/orders",view:()=>y`<order-view></order-view>`},{path:"/app/assetTypes",view:()=>y`<asset-view></asset-view>`},{path:"/app/strategies",view:()=>y`<strategies-view></strategies-view>`},{path:"/app/brokerageAcc",view:()=>y`<brokerage-view></brokerage-view>`},{path:"/app/margins",view:()=>y`<margins-view></margins-view>`},{path:"/app",view:()=>y`<index-view></index-view>`},{path:"/app/login",view:()=>y`<login-view></login-view>`},{path:"/app/register",view:()=>y`<register-view></register-view>`}];rr({"mu-auth":me.Provider,"mu-history":Rs.Provider,"t-header":xt,"mu-switch":class extends Ti.Element{constructor(){super(yn,"blazing:history","blazing:auth")}},"mu-store":class extends Hr.Provider{constructor(){super(sn,en,"blazing:auth")}},"profile-view":wt,"card-edit-view":ot,"index-view":jt,"trade-cards":kt,"trade-card":at,"login-form":B,"login-view":zt,"register-view":Dt,"register-form":V,"daytrades-view":Ht,"margins-view":It,"order-view":qt,"strategies-view":Bt,"brokerage-view":Ft,"asset-view":Vt});
