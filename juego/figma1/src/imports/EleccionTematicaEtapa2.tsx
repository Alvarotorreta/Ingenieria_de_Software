import imgTexto21 from "figma:asset/6eff7a475516ebec12f8e344181ea4e98319559b.png";
import { imgGroup, imgGroup1 } from "./svg-0h6ee";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84px] items-start left-[151px] top-[118px] w-[615px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[48px] w-[912px]">Elección tematica</p>
    </div>
  );
}

function Seconds() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal items-center leading-[0] left-[1190px] text-[#f757ac] text-center text-nowrap top-[130px]" data-name="seconds">
      <div className="flex flex-col justify-center relative shrink-0 text-[48px] tracking-[0.48px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[69.856px] text-nowrap whitespace-pre">00</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-nowrap whitespace-pre">Segundos</p>
      </div>
    </div>
  );
}

function Minutes() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal h-[85px] items-center leading-[0] left-[1085px] text-[#f757ac] text-center text-nowrap top-[130px]" data-name="minutes">
      <div className="flex flex-col justify-center relative shrink-0 text-[48px] tracking-[0.48px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[69.856px] text-nowrap whitespace-pre">03</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-nowrap whitespace-pre">Minutos</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[85.16%_36.27%_8.37%_36.09%] mask-position-[0px,_0px] mask-size-[377.49px_66.258px,_377.49px_66.258px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 378 67">
        <g id="Group">
          <g id="Vector">
            <path d="M0 0V66.2584H377.49V0H0Z" fill="var(--fill-0, #093C92)" />
            <path d="M0 0V66.2584H377.49V0H0Z" fill="var(--fill-1, #F757AC)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[85.16%_36.27%_8.37%_36.09%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[85.16%_36.27%_8.37%_36.09%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[85.16%_36.27%_8.37%_36.09%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[493px] top-[872px]" data-name="Send Code (Button)">
      <div className="absolute bg-[#093c92] inset-[85.16%_36.09%_8.11%_36.09%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[23.858px] leading-[normal] left-[704.04px] text-[15px] text-center top-[897.18px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

function Frame2() {
  return <div className="absolute h-[58px] left-0 top-0 w-[104px]" />;
}

function Welcome1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-[9px] top-[21px] w-[372px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#43f61f] text-[36px] w-full">Grupo 1: Dream Team</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[73px] left-0 top-0 w-[428px]">
      <div className="absolute h-[73px] left-0 top-0 w-[502px]">
        <div aria-hidden="true" className="absolute border border-[#020202] border-solid inset-0 pointer-events-none" />
      </div>
      {[...Array(2).keys()].map((_, i) => (
        <Welcome1 key={i} />
      ))}
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] left-[428px] text-[24px] text-white top-[29px] w-[26px]">13</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[73px] left-0 top-0 w-[381px]">
      <Frame />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[73px] left-0 top-0 w-[381px]">
      <Frame1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute h-[58px] left-0 top-0 w-[104px]">
      <div className="absolute h-[58px] left-0 top-0 w-[104px]" data-name="Texto (2) 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgTexto21} />
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute h-[58px] left-[423px] top-[17px] w-[104px]">
      <Frame5 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[75px] left-[865px] top-[-2px] w-[527px]">
      <Frame3 />
      <Frame6 />
    </div>
  );
}

export default function EleccionTematicaEtapa() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Eleccion tematica: Etapa 2">
      <div className="absolute bg-black h-[100px] left-[1063px] rounded-[15px] top-[129px] w-[240px]" />
      <Welcome />
      <Seconds />
      <Minutes />
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[687.5px] text-[40px] text-center text-nowrap text-white top-[879px] translate-x-[-50%] whitespace-pre">{`Elegir tematica `}</p>
      <Frame2 />
      <Frame4 />
      <ol className="absolute block font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[495px] leading-[0] left-[72px] list-decimal text-[0px] text-white top-[285px] w-[1184px]" start="1">
        <li className="leading-[normal] mb-0 ms-[calc(1.5*1*var(--list-marker-font-size,0))] text-[35px] whitespace-pre-wrap">
          <span>{`Tecnología adultos mayores: `}</span>
          <span className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium">{`El avance tecnológico en los últimos años ha sido incremental. Esto ha beneficiado amultiples sectores, sin embargo el conocimiento y adaptación para los adultos mayores hasido una gran dificultad.                                                                                                                                                             `}</span>
        </li>
        <li className="leading-[normal] mb-0 ms-[calc(1.5*1*var(--list-marker-font-size,0))] text-[35px]">
          <span>{`Fast Fashion: `}</span>
          <span className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium">{`La moda rápida ha traido graves consecuencias al medio ambiente. Especialmente ensectores del norte de Chile en donde los vertederos y basurales están afectando el diario vivirde las personas. `}</span>
        </li>
        <li className="leading-[normal] ms-[calc(1.5*1*var(--list-marker-font-size,0))] text-[35px]">
          <span>{`Sustentabilidad del agua en la agricultura: `}</span>
          <span className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium">El agua dulce es un recurso natural fundamental para la vida. Hay zonas rurales en que el aguase ha hecho escasa.</span>
        </li>
      </ol>
    </div>
  );
}