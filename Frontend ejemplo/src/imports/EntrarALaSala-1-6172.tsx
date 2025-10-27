import { imgGroup, imgGroup1 } from "./svg-w9p9c";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[89px] items-start left-[40px] top-[108px] w-[400px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[36px] w-full">Evalua la actividad</p>
    </div>
  );
}

function Password() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Password">
      <div className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[20px] text-white w-full">
        <p className="mb-0">Esta actividad me aportó valor principalmente para entender y trabajar: (Puedes marcar más de 1 opción)</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0 whitespace-pre-wrap">{`          Resolver desafios`}</p>
        <p className="mb-0 whitespace-pre-wrap">{`          Trabajar en equipo`}</p>
        <p className="mb-0 whitespace-pre-wrap">{`          Empatizar`}</p>
        <p className="mb-0 whitespace-pre-wrap">{`          Ser creativo`}</p>
        <p className="whitespace-pre-wrap">{`          Comunicar mis ideas`}</p>
      </div>
    </div>
  );
}

function Password1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Password">
      <div className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[20px] text-white w-full">
        <p className="mb-0 whitespace-pre-wrap">{`Te gustó la actividad realizada?   `}</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0 whitespace-pre-wrap">{`          Si, mucho`}</p>
        <p className="mb-0 whitespace-pre-wrap">{`          Si`}</p>
        <p className="mb-0 whitespace-pre-wrap">{`          Más o menos`}</p>
        <p className="mb-0 whitespace-pre-wrap">{`          No mucho`}</p>
        <p className="whitespace-pre-wrap">
          {`          No`}
          <br aria-hidden="true" />
          <br aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}

function Password2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Password">
      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[20px] text-white w-full">Luego de esta actividad, ¿Se incrementaron tus ganas de querer emprender?</p>
    </div>
  );
}

function Data() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[20px] top-[263px] w-[400px]" data-name="data">
      <Password />
      <Password1 />
      <Password2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[99px] relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#42e5f6] border-solid inset-[-1px] pointer-events-none rounded-[17px]" />
      <div className="flex flex-row items-center size-full">
        <div className="h-[99px] w-full" />
      </div>
    </div>
  );
}

function Password3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[20px] top-[991px] w-[400px]" data-name="Password">
      <p className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[20px] text-white w-full">{`Dejanos tus comentarios sobre la actividad o sobre tus intereses `}</p>
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[116px] left-[32px] top-[370px] w-[15px]">
      <div className="absolute bg-[#d9d9d9] left-0 size-[15px] top-0" />
      <div className="absolute bg-[#d9d9d9] left-0 size-[15px] top-[25px]" />
      <div className="absolute bg-[#d9d9d9] left-0 size-[15px] top-[50px]" />
      <div className="absolute bg-[#d9d9d9] left-0 size-[15px] top-[76px]" />
      <div className="absolute bg-[#d9d9d9] left-0 size-[15px] top-[101px]" />
    </div>
  );
}

function Password4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[49px] top-[819px] w-[400px]" data-name="Password">
      <div className="font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[20px] text-white w-[357px]">
        <p className="mb-0">Ya tenía ganas de emprender antes de la actividad</p>
        <p className="mb-0">Si, me encantaría emprender</p>
        <p className="mb-0">Ahora lo veo como una posible opción</p>
        <p>No, sigue sin interesarme</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[88.82%_5.12%_6.24%_9.09%] mask-position-[0px,_0px] mask-size-[377.49px_66.258px,_377.49px_66.258px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
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
    <div className="absolute contents inset-[88.82%_5.12%_6.24%_9.09%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[88.82%_5.12%_6.24%_9.09%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[88.82%_5.12%_6.24%_9.09%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[40px] top-[1192px]" data-name="Send Code (Button)">
      <div className="absolute bg-[#093c92] inset-[88.82%_4.54%_6.04%_9.09%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[23.858px] leading-[normal] left-[251.04px] text-[15px] text-center top-[1217.18px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

export default function EntrarALaSala() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Entrar a la sala">
      <Welcome />
      <Data />
      <Password3 />
      <Frame1 />
      <Password4 />
      <div className="absolute left-[25px] size-[15px] top-[824px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #D9D9D9)" id="Ellipse 6" r="7.5" />
        </svg>
      </div>
      <div className="absolute left-[25px] size-[15px] top-[900px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #D9D9D9)" id="Ellipse 6" r="7.5" />
        </svg>
      </div>
      <div className="absolute left-[25px] size-[15px] top-[874px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #D9D9D9)" id="Ellipse 6" r="7.5" />
        </svg>
      </div>
      <div className="absolute left-[25px] size-[15px] top-[950px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #D9D9D9)" id="Ellipse 6" r="7.5" />
        </svg>
      </div>
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[234.5px] text-[40px] text-center text-nowrap text-white top-[1199px] translate-x-[-50%] whitespace-pre">Enviar</p>
      <div className="absolute left-[29px] size-[15px] top-[559px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #D9D9D9)" id="Ellipse 6" r="7.5" />
        </svg>
      </div>
      <div className="absolute left-[29px] size-[15px] top-[660px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #D9D9D9)" id="Ellipse 6" r="7.5" />
        </svg>
      </div>
      <div className="absolute left-[29px] size-[15px] top-[635px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #D9D9D9)" id="Ellipse 6" r="7.5" />
        </svg>
      </div>
      <div className="absolute left-[29px] size-[15px] top-[609px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #D9D9D9)" id="Ellipse 6" r="7.5" />
        </svg>
      </div>
      <div className="absolute left-[29px] size-[15px] top-[583px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <circle cx="7.5" cy="7.5" fill="var(--fill-0, #D9D9D9)" id="Ellipse 6" r="7.5" />
        </svg>
      </div>
    </div>
  );
}