import { imgGroup, imgGroup1 } from "./svg-5eecm";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-[151px] top-[118px] w-[615px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[48px] w-[912px]">Introducción</p>
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
    <div className="absolute bg-black content-stretch flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal h-[85px] items-center leading-[0] left-[1085px] text-[#f757ac] text-center top-[130px]" data-name="minutes">
      <div className="flex flex-col justify-center relative shrink-0 text-[48px] tracking-[0.48px] w-[56px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[69.856px]">00</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[20px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Minutos</p>
      </div>
    </div>
  );
}

function Welcome1() {
  return (
    <div className="absolute bg-[#093c92] content-stretch flex flex-col gap-[8px] items-start left-[29px] top-[946px] w-[178px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#43f61f] text-[48px] w-full">Grupo 1</p>
    </div>
  );
}

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[71.09%_36.27%_22.44%_36.09%] mask-position-[0px,_0px] mask-size-[377.49px_66.258px,_377.49px_66.258px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
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
    <div className="absolute contents inset-[71.09%_36.27%_22.44%_36.09%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[71.09%_36.27%_22.44%_36.09%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[71.09%_36.27%_22.44%_36.09%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[493px] top-[728px]" data-name="Send Code (Button)">
      <div className="absolute bg-[#093c92] inset-[71.09%_36.09%_22.18%_36.09%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[23.858px] leading-[normal] left-[704.04px] text-[15px] text-center top-[753.18px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

export default function Introduccion() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Introduccion">
      <div className="absolute bg-black h-[100px] left-[1063px] rounded-[15px] top-[129px] w-[240px]" />
      <Welcome />
      <Seconds />
      <Minutes />
      <Welcome1 />
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[687px] text-[40px] text-center text-nowrap text-white top-[735px] translate-x-[-50%] whitespace-pre">Continuar</p>
      <ul className="absolute block font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[262px] leading-[0] left-[238px] text-[48px] text-justify text-white top-[402px] w-[937px]">
        <li className="mb-0 ms-[72px] whitespace-pre-wrap">
          <span className="leading-[normal]">{`El grupo que consiga mas tokens      será el ganador del juego.`}</span>
        </li>
        <li className="ms-[72px]">
          <span className="leading-[normal]">Todas las actividades tendran un tiempo asignado para finalizarla</span>
        </li>
      </ul>
    </div>
  );
}