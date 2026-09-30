import {useState,type InputHTMLAttributes} from 'react';
/** Keep incomplete text local; normalize only after the user finishes the field. */
export default function NumberInput({value,onCommit,min=0,max=1e12,...props}:Omit<InputHTMLAttributes<HTMLInputElement>,'value'|'onChange'|'min'|'max'> & {value:number;onCommit:(n:number)=>void;min?:number;max?:number}){
 const [draft,setDraft]=useState<string|null>(null);
 const commit=()=>{if(draft===null)return;const n=draft.trim()===''?value:Number(draft);if(Number.isFinite(n))onCommit(Math.max(min,Math.min(max,n)));setDraft(null);};
 return <input {...props} type="number" min={min} max={max} value={draft??value} onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();e.currentTarget.blur();}if(e.key==='Escape'){e.preventDefault();setDraft(null);}}}/>;
}
