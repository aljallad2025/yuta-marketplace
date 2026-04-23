import { useState, useCallback } from 'react'
import { Phone, ArrowLeft, X, CheckCircle, Users, Shield, Star, Clock } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLang } from '../../i18n/LangContext'
import { useNavigate } from 'react-router-dom'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const mkDot=(c,s=14)=>L.divIcon({html:`<div style="width:${s}px;height:${s}px;border-radius:50%;background:${c};border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)"></div>`,className:'',iconSize:[s,s],iconAnchor:[s/2,s/2]})
const mkCar=(e,s=30)=>L.divIcon({html:`<div style="font-size:${s}px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))">${e}</div>`,className:'',iconSize:[s,s],iconAnchor:[s/2,s/2]})
const G=mkDot('#16A34A')
const A=mkDot('#D97706')
const CAR=mkCar('🚖')
const DRV=mkCar('🚗',22)

const CARS=[
  {id:'go',e:'🚗',ar:'Go',en:'Go',s:4,base:8,eta:4,dar:'اقتصادي يومي',den:'Everyday rides'},
  {id:'comfort',e:'🚙',ar:'كومفرت',en:'Comfort',s:4,base:16,eta:6,dar:'مريح ومكيّف',den:'Comfortable AC'},
  {id:'black',e:'🚘',ar:'بلاك',en:'Black',s:4,base:28,eta:9,dar:'تجربة فاخرة',den:'Premium luxury'},
  {id:'xl',e:'🚐',ar:'XL',en:'XL',s:7,base:32,eta:11,dar:'عائلات ومجموعات',den:'Groups & family'},
]

const DRVS=[
  {id:1,pos:[24.724,46.681],ar:'محمد العتيبي',en:'Mohammed Al-Otaibi',rating:4.9,trips:2340},
  {id:2,pos:[24.718,46.692],ar:'سعد الدوسري',en:'Saad Al-Dosari',rating:4.8,trips:1870},
  {id:3,pos:[24.709,46.674],ar:'فهد القحطاني',en:'Fahad Al-Qahtani',rating:4.95,trips:3100},
]

const CTR=[24.7136,46.6753]

function Clicker({cb}){useMapEvents({click:e=>cb(e.latlng)});return null}
function Fitter({a,b}){
  const map=useMap()
  useState(()=>{
    if(a&&b)map.fitBounds([a,b],{padding:[80,80],animate:true})
    else if(a)map.setView(a,15,{animate:true})
  })
  return null
}

async function rev(lat,lng){
  try{
    const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    const d=await r.json()
    return d.display_name?.split(',').slice(0,2).join(', ')||`${lat.toFixed(4)},${lng.toFixed(4)}`
  }catch{return `${lat.toFixed(4)},${lng.toFixed(4)}`}
}

function kmdist(a,b){
  const R=6371,dLat=(b[0]-a[0])*Math.PI/180,dLon=(b[1]-a[1])*Math.PI/180
  const x=Math.sin(dLat/2)**2+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLon/2)**2
  return+(R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))).toFixed(1)
}

