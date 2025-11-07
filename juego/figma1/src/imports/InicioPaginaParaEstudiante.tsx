import img35AnosUdd300X351 from "figma:asset/131d0c155ae5b9cec3902d18a2ff3bde2c32236f.png";
import { imgGroup, imgGroup1 } from "./svg-4pyv6";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84px] items-start left-[483px] top-[485px] w-[396px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[36px] text-center w-full">Codigo de sala</p>
    </div>
  );
}

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[63.28%_36.35%_30.25%_36.02%] mask-position-[0px,_0px] mask-size-[377.49px_66.258px,_377.49px_66.258px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
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
    <div className="absolute contents inset-[63.28%_36.35%_30.25%_36.02%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[63.28%_36.35%_30.25%_36.02%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[63.28%_36.35%_30.25%_36.02%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[492px] top-[648px]" data-name="Send Code (Button)">
      <div className="absolute bg-[#093c92] inset-[63.28%_36.16%_29.99%_36.02%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[23.858px] leading-[normal] left-[703.04px] text-[15px] text-center top-[673.18px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

function InputInnerContainer() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="InputInnerContainer">
      <div className="basis-0 flex flex-col font-['Roboto:Medium',_sans-serif] font-medium grow justify-center leading-[0] min-h-px min-w-px opacity-40 relative shrink-0 text-[16px] text-black text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">784 372</p>
      </div>
    </div>
  );
}

function InputContainer() {
  return (
    <div className="absolute bg-white left-[505px] rounded-[5px] top-[549px] w-[352px]" data-name="InputContainer">
      <div className="box-border content-stretch flex flex-col gap-[6px] items-start justify-center overflow-clip p-[12px] relative rounded-[inherit] w-[352px]">
        <InputInnerContainer />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(66,80,102,0.4)] border-solid inset-0 pointer-events-none rounded-[5px] shadow-[0px_2px_4px_0px_rgba(66,80,102,0.1)]" />
    </div>
  );
}

export default function InicioPaginaParaEstudiante() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="inicio pagina para estudiante">
      <div className="absolute bg-[#093c92] h-[148px] left-[483px] rounded-[10px] top-[460px] w-[396px]" />
      <Welcome />
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[686px] text-[40px] text-center text-nowrap text-white top-[655px] translate-x-[-50%] whitespace-pre">Ingresar</p>
      <div className="absolute h-[35px] left-[554px] top-[905px] w-[300px]" data-name="35-anos-udd-300x35 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img35AnosUdd300X351} />
      </div>
      <InputContainer />
    </div>
  );
}