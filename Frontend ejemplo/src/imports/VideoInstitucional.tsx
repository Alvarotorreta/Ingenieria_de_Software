import svgPaths from "./svg-oun3sksnm7";
import img35AnosUdd300X351 from "figma:asset/131d0c155ae5b9cec3902d18a2ff3bde2c32236f.png";
import { imgGroup, imgGroup1 } from "./svg-aihlq";

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[86.82%_36.27%_6.71%_36.09%] mask-position-[0px,_0px] mask-size-[377.49px_66.258px,_377.49px_66.258px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
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
    <div className="absolute contents inset-[86.82%_36.27%_6.71%_36.09%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[86.82%_36.27%_6.71%_36.09%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[86.82%_36.27%_6.71%_36.09%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[493px] top-[889px]" data-name="Send Code (Button)">
      <div className="absolute bg-[#093c92] inset-[86.82%_36.09%_6.45%_36.09%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[23.858px] leading-[normal] left-[704.04px] text-[15px] text-center top-[914.18px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

function Cover() {
  return <div className="absolute inset-0" data-name="Cover" />;
}

function IconPlay() {
  return (
    <div className="absolute left-1/2 size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon / Play">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / Play">
          <path d={svgPaths.p2c8a8a00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return <div className="absolute bg-[rgba(0,0,0,0.4)] inset-0 opacity-0 rounded-[36px]" data-name="Bg" />;
}

function Start() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Start">
      <Button />
    </div>
  );
}

function Play() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Play">
      <Start />
      <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">0:00 / 0;30</p>
    </div>
  );
}

function IconVolumeUp() {
  return (
    <div className="absolute left-1/2 size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon / Volume Up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / Volume Up">
          <path d={svgPaths.p1643d600} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute right-0 size-[40px] top-0" data-name="Button">
      <IconVolumeUp />
    </div>
  );
}

function VolumeBar() {
  return (
    <div className="absolute h-[16px] right-[44px] top-1/2 translate-y-[-50%] w-[52px]" data-name="VolumeBar">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 16">
        <g id="VolumeBar">
          <rect fill="var(--fill-0, white)" fillOpacity="0.3" height="4" id="Total" rx="2" width="52" y="6" />
          <rect fill="var(--fill-0, white)" fillOpacity="0.5" height="4" id="Progress" rx="2" width="26" y="6" />
          <circle cx="26" cy="8" fill="var(--fill-0, white)" id="Knot" opacity="0" r="6" />
        </g>
      </svg>
    </div>
  );
}

function Volume() {
  return (
    <div className="h-[40px] overflow-clip relative shrink-0 w-[112px]" data-name="Volume">
      <div className="absolute bg-[rgba(0,0,0,0.4)] h-[40px] right-0 rounded-[36px] top-0 w-[112px]" data-name="Bg" />
      <Button1 />
      <VolumeBar />
    </div>
  );
}

function IconFullscreen() {
  return (
    <div className="absolute left-1/2 size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon / Fullscreen">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / Fullscreen">
          <path d={svgPaths.p1d25c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Button">
      <div className="absolute bg-[rgba(0,0,0,0.4)] inset-0 opacity-0 rounded-[36px]" data-name="Bg" />
      <IconFullscreen />
    </div>
  );
}

function IconMoreVertical() {
  return (
    <div className="absolute left-1/2 size-[20px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icon / More Vertical">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon / More Vertical">
          <path d={svgPaths.p24b71d80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="Button">
      <div className="absolute bg-[rgba(0,0,0,0.4)] inset-0 opacity-0 rounded-[36px]" data-name="Bg" />
      <IconMoreVertical />
    </div>
  );
}

function More() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="More">
      <Volume />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Actions() {
  return (
    <div className="absolute bottom-[8px] content-stretch flex items-start justify-between left-0 right-0" data-name="Actions">
      <Play />
      <More />
    </div>
  );
}

function Timeline() {
  return (
    <div className="absolute bottom-[-4px] h-[12px] left-[12px] right-[12px] rounded-[4px]" data-name="Timeline">
      <div className="absolute bg-[rgba(255,255,255,0.7)] h-[4px] left-0 right-0 rounded-[4px] top-1/2 translate-y-[-50%]" data-name="Bar" />
      <div className="absolute right-[78px] size-[12px] top-1/2 translate-y-[-50%]" data-name="Knot">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="6" cy="6" fill="var(--fill-0, white)" id="Knot" opacity="0" r="6" />
        </svg>
      </div>
    </div>
  );
}

function Controls() {
  return (
    <div className="absolute bottom-[20px] h-[44px] left-[8px] right-[8px]" data-name="Controls">
      <Actions />
      <Timeline />
    </div>
  );
}

function Player() {
  return (
    <div className="absolute bg-black h-[612px] left-[calc(50%+12.5px)] top-[calc(50%+4px)] translate-x-[-50%] translate-y-[-50%] w-[1265px]" data-name="Player">
      <Cover />
      <div className="absolute bg-gradient-to-b bottom-0 from-[rgba(0,0,0,0)] h-[110px] left-0 right-0 to-[rgba(0,0,0,0.7)] via-[51.562%] via-[rgba(0,0,0,0.31)]" data-name="Overlay" />
      <Controls />
    </div>
  );
}

export default function VideoInstitucional() {
  return (
    <div className="bg-[#093c92] relative size-full" data-name="Video Institucional">
      <div className="absolute h-[35px] left-[554px] top-[905px] w-[300px]" data-name="35-anos-udd-300x35 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img35AnosUdd300X351} />
      </div>
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold leading-[normal] left-[687px] text-[40px] text-center text-nowrap text-white top-[896px] translate-x-[-50%] whitespace-pre">Continuar</p>
      <Player />
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[42px] leading-[normal] left-[686.5px] text-[#fbc95c] text-[36px] text-center top-[73px] translate-x-[-50%] w-[1283px]">Como la UDD apoya el emprendimiento</p>
    </div>
  );
}