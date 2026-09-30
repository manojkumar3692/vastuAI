/** Sourced baseline, deliberately not represented as a current consolidated approval rulebook. */
export const CMDA_BASELINE = {
 id:'tn-layout-2019-go16-2020', reviewed:'2026-09-30',
 title:'Residential layouts · TNCDBR 2019 + G.O.16 (2020) baseline',
 source:'https://cmdachennai.gov.in/pdfs/TNCDBR-2019.pdf',
 amendment:'https://www.cmdachennai.gov.in/pdfs/TNCDBR-2019-Amendments.pdf',
 caveat:'Later amendments, zoning, road classification and authority conditions must be checked by the approval consultant. This is a sourced baseline, not statutory clearance.',
};
export const isTamilNadu=(authority:string)=>authority==='CMDA'||authority==='DTCP';
export function baselineStreetWidth(length:number){return length<=120?7.2:length<240?10:length<400?12:length<=1000?18:24;}
export function baselineReservations(area:number,roadArea:number,authority:string){const net=Math.max(0,area-roadArea);return isTamilNadu(authority)?{osr:area<=3000?0:net*.1,public:net*.01,ews:area>10000?net*.1:0}:{osr:0,public:0,ews:0};}
