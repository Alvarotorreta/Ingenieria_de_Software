import img35AnosUdd300X351 from "figma:asset/131d0c155ae5b9cec3902d18a2ff3bde2c32236f.png";
import { imgGroup, imgGroup1 } from "./svg-8pm3x";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[89px] items-start left-[54px] top-[388px] w-[400px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[36px] w-full">GRACIAS POR EVALUAR EL JUEGO</p>
    </div>
  );
}

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[67.78%_7.16%_25.29%_7.04%] mask-position-[0px,_0px] mask-size-[377.49px_66.258px,_377.49px_66.258px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
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
    <div className="absolute contents inset-[67.78%_7.16%_25.29%_7.04%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[67.78%_7.16%_25.29%_7.04%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[67.78%_7.16%_25.29%_7.04%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[31px] top-[648px]" data-name="Send Code (Button)">
      <div className="absolute bg-[#093c92] inset-[67.78%_6.59%_25.01%_7.04%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[23.858px] leading-[normal] left-[242.04px] text-[15px] text-center top-[673.18px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

export default function EntrarALaSala() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Entrar a la sala">
      <div className="absolute h-[35px] left-[75px] top-[888px] w-[300px]" data-name="35-anos-udd-300x35 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img35AnosUdd300X351} />
      </div>
      <Welcome />
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[225.5px] text-[40px] text-center text-nowrap text-white top-[655px] translate-x-[-50%] whitespace-pre">Salir</p>
    </div>
  );
}