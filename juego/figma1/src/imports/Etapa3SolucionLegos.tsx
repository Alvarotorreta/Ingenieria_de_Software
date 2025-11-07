import { imgGroup, imgGroup1 } from "./svg-7k6d4";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84px] items-start left-[151px] top-[118px] w-[615px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[48px] w-[912px]">Etapa 3: Solucion Legos</p>
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
        <p className="leading-[69.856px] text-nowrap whitespace-pre">10</p>
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

export default function Etapa3SolucionLegos() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Etapa 3: Solución Legos">
      <div className="absolute bg-black h-[100px] left-[1063px] rounded-[15px] top-[129px] w-[240px]" />
      <Welcome />
      <Seconds />
      <Minutes />
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[687px] text-[40px] text-center text-nowrap text-white top-[879px] translate-x-[-50%] whitespace-pre">Continuar</p>
      <div className="absolute bg-[#e1e900] h-[171px] left-[151px] rounded-[10px] top-[560px] w-[494px]" />
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[30px] leading-[normal] left-[430px] text-[36px] text-center text-white top-[624px] translate-x-[-50%] w-[382px]">En progreso...</p>
      <div className="absolute bg-[#43f61f] h-[179px] left-[151px] rounded-[10px] top-[342px] w-[494px]" data-name="Rounded rectangle" />
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[30px] leading-[normal] left-[395px] text-[36px] text-center text-white top-[402px] translate-x-[-50%] w-[382px]">Listo</p>
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[25px] leading-[normal] left-[383.5px] text-[24px] text-black text-center top-[342px] translate-x-[-50%] w-[381px]">Grupo 1</p>
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[25px] leading-[normal] left-[383.5px] text-[24px] text-black text-center top-[342px] translate-x-[-50%] w-[381px]">Grupo 1</p>
      <div className="absolute bg-[#f61a1a] h-[179px] left-[738px] rounded-[10px] top-[342px] w-[494px]" />
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[30px] leading-[normal] left-[990px] text-[36px] text-center text-white top-[409px] translate-x-[-50%] w-[382px]">En progreso...</p>
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[25px] leading-[normal] left-[980.5px] text-[24px] text-black text-center top-[342px] translate-x-[-50%] w-[381px]">Grupo 2</p>
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[25px] leading-[normal] left-[383.5px] text-[24px] text-black text-center top-[560px] translate-x-[-50%] w-[381px]">Grupo 3</p>
      <div className="absolute bg-[#ac57f7] h-[171px] left-[738px] rounded-[10px] top-[560px] w-[494px]" />
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] left-[984px] text-[36px] text-center text-white top-[621px] translate-x-[-50%] w-[382px]">En progreso...</p>
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[25px] leading-[normal] left-[980.5px] text-[24px] text-black text-center top-[560px] translate-x-[-50%] w-[381px]">Grupo 4</p>
    </div>
  );
}