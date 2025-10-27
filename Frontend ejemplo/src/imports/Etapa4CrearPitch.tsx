import imgTexto21 from "figma:asset/6eff7a475516ebec12f8e344181ea4e98319559b.png";
import { imgGroup, imgGroup1 } from "./svg-w18tq";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84px] items-start left-[151px] top-[118px] w-[615px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[48px] w-[912px]">Etapa 4: Comunicación</p>
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
        <p className="leading-[69.856px] text-nowrap whitespace-pre">15</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-nowrap whitespace-pre">Minutos</p>
      </div>
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

function Frame3() {
  return (
    <div className="absolute h-[73px] left-0 top-0 w-[428px]">
      <div className="absolute h-[73px] left-0 top-0 w-[502px]">
        <div aria-hidden="true" className="absolute border border-[#020202] border-solid inset-0 pointer-events-none" />
      </div>
      {[...Array(2).keys()].map((_, i) => (
        <Welcome1 key={i} />
      ))}
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] left-[454px] text-[24px] text-right text-white top-[29px] translate-x-[-100%] w-[73px]">23</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[73px] left-0 top-0 w-[381px]">
      <Frame3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute h-[73px] left-0 top-0 w-[381px]">
      <Frame4 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute h-[75px] left-[865px] top-[-2px] w-[527px]">
      <Frame5 />
      <div className="absolute h-[58px] left-[424px] top-[17px] w-[104px]" data-name="Texto (2) 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgTexto21} />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#42e5f6] border-solid inset-[-1px] pointer-events-none rounded-[17px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center pl-[24px] pr-[100px] py-[12px] relative w-full">
          <p className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#c2c2c2] text-[16px] w-[682px]">
            C<span className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal">uéntanos cómo se llamara el emprendimiento</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Password() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Password">
      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[24px] text-white w-full">Nombre del emprendimiento</p>
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[130px] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#42e5f6] border-solid inset-[-1px] pointer-events-none rounded-[17px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[130px] items-center pl-[24px] pr-[100px] py-[12px] relative w-full">
          <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#c2c2c2] text-[16px] w-[682px]">Expongan cuál es el desafío que están abordando y den a conocer a lapersona que enfrenta el desafío, destacando sus características.</p>
        </div>
      </div>
    </div>
  );
}

function Password1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Password">
      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[24px] text-white w-full">Desafio abordado y sus caracteristicas (Etapa 2)</p>
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[130px] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#42e5f6] border-solid inset-[-1px] pointer-events-none rounded-[17px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[130px] items-center pl-[24px] pr-[100px] py-[12px] relative w-full">
          <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#c2c2c2] text-[16px] w-[682px]">Muéstranos la solución para el desafío utilizando la creación con los legos</p>
        </div>
      </div>
    </div>
  );
}

function Password2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[170px] items-start relative shrink-0 w-full" data-name="Password">
      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[24px] text-white w-full">Solución(Etapa 3)</p>
      <Frame2 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="h-[72px] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#42e5f6] border-solid inset-[-1px] pointer-events-none rounded-[17px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[72px] items-center pl-[24px] pr-[100px] py-[12px] relative w-full">
          <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#c2c2c2] text-[16px] w-[682px]">{` Hagan el pitch de una manera atractiva, cierra invitando a apoyar`}</p>
        </div>
      </div>
    </div>
  );
}

function Password3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Password">
      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[24px] text-white w-full">Cierre</p>
      <Frame6 />
    </div>
  );
}

function Data() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[257px] top-[389px] w-[806px]" data-name="data">
      <Password />
      <Password1 />
      <Password2 />
      <Password3 />
    </div>
  );
}

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[85.85%_37.96%_8.94%_34.41%] mask-position-[0px,_0px] mask-size-[377.49px_66.258px,_377.49px_66.258px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
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
    <div className="absolute contents inset-[85.85%_37.96%_8.94%_34.41%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[85.85%_37.96%_8.94%_34.41%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[85.85%_37.96%_8.94%_34.41%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[470px] top-[1092px]" data-name="Send Code (Button)">
      <div className="absolute bg-[#093c92] inset-[85.85%_37.77%_8.73%_34.41%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[23.858px] leading-[normal] left-[681.04px] text-[15px] text-center top-[1117.18px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

export default function Etapa4CrearPitch() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Etapa 4: Crear Pitch">
      <Welcome />
      <div className="absolute bg-black h-[100px] left-[1063px] rounded-[15px] top-[129px] w-[240px]" />
      <Seconds />
      <Minutes />
      <Frame7 />
      <Data />
      <div className="absolute h-[86px] left-[145px] top-[259px] w-[1017px]">
        <div aria-hidden="true" className="absolute border border-[#42e5f6] border-solid inset-0 pointer-events-none" />
      </div>
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[60px] leading-[normal] left-[163px] text-[24px] text-justify text-white top-[273px] w-[973px]">
        <span>{`Actividad: `}</span>
        <span className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal">Para crear un pitch de 90 segundos el equipo debe seguir la siguiente rúbrica:</span>
      </p>
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[664.5px] text-[40px] text-center text-nowrap text-white top-[1099px] translate-x-[-50%] whitespace-pre">Listo</p>
    </div>
  );
}