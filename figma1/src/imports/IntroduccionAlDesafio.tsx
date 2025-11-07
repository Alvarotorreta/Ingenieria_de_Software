import svgPaths from "./svg-p26ymyr6fl";
import imgTexto21 from "figma:asset/6eff7a475516ebec12f8e344181ea4e98319559b.png";
import { imgGroup, imgGroup1 } from "./svg-jl5tx";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84px] items-start left-[151px] top-[118px] w-[615px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[48px] w-[912px]">Desafio</p>
    </div>
  );
}

function Welcome1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84px] items-start left-[17px] top-[229px] w-[1350px]" data-name="Welcome">
      <ol className="block font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[0] list-decimal relative shrink-0 text-[32px] text-center text-white w-full" start="1">
        <li className="list-inside ms-[48px]">
          <span className="leading-[normal]">Tecnología adultos mayores</span>
        </li>
      </ol>
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
        <p className="leading-[69.856px] text-nowrap whitespace-pre">01</p>
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

function Welcome2() {
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
        <Welcome2 key={i} />
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

function Cover() {
  return <div className="absolute inset-0" data-name="Cover" />;
}

function IconPlay() {
  return (
    <div className="absolute left-1/2 size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon / Play">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / Play">
          <path d={svgPaths.p2c8a8a00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return <div className="absolute bg-[rgba(0,0,0,0.4)] inset-0 opacity-0 rounded-[36px]" data-name="Bg" />;
}

function Start() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Start">
      <Button />
    </div>
  );
}

function Play() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Play">
      <Start />
      <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">0:00 / 0;30</p>
    </div>
  );
}

function IconVolumeUp() {
  return (
    <div className="absolute left-1/2 size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon / Volume Up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / Volume Up">
          <path d={svgPaths.p1643d600} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute right-0 size-[40px] top-0" data-name="Button">
      <IconVolumeUp />
    </div>
  );
}

function VolumeBar() {
  return (
    <div className="absolute h-[16px] right-[44px] top-1/2 translate-y-[-50%] w-[52px]" data-name="VolumeBar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 16">
        <g id="VolumeBar">
          <rect fill="var(--fill-0, white)" fillOpacity="0.3" height="4" id="Total" rx="2" width="52" y="6" />
          <rect fill="var(--fill-0, white)" fillOpacity="0.5" height="4" id="Progress" rx="2" width="26" y="6" />
          <circle cx="26" cy="8" fill="var(--fill-0, white)" id="Knot" opacity="0" r="6" />
        </g>
      </svg>
    </div>
  );
}

function Volume() {
  return (
    <div className="h-[40px] overflow-clip relative shrink-0 w-[112px]" data-name="Volume">
      <div className="absolute bg-[rgba(0,0,0,0.4)] h-[40px] right-0 rounded-[36px] top-0 w-[112px]" data-name="Bg" />
      <Button1 />
      <VolumeBar />
    </div>
  );
}

function IconFullscreen() {
  return (
    <div className="absolute left-1/2 size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon / Fullscreen">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / Fullscreen">
          <path d={svgPaths.p1d25c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Button">
      <div className="absolute bg-[rgba(0,0,0,0.4)] inset-0 opacity-0 rounded-[36px]" data-name="Bg" />
      <IconFullscreen />
    </div>
  );
}

function IconMoreVertical() {
  return (
    <div className="absolute left-1/2 size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon / More Vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / More Vertical">
          <path d={svgPaths.p24b71d80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Button">
      <div className="absolute bg-[rgba(0,0,0,0.4)] inset-0 opacity-0 rounded-[36px]" data-name="Bg" />
      <IconMoreVertical />
    </div>
  );
}

function More() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="More">
      <Volume />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Actions() {
  return (
    <div className="absolute bottom-[8px] content-stretch flex items-start justify-between left-0 right-0" data-name="Actions">
      <Play />
      <More />
    </div>
  );
}

function Timeline() {
  return (
    <div className="absolute bottom-[-4px] h-[12px] left-[12px] right-[12px] rounded-[4px]" data-name="Timeline">
      <div className="absolute bg-[rgba(255,255,255,0.7)] h-[4px] left-0 right-0 rounded-[4px] top-1/2 translate-y-[-50%]" data-name="Bar" />
      <div className="absolute right-[78px] size-[12px] top-1/2 translate-y-[-50%]" data-name="Knot">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="6" cy="6" fill="var(--fill-0, white)" id="Knot" opacity="0" r="6" />
        </svg>
      </div>
    </div>
  );
}

function Controls() {
  return (
    <div className="absolute bottom-[20px] h-[44px] left-[8px] right-[8px]" data-name="Controls">
      <Actions />
      <Timeline />
    </div>
  );
}

function Player() {
  return (
    <div className="absolute bg-black h-[374px] left-[calc(50%-0.5px)] top-[calc(50%-39px)] translate-x-[-50%] translate-y-[-50%] w-[725px]" data-name="Player">
      <Cover />
      <div className="absolute bg-gradient-to-b bottom-0 from-[rgba(0,0,0,0)] h-[110px] left-0 right-0 to-[rgba(0,0,0,0.7)] via-[51.562%] via-[rgba(0,0,0,0.31)]" data-name="Overlay" />
      <Controls />
    </div>
  );
}

export default function IntroduccionAlDesafio() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Introduccion al desafio">
      <div className="absolute bg-black h-[100px] left-[1063px] rounded-[15px] top-[129px] w-[240px]" />
      <Welcome />
      <Welcome1 />
      <Seconds />
      <Minutes />
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[687px] text-[40px] text-center text-nowrap text-white top-[879px] translate-x-[-50%] whitespace-pre">Continuar</p>
      <Frame2 />
      <Frame4 />
      <Player />
      <p className="absolute font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium leading-[normal] left-[327px] text-[32px] text-white top-[687px] w-[729px]">Osvaldo es un adulto mayor de 70 años y debe pedir ayuda a sus hijos o nietos cada vez que debe hacer tramites.</p>
    </div>
  );
}