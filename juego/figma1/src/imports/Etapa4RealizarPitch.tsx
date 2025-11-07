import { imgGroup, imgGroup1 } from "./svg-9se12";

function Welcome() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[84px] items-start left-[151px] top-[118px] w-[615px]" data-name="Welcome">
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold leading-[normal] relative shrink-0 text-[#fbc95c] text-[48px] w-[912px]">Etapa 4: Realizar Pitch</p>
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
        <p className="leading-[69.856px] text-nowrap whitespace-pre">5</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-nowrap whitespace-pre">Minutos</p>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-start px-[12px] py-[10px] relative w-full">
          <p className="basis-0 font-['Inter:Semi_Bold',_sans-serif] font-semibold grow leading-[1.3] min-h-px min-w-px not-italic relative shrink-0 text-[32px] text-center text-white">Criterio</p>
        </div>
      </div>
    </div>
  );
}

function CellHeader() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[71px] items-start relative shrink-0 w-[379px]" data-name="Cell/Header">
      <div aria-hidden="true" className="absolute border-[#42e5f6] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Content />
    </div>
  );
}

function Content1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-start px-[12px] py-[10px] relative w-full">
          <p className="basis-0 font-['Inter:Semi_Bold',_sans-serif] font-semibold grow leading-[1.3] min-h-px min-w-px not-italic relative shrink-0 text-[20px] text-center text-white">Da 1 a 5 tokens al grupo 3, segun el apoyo que le das respecto a cada criterio de la rubrica.</p>
        </div>
      </div>
    </div>
  );
}

function CellHeader1() {
  return (
    <div className="basis-0 bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col grow items-start min-h-px min-w-px relative self-stretch shrink-0" data-name="Cell/Header">
      <div aria-hidden="true" className="absolute border-[#42e5f6] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Content1 />
    </div>
  );
}

function Row() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start overflow-clip relative shrink-0 w-full" data-name=".Row">
      <CellHeader />
      <CellHeader1 />
    </div>
  );
}

function Content2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-start px-[12px] py-[10px] relative w-full">
          <p className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[1.3] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-white">&nbsp;</p>
        </div>
      </div>
    </div>
  );
}

function CellDefault() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex flex-col h-[71px] items-start relative shrink-0 w-[379px]" data-name="Cell/Default">
      <div aria-hidden="true" className="absolute border-[#42e5f6] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Content2 />
    </div>
  );
}

function Content3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-start px-[12px] py-[10px] relative w-full">
          <p className="basis-0 font-['Inter:Regular',_sans-serif] font-normal grow leading-[1.3] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-white">&nbsp;</p>
        </div>
      </div>
    </div>
  );
}

function CellDefault1() {
  return (
    <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start min-h-px min-w-px relative self-stretch shrink-0" data-name="Cell/Default">
      <div aria-hidden="true" className="absolute border-[#42e5f6] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Content3 />
    </div>
  );
}

function Row1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start overflow-clip relative shrink-0 w-full" data-name=".Row">
      <CellDefault />
      <CellDefault1 />
    </div>
  );
}

function Table() {
  return (
    <div className="bg-[#093c92] relative rounded-[4px] shrink-0 w-[1000px]" data-name="Table">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-[1000px]">
        <Row />
        {[...Array(3).keys()].map((_, i) => (
          <Row1 key={i} />
        ))}
      </div>
      <div aria-hidden="true" className="absolute border border-[#42e5f6] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Table1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[204px] top-[490px]" data-name="Table 1">
      <Table />
    </div>
  );
}

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[89.55%_36.27%_3.98%_36.09%] mask-position-[0px,_0px] mask-size-[377.49px_66.258px,_377.49px_66.258px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
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
    <div className="absolute contents inset-[89.55%_36.27%_3.98%_36.09%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[89.55%_36.27%_3.98%_36.09%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[89.55%_36.27%_3.98%_36.09%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[493px] top-[917px]" data-name="Send Code (Button)">
      <div className="absolute bg-[#093c92] inset-[89.55%_36.09%_3.72%_36.09%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[23.858px] leading-[normal] left-[704.04px] text-[15px] text-center top-[942.18px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

export default function Etapa4RealizarPitch() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Etapa 4: Realizar pitch">
      <Welcome />
      <div className="absolute bg-black h-[100px] left-[1063px] rounded-[15px] top-[129px] w-[240px]" />
      <Seconds />
      <Minutes />
      <div className="absolute flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold justify-center leading-[0] left-[187px] text-[#e1e900] text-[36px] top-[340.5px] translate-y-[-50%] w-[991px]">
        <p className="leading-[normal]">Turno Grupo 3: “Sustentabilidad del agua en agricultura”</p>
      </div>
      <Table1 />
      <p className="absolute font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold leading-[normal] left-[204px] text-[24px] text-white top-[452px] w-[806px]">
        <span>{`Evaluar el trabajo del `}</span>
        <span className="text-[#e1e900]">grupo 3</span>, cuando finalice su presentación
      </p>
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[687px] text-[40px] text-center text-nowrap text-white top-[924px] translate-x-[-50%] whitespace-pre">Enviar evaluación</p>
    </div>
  );
}