import svgPaths from "./svg-bn676mxz0t";
import imgTexto21 from "figma:asset/6eff7a475516ebec12f8e344181ea4e98319559b.png";
import { imgGroup, imgGroup1 } from "./svg-mk95o";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84px] items-start left-[151px] top-[118px] w-[615px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[48px] w-[912px]">Resultados finales</p>
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
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] left-[454px] text-[24px] text-right text-white top-[29px] translate-x-[-100%] w-[73px]">43</p>
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

function Frame2() {
  return (
    <div className="absolute h-[73px] left-0 top-0 w-[381px]">
      <Frame1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[75px] left-[865px] top-[-2px] w-[527px]">
      <Frame2 />
      <div className="absolute h-[58px] left-[424px] top-[17px] w-[104px]" data-name="Texto (2) 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgTexto21} />
      </div>
    </div>
  );
}

function Seconds() {
  return (
    <div className="absolute bg-black content-stretch flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal items-center leading-[0] left-[1190px] text-[#f757ac] text-center text-nowrap top-[130px]" data-name="seconds">
      <div className="flex flex-col justify-center relative shrink-0 text-[48px] tracking-[0.48px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[69.856px] text-nowrap whitespace-pre">30</p>
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
        <p className="leading-[69.856px] text-nowrap whitespace-pre">00</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-nowrap whitespace-pre">Minutos</p>
      </div>
    </div>
  );
}

function Jonathan() {
  return (
    <div className="absolute h-[89.508px] left-[350px] top-[674.12px] w-[673px]" data-name="Jonathan">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 673 90">
        <g id="Jonathan">
          <path d={svgPaths.p3196fd00} fill="var(--fill-0, #AC57F7)" id="bg" />
        </g>
      </svg>
    </div>
  );
}

function Paul() {
  return (
    <div className="absolute contents font-['NATS:Regular',_sans-serif] leading-[0] left-[412.2px] not-italic text-black top-[675.49px]" data-name="Paul">
      <div className="absolute flex flex-col h-[70.23px] justify-center left-[999.36px] text-[0px] text-right top-[720.25px] translate-x-[-100%] translate-y-[-50%] w-[55.98px]">
        <p className="leading-[normal]">
          <span className="text-[24px]">10</span>
          <span className="text-[24px] text-black"> </span>
          <span className="text-[16px] text-black">pts.</span>
        </p>
      </div>
      <div className="absolute flex flex-col h-[63.344px] justify-center left-[468.18px] text-[22px] top-[720.93px] translate-y-[-50%] w-[415.494px]">
        <p className="leading-[normal]">Grupo 4:</p>
      </div>
      <div className="absolute flex flex-col h-[89.508px] justify-center left-[412.2px] text-[20px] top-[720.25px] translate-y-[-50%] w-[42.296px]">
        <p className="leading-[normal]">4</p>
      </div>
    </div>
  );
}

