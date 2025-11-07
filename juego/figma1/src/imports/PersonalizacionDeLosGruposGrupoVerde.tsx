import { imgGroup, imgGroup1 } from "./svg-3r6ln";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84px] items-start left-[151px] top-[118px] w-[615px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[48px] w-[912px]">Personalización de equipos</p>
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
        <p className="leading-[69.856px] text-nowrap whitespace-pre">02</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-nowrap whitespace-pre">Minutos</p>
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

function Frame() {
  return (
    <div className="h-[44px] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#42e5f6] border-solid inset-[-1px] pointer-events-none rounded-[17px]" />
      <div className="flex flex-row items-center size-full">
        <div className="h-[44px] w-full" />
      </div>
    </div>
  );
}

function Password() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Password">
      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[32px] text-white w-full">Nombre del grupo</p>
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#42e5f6] border-solid inset-[-1px] pointer-events-none rounded-[17px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center pl-[24px] pr-[100px] py-[12px] relative w-full">
          <p className="basis-0 font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#c2c2c2] text-[16px]">Selecciona una opcion</p>
        </div>
      </div>
    </div>
  );
}

function Password1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Password">
      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[32px] text-white w-full">¿Los integrantes del grupo se conocen?</p>
      <Frame1 />
    </div>
  );
}

function Data() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[236px] items-start left-[290px] top-[392px] w-[806px]" data-name="data">
      <Password />
      <Password1 />
    </div>
  );
}

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[63.67%_35.47%_29.86%_36.9%] mask-position-[0px,_0px] mask-size-[377.49px_66.258px,_377.49px_66.258px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
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
    <div className="absolute contents inset-[63.67%_35.47%_29.86%_36.9%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[63.67%_35.47%_29.86%_36.9%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[63.67%_35.47%_29.86%_36.9%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[504px] top-[652px]" data-name="Send Code (Button)">
      <div className="absolute bg-[#093c92] inset-[63.67%_35.29%_29.6%_36.9%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[23.858px] leading-[normal] left-[715.04px] text-[15px] text-center top-[677.18px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

export default function PersonalizacionDeLosGruposGrupoVerde() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Personalizacion de los grupos 'Grupo Verde'">
      <div className="absolute bg-black h-[100px] left-[1063px] rounded-[15px] top-[129px] w-[240px]" />
      <Welcome />
      <Seconds />
      <Minutes />
      <Welcome1 />
      <Data />
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[698.5px] text-[40px] text-center text-nowrap text-white top-[659px] translate-x-[-50%] whitespace-pre">Listo</p>
    </div>
  );
}