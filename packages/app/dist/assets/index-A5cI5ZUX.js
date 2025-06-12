(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var fs;class kt extends Error{}kt.prototype.name="InvalidTokenError";function Jr(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Qr(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Jr(t)}catch{return atob(t)}}function Ys(i,t){if(typeof i!="string")throw new kt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new kt(`Invalid token specified: missing part #${e+1}`);let r;try{r=Qr(s)}catch(n){throw new kt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new kt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Zr="mu:context",xe=`${Zr}:change`;class Xr{constructor(t,e){this._proxy=ti(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class Le extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Xr(t,this),this.style.display="contents"}attach(t){return this.addEventListener(xe,t),t}detach(t){this.removeEventListener(xe,t)}}function ti(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const a=i[r];console.log(`Context['${r.toString()}'] <= `,n);const c=Reflect.set(s,r,n,o);if(c){let h=new CustomEvent(xe,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(h,{property:r,oldValue:a,value:n}),t.dispatchEvent(h)}else console.log(`Context['${r}] was not set to ${n}`);return c}})}function ei(i,t){const e=Gs(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function Gs(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return Gs(i,r.host)}class si extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Js(i="mu:message"){return(t,...e)=>t.dispatchEvent(new si(e,i))}class Ne{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ri(i){return t=>({...t,...i})}const ke="mu:auth:jwt",Qs=class Zs extends Ne{constructor(t,e){super((s,r)=>this.update(s,r),t,Zs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(ni(s)),ve(r);case"auth/signout":return e(oi()),ve(this._redirectForLogin);case"auth/redirect":return ve(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};Qs.EVENT_TYPE="auth:message";let Xs=Qs;const tr=Js(Xs.EVENT_TYPE);function ve(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class ii extends Le{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:pt.authenticateFromLocalStorage()})}connectedCallback(){new Xs(this.context,this.redirect).attach(this)}}class dt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ke),t}}class pt extends dt{constructor(t){super();const e=Ys(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new pt(t);return localStorage.setItem(ke,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ke);return t?pt.authenticate(t):new dt}}function ni(i){return ri({user:pt.authenticate(i),token:i})}function oi(){return i=>{const t=i.user;return{user:t&&t.authenticated?dt.deauthenticate(t):t,token:""}}}function ai(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function ci(i){return i.authenticated?Ys(i.token||""):{}}const Fe=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:pt,Provider:ii,User:dt,dispatch:tr,headers:ai,payload:ci},Symbol.toStringTag,{value:"Module"}));function Se(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function gs(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const li=new DOMParser;function Bt(i,...t){const e=i.map((o,a)=>a?[t[a-1],o]:[o]).flat().join(""),s=li.parseFromString(e,"text/html"),r=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...r),n}function he(i){const t=i.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(r,n={mode:"open"}){const o=r.attachShadow(n);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const er=class sr extends HTMLElement{constructor(){super(),this._state={},he(sr.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Se(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},ui(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};er.template=Bt`
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
  `;let hi=er;function ui(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const a=o;a.checked=!!r;break;case"date":o.value=r.toISOString().substr(0,10);break;default:o.value=r;break}}}return i}const di=Object.freeze(Object.defineProperty({__proto__:null,Element:hi},Symbol.toStringTag,{value:"Module"})),rr=class ir extends Ne{constructor(t){super((e,s)=>this.update(e,s),t,ir.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(fi(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(gi(s,r));break}}}};rr.EVENT_TYPE="history:message";let Ie=rr;class ms extends Le{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=pi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),Be(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new Ie(this.context).attach(this)}}function pi(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function fi(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function gi(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const Be=Js(Ie.EVENT_TYPE),nr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:ms,Provider:ms,Service:Ie,dispatch:Be},Symbol.toStringTag,{value:"Module"}));class z{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new ys(this._provider,t);this._effects.push(r),e(r)}else ei(this._target,this._contextLabel).then(r=>{const n=new ys(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class ys{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const or=class ar extends HTMLElement{constructor(){super(),this._state={},this._user=new dt,this._authObserver=new z(this,"blazing:auth"),he(ar.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;mi(r,this._state,e,this.authorization).then(n=>wt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,a=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(a)}).catch(n=>{const o="mu-rest-form:error",a=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:r,request:this._state}});this.dispatchEvent(a)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},wt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&vs(this.src,this.authorization).then(e=>{this._state=e,wt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&vs(this.src,this.authorization).then(r=>{this._state=r,wt(r,this)});break;case"new":s&&(this._state={},wt({},this));break}}};or.observedAttributes=["src","new","action"];or.template=Bt`
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
  `;function vs(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function wt(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const a=o;a.checked=!!r;break;default:o.value=r;break}}}return i}function mi(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const cr=class lr extends Ne{constructor(t,e){super(e,t,lr.EVENT_TYPE,!1)}};cr.EVENT_TYPE="mu:message";let hr=cr;class yi extends Le{constructor(t,e,s){super(e),this._user=new dt,this._updateFn=t,this._authObserver=new z(this,s)}connectedCallback(){const t=new hr(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const vi=Object.freeze(Object.defineProperty({__proto__:null,Provider:yi,Service:hr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Wt=globalThis,Ue=Wt.ShadowRoot&&(Wt.ShadyCSS===void 0||Wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,je=Symbol(),bs=new WeakMap;let ur=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==je)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Ue&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=bs.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&bs.set(e,t))}return t}toString(){return this.cssText}};const bi=i=>new ur(typeof i=="string"?i:i+"",void 0,je),_i=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new ur(e,i,je)},$i=(i,t)=>{if(Ue)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Wt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},_s=Ue?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return bi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:wi,defineProperty:Ai,getOwnPropertyDescriptor:Ei,getOwnPropertyNames:xi,getOwnPropertySymbols:ki,getPrototypeOf:Si}=Object,ft=globalThis,$s=ft.trustedTypes,Ci=$s?$s.emptyScript:"",ws=ft.reactiveElementPolyfillSupport,St=(i,t)=>i,Kt={toAttribute(i,t){switch(t){case Boolean:i=i?Ci:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ze=(i,t)=>!wi(i,t),As={attribute:!0,type:String,converter:Kt,reflect:!1,hasChanged:ze};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ft.litPropertyMetadata??(ft.litPropertyMetadata=new WeakMap);let lt=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=As){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Ai(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Ei(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const a=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??As}static _$Ei(){if(this.hasOwnProperty(St("elementProperties")))return;const t=Si(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(St("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(St("properties"))){const e=this.properties,s=[...xi(e),...ki(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(_s(r))}else t!==void 0&&e.push(_s(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $i(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Kt).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),a=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Kt;this._$Em=n,this[n]=a.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ze)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};lt.elementStyles=[],lt.shadowRootOptions={mode:"open"},lt[St("elementProperties")]=new Map,lt[St("finalized")]=new Map,ws==null||ws({ReactiveElement:lt}),(ft.reactiveElementVersions??(ft.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Yt=globalThis,Gt=Yt.trustedTypes,Es=Gt?Gt.createPolicy("lit-html",{createHTML:i=>i}):void 0,dr="$lit$",B=`lit$${Math.random().toFixed(9).slice(2)}$`,pr="?"+B,Pi=`<${pr}>`,X=document,Tt=()=>X.createComment(""),Ot=i=>i===null||typeof i!="object"&&typeof i!="function",fr=Array.isArray,Ti=i=>fr(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",be=`[ 	
\f\r]`,At=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xs=/-->/g,ks=/>/g,K=RegExp(`>|${be}(?:([^\\s"'>=/]+)(${be}*=${be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ss=/'/g,Cs=/"/g,gr=/^(?:script|style|textarea|title)$/i,Oi=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),Et=Oi(1),gt=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),Ps=new WeakMap,J=X.createTreeWalker(X,129);function mr(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Es!==void 0?Es.createHTML(t):t}const Mi=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":"",o=At;for(let a=0;a<e;a++){const c=i[a];let h,p,u=-1,l=0;for(;l<c.length&&(o.lastIndex=l,p=o.exec(c),p!==null);)l=o.lastIndex,o===At?p[1]==="!--"?o=xs:p[1]!==void 0?o=ks:p[2]!==void 0?(gr.test(p[2])&&(r=RegExp("</"+p[2],"g")),o=K):p[3]!==void 0&&(o=K):o===K?p[0]===">"?(o=r??At,u=-1):p[1]===void 0?u=-2:(u=o.lastIndex-p[2].length,h=p[1],o=p[3]===void 0?K:p[3]==='"'?Cs:Ss):o===Cs||o===Ss?o=K:o===xs||o===ks?o=At:(o=K,r=void 0);const d=o===K&&i[a+1].startsWith("/>")?" ":"";n+=o===At?c+Pi:u>=0?(s.push(h),c.slice(0,u)+dr+c.slice(u)+B+d):c+B+(u===-2?a:d)}return[mr(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};let Ce=class yr{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const a=t.length-1,c=this.parts,[h,p]=Mi(t,e);if(this.el=yr.createElement(h,s),J.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=J.nextNode())!==null&&c.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(dr)){const l=p[o++],d=r.getAttribute(u).split(B),f=/([.?@])?(.*)/.exec(l);c.push({type:1,index:n,name:f[2],strings:d,ctor:f[1]==="."?Di:f[1]==="?"?Li:f[1]==="@"?Ni:ue}),r.removeAttribute(u)}else u.startsWith(B)&&(c.push({type:6,index:n}),r.removeAttribute(u));if(gr.test(r.tagName)){const u=r.textContent.split(B),l=u.length-1;if(l>0){r.textContent=Gt?Gt.emptyScript:"";for(let d=0;d<l;d++)r.append(u[d],Tt()),J.nextNode(),c.push({type:2,index:++n});r.append(u[l],Tt())}}}else if(r.nodeType===8)if(r.data===pr)c.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(B,u+1))!==-1;)c.push({type:7,index:n}),u+=B.length-1}n++}}static createElement(t,e){const s=X.createElement("template");return s.innerHTML=t,s}};function mt(i,t,e=i,s){var r,n;if(t===gt)return t;let o=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const a=Ot(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==a&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),a===void 0?o=void 0:(o=new a(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=mt(i,o._$AS(i,t.values),o,s)),t}let Ri=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??X).importNode(e,!0);J.currentNode=r;let n=J.nextNode(),o=0,a=0,c=s[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new He(n,n.nextSibling,this,t):c.type===1?h=new c.ctor(n,c.name,c.strings,this,t):c.type===6&&(h=new Fi(n,this,t)),this._$AV.push(h),c=s[++a]}o!==(c==null?void 0:c.index)&&(n=J.nextNode(),o++)}return J.currentNode=X,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},He=class vr{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=mt(this,t,e),Ot(t)?t===A||t==null||t===""?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==gt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ti(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==A&&Ot(this._$AH)?this._$AA.nextSibling.data=t:this.T(X.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=Ce.createElement(mr(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Ri(n,this),a=o.u(this.options);o.p(s),this.T(a),this._$AH=o}}_$AC(t){let e=Ps.get(t.strings);return e===void 0&&Ps.set(t.strings,e=new Ce(t)),e}k(t){fr(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new vr(this.S(Tt()),this.S(Tt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},ue=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=mt(this,t,e,0),o=!Ot(t)||t!==this._$AH&&t!==gt,o&&(this._$AH=t);else{const a=t;let c,h;for(t=n[0],c=0;c<n.length-1;c++)h=mt(this,a[s+c],e,c),h===gt&&(h=this._$AH[c]),o||(o=!Ot(h)||h!==this._$AH[c]),h===A?t=A:t!==A&&(t+=(h??"")+n[c+1]),this._$AH[c]=h}o&&!r&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Di=class extends ue{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}},Li=class extends ue{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}},Ni=class extends ue{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=mt(this,t,e,0)??A)===gt)return;const s=this._$AH,r=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==A&&(s===A||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Fi=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){mt(this,t)}};const Ts=Yt.litHtmlPolyfillSupport;Ts==null||Ts(Ce,He),(Yt.litHtmlVersions??(Yt.litHtmlVersions=[])).push("3.1.3");const Ii=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new He(t.insertBefore(Tt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ut=class extends lt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ii(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return gt}};ut._$litElement$=!0,ut.finalized=!0,(fs=globalThis.litElementHydrateSupport)==null||fs.call(globalThis,{LitElement:ut});const Os=globalThis.litElementPolyfillSupport;Os==null||Os({LitElement:ut});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bi={attribute:!0,type:String,converter:Kt,reflect:!1,hasChanged:ze},Ui=(i=Bi,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(a){const c=t.get.call(this);t.set.call(this,a),this.requestUpdate(o,c,i)},init(a){return a!==void 0&&this.P(o,void 0,i),a}}}if(s==="setter"){const{name:o}=e;return function(a){const c=this[o];t.call(this,a),this.requestUpdate(o,c,i)}}throw Error("Unsupported decorator location: "+s)};function br(i){return(t,e)=>typeof e=="object"?Ui(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _r(i){return br({...i,state:!0,attribute:!1})}function ji(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function zi(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var $r={};(function(i){var t=function(){var e=function(u,l,d,f){for(d=d||{},f=u.length;f--;d[u[f]]=l);return d},s=[1,9],r=[1,10],n=[1,11],o=[1,12],a=[5,11,12,13,14,15],c={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,d,f,g,m,v,C){var w=v.length-1;switch(m){case 1:return new g.Root({},[v[w-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[w-1],v[w]]);break;case 4:case 5:this.$=v[w];break;case 6:this.$=new g.Literal({value:v[w]});break;case 7:this.$=new g.Splat({name:v[w]});break;case 8:this.$=new g.Param({name:v[w]});break;case 9:this.$=new g.Optional({},[v[w-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(a,[2,4]),e(a,[2,5]),e(a,[2,6]),e(a,[2,7]),e(a,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(a,[2,10]),e(a,[2,11]),e(a,[2,12]),{1:[2,1]},e(a,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(a,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,d){if(d.recoverable)this.trace(l);else{let f=function(g,m){this.message=g,this.hash=m};throw f.prototype=Error,new f(l,d)}},parse:function(l){var d=this,f=[0],g=[null],m=[],v=this.table,C="",w=0,R=0,ge=2,it=1,S=m.slice.call(arguments,1),_=Object.create(this.lexer),x={yy:{}};for(var nt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,nt)&&(x.yy[nt]=this.yy[nt]);_.setInput(l,x.yy),x.yy.lexer=_,x.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var V=_.yylloc;m.push(V);var I=_.options&&_.options.ranges;typeof x.yy.parseError=="function"?this.parseError=x.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var ds=function(){var at;return at=_.lex()||it,typeof at!="number"&&(at=d.symbols_[at]||at),at},$,T,k,me,ot={},zt,L,ps,Ht;;){if(T=f[f.length-1],this.defaultActions[T]?k=this.defaultActions[T]:(($===null||typeof $>"u")&&($=ds()),k=v[T]&&v[T][$]),typeof k>"u"||!k.length||!k[0]){var ye="";Ht=[];for(zt in v[T])this.terminals_[zt]&&zt>ge&&Ht.push("'"+this.terminals_[zt]+"'");_.showPosition?ye="Parse error on line "+(w+1)+`:
`+_.showPosition()+`
Expecting `+Ht.join(", ")+", got '"+(this.terminals_[$]||$)+"'":ye="Parse error on line "+(w+1)+": Unexpected "+($==it?"end of input":"'"+(this.terminals_[$]||$)+"'"),this.parseError(ye,{text:_.match,token:this.terminals_[$]||$,line:_.yylineno,loc:V,expected:Ht})}if(k[0]instanceof Array&&k.length>1)throw new Error("Parse Error: multiple actions possible at state: "+T+", token: "+$);switch(k[0]){case 1:f.push($),g.push(_.yytext),m.push(_.yylloc),f.push(k[1]),$=null,R=_.yyleng,C=_.yytext,w=_.yylineno,V=_.yylloc;break;case 2:if(L=this.productions_[k[1]][1],ot.$=g[g.length-L],ot._$={first_line:m[m.length-(L||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(L||1)].first_column,last_column:m[m.length-1].last_column},I&&(ot._$.range=[m[m.length-(L||1)].range[0],m[m.length-1].range[1]]),me=this.performAction.apply(ot,[C,R,w,x.yy,k[1],g,m].concat(S)),typeof me<"u")return me;L&&(f=f.slice(0,-1*L*2),g=g.slice(0,-1*L),m=m.slice(0,-1*L)),f.push(this.productions_[k[1]][0]),g.push(ot.$),m.push(ot._$),ps=v[f[f.length-2]][f[f.length-1]],f.push(ps);break;case 3:return!0}}return!0}},h=function(){var u={EOF:1,parseError:function(d,f){if(this.yy.parser)this.yy.parser.parseError(d,f);else throw new Error(d)},setInput:function(l,d){return this.yy=d||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var d=l.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var d=l.length,f=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),f.length-1&&(this.yylineno-=f.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:f?(f.length===g.length?this.yylloc.first_column:0)+g[g.length-f.length].length-f[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),d=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+d+"^"},test_match:function(l,d){var f,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=l[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],f=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),f)return f;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,d,f,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(f=this._input.match(this.rules[m[v]]),f&&(!d||f[0].length>d[0].length)){if(d=f,g=v,this.options.backtrack_lexer){if(l=this.test_match(f,m[v]),l!==!1)return l;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(l=this.test_match(d,m[g]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var d=this.next();return d||this.lex()},begin:function(d){this.conditionStack.push(d)},popState:function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},pushState:function(d){this.begin(d)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(d,f,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();c.lexer=h;function p(){this.yy={}}return p.prototype=c,c.Parser=p,new p}();typeof zi<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})($r);function ct(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var wr={Root:ct("Root"),Concat:ct("Concat"),Literal:ct("Literal"),Splat:ct("Splat"),Param:ct("Param"),Optional:ct("Optional")},Ar=$r.parser;Ar.yy=wr;var Hi=Ar,qi=Object.keys(wr);function Wi(i){return qi.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Er=Wi,Vi=Er,Ki=/[\-{}\[\]+?.,\\\^$|#\s]/g;function xr(i){this.captures=i.captures,this.re=i.re}xr.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Yi=Vi({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Ki,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new xr({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Gi=Yi,Ji=Er,Qi=Ji({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Zi=Qi,Xi=Hi,tn=Gi,en=Zi;Ut.prototype=Object.create(null);Ut.prototype.match=function(i){var t=tn.visit(this.ast),e=t.match(i);return e||!1};Ut.prototype.reverse=function(i){return en.visit(this.ast,i)};function Ut(i){var t;if(this?t=this:t=Object.create(Ut.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Xi.parse(i),t}var sn=Ut,rn=sn,nn=rn;const on=ji(nn);var an=Object.defineProperty,kr=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&an(t,e,r),r};class Mt extends ut{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>Et`
      <h1>Not Found</h1>
    `,this._cases=t.map(r=>({...r,route:new on(r.path)})),this._historyObserver=new z(this,e),this._authObserver=new z(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),Et`
      <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(tr(this,"auth/redirect"),Et`
              <h1>Redirecting for Login</h1>
            `):e.view(e.params||{}):Et`
              <h1>Authenticating</h1>
            `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),Et`
              <h1>Redirecting to ${s}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const a=o.route.match(n);if(a)return{...o,path:s,params:a,query:r}}}redirect(t){Be(this,"history/redirect",{href:t})}}Mt.styles=_i`
    :host,
    main {
      display: contents;
    }
  `;kr([_r()],Mt.prototype,"_user");kr([_r()],Mt.prototype,"_match");const cn=Object.freeze(Object.defineProperty({__proto__:null,Element:Mt,Switch:Mt},Symbol.toStringTag,{value:"Module"})),ln=class Sr extends HTMLElement{constructor(){if(super(),he(Sr.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ln.template=Bt`
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
  `;const hn=class Cr extends HTMLElement{constructor(){super(),this._array=[],he(Cr.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Pr("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{gs(t,"button.add")?Se(t,"input-array:add"):gs(t,"button.remove")&&Se(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],un(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};hn.template=Bt`
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
  `;function un(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Pr(e)))}function Pr(i,t){const e=i===void 0?"":`value="${i}"`;return Bt`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Tr(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var dn=Object.defineProperty,pn=Object.getOwnPropertyDescriptor,fn=(i,t,e,s)=>{for(var r=pn(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&dn(t,e,r),r};class O extends ut{constructor(t){super(),this._pending=[],this._observer=new z(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}fn([br()],O.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Vt=globalThis,qe=Vt.ShadowRoot&&(Vt.ShadyCSS===void 0||Vt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,We=Symbol(),Ms=new WeakMap;let Or=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==We)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(qe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ms.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ms.set(e,t))}return t}toString(){return this.cssText}};const gn=i=>new Or(typeof i=="string"?i:i+"",void 0,We),H=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Or(e,i,We)},mn=(i,t)=>{if(qe)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Vt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Rs=qe?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return gn(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:yn,defineProperty:vn,getOwnPropertyDescriptor:bn,getOwnPropertyNames:_n,getOwnPropertySymbols:$n,getPrototypeOf:wn}=Object,j=globalThis,Ds=j.trustedTypes,An=Ds?Ds.emptyScript:"",_e=j.reactiveElementPolyfillSupport,Ct=(i,t)=>i,Jt={toAttribute(i,t){switch(t){case Boolean:i=i?An:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ve=(i,t)=>!yn(i,t),Ls={attribute:!0,type:String,converter:Jt,reflect:!1,useDefault:!1,hasChanged:Ve};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),j.litPropertyMetadata??(j.litPropertyMetadata=new WeakMap);let ht=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ls){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&vn(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=bn(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){const a=r==null?void 0:r.call(this);n==null||n.call(this,o),this.requestUpdate(t,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ls}static _$Ei(){if(this.hasOwnProperty(Ct("elementProperties")))return;const t=wn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Ct("properties"))){const e=this.properties,s=[..._n(e),...$n(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Rs(r))}else t!==void 0&&e.push(Rs(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Jt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n,o;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const a=s.getPropertyOptions(r),c=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:Jt;this._$Em=r,this[r]=c.fromAttribute(e,a.type)??((o=this._$Ej)==null?void 0:o.get(r))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??Ve)(o,e)||s.useDefault&&s.reflect&&o===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r){const{wrapped:a}=o,c=this[n];a!==!0||this._$AL.has(n)||c===void 0||this.C(n,void 0,o,c)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};ht.elementStyles=[],ht.shadowRootOptions={mode:"open"},ht[Ct("elementProperties")]=new Map,ht[Ct("finalized")]=new Map,_e==null||_e({ReactiveElement:ht}),(j.reactiveElementVersions??(j.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,Qt=Pt.trustedTypes,Ns=Qt?Qt.createPolicy("lit-html",{createHTML:i=>i}):void 0,Mr="$lit$",U=`lit$${Math.random().toFixed(9).slice(2)}$`,Rr="?"+U,En=`<${Rr}>`,tt=document,Rt=()=>tt.createComment(""),Dt=i=>i===null||typeof i!="object"&&typeof i!="function",Ke=Array.isArray,xn=i=>Ke(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",$e=`[ 	
\f\r]`,xt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fs=/-->/g,Is=/>/g,Y=RegExp(`>|${$e}(?:([^\\s"'>=/]+)(${$e}*=${$e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Bs=/'/g,Us=/"/g,Dr=/^(?:script|style|textarea|title)$/i,kn=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),b=kn(1),yt=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),js=new WeakMap,Q=tt.createTreeWalker(tt,129);function Lr(i,t){if(!Ke(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ns!==void 0?Ns.createHTML(t):t}const Sn=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":t===3?"<math>":"",o=xt;for(let a=0;a<e;a++){const c=i[a];let h,p,u=-1,l=0;for(;l<c.length&&(o.lastIndex=l,p=o.exec(c),p!==null);)l=o.lastIndex,o===xt?p[1]==="!--"?o=Fs:p[1]!==void 0?o=Is:p[2]!==void 0?(Dr.test(p[2])&&(r=RegExp("</"+p[2],"g")),o=Y):p[3]!==void 0&&(o=Y):o===Y?p[0]===">"?(o=r??xt,u=-1):p[1]===void 0?u=-2:(u=o.lastIndex-p[2].length,h=p[1],o=p[3]===void 0?Y:p[3]==='"'?Us:Bs):o===Us||o===Bs?o=Y:o===Fs||o===Is?o=xt:(o=Y,r=void 0);const d=o===Y&&i[a+1].startsWith("/>")?" ":"";n+=o===xt?c+En:u>=0?(s.push(h),c.slice(0,u)+Mr+c.slice(u)+U+d):c+U+(u===-2?a:d)}return[Lr(i,n+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class Lt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const a=t.length-1,c=this.parts,[h,p]=Sn(t,e);if(this.el=Lt.createElement(h,s),Q.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=Q.nextNode())!==null&&c.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Mr)){const l=p[o++],d=r.getAttribute(u).split(U),f=/([.?@])?(.*)/.exec(l);c.push({type:1,index:n,name:f[2],strings:d,ctor:f[1]==="."?Pn:f[1]==="?"?Tn:f[1]==="@"?On:de}),r.removeAttribute(u)}else u.startsWith(U)&&(c.push({type:6,index:n}),r.removeAttribute(u));if(Dr.test(r.tagName)){const u=r.textContent.split(U),l=u.length-1;if(l>0){r.textContent=Qt?Qt.emptyScript:"";for(let d=0;d<l;d++)r.append(u[d],Rt()),Q.nextNode(),c.push({type:2,index:++n});r.append(u[l],Rt())}}}else if(r.nodeType===8)if(r.data===Rr)c.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(U,u+1))!==-1;)c.push({type:7,index:n}),u+=U.length-1}n++}}static createElement(t,e){const s=tt.createElement("template");return s.innerHTML=t,s}}function vt(i,t,e=i,s){var o,a;if(t===yt)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=Dt(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((a=r==null?void 0:r._$AO)==null||a.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=vt(i,r._$AS(i,t.values),r,s)),t}class Cn{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??tt).importNode(e,!0);Q.currentNode=r;let n=Q.nextNode(),o=0,a=0,c=s[0];for(;c!==void 0;){if(o===c.index){let h;c.type===2?h=new jt(n,n.nextSibling,this,t):c.type===1?h=new c.ctor(n,c.name,c.strings,this,t):c.type===6&&(h=new Mn(n,this,t)),this._$AV.push(h),c=s[++a]}o!==(c==null?void 0:c.index)&&(n=Q.nextNode(),o++)}return Q.currentNode=tt,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class jt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=vt(this,t,e),Dt(t)?t===E||t==null||t===""?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==yt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):xn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==E&&Dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(tt.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=Lt.createElement(Lr(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new Cn(r,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=js.get(t.strings);return e===void 0&&js.set(t.strings,e=new Lt(t)),e}k(t){Ke(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new jt(this.O(Rt()),this.O(Rt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class de{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=vt(this,t,e,0),o=!Dt(t)||t!==this._$AH&&t!==yt,o&&(this._$AH=t);else{const a=t;let c,h;for(t=n[0],c=0;c<n.length-1;c++)h=vt(this,a[s+c],e,c),h===yt&&(h=this._$AH[c]),o||(o=!Dt(h)||h!==this._$AH[c]),h===E?t=E:t!==E&&(t+=(h??"")+n[c+1]),this._$AH[c]=h}o&&!r&&this.j(t)}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Pn extends de{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===E?void 0:t}}class Tn extends de{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E)}}class On extends de{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=vt(this,t,e,0)??E)===yt)return;const s=this._$AH,r=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==E&&(s===E||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Mn{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){vt(this,t)}}const we=Pt.litHtmlPolyfillSupport;we==null||we(Lt,jt),(Pt.litHtmlVersions??(Pt.litHtmlVersions=[])).push("3.3.0");const Rn=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new jt(t.insertBefore(Rt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Z=globalThis;class N extends ht{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Rn(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return yt}}var Ks;N._$litElement$=!0,N.finalized=!0,(Ks=Z.litElementHydrateSupport)==null||Ks.call(Z,{LitElement:N});const Ae=Z.litElementPolyfillSupport;Ae==null||Ae({LitElement:N});(Z.litElementVersions??(Z.litElementVersions=[])).push("4.2.0");const Dn={search:""};function Ln(i,t,e){switch(i[0]){case"card/select":Nn(i[1],e).then(s=>t(r=>({...r,card:s})));break;case"card/save":Nr(i[1],e).then(s=>t(r=>({...r,card:s}))).then(()=>{const{onSuccess:s}=i[1];s&&s()}).catch(s=>{const{onFailure:r}=i[1];r&&r(s)});break;case"search/set":t(s=>({...s,search:i[1].term}));break;default:throw new Error(`Unhandled Auth message "${i[0]}"`)}}function Nn({id:i},t){return fetch(`/api/cardDatas/${i}`,{headers:Fe.headers(t)}).then(async e=>{if(e.status===200)return e.json();if(e.status===404){const s={id:i,name:"",bio:"",tradingStyle:""};return console.warn(`Card not found for ${i}, creating new one...`),Nr({id:i,card:s},t)}else throw new Error(`Unexpected status ${e.status}`)}).then(e=>{if(e)return console.log("cardData:",e),e})}function Nr(i,t){const e={...i.card,id:i.id};return fetch(`/api/cardDatas/${i.id}`,{method:"PUT",headers:{"Content-Type":"application/json",...Fe.headers(t)},body:JSON.stringify(e)}).then(s=>{if(s.status===200)return s.json();throw new Error(`Failed to save card for ${t.username}`)}).then(s=>{if(s)return s})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fn={attribute:!0,type:String,converter:Jt,reflect:!1,hasChanged:Ve},In=(i=Fn,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(a){const c=t.get.call(this);t.set.call(this,a),this.requestUpdate(o,c,i)},init(a){return a!==void 0&&this.C(o,void 0,i,a),a}}}if(s==="setter"){const{name:o}=e;return function(a){const c=this[o];t.call(this,a),this.requestUpdate(o,c,i)}}throw Error("Unsupported decorator location: "+s)};function M(i){return(t,e)=>typeof e=="object"?In(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function rt(i){return M({...i,state:!0,attribute:!1})}const Fr=H`
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
`;var Bn=Object.defineProperty,Un=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Bn(t,e,r),r};const Qe=class Qe extends O{constructor(){super("blazing:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="user-id"&&e!==s&&s&&(!this.model.card||this.model.card.id!==s)&&this.dispatchMessage(["card/select",{id:s}])}render(){const t=this.model.card??{id:this.userid,name:"",bio:"",tradingStyle:""};return b`
      <section class="profile">
        <h2>${t.name}</h2>
        <p><strong>Bio:</strong> ${t.bio||"N/A"}</p>
        <p><strong>Trading Style:</strong> ${t.tradingStyle||"NA"}</p>
        <a class="edit-btn" href="/app/edit/${this.userid}">Edit Profile</a>
      </section>
    `}};Qe.styles=[Fr];let Nt=Qe;Un([M({attribute:"user-id"})],Nt.prototype,"userid");customElements.define("profile-view",Nt);var jn=Object.defineProperty,zn=Object.getOwnPropertyDescriptor,Ir=(i,t,e,s)=>{for(var r=s>1?void 0:s?zn(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&jn(t,e,r),r};const le=class le extends O{get card(){return this.model.card}connectedCallback(){super.connectedCallback(),this.userid&&this.dispatchMessage(["card/select",{id:this.userid}])}render(){var t,e,s;return b`
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
    `}handleSubmit(t){console.log("Form submit:",t.detail);const e=this.userid??"";this.dispatchMessage(["card/save",{id:e,card:t.detail,onSuccess:()=>{this.dispatchMessage(["card/select",{id:e}]),nr.dispatch(this,"history/navigate",{href:`/app/profile/${e}`})},onFailure:s=>console.log("Save Failed:",s)}])}};le.styles=[Fr],le.uses=Tr({"mu-form":di.Element});let bt=le;Ir([M({attribute:"user-id"})],bt.prototype,"userid",2);Ir([rt()],bt.prototype,"card",1);customElements.define("card-edit-view",bt);const q=H`
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

  .search-results {
    margin: 2rem;
    padding: 1rem;
    background: rgba(179, 176, 176, 0.05);
    border-radius: 6px;
  }

  .search-results ul {
    list-style: none;
    padding: 0;
  }

  .search-results li a {
    color: var(--color-link);
    text-decoration: underline;
  }
`;function F(i){return Array.isArray?Array.isArray(i):jr(i)==="[object Array]"}function Hn(i){if(typeof i=="string")return i;let t=i+"";return t=="0"&&1/i==-1/0?"-0":t}function qn(i){return i==null?"":Hn(i)}function D(i){return typeof i=="string"}function Br(i){return typeof i=="number"}function Wn(i){return i===!0||i===!1||Vn(i)&&jr(i)=="[object Boolean]"}function Ur(i){return typeof i=="object"}function Vn(i){return Ur(i)&&i!==null}function P(i){return i!=null}function Ee(i){return!i.trim().length}function jr(i){return i==null?i===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(i)}const Kn="Incorrect 'index' type",Yn=i=>`Invalid value for key ${i}`,Gn=i=>`Pattern length exceeds max of ${i}.`,Jn=i=>`Missing ${i} property in key`,Qn=i=>`Property 'weight' in key '${i}' must be a positive integer`,zs=Object.prototype.hasOwnProperty;class Zn{constructor(t){this._keys=[],this._keyMap={};let e=0;t.forEach(s=>{let r=zr(s);this._keys.push(r),this._keyMap[r.id]=r,e+=r.weight}),this._keys.forEach(s=>{s.weight/=e})}get(t){return this._keyMap[t]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function zr(i){let t=null,e=null,s=null,r=1,n=null;if(D(i)||F(i))s=i,t=Hs(i),e=Pe(i);else{if(!zs.call(i,"name"))throw new Error(Jn("name"));const o=i.name;if(s=o,zs.call(i,"weight")&&(r=i.weight,r<=0))throw new Error(Qn(o));t=Hs(o),e=Pe(o),n=i.getFn}return{path:t,id:e,weight:r,src:s,getFn:n}}function Hs(i){return F(i)?i:i.split(".")}function Pe(i){return F(i)?i.join("."):i}function Xn(i,t){let e=[],s=!1;const r=(n,o,a)=>{if(P(n))if(!o[a])e.push(n);else{let c=o[a];const h=n[c];if(!P(h))return;if(a===o.length-1&&(D(h)||Br(h)||Wn(h)))e.push(qn(h));else if(F(h)){s=!0;for(let p=0,u=h.length;p<u;p+=1)r(h[p],o,a+1)}else o.length&&r(h,o,a+1)}};return r(i,D(t)?t.split("."):t,0),s?e:e[0]}const to={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},eo={isCaseSensitive:!1,ignoreDiacritics:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(i,t)=>i.score===t.score?i.idx<t.idx?-1:1:i.score<t.score?-1:1},so={location:0,threshold:.6,distance:100},ro={useExtendedSearch:!1,getFn:Xn,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var y={...eo,...to,...so,...ro};const io=/[^ ]+/g;function no(i=1,t=3){const e=new Map,s=Math.pow(10,t);return{get(r){const n=r.match(io).length;if(e.has(n))return e.get(n);const o=1/Math.pow(n,.5*i),a=parseFloat(Math.round(o*s)/s);return e.set(n,a),a},clear(){e.clear()}}}class Ye{constructor({getFn:t=y.getFn,fieldNormWeight:e=y.fieldNormWeight}={}){this.norm=no(e,3),this.getFn=t,this.isCreated=!1,this.setIndexRecords()}setSources(t=[]){this.docs=t}setIndexRecords(t=[]){this.records=t}setKeys(t=[]){this.keys=t,this._keysMap={},t.forEach((e,s)=>{this._keysMap[e.id]=s})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,D(this.docs[0])?this.docs.forEach((t,e)=>{this._addString(t,e)}):this.docs.forEach((t,e)=>{this._addObject(t,e)}),this.norm.clear())}add(t){const e=this.size();D(t)?this._addString(t,e):this._addObject(t,e)}removeAt(t){this.records.splice(t,1);for(let e=t,s=this.size();e<s;e+=1)this.records[e].i-=1}getValueForItemAtKeyId(t,e){return t[this._keysMap[e]]}size(){return this.records.length}_addString(t,e){if(!P(t)||Ee(t))return;let s={v:t,i:e,n:this.norm.get(t)};this.records.push(s)}_addObject(t,e){let s={i:e,$:{}};this.keys.forEach((r,n)=>{let o=r.getFn?r.getFn(t):this.getFn(t,r.path);if(P(o)){if(F(o)){let a=[];const c=[{nestedArrIndex:-1,value:o}];for(;c.length;){const{nestedArrIndex:h,value:p}=c.pop();if(P(p))if(D(p)&&!Ee(p)){let u={v:p,i:h,n:this.norm.get(p)};a.push(u)}else F(p)&&p.forEach((u,l)=>{c.push({nestedArrIndex:l,value:u})})}s.$[n]=a}else if(D(o)&&!Ee(o)){let a={v:o,n:this.norm.get(o)};s.$[n]=a}}}),this.records.push(s)}toJSON(){return{keys:this.keys,records:this.records}}}function Hr(i,t,{getFn:e=y.getFn,fieldNormWeight:s=y.fieldNormWeight}={}){const r=new Ye({getFn:e,fieldNormWeight:s});return r.setKeys(i.map(zr)),r.setSources(t),r.create(),r}function oo(i,{getFn:t=y.getFn,fieldNormWeight:e=y.fieldNormWeight}={}){const{keys:s,records:r}=i,n=new Ye({getFn:t,fieldNormWeight:e});return n.setKeys(s),n.setIndexRecords(r),n}function qt(i,{errors:t=0,currentLocation:e=0,expectedLocation:s=0,distance:r=y.distance,ignoreLocation:n=y.ignoreLocation}={}){const o=t/i.length;if(n)return o;const a=Math.abs(s-e);return r?o+a/r:a?1:o}function ao(i=[],t=y.minMatchCharLength){let e=[],s=-1,r=-1,n=0;for(let o=i.length;n<o;n+=1){let a=i[n];a&&s===-1?s=n:!a&&s!==-1&&(r=n-1,r-s+1>=t&&e.push([s,r]),s=-1)}return i[n-1]&&n-s>=t&&e.push([s,n-1]),e}const G=32;function co(i,t,e,{location:s=y.location,distance:r=y.distance,threshold:n=y.threshold,findAllMatches:o=y.findAllMatches,minMatchCharLength:a=y.minMatchCharLength,includeMatches:c=y.includeMatches,ignoreLocation:h=y.ignoreLocation}={}){if(t.length>G)throw new Error(Gn(G));const p=t.length,u=i.length,l=Math.max(0,Math.min(s,u));let d=n,f=l;const g=a>1||c,m=g?Array(u):[];let v;for(;(v=i.indexOf(t,f))>-1;){let S=qt(t,{currentLocation:v,expectedLocation:l,distance:r,ignoreLocation:h});if(d=Math.min(S,d),f=v+p,g){let _=0;for(;_<p;)m[v+_]=1,_+=1}}f=-1;let C=[],w=1,R=p+u;const ge=1<<p-1;for(let S=0;S<p;S+=1){let _=0,x=R;for(;_<x;)qt(t,{errors:S,currentLocation:l+x,expectedLocation:l,distance:r,ignoreLocation:h})<=d?_=x:R=x,x=Math.floor((R-_)/2+_);R=x;let nt=Math.max(1,l-x+1),V=o?u:Math.min(l+x,u)+p,I=Array(V+2);I[V+1]=(1<<S)-1;for(let $=V;$>=nt;$-=1){let T=$-1,k=e[i.charAt(T)];if(g&&(m[T]=+!!k),I[$]=(I[$+1]<<1|1)&k,S&&(I[$]|=(C[$+1]|C[$])<<1|1|C[$+1]),I[$]&ge&&(w=qt(t,{errors:S,currentLocation:T,expectedLocation:l,distance:r,ignoreLocation:h}),w<=d)){if(d=w,f=T,f<=l)break;nt=Math.max(1,2*l-f)}}if(qt(t,{errors:S+1,currentLocation:l,expectedLocation:l,distance:r,ignoreLocation:h})>d)break;C=I}const it={isMatch:f>=0,score:Math.max(.001,w)};if(g){const S=ao(m,a);S.length?c&&(it.indices=S):it.isMatch=!1}return it}function lo(i){let t={};for(let e=0,s=i.length;e<s;e+=1){const r=i.charAt(e);t[r]=(t[r]||0)|1<<s-e-1}return t}const Zt=String.prototype.normalize?i=>i.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g,""):i=>i;class qr{constructor(t,{location:e=y.location,threshold:s=y.threshold,distance:r=y.distance,includeMatches:n=y.includeMatches,findAllMatches:o=y.findAllMatches,minMatchCharLength:a=y.minMatchCharLength,isCaseSensitive:c=y.isCaseSensitive,ignoreDiacritics:h=y.ignoreDiacritics,ignoreLocation:p=y.ignoreLocation}={}){if(this.options={location:e,threshold:s,distance:r,includeMatches:n,findAllMatches:o,minMatchCharLength:a,isCaseSensitive:c,ignoreDiacritics:h,ignoreLocation:p},t=c?t:t.toLowerCase(),t=h?Zt(t):t,this.pattern=t,this.chunks=[],!this.pattern.length)return;const u=(d,f)=>{this.chunks.push({pattern:d,alphabet:lo(d),startIndex:f})},l=this.pattern.length;if(l>G){let d=0;const f=l%G,g=l-f;for(;d<g;)u(this.pattern.substr(d,G),d),d+=G;if(f){const m=l-G;u(this.pattern.substr(m),m)}}else u(this.pattern,0)}searchIn(t){const{isCaseSensitive:e,ignoreDiacritics:s,includeMatches:r}=this.options;if(t=e?t:t.toLowerCase(),t=s?Zt(t):t,this.pattern===t){let g={isMatch:!0,score:0};return r&&(g.indices=[[0,t.length-1]]),g}const{location:n,distance:o,threshold:a,findAllMatches:c,minMatchCharLength:h,ignoreLocation:p}=this.options;let u=[],l=0,d=!1;this.chunks.forEach(({pattern:g,alphabet:m,startIndex:v})=>{const{isMatch:C,score:w,indices:R}=co(t,g,m,{location:n+v,distance:o,threshold:a,findAllMatches:c,minMatchCharLength:h,includeMatches:r,ignoreLocation:p});C&&(d=!0),l+=w,C&&R&&(u=[...u,...R])});let f={isMatch:d,score:d?l/this.chunks.length:1};return d&&r&&(f.indices=u),f}}class W{constructor(t){this.pattern=t}static isMultiMatch(t){return qs(t,this.multiRegex)}static isSingleMatch(t){return qs(t,this.singleRegex)}search(){}}function qs(i,t){const e=i.match(t);return e?e[1]:null}class ho extends W{constructor(t){super(t)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(t){const e=t===this.pattern;return{isMatch:e,score:e?0:1,indices:[0,this.pattern.length-1]}}}class uo extends W{constructor(t){super(t)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(t){const s=t.indexOf(this.pattern)===-1;return{isMatch:s,score:s?0:1,indices:[0,t.length-1]}}}class po extends W{constructor(t){super(t)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(t){const e=t.startsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,this.pattern.length-1]}}}class fo extends W{constructor(t){super(t)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(t){const e=!t.startsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}}class go extends W{constructor(t){super(t)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(t){const e=t.endsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[t.length-this.pattern.length,t.length-1]}}}class mo extends W{constructor(t){super(t)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(t){const e=!t.endsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}}class Wr extends W{constructor(t,{location:e=y.location,threshold:s=y.threshold,distance:r=y.distance,includeMatches:n=y.includeMatches,findAllMatches:o=y.findAllMatches,minMatchCharLength:a=y.minMatchCharLength,isCaseSensitive:c=y.isCaseSensitive,ignoreDiacritics:h=y.ignoreDiacritics,ignoreLocation:p=y.ignoreLocation}={}){super(t),this._bitapSearch=new qr(t,{location:e,threshold:s,distance:r,includeMatches:n,findAllMatches:o,minMatchCharLength:a,isCaseSensitive:c,ignoreDiacritics:h,ignoreLocation:p})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(t){return this._bitapSearch.searchIn(t)}}class Vr extends W{constructor(t){super(t)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(t){let e=0,s;const r=[],n=this.pattern.length;for(;(s=t.indexOf(this.pattern,e))>-1;)e=s+n,r.push([s,e-1]);const o=!!r.length;return{isMatch:o,score:o?0:1,indices:r}}}const Te=[ho,Vr,po,fo,mo,go,uo,Wr],Ws=Te.length,yo=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,vo="|";function bo(i,t={}){return i.split(vo).map(e=>{let s=e.trim().split(yo).filter(n=>n&&!!n.trim()),r=[];for(let n=0,o=s.length;n<o;n+=1){const a=s[n];let c=!1,h=-1;for(;!c&&++h<Ws;){const p=Te[h];let u=p.isMultiMatch(a);u&&(r.push(new p(u,t)),c=!0)}if(!c)for(h=-1;++h<Ws;){const p=Te[h];let u=p.isSingleMatch(a);if(u){r.push(new p(u,t));break}}}return r})}const _o=new Set([Wr.type,Vr.type]);class $o{constructor(t,{isCaseSensitive:e=y.isCaseSensitive,ignoreDiacritics:s=y.ignoreDiacritics,includeMatches:r=y.includeMatches,minMatchCharLength:n=y.minMatchCharLength,ignoreLocation:o=y.ignoreLocation,findAllMatches:a=y.findAllMatches,location:c=y.location,threshold:h=y.threshold,distance:p=y.distance}={}){this.query=null,this.options={isCaseSensitive:e,ignoreDiacritics:s,includeMatches:r,minMatchCharLength:n,findAllMatches:a,ignoreLocation:o,location:c,threshold:h,distance:p},t=e?t:t.toLowerCase(),t=s?Zt(t):t,this.pattern=t,this.query=bo(this.pattern,this.options)}static condition(t,e){return e.useExtendedSearch}searchIn(t){const e=this.query;if(!e)return{isMatch:!1,score:1};const{includeMatches:s,isCaseSensitive:r,ignoreDiacritics:n}=this.options;t=r?t:t.toLowerCase(),t=n?Zt(t):t;let o=0,a=[],c=0;for(let h=0,p=e.length;h<p;h+=1){const u=e[h];a.length=0,o=0;for(let l=0,d=u.length;l<d;l+=1){const f=u[l],{isMatch:g,indices:m,score:v}=f.search(t);if(g){if(o+=1,c+=v,s){const C=f.constructor.type;_o.has(C)?a=[...a,...m]:a.push(m)}}else{c=0,o=0,a.length=0;break}}if(o){let l={isMatch:!0,score:c/o};return s&&(l.indices=a),l}}return{isMatch:!1,score:1}}}const Oe=[];function wo(...i){Oe.push(...i)}function Me(i,t){for(let e=0,s=Oe.length;e<s;e+=1){let r=Oe[e];if(r.condition(i,t))return new r(i,t)}return new qr(i,t)}const Xt={AND:"$and",OR:"$or"},Re={PATH:"$path",PATTERN:"$val"},De=i=>!!(i[Xt.AND]||i[Xt.OR]),Ao=i=>!!i[Re.PATH],Eo=i=>!F(i)&&Ur(i)&&!De(i),Vs=i=>({[Xt.AND]:Object.keys(i).map(t=>({[t]:i[t]}))});function Kr(i,t,{auto:e=!0}={}){const s=r=>{let n=Object.keys(r);const o=Ao(r);if(!o&&n.length>1&&!De(r))return s(Vs(r));if(Eo(r)){const c=o?r[Re.PATH]:n[0],h=o?r[Re.PATTERN]:r[c];if(!D(h))throw new Error(Yn(c));const p={keyId:Pe(c),pattern:h};return e&&(p.searcher=Me(h,t)),p}let a={children:[],operator:n[0]};return n.forEach(c=>{const h=r[c];F(h)&&h.forEach(p=>{a.children.push(s(p))})}),a};return De(i)||(i=Vs(i)),s(i)}function xo(i,{ignoreFieldNorm:t=y.ignoreFieldNorm}){i.forEach(e=>{let s=1;e.matches.forEach(({key:r,norm:n,score:o})=>{const a=r?r.weight:null;s*=Math.pow(o===0&&a?Number.EPSILON:o,(a||1)*(t?1:n))}),e.score=s})}function ko(i,t){const e=i.matches;t.matches=[],P(e)&&e.forEach(s=>{if(!P(s.indices)||!s.indices.length)return;const{indices:r,value:n}=s;let o={indices:r,value:n};s.key&&(o.key=s.key.src),s.idx>-1&&(o.refIndex=s.idx),t.matches.push(o)})}function So(i,t){t.score=i.score}function Co(i,t,{includeMatches:e=y.includeMatches,includeScore:s=y.includeScore}={}){const r=[];return e&&r.push(ko),s&&r.push(So),i.map(n=>{const{idx:o}=n,a={item:t[o],refIndex:o};return r.length&&r.forEach(c=>{c(n,a)}),a})}class $t{constructor(t,e={},s){this.options={...y,...e},this.options.useExtendedSearch,this._keyStore=new Zn(this.options.keys),this.setCollection(t,s)}setCollection(t,e){if(this._docs=t,e&&!(e instanceof Ye))throw new Error(Kn);this._myIndex=e||Hr(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(t){P(t)&&(this._docs.push(t),this._myIndex.add(t))}remove(t=()=>!1){const e=[];for(let s=0,r=this._docs.length;s<r;s+=1){const n=this._docs[s];t(n,s)&&(this.removeAt(s),s-=1,r-=1,e.push(n))}return e}removeAt(t){this._docs.splice(t,1),this._myIndex.removeAt(t)}getIndex(){return this._myIndex}search(t,{limit:e=-1}={}){const{includeMatches:s,includeScore:r,shouldSort:n,sortFn:o,ignoreFieldNorm:a}=this.options;let c=D(t)?D(this._docs[0])?this._searchStringList(t):this._searchObjectList(t):this._searchLogical(t);return xo(c,{ignoreFieldNorm:a}),n&&c.sort(o),Br(e)&&e>-1&&(c=c.slice(0,e)),Co(c,this._docs,{includeMatches:s,includeScore:r})}_searchStringList(t){const e=Me(t,this.options),{records:s}=this._myIndex,r=[];return s.forEach(({v:n,i:o,n:a})=>{if(!P(n))return;const{isMatch:c,score:h,indices:p}=e.searchIn(n);c&&r.push({item:n,idx:o,matches:[{score:h,value:n,norm:a,indices:p}]})}),r}_searchLogical(t){const e=Kr(t,this.options),s=(a,c,h)=>{if(!a.children){const{keyId:u,searcher:l}=a,d=this._findMatches({key:this._keyStore.get(u),value:this._myIndex.getValueForItemAtKeyId(c,u),searcher:l});return d&&d.length?[{idx:h,item:c,matches:d}]:[]}const p=[];for(let u=0,l=a.children.length;u<l;u+=1){const d=a.children[u],f=s(d,c,h);if(f.length)p.push(...f);else if(a.operator===Xt.AND)return[]}return p},r=this._myIndex.records,n={},o=[];return r.forEach(({$:a,i:c})=>{if(P(a)){let h=s(e,a,c);h.length&&(n[c]||(n[c]={idx:c,item:a,matches:[]},o.push(n[c])),h.forEach(({matches:p})=>{n[c].matches.push(...p)}))}}),o}_searchObjectList(t){const e=Me(t,this.options),{keys:s,records:r}=this._myIndex,n=[];return r.forEach(({$:o,i:a})=>{if(!P(o))return;let c=[];s.forEach((h,p)=>{c.push(...this._findMatches({key:h,value:o[p],searcher:e}))}),c.length&&n.push({idx:a,item:o,matches:c})}),n}_findMatches({key:t,value:e,searcher:s}){if(!P(e))return[];let r=[];if(F(e))e.forEach(({v:n,i:o,n:a})=>{if(!P(n))return;const{isMatch:c,score:h,indices:p}=s.searchIn(n);c&&r.push({score:h,key:t,value:n,idx:o,norm:a,indices:p})});else{const{v:n,n:o}=e,{isMatch:a,score:c,indices:h}=s.searchIn(n);a&&r.push({score:c,key:t,value:n,norm:o,indices:h})}return r}}$t.version="7.1.0";$t.createIndex=Hr;$t.parseIndex=oo;$t.config=y;$t.parseQuery=Kr;wo($o);const Po=[{title:"Day Trades",path:"/app/daytrades",content:`
        Day trading is the form of buying and selling...
        Real-time Data Monitoring...
        Technical Analysis...
      `},{title:"Orders",path:"/app/orders",content:"In day trading, orders are the set of instructions..."},{title:"Brokerage Account",path:"/app/brokerageAcc",content:"A brokerage account is a type of account..."},{title:"Strategies",path:"/app/strategies",content:"There are several common strategies like scalping..."},{title:"Asset Type",path:"/app/assetTypes",content:"Stocks, ETFs, Options, Futures, Crypto..."},{title:"Margins",path:"/app/margins",content:"Margin trading allows traders to borrow funds..."}],To=new $t(Po,{keys:["title","path","content"],threshold:.3}),Ze=class Ze extends O{render(){const t=this.model.search??"";return t&&To.search(t).map(e=>e.item),b`
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
        <p>
          2025 Day Trades Index. All Rights Reserved. Most infomation were
          obtained from Google and ChatGpt
        </p>
      </footer>
    `}scrollCRight(){var e;const t=(e=this.renderRoot)==null?void 0:e.querySelector("#scroll-container");t.scrollLeft+t.clientWidth>=t.scrollWidth-10?t.scrollTo({left:0,behavior:"smooth"}):t.scrollBy({left:350,behavior:"smooth"})}scrollCLeft(){var e;const t=(e=this.renderRoot)==null?void 0:e.querySelector("#scroll-container");t.scrollLeft<=10?t.scrollTo({left:t.scrollWidth,behavior:"smooth"}):t.scrollBy({left:-350,behavior:"smooth"})}};Ze.styles=[q];let te=Ze;customElements.define("index-view",te);var Oo=Object.defineProperty,Mo=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Oo(t,e,r),r};const Xe=class Xe extends N{constructor(){super(...arguments),this.auth={user:{authenticated:!1,username:""}},this.sendSearch=t=>{},this.searchTerm="",this.authObserver=new z(this,"blazing:auth"),this.storeObserver=new z(this,"blazing:store")}dispatchSearch(t){this.searchTerm=t,console.log("Search dispatched with:",t),this.sendSearch(t)}connectedCallback(){super.connectedCallback(),this.storeObserver.observe(({send:e})=>{this.sendSearch=s=>{e(["search/set",{term:s}])}}),this.authObserver.observe(e=>{this.auth=e}),localStorage.getItem("mode")==="dark"&&requestAnimationFrame(()=>{var s;const e=(s=this.shadowRoot)==null?void 0:s.querySelector(".dark-checkbox");e&&(e.checked=!0)})}render(){var s,r;const t=(s=this.auth.user)==null?void 0:s.authenticated,e=((r=this.auth.user)==null?void 0:r.username)??"Guest";return b`
      <header>
        <input
          type="text"
          class="search-bar"
          placeholder="Search..."
          @input=${n=>this.dispatchSearch(n.target.value)}
          }
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

        ${t?b`
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
            `:b`<a href="/app/login" class="login-btn">Login</a>`}

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
    `}signOut(){this.dispatchEvent(new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signout"]}))}};Xe.styles=[q];let Ft=Xe;Mo([rt()],Ft.prototype,"auth");customElements.define("t-header",Ft);const Ge={styles:H`
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
  `};var Ro=Object.defineProperty,Je=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ro(t,e,r),r};const ts=class ts extends N{constructor(){super(...arguments),this.title="",this.href="",this.linkText=""}render(){return b`
      <h1>${this.title}</h1>
      <p><slot></slot></p>
      <a href="${this.href}">${this.linkText}</a>
    `}};ts.styles=[Ge.styles,H`
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
    `];let _t=ts;Je([M()],_t.prototype,"title");Je([M()],_t.prototype,"href");Je([M({attribute:"link-text"})],_t.prototype,"linkText");var Do=Object.defineProperty,Yr=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Do(t,e,r),r};const es=class es extends N{constructor(){super(...arguments),this.src="",this.items=[],this._authObserver=new z(this,"blazing:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._token=t.token,this.src&&this.hydrate(this.src)}),this.src&&this.hydrate(this.src)}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._token}`}:void 0}async hydrate(t){try{const e=await fetch(t,{headers:this.authorization});if(!e.ok)throw new Error(`HTTP ${e.status}`);this.items=await e.json()}catch(e){console.error("Failed to load trade cards:",e)}}render(){return b`
      ${this.items.map(t=>b`
          <trade-card
            id=${t.id||""}
            title=${t.title}
            href=${t.href}
            link-text=${t.linkText}
          >
            ${t.description}
          </trade-card>
        `)}
    `}};es.styles=H`
    :host {
      display: contents;
    }
  `;let It=es;Yr([M()],It.prototype,"src");Yr([rt()],It.prototype,"items");var Lo=Object.defineProperty,pe=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Lo(t,e,r),r};const ss=class ss extends N{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return b`
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
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,n=this.formData;switch(s){case"username":this.formData={...n,username:r};break;case"password":this.formData={...n,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch((this==null?void 0:this.api)||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(e.status!==200)throw"Login failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}};ss.styles=[Ge.styles,H`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
  `];let et=ss;pe([rt()],et.prototype,"formData");pe([M()],et.prototype,"api");pe([M()],et.prototype,"redirect");pe([rt()],et.prototype,"error");const Gr=H`
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
`,rs=class rs extends O{render(){return b`
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
    `}};rs.styles=[Gr];let ee=rs;customElements.define("login-view",ee);var No=Object.defineProperty,fe=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&No(t,e,r),r};const is=class is extends N{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return b`
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
    `}handleChange(t){const e=t.target,s=e==null?void 0:e.name,r=e==null?void 0:e.value,n=this.formData;switch(s){case"username":this.formData={...n,username:r};break;case"password":this.formData={...n,password:r};break}}handleSubmit(t){t.preventDefault(),this.canSubmit&&fetch("/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(e=>{if(!e.ok)throw"Register failed";return e.json()}).then(e=>{const{token:s}=e,r=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",r),this.dispatchEvent(r)}).catch(e=>{console.log(e),this.error=e.toString()})}};is.styles=[Ge.styles,H`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `];let st=is;fe([rt()],st.prototype,"formData");fe([M()],st.prototype,"api");fe([M()],st.prototype,"redirect");fe([rt()],st.prototype,"error");const ns=class ns extends O{render(){return b`
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
    `}};ns.styles=[Gr];let se=ns;customElements.define("register-view",se);const os=class os extends O{render(){return b`
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
    `}};os.styles=[q];let re=os;customElements.define("daytrades-view",re);const as=class as extends O{render(){return b`
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
    `}};as.styles=[q];let ie=as;customElements.define("margins-view",ie);const cs=class cs extends O{render(){return b`
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
    `}};cs.styles=[q];let ne=cs;customElements.define("order-view",ne);const ls=class ls extends O{render(){return b`
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
    `}};ls.styles=[q];let oe=ls;customElements.define("brokerage-view",oe);const hs=class hs extends O{render(){return b`
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
    `}};hs.styles=[q];let ae=hs;customElements.define("strategies-view",ae);const us=class us extends O{render(){return b`
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
    `}};us.styles=[q];let ce=us;customElements.define("asset-view",ce);const Fo=[{path:"/app/profile/:id",view:i=>b`
      <mu-auth provides="blazing:auth" redirect="/app/login">
        <profile-view user-id=${i.id}></profile-view>
      </mu-auth>`},{path:"/app/edit/:id",view:i=>b`<card-edit-view user-id=${i.id}></card-edit-view>`},{path:"/",redirect:"/app"},{path:"/app/daytrades",view:()=>b`<daytrades-view></daytrades-view>`},{path:"/app/orders",view:()=>b`<order-view></order-view>`},{path:"/app/assetTypes",view:()=>b`<asset-view></asset-view>`},{path:"/app/strategies",view:()=>b`<strategies-view></strategies-view>`},{path:"/app/brokerageAcc",view:()=>b`<brokerage-view></brokerage-view>`},{path:"/app/margins",view:()=>b`<margins-view></margins-view>`},{path:"/app",view:()=>b`<index-view></index-view>`},{path:"/app/login",view:()=>b`<login-view></login-view>`},{path:"/app/register",view:()=>b`<register-view></register-view>`}];Tr({"mu-auth":Fe.Provider,"mu-history":nr.Provider,"t-header":Ft,"mu-switch":class extends cn.Element{constructor(){super(Fo,"blazing:history","blazing:auth")}},"mu-store":class extends vi.Provider{constructor(){super(Ln,Dn,"blazing:auth")}},"profile-view":Nt,"card-edit-view":bt,"index-view":te,"trade-cards":It,"trade-card":_t,"login-form":et,"login-view":ee,"register-view":se,"register-form":st,"daytrades-view":re,"margins-view":ie,"order-view":ne,"strategies-view":ae,"brokerage-view":oe,"asset-view":ce});