function Jonathan1() {
  return (
    <div className="absolute contents left-[350px] top-[565.33px]" data-name="Jonathan">
      <div className="absolute h-[89.508px] left-[350px] top-[565.33px] w-[673px]" data-name="bg">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 673 90">
          <path d={svgPaths.p144f3500} fill="var(--fill-0, #43F61F)" id="bg" stroke="var(--stroke-0, #F757AC)" strokeWidth="5" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['NATS:Regular',_sans-serif] h-[70.23px] justify-center leading-[0] left-[998.12px] not-italic text-[0px] text-[rgba(49,34,68,0.7)] text-right top-[618.34px] translate-x-[-100%] translate-y-[-50%] w-[51.004px]">
        <p className="leading-[normal]">
          <span className="text-[24px]">13</span>
          <span className="text-[24px] text-[rgba(49,34,68,0.7)]"> </span>
          <span className="text-[16px] text-[rgba(49,34,68,0.7)]">pts.</span>
        </p>
      </div>
      <div className="absolute flex flex-col font-['NATS:Regular',_sans-serif] h-[63.344px] justify-center leading-[0] left-[468.18px] not-italic text-[#312244] text-[22px] top-[610.77px] translate-y-[-50%] w-[415.494px]">
        <p className="leading-[normal]">Grupo 1:</p>
      </div>
      <div className="absolute flex flex-col font-['NATS:Regular',_sans-serif] h-[89.508px] justify-center leading-[0] left-[412.2px] not-italic text-[#312244] text-[20px] top-[610.08px] translate-y-[-50%] w-[42.296px]">
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Vatani() {
  return (
    <div className="absolute contents left-[350px] top-[455.16px]" data-name="Vatani">
      <div className="absolute bg-[#f61a1a] h-[89.508px] left-[350px] rounded-[30px] top-[455.16px] w-[673px]" data-name="bg" />
      <div className="absolute flex flex-col font-['NATS:Regular',_sans-serif] h-[70px] justify-center leading-[0] left-[971px] not-italic text-[24px] text-[rgba(49,34,68,0.7)] text-right top-[504px] translate-x-[-100%] translate-y-[-50%] w-[38px]">
        <p className="leading-[normal]">{`16 `}</p>
      </div>
      <div className="absolute flex flex-col font-['NATS:Regular',_sans-serif] h-[63.344px] justify-center leading-[0] left-[468.18px] not-italic text-[#312244] text-[22px] top-[500.61px] translate-y-[-50%] w-[415.494px]">
        <p className="leading-[normal]">Grupo 2:</p>
      </div>
      <div className="absolute flex flex-col font-['NATS:Regular',_sans-serif] h-[89.508px] justify-center leading-[0] left-[412.2px] not-italic text-[#312244] text-[20px] top-[499.92px] translate-y-[-50%] w-[42.296px]">
        <p className="leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Iman() {
  return (
    <div className="absolute contents left-[350px] top-[345px]" data-name="Iman">
      <div className="absolute bg-[#e1e900] h-[89.508px] left-[350px] rounded-[30px] top-[345px] w-[673px]" data-name="bg" />
      <div className="absolute flex flex-col font-['NATS:Regular',_sans-serif] h-[70.23px] justify-center leading-[0] left-[996.88px] not-italic text-[0px] text-[rgba(49,34,68,0.7)] text-right top-[387px] translate-x-[-100%] translate-y-[-50%] w-[60.956px]">
        <p className="leading-[normal]">
          <span className="text-[24px]">{`20 `}</span>
          <span className="text-[16px]">pts.</span>
        </p>
      </div>
      <div className="absolute flex flex-col font-['NATS:Regular',_sans-serif] h-[63.344px] justify-center leading-[0] left-[454.5px] not-italic text-[#312244] text-[22px] top-[390.44px] translate-y-[-50%] w-[429.177px]">
        <p className="leading-[normal] whitespace-pre-wrap">{`Grupo 3:  Dream Team`}</p>
      </div>
      <div className="absolute flex flex-col font-['NATS:Regular',_sans-serif] h-[89.508px] justify-center leading-[0] left-[412.2px] not-italic text-[#312244] text-[20px] top-[389.75px] translate-y-[-50%] w-[42.296px]">
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

function Leaderboard() {
  return (
    <div className="absolute contents left-[350px] top-[345px]" data-name="Leaderboard">
      <Paul />
      <Jonathan1 />
      <Vatani />
      <Iman />
    </div>
  );
}

export default function Resultados() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Resultados">
      <Welcome />
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[687px] text-[40px] text-center text-nowrap text-white top-[879px] translate-x-[-50%] whitespace-pre">Continuar</p>
      <Frame3 />
      <div className="absolute bg-black h-[100px] left-[1063px] rounded-[15px] top-[129px] w-[240px]" />
      <Seconds />
      <Minutes />
      <div className="absolute bg-[#cdcdcd] h-[528px] left-[320px] rounded-[10px] top-[277px] w-[724px]" />
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[30px] leading-[normal] left-[680px] text-[36px] text-black text-center top-[289px] translate-x-[-50%] w-[382px]">Ranking</p>
      <Jonathan />
      <Leaderboard />
      <div className="absolute h-[27px] left-[971px] top-[375px] w-[29px]" data-name="Texto (2) 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[216.67%] left-[-131.03%] max-w-none top-[-56.48%] w-[358.62%]" src={imgTexto21} />
        </div>
      </div>
      <div className="absolute h-[27px] left-[972px] top-[490px] w-[29px]" data-name="Texto (2) 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[216.67%] left-[-131.03%] max-w-none top-[-56.48%] w-[358.62%]" src={imgTexto21} />
        </div>
      </div>
      <div className="absolute h-[27px] left-[972px] top-[605px] w-[29px]" data-name="Texto (2) 3">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[216.67%] left-[-131.03%] max-w-none top-[-56.48%] w-[358.62%]" src={imgTexto21} />
        </div>
      </div>
      <div className="absolute h-[27px] left-[974px] top-[708px] w-[29px]" data-name="Texto (2) 4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[216.67%] left-[-131.03%] max-w-none top-[-56.48%] w-[358.62%]" src={imgTexto21} />
        </div>
      </div>
    </div>
  );
}