export default function TaxiPage(){
  const {isAr}=useLang()
  const navigate=useNavigate()
  const T=(ar,en)=>isAr?ar:en
  const ff="'Cairo','Tajawal',sans-serif"
  const blue='#1D4ED8'
  const blueDark='#1E3A8A'
  const blueLt='#EFF6FF'
  const dir=isAr?'rtl':'ltr'

  const [step,setStep]=useState('map')
  const [pick,setPick]=useState('from')
  const [fC,setFC]=useState(null)
  const [tC,setTC]=useState(null)
  const [fL,setFL]=useState('')
  const [tL,setTL]=useState('')
  const [car,setCar]=useState('go')
  const [nm,setNm]=useState('')
  const [ph,setPh]=useState('')
  const [busy,setBusy]=useState(false)
  const [drv,setDrv]=useState(null)
  const [dPos,setDPos]=useState(null)
  const [cd,setCd]=useState(null)
  const [stars,setStars]=useState(0)
  const [hov,setHov]=useState(0)

  const sel=CARS.find(c=>c.id===car)
  const dist=fC&&tC?kmdist(fC,tC):null
  const fare=dist?Math.max(sel.base,Math.round(dist*sel.base*0.65)):sel.base

  const onMap=useCallback(async({lat,lng})=>{
    const lb=await rev(lat,lng)
    if(pick==='from'){setFC([lat,lng]);setFL(lb);if(!tC)setPick('to')}
    else{setTC([lat,lng]);setTL(lb)}
  },[pick,tC])

  const book=()=>{
    if(!nm.trim()||!ph.trim())return
    setBusy(true)
    setTimeout(()=>{
      const d=DRVS[Math.floor(Math.random()*DRVS.length)]
      setDrv(d);setDPos(d.pos)
      let c=sel.eta+2;setCd(c)
      setStep('track');setBusy(false)
      const iv=setInterval(()=>{
        c-=1;setCd(c)
        setDPos(p=>p&&fC?[p[0]+(fC[0]-p[0])*.15,p[1]+(fC[1]-p[1])*.15]:p)
        if(c<=0){clearInterval(iv);setStep('done')}
      },1000)
    },2000)
  }

  const reset=()=>{
    setStep('map');setFC(null);setTC(null);setFL('');setTL('')
    setPick('from');setNm('');setPh('');setDrv(null);setDPos(null);setCd(null);setStars(0)
  }

  const card={background:'#fff',borderRadius:20,border:'1px solid #E5E7EB',boxShadow:'0 2px 12px rgba(0,0,0,.06)'}
  const btn=(on)=>({width:'100%',padding:'16px 0',borderRadius:16,background:on?`linear-gradient(135deg,${blue},#2563EB)`:'#E5E7EB',color:on?'#fff':'#9CA3AF',fontWeight:900,fontSize:16,fontFamily:ff,border:'none',cursor:on?'pointer':'not-allowed',boxShadow:on?'0 6px 20px rgba(29,78,216,.3)':'none',transition:'all .25s'})
  const hdrStyle={background:`linear-gradient(135deg,${blueDark},${blue})`,padding:'18px 18px 24px',direction:dir,fontFamily:ff}
  const backBtn={background:'rgba(255,255,255,.15)',border:'none',borderRadius:12,width:38,height:38,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#fff',marginBottom:14}

  const MapEl=(
    <MapContainer center={CTR} zoom={13} style={{width:'100%',height:'100%'}} zoomControl={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution=""/>
      <Clicker cb={onMap}/>
      {fC&&tC&&<Fitter a={fC} b={tC}/>}
      {fC&&<Marker position={fC} icon={G}/>}
      {tC&&<Marker position={tC} icon={A}/>}
      {fC&&tC&&<Polyline positions={[fC,tC]} pathOptions={{color:blue,weight:4,dashArray:'10 8',opacity:.85}}/>}
      {dPos&&<Marker position={dPos} icon={CAR}/>}
      {step==='map'&&DRVS.map(d=><Marker key={d.id} position={d.pos} icon={DRV}/>)}
    </MapContainer>
  )

  if(step==='map')return(
    <div style={{position:'relative',height:'calc(100vh - 64px)',fontFamily:ff,direction:dir}}>
      <div style={{position:'absolute',inset:0,zIndex:0}}>{MapEl}</div>
      <div style={{position:'absolute',top:14,left:14,right:14,zIndex:10}}>
        <div style={{background:'rgba(255,255,255,.96)',backdropFilter:'blur(10px)',borderRadius:14,padding:'10px 16px',boxShadow:'0 4px 20px rgba(0,0,0,.12)',display:'flex',alignItems:'center',gap:10}}>
          <button onClick={()=>navigate('/web')} style={{background:'none',border:'none',cursor:'pointer',color:'#374151',display:'flex',padding:4}}>
            <ArrowLeft size={18} style={{transform:isAr?'scaleX(-1)':'none'}}/>
          </button>
          <div style={{width:10,height:10,borderRadius:'50%',background:pick==='from'?'#16A34A':'#D97706',flexShrink:0}}/>
          <span style={{fontSize:13,color:'#374151',fontWeight:600,flex:1}}>
            {pick==='from'?T('📍 اضغط لتحديد نقطة الانطلاق','📍 Tap to set pickup'):T('🎯 اضغط لتحديد وجهتك','🎯 Tap to set destination')}
          </span>
          <span style={{background:'#F0FDF4',color:'#16A34A',fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:8}}>{DRVS.length} {T('سائق','drivers')}</span>
        </div>
      </div>
      <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:10,background:'#fff',borderRadius:'24px 24px 0 0',boxShadow:'0 -6px 32px rgba(0,0,0,.14)',padding:'10px 18px 28px'}}>
        <div style={{width:36,height:4,borderRadius:99,background:'#E5E7EB',margin:'0 auto 18px'}}/>
        <div style={{fontWeight:900,fontSize:21,color:'#111827',marginBottom:3}}>{T('احجز رحلتك','Book Your Ride')}</div>
        <div style={{fontSize:12,color:'#9CA3AF',marginBottom:16}}>{T('اضغط على الخريطة لتحديد المواقع','Tap the map to select locations')}</div>
        {[
          {lbl:T('الانطلاق','PICKUP'),val:fL,ph:T('اضغط على الخريطة','Tap on map'),dot:'#16A34A',act:pick==='from',clr:()=>{setFL('');setFC(null);setPick('from')},click:()=>setPick('from'),hl:'rgba(22,163,74,.08)',bdr:'#16A34A'},
          {lbl:T('الوجهة','DESTINATION'),val:tL,ph:T('اضغط على الخريطة','Tap on map'),dot:'#D97706',act:pick==='to',clr:()=>{setTL('');setTC(null);setPick('to')},click:()=>setPick('to'),hl:'rgba(217,119,6,.08)',bdr:'#D97706'},
        ].map((r,i)=>(
          <div key={i} onClick={r.click} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 15px',borderRadius:14,border:`2px solid ${r.act?r.bdr:'#F3F4F6'}`,background:r.act?r.hl:'#F9FAFB',marginBottom:10,cursor:'pointer',transition:'all .2s'}}>
            <div style={{width:11,height:11,borderRadius:'50%',background:r.dot,flexShrink:0}}/>
            <div style={{flex:1,overflow:'hidden'}}>
              <div style={{fontSize:10,color:'#9CA3AF',fontWeight:700,marginBottom:1,letterSpacing:.5}}>{r.lbl}</div>
              <div style={{fontSize:14,fontWeight:r.val?700:400,color:r.val?'#111827':'#D1D5DB',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.val||r.ph}</div>
            </div>
            {r.val&&<button onClick={e=>{e.stopPropagation();r.clr()}} style={{background:'none',border:'none',cursor:'pointer',color:'#9CA3AF',padding:2,display:'flex'}}><X size={15}/></button>}
          </div>
        ))}
        <button style={btn(fC&&tC)} onClick={()=>fC&&tC&&setStep('cars')}>{T('اختر السيارة 🚗','Choose Car Type 🚗')}</button>
      </div>
    </div>
  )

  if(step==='cars')return(
    <div style={{minHeight:'calc(100vh - 64px)',background:'#F8FAFC',fontFamily:ff,direction:dir}}>
      <div style={hdrStyle}>
        <button style={backBtn} onClick={()=>setStep('map')}><ArrowLeft size={17} style={{transform:isAr?'scaleX(-1)':'none'}}/></button>
        <div style={{fontWeight:900,fontSize:21,color:'#fff',marginBottom:4}}>{T('اختر نوع السيارة','Choose Car Type')}</div>
        {dist&&<div style={{fontSize:12,color:'rgba(255,255,255,.7)'}}>{dist} {T('كم','km')}</div>}
        <div style={{marginTop:14,background:'rgba(255,255,255,.12)',borderRadius:12,padding:'10px 14px',display:'flex',gap:10,alignItems:'center'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:'#4ADE80'}}/>
            <div style={{width:1,height:14,background:'rgba(255,255,255,.3)'}}/>
            <div style={{width:7,height:7,borderRadius:'50%',background:'#FCD34D'}}/>
          </div>
          <div style={{flex:1,overflow:'hidden'}}>
            <div style={{fontSize:12,color:'rgba(255,255,255,.9)',fontWeight:600,marginBottom:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{fL}</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,.65)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{tL}</div>
          </div>
        </div>
      </div>
      <div style={{padding:'18px 16px'}}>
        {CARS.map(c=>{
          const p=dist?Math.max(c.base,Math.round(dist*c.base*.65)):c.base
          const on=car===c.id
          return(
            <div key={c.id} onClick={()=>setCar(c.id)} style={{display:'flex',alignItems:'center',gap:14,padding:'16px',borderRadius:18,border:`2px solid ${on?blue:'#E5E7EB'}`,background:on?blueLt:'#fff',marginBottom:11,cursor:'pointer',transition:'all .2s',boxShadow:on?'0 4px 16px rgba(29,78,216,.15)':'0 1px 4px rgba(0,0,0,.04)'}}>
              <span style={{fontSize:38,lineHeight:1}}>{c.e}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:900,fontSize:15,color:'#111827',marginBottom:2}}>{isAr?c.ar:c.en}</div>
                <div style={{fontSize:12,color:'#6B7280',marginBottom:5}}>{isAr?c.dar:c.den}</div>
                <div style={{display:'flex',gap:10}}>
                  <span style={{fontSize:11,color:'#9CA3AF',display:'flex',alignItems:'center',gap:3}}><Users size={10}/>{c.s} {T('مقاعد','seats')}</span>
                  <span style={{fontSize:11,color:'#9CA3AF',display:'flex',alignItems:'center',gap:3}}><Clock size={10}/>{c.eta} {T('دق','min')}</span>
                </div>
              </div>
              <div style={{textAlign:isAr?'left':'right'}}>
                <div style={{fontWeight:900,fontSize:21,color:on?blue:'#111827'}}>{p}</div>
                <div style={{fontSize:11,color:'#9CA3AF'}}>{T('ريال','SAR')}</div>
              </div>
              {on&&<CheckCircle size={19} color={blue} style={{flexShrink:0}}/>}
            </div>
          )
        })}
        <button style={btn(true)} onClick={()=>setStep('confirm')}>{T(`متابعة · ${sel.e} ${sel.ar}`,`Continue · ${sel.e} ${sel.en}`)}</button>
      </div>
    </div>
  )

  if(step==='confirm')return(
    <div style={{minHeight:'calc(100vh - 64px)',background:'#F8FAFC',fontFamily:ff,direction:dir}}>
      <div style={hdrStyle}>
        <button style={backBtn} onClick={()=>setStep('cars')}><ArrowLeft size={17} style={{transform:isAr?'scaleX(-1)':'none'}}/></button>
        <div style={{fontWeight:900,fontSize:21,color:'#fff',marginBottom:2}}>{T('تأكيد الرحلة','Confirm Ride')}</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,.65)'}}>{T('راجع التفاصيل وأكمل البيانات','Review details')}</div>
      </div>
      <div style={{padding:'18px 16px',display:'flex',flexDirection:'column',gap:13}}>
        <div style={{...card,overflow:'hidden'}}>
          <div style={{padding:'16px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #F3F4F6'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:34}}>{sel.e}</span>
              <div>
                <div style={{fontWeight:900,fontSize:15,color:'#111827'}}>{isAr?sel.ar:sel.en}</div>
                <div style={{fontSize:11,color:'#6B7280'}}>{sel.eta} {T('دق','min')} · {sel.s} {T('مقاعد','seats')}</div>
              </div>
            </div>
            <div style={{textAlign:isAr?'left':'right'}}>
              <div style={{fontWeight:900,fontSize:26,color:blue}}>{fare}</div>
              <div style={{fontSize:11,color:'#9CA3AF'}}>{T('ريال','SAR')}</div>
            </div>
          </div>
          <div style={{padding:'14px 18px'}}>
            {[{dot:'#16A34A',lbl:T('من','FROM'),val:fL},{dot:'#D97706',lbl:T('إلى','TO'),val:tL}].map((r,i)=>(
              <div key={i} style={{display:'flex',gap:10,marginBottom:i===0?11:0}}>
                <div style={{width:9,height:9,borderRadius:'50%',background:r.dot,marginTop:4,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:10,color:'#9CA3AF',fontWeight:700,letterSpacing:.5,marginBottom:2}}>{r.lbl}</div>
                  <div style={{fontSize:13,color:'#374151',fontWeight:600,lineHeight:1.4}}>{r.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{...card,padding:'18px'}}>
          <div style={{fontWeight:800,fontSize:15,color:'#111827',marginBottom:14}}>{T('بياناتك','Your Info')}</div>
          {[
            {ph:T('الاسم الكامل *','Full name *'),val:nm,set:setNm,type:'text'},
            {ph:T('رقم الجوال *','Phone number *'),val:ph,set:setPh,type:'tel'},
          ].map((f,i)=>(
            <input key={i} type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
              style={{width:'100%',padding:'13px 15px',borderRadius:12,border:'1.5px solid #E5E7EB',fontSize:14,fontFamily:ff,color:'#111827',outline:'none',marginBottom:i===0?10:0,boxSizing:'border-box',background:'#F9FAFB',fontWeight:600}}
              onFocus={e=>e.target.style.borderColor=blue} onBlur={e=>e.target.style.borderColor='#E5E7EB'}
            />
          ))}
        </div>
        <div style={{...card,padding:'13px 16px',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:12,background:blueLt,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>💵</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14,color:'#111827'}}>{T('دفع نقداً','Cash Payment')}</div>
            <div style={{fontSize:11,color:'#6B7280'}}>{T('الدفع عند الوصول','Pay on arrival')}</div>
          </div>
          <Shield size={17} color="#16A34A"/>
        </div>
        <button style={btn(nm.trim().length>1&&ph.trim().length>6&&!busy)} onClick={book} disabled={nm.trim().length<2||ph.trim().length<7||busy}>
          {busy
            ?<span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}><span style={{width:18,height:18,border:'3px solid rgba(255,255,255,.4)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',animation:'sp .8s linear infinite'}}/>{T('جارٍ البحث عن سائق...','Finding driver...')}</span>
            :T(`🚀 احجز الآن · ${fare} ريال`,`🚀 Book Now · ${fare} SAR`)
          }
        </button>
      </div>
      <style>{'@keyframes sp{to{transform:rotate(360deg)}}'}</style>
    </div>
  )

  if(step==='track'&&drv)return(
    <div style={{minHeight:'calc(100vh - 64px)',background:'#F8FAFC',fontFamily:ff,direction:dir,display:'flex',flexDirection:'column'}}>
      <div style={{height:240,position:'relative',flexShrink:0}}>{MapEl}
        <div style={{position:'absolute',top:12,left:'50%',transform:'translateX(-50%)',zIndex:5,background:'rgba(29,78,216,.9)',backdropFilter:'blur(8px)',borderRadius:10,padding:'7px 16px',color:'#fff',fontWeight:800,fontSize:12,whiteSpace:'nowrap'}}>
          🚖 {T('السائق في الطريق','Driver is on the way')}
        </div>
      </div>
      <div style={{background:`linear-gradient(135deg,${blueDark},${blue})`,padding:'18px',textAlign:'center',flexShrink:0}}>
        <div style={{fontSize:56,fontWeight:900,color:'#fff',lineHeight:1}}>{cd}</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.65)',marginTop:4,textTransform:'uppercase',letterSpacing:2}}>{T('دقيقة للوصول','MINUTES AWAY')}</div>
        <div style={{marginTop:12,background:'rgba(255,255,255,.2)',borderRadius:99,height:4}}>
          <div style={{height:4,borderRadius:99,background:'#fff',width:`${Math.max(5,Math.min(98,(1-cd/(sel.eta+2))*100))}%`,transition:'width 1s ease'}}/>
        </div>
      </div>
      <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:11,flex:1}}>
        <div style={{...card,padding:'16px 18px'}}>
          <div style={{display:'flex',alignItems:'center',gap:13,marginBottom:14}}>
            <div style={{width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${blueDark},${blue})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>👨‍✈️</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:16,color:'#111827',marginBottom:3}}>{isAr?drv.ar:drv.en}</div>
              <div style={{display:'flex',alignItems:'center',gap:5}}>
                <Star size={13} fill="#F59E0B" color="#F59E0B"/>
                <span style={{fontWeight:700,fontSize:12,color:'#374151'}}>{drv.rating}</span>
                <span style={{fontSize:11,color:'#9CA3AF'}}>· {drv.trips.toLocaleString()} {T('رحلة','trips')}</span>
              </div>
              <div style={{fontSize:11,color:'#6B7280',marginTop:2}}>{sel.e} {isAr?sel.ar:sel.en}</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button style={{flex:1,padding:'11px 0',borderRadius:12,border:'1.5px solid #E5E7EB',background:'#F9FAFB',color:'#374151',fontWeight:700,fontSize:13,fontFamily:ff,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
              <Phone size={15}/>{T('اتصال','Call')}
            </button>
            <button style={{flex:1,padding:'11px 0',borderRadius:12,border:'1.5px solid #E5E7EB',background:'#F9FAFB',color:'#374151',fontWeight:700,fontSize:13,fontFamily:ff,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
              <Shield size={15}/>{T('سلامتي','Safety')}
            </button>
            <button onClick={reset} style={{padding:'11px 14px',borderRadius:12,border:'1.5px solid #FEE2E2',background:'#FFF5F5',color:'#EF4444',cursor:'pointer',display:'flex',alignItems:'center'}}>
              <X size={15}/>
            </button>
          </div>
        </div>
        <div style={{...card,padding:'13px 16px',display:'flex',gap:10,alignItems:'center'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,flexShrink:0}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:'#16A34A'}}/>
            <div style={{width:1,height:18,background:'#E5E7EB'}}/>
            <div style={{width:7,height:7,borderRadius:'50%',background:'#D97706'}}/>
          </div>
          <div style={{flex:1,overflow:'hidden'}}>
            <div style={{fontSize:12,color:'#374151',fontWeight:600,marginBottom:5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{fL}</div>
            <div style={{fontSize:12,color:'#6B7280',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{tL}</div>
          </div>
          <div style={{textAlign:isAr?'left':'right',flexShrink:0}}>
            <div style={{fontWeight:900,fontSize:18,color:blue}}>{fare}</div>
            <div style={{fontSize:11,color:'#9CA3AF'}}>{T('ريال','SAR')}</div>
          </div>
        </div>
      </div>
    </div>
  )

  return(
    <div style={{minHeight:'calc(100vh - 64px)',background:'#F8FAFC',fontFamily:ff,direction:dir,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 20px'}}>
      <div style={{width:96,height:96,borderRadius:'50%',background:'linear-gradient(135deg,#DCFCE7,#BBF7D0)',border:'3px solid #16A34A',display:'flex',alignItems:'center',justifyContent:'center',fontSize:46,marginBottom:18,boxShadow:'0 10px 36px rgba(22,163,74,.2)'}}>✅</div>
      <div style={{fontWeight:900,fontSize:24,color:'#111827',marginBottom:5,textAlign:'center'}}>{T('وصلت بسلامة!','Arrived Safely!')}</div>
      <div style={{fontSize:13,color:'#6B7280',marginBottom:28,textAlign:'center'}}>{T('شكراً لاختيارك سمو تاكسي','Thanks for riding with SUMU')}</div>
      <div style={{...card,padding:'22px 28px',marginBottom:18,textAlign:'center',width:'100%',maxWidth:320}}>
        <div style={{fontWeight:800,fontSize:14,color:'#374151',marginBottom:14}}>{T('قيّم رحلتك','Rate your trip')}</div>
        <div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:6}}>
          {[1,2,3,4,5].map(n=>(
            <button key={n} onMouseEnter={()=>setHov(n)} onMouseLeave={()=>setHov(0)} onClick={()=>setStars(n)}
              style={{fontSize:34,background:'none',border:'none',cursor:'pointer',transition:'transform .15s',transform:(hov||stars)>=n?'scale(1.2)':'scale(1)',filter:(hov||stars)>=n?'none':'grayscale(1) opacity(.35)'}}>⭐</button>
          ))}
        </div>
        {stars>0&&<div style={{fontSize:12,color:'#16A34A',fontWeight:700}}>{[T('سيئ','Poor'),T('مقبول','Fair'),T('جيد','Good'),T('جيد جداً','Very Good'),T('ممتاز 🎉','Excellent 🎉')][stars-1]}</div>}
      </div>
      <button style={{...btn(true),maxWidth:320}} onClick={reset}>{T('🚗 رحلة جديدة','🚗 New Ride')}</button>
    </div>
  )
}
