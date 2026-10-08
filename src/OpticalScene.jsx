import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GLASS } from './glassConfig.js';

const vertex = `attribute vec2 position; varying vec2 uv; void main(){uv=(position+1.)*.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision mediump float;
varying vec2 uv; uniform sampler2D background; uniform vec2 size;
uniform vec4 lens; uniform float radius; uniform float refraction; uniform float blur;
uniform float tint; uniform float dark; uniform vec2 light; uniform float rimWidth;
float distanceToLens(vec2 p){vec2 q=abs(p-(lens.xy+lens.zw*.5))-(lens.zw*.5-radius);return length(max(q,0.))+min(max(q.x,q.y),0.)-radius;}
vec3 sampleAt(vec2 p){return texture2D(background,clamp(vec2(p.x/size.x,1.-p.y/size.y),vec2(.001),vec2(.999))).rgb;}
void main(){
 vec2 p=vec2(uv.x,1.-uv.y)*size; float sd=distanceToLens(p); vec3 color=sampleAt(p);
 if(sd<0.){
  float depth=-sd; vec2 normal=normalize(vec2(distanceToLens(p+vec2(1.,0.))-distanceToLens(p-vec2(1.,0.)),distanceToLens(p+vec2(0.,1.))-distanceToLens(p-vec2(0.,1.)))+vec2(.0001));
  float rim=sin(clamp(depth/rimWidth,0.,1.)*3.14159265); vec2 coordinate=p-normal*rim*refraction;
  vec3 filtered=sampleAt(coordinate)*.28;
  filtered+=(sampleAt(coordinate+vec2(blur,0.))+sampleAt(coordinate-vec2(blur,0.))+sampleAt(coordinate+vec2(0.,blur))+sampleAt(coordinate-vec2(0.,blur)))*.12;
  filtered+=(sampleAt(coordinate+vec2(blur,blur))+sampleAt(coordinate-vec2(blur,blur))+sampleAt(coordinate+vec2(blur,-blur))+sampleAt(coordinate-vec2(blur,-blur)))*.06;
  color=mix(filtered,mix(vec3(1.),vec3(.08,.10,.13),dark),tint);
  float edge=1.-smoothstep(.5,2.8,depth); float spec=pow(max(dot(normal,normalize(light)),0.),2.);
  color=mix(color,vec3(1.),edge*(.055+spec*.34));
  color*=1.-edge*max(normal.y,0.)*.075;
 }else{float shadow=exp(-max(distanceToLens(p-vec2(0.,5.)),0.)/13.)*.07;color*=1.-shadow;}
 gl_FragColor=vec4(color,1.);
}`;

