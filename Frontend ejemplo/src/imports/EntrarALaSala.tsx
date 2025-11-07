import img35AnosUdd300X351 from "figma:asset/131d0c155ae5b9cec3902d18a2ff3bde2c32236f.png";
import { imgGroup, imgGroup1 } from "./svg-e2pl5";

function Frame() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#42e5f6] border-solid inset-[-1px] pointer-events-none rounded-[17px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center pl-[24px] pr-[100px] py-[12px] relative w-full">
          <p className="basis-0 font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#c2c2c2] text-[16px]">Selecciona una opción</p>
        </div>
      </div>
    </div>
  );
}

function Password() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Password">
      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[20px] text-white w-full">Escoge el grupo:</p>
      <Frame />
    </div>
  );
}

function Data() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[400px] top-[478px] w-[615px]" data-name="data">
      <Password />
    </div>
  );
}

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start leading-[normal] left-[400px] top-[331px] w-[615px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold relative shrink-0 text-[#fbc95c] text-[48px] w-full">Sala 731 836</p>
      <p className="font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium relative shrink-0 text-[24px] text-white w-full">Curso: Ingenieria de software</p>
    </div>
  );
}

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[57.81%_37.23%_35.72%_35.14%] mask-position-[0px,_0px] mask-size-[377.49px_66.258px,_377.49px_66.258px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
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
    <div className="absolute contents inset-[57.81%_37.23%_35.72%_35.14%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[57.81%_37.23%_35.72%_35.14%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[57.81%_37.23%_35.72%_35.14%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[480px] top-[592px]" data-name="Send Code (Button)">
      <div className="absolute bg-[#093c92] inset-[57.81%_37.04%_35.46%_35.14%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[23.858px] leading-[normal] left-[691.04px] text-[15px] text-center top-[617.18px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

export default function EntrarALaSala() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Entrar a la sala">
      <div className="absolute bg-[#093c92] h-[480px] left-[381px] rounded-[20px] top-[316px] w-[646px]" />
      <Data />
      <Welcome />
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[665px] text-[40px] text-center text-nowrap text-white top-[601px] translate-x-[-50%] whitespace-pre">Ingresar</p>
      <div className="absolute h-[35px] left-[554px] top-[905px] w-[300px]" data-name="35-anos-udd-300x35 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img35AnosUdd300X351} />
      </div>
    </div>
  );
}