export default function OpticalScene({ theme, material, transmission, background }) {
  const ref = useRef(null), canvasRef = useRef(null), renderer = useRef(null);
  const textureRef = useRef(null), sizeRef = useRef({ width: 600, height: 224 });
  const drag = useRef(null);
  const [position, setPosition] = useState(.46);
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha:false, antialias:false, preserveDrawingBuffer:true });
    if (!gl) return;
    function shader(type, code) {
      const s=gl.createShader(type); gl.shaderSource(s,code); gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw new Error('Optics shader unavailable');}return s;
    }
    let program;
    try {
      program=gl.createProgram();
      const vs=shader(gl.VERTEX_SHADER,vertex), fs=shader(gl.FRAGMENT_SHADER,fragment);
      gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Optics program unavailable');
    } catch { gl.deleteProgram(program); return; }
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    gl.useProgram(program);
    const a=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    const uniforms=Object.fromEntries(['background','size','lens','radius','refraction','blur','tint','dark','light','rimWidth'].map(n=>[n,gl.getUniformLocation(program,n)]));
    renderer.current={gl,program,uniforms,texture};
    textureRef.current=document.createElement('canvas');
    const resize = new ResizeObserver(entries=>{const r=entries[0].contentRect;sizeRef.current={width:r.width,height:r.height};setRevision(v=>v+1);});resize.observe(ref.current);
    setReady(true);
    const lost=e=>{e.preventDefault();ref.current.dataset.renderer='css';setReady(false);renderer.current=null;};
    canvas.addEventListener('webglcontextlost',lost);
    return ()=>{resize.disconnect();canvas.removeEventListener('webglcontextlost',lost);gl.deleteBuffer(buffer);gl.deleteTexture(texture);gl.deleteProgram(program);renderer.current=null;};
  }, []);

  const imageRef=useRef(null), overviewRef=useRef(null);
  useEffect(()=>{
    let canceled=false;
    const image=new Image(),overview=new Image();
    const loaded=()=>{if(!canceled)setRevision(v=>v+1);};
    image.onload=loaded;overview.onload=loaded;
    image.src='/assets/hero-flow-loop-poster.jpg';overview.src='/assets/S23-overview.webp';
    imageRef.current=image;overviewRef.current=overview;
    return()=>{canceled=true;image.onload=null;overview.onload=null;};
  },[]);

  useLayoutEffect(()=>{
    if(!ready||!renderer.current)return;
    const {width:w,height:h}=sizeRef.current, dpr=Math.min(devicePixelRatio||1,GLASS.optics.renderDpr);
    const canvas=canvasRef.current, input=textureRef.current, ctx=input.getContext('2d');
    const {gl,program,uniforms:u,texture}=renderer.current;
    const backgroundKey=`${revision}-${w}-${h}-${dpr}-${theme}-${background}`;
    if(renderer.current.backgroundKey!==backgroundKey){
    canvas.width=input.width=Math.round(w*dpr);canvas.height=input.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle=theme==='dark'?'#18212d':'#e9eef2';ctx.fillRect(0,0,w,h);
    if(background==='blocks'){
      ctx.fillStyle=theme==='dark'?'#485f72':'#afc5d5';ctx.fillRect(0,0,w*.47,h);
      ctx.fillStyle=theme==='dark'?'#7b6a60':'#e2bfaa';ctx.fillRect(w*.62,0,w*.38,h);
      ctx.fillStyle=theme==='dark'?'#709291':'#d1e6e3';ctx.beginPath();ctx.arc(w*.52,h*.5,75,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=theme==='dark'?'#ffffff35':'#ffffffa0';ctx.lineWidth=2;
      for(let x=25;x<w;x+=45){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    }else{
      const image=background==='image'?imageRef.current:overviewRef.current;
      if(image?.complete&&image.naturalWidth){
        const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight);
        ctx.drawImage(image,(w-image.naturalWidth*scale)/2,(h-image.naturalHeight*scale)/2,image.naturalWidth*scale,image.naturalHeight*scale);
      }
      if(theme==='dark'){ctx.fillStyle='#12172288';ctx.fillRect(0,0,w,h);}
    }
    gl.viewport(0,0,canvas.width,canvas.height);gl.useProgram(program);gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,input);
    renderer.current.backgroundKey=backgroundKey;
    }
    const lensWidth=Math.min(290,w-48),x=24+position*(w-lensWidth-48),y=h*.5-34;
    const t=transmission/100;
    gl.uniform1i(u.background,0);gl.uniform2f(u.size,w,h);gl.uniform4f(u.lens,x,y,lensWidth,68);gl.uniform1f(u.radius,34);
    gl.uniform1f(u.rimWidth,GLASS.optics.rim);
    gl.uniform1f(u.refraction,3+t*GLASS.optics.edgeOffset);gl.uniform1f(u.blur,material==='soft'?2.5+(1-t)*3:.5+(1-t));
    gl.uniform1f(u.tint,material==='soft'?.18+(1-t)*.18:.025+(1-t)*.065);gl.uniform1f(u.dark,theme==='dark'?1:0);gl.uniform2f(u.light,-.65,-.8);
    gl.drawArrays(gl.TRIANGLES,0,6);
    ref.current.dataset.renderer='webgl';
    ref.current.style.setProperty('--lens-x',`${x}px`);ref.current.style.setProperty('--lens-y',`${y}px`);ref.current.style.setProperty('--lens-width',`${lensWidth}px`);
    // Debug measurements are DOM metadata only; no persistent or global render loop.
    ref.current.dataset.lens=JSON.stringify({x,y,width:lensWidth,height:68,sceneWidth:w,sceneHeight:h});
  },[ready,revision,theme,material,transmission,background,position]);

  function move(e){
    if(!drag.current)return;
    const w=sizeRef.current.width,lensWidth=Math.min(290,w-48),travel=w-lensWidth-48;
    if(travel>0)setPosition(Math.max(0,Math.min(1,drag.current.position+(e.clientX-drag.current.x)/travel)));
  }
  return <div className="optic-scene" ref={ref} data-background={background}>
    <canvas ref={canvasRef} className="optic-canvas" aria-hidden="true" />
    <button className="scene-lens glass" aria-label="拖动玻璃透镜，左右方向键也可移动" onPointerDown={e=>{drag.current={x:e.clientX,position};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={move} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setPosition(p=>Math.max(0,Math.min(1,p+(e.key==='ArrowRight'?.05:-.05))));}}}>
      <span>内容判断</span><span className="scene-lens-divider" /><span>平台运营</span>
    </button>
    <span className="scene-hint">按住玻璃控件拖动</span>
  </div>;
}
