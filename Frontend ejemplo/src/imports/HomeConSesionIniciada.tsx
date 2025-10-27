import svgPaths from "./svg-0xn9ggnppx";
import img59 from "figma:asset/b24745fcb2f3b6fd6f823ae99430dfe5ab8cd460.png";
import { imgGroup, imgGroup1 } from "./svg-llp3d";

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
      <p className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">0:00 / 5:10</p>
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
    <div className="absolute bg-black h-[425px] left-[calc(50%+162.5px)] top-[calc(50%-18px)] translate-x-[-50%] translate-y-[-50%] w-[755px]" data-name="Player">
      <Cover />
      <div className="absolute bg-gradient-to-b bottom-0 from-[rgba(0,0,0,0)] h-[110px] left-0 right-0 to-[rgba(0,0,0,0.7)] via-[51.562%] via-[rgba(0,0,0,0.31)]" data-name="Overlay" />
      <Controls />
    </div>
  );
}

function Group() {
  return (
    <div className="[mask-clip:no-clip,_no-clip] [mask-composite:intersect,_intersect] [mask-mode:alpha,_alpha] [mask-repeat:no-repeat,_no-repeat] absolute inset-[68.19%_24.41%_27.86%_47.95%] mask-position-[0px,_0px] mask-size-[377.49px_63.448px,_377.49px_63.448px]" data-name="Group" style={{ maskImage: `url('${imgGroup}'), url('${imgGroup1}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 378 64">
        <g id="Group">
          <g id="Vector">
            <path d="M0 0V63.4483H377.49V0H0Z" fill="var(--fill-0, white)" />
            <path d="M0 0V63.4483H377.49V0H0Z" fill="var(--fill-1, #F757AC)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[68.19%_24.41%_27.86%_47.95%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[68.19%_24.41%_27.86%_47.95%]" data-name="Group">
      <ClipPathGroup />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[68.19%_24.41%_27.86%_47.95%]" data-name="Clip path group">
      <Group1 />
    </div>
  );
}

function SendCodeButton() {
  return (
    <div className="absolute contents left-[655px] top-[1093px]" data-name="Send Code (Button)">
      <div className="absolute bg-white inset-[68.19%_24.23%_27.7%_47.95%] rounded-[8px]" />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[22.846px] leading-[normal] left-[866.04px] text-[15px] text-center top-[1117.12px] translate-x-[-50%] w-[95.638px]">Send Code</p>
      <ClipPathGroup1 />
    </div>
  );
}

function G() {
  return (
    <div className="absolute inset-[54.46%_93.13%_43.23%_4.03%]" data-name="g4712">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 37">
        <g id="g4712">
          <path d={svgPaths.p105ede00} fill="var(--fill-0, #0EC5D7)" id="rect1722" />
          <g id="g1728">
            <path d="M10.2509 8.14263V28.8573" id="path1714" stroke="var(--stroke-0, white)" strokeWidth="3.46892" />
            <path d="M16.5132 8.14262V18.4608" id="path1716" stroke="var(--stroke-0, white)" strokeWidth="3.46234" />
            <path d={svgPaths.p171376c0} fill="var(--fill-0, white)" id="path1718" />
            <path d="M23.0674 15.0349V28.8573" id="path1720" stroke="var(--stroke-0, white)" strokeWidth="4.00739" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[54.46%_83.89%_43.23%_4.03%]">
      <p className="absolute font-['Roboto:Bold',_sans-serif] font-bold inset-[54.72%_83.89%_43.83%_7.81%] leading-[normal] text-[20.243px] text-center text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        mangcoding
      </p>
      <G />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[730px] text-nowrap top-[44px]">
      <p className="absolute font-['Roboto:Bold',_sans-serif] font-bold leading-[normal] left-[730px] text-[18px] text-white top-[44px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Pages
      </p>
      <div className="absolute font-['Roboto:Regular',_sans-serif] font-normal leading-[normal] left-[730px] text-[#dddddd] text-[14px] top-[105px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-[24px]">Home it work</p>
        <p className="mb-[24px]">Pricing</p>
        <p className="mb-[24px]">Blog</p>
        <p>Demo</p>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[873px] text-nowrap top-[44px]">
      <p className="absolute font-['Roboto:Bold',_sans-serif] font-bold leading-[normal] left-[873px] text-[18px] text-white top-[44px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Service
      </p>
      <div className="absolute font-['Roboto:Regular',_sans-serif] font-normal leading-[normal] left-[873px] text-[#dddddd] text-[14px] top-[105px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="mb-[24px]">Shopify</p>
        <p className="mb-[24px]">WordPress</p>
        <p>UI/UX Design</p>
      </div>
    </div>
  );
}

function AntDesignPhoneFilled() {
  return (
    <div className="absolute left-0 size-[24px] top-0" data-name="ant-design:phone-filled">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ant-design:phone-filled">
          <path d={svgPaths.p3972a900} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="overflow-clip relative size-[24px]">
      <AntDesignPhoneFilled />
    </div>
  );
}

function Frame1() {
  return <div className="absolute left-[1016px] size-[24px] top-[144px]" />;
}

function Fa6SolidLocationDot() {
  return (
    <div className="absolute inset-[12.5%_20.83%_8.33%_20.83%]" data-name="fa6-solid:location-dot">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 19">
        <g clipPath="url(#clip0_1_3236)" id="fa6-solid:location-dot">
          <path d={svgPaths.p239f000} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3236">
            <rect fill="white" height="19" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute left-[1016px] overflow-clip size-[24px] top-[183px]">
      <Fa6SolidLocationDot />
    </div>
  );
}

function DashiconsEmail() {
  return (
    <div className="absolute left-[1016px] size-[24px] top-[144px]" data-name="dashicons:email">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="dashicons:email">
          <path d={svgPaths.p2274ce00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[1016px] top-[44px]">
      <p className="absolute font-['Roboto:Bold',_sans-serif] font-bold leading-[normal] left-[1016px] text-[18px] text-nowrap text-white top-[44px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Contact
      </p>
      <p className="absolute font-['Roboto:Regular',_sans-serif] font-normal leading-[normal] left-[1048px] text-[#dddddd] text-[14px] text-nowrap top-[108px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        (406) 555-0120
      </p>
      <p className="absolute font-['Roboto:Regular',_sans-serif] font-normal leading-[normal] left-[1048px] text-[#dddddd] text-[14px] text-nowrap top-[148px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        mangcoding123@gmail.com
      </p>
      <p className="absolute font-['Roboto:Regular',_sans-serif] font-normal leading-[24px] left-[1048px] text-[#dddddd] text-[14px] top-[187px] w-[208px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`2972 Westheimer Rd. Santa Ana, Illinois 85486 `}</p>
      <div className="absolute flex items-center justify-center left-[1016px] size-[24px] top-[105px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <Frame />
        </div>
      </div>
      <Frame1 />
      <Frame2 />
      <DashiconsEmail />
    </div>
  );
}

function InstagramLogo() {
  return (
    <div className="absolute h-[18px] left-[201px] top-[214px] w-[16px]" data-name="instagram logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 18">
        <g clipPath="url(#clip0_1_3228)" id="instagram logo">
          <path d={svgPaths.p10acc400} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3228">
            <rect fill="white" height="18" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[197px] top-[211px]">
      <div className="absolute left-[197px] size-[24px] top-[211px]" />
      <InstagramLogo />
    </div>
  );
}

function LinkedinLogo() {
  return (
    <div className="absolute h-[15px] left-[162px] top-[215px] w-[16px]" data-name="linkedin logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 15">
        <g clipPath="url(#clip0_1_3231)" id="linkedin logo">
          <path d={svgPaths.p21cf7400} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3231">
            <rect fill="white" height="15" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[158px] top-[211px]">
      <div className="absolute left-[158px] size-[24px] top-[211px]" />
      <LinkedinLogo />
    </div>
  );
}

function TwitterLogo() {
  return (
    <div className="absolute h-[14px] left-[121px] top-[216px] w-[18px]" data-name="Twitter logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 14">
        <g clipPath="url(#clip0_1_3225)" id="Twitter logo">
          <path d={svgPaths.p288ff540} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3225">
            <rect fill="white" height="14" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[118px] top-[211px]">
      <div className="absolute left-[118px] size-[24px] top-[211px]" />
      <TwitterLogo />
    </div>
  );
}

function FacebookLogo() {
  return (
    <div className="absolute h-[14px] left-[87px] top-[216px] w-[7px]" data-name="facebook logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 14">
        <g clipPath="url(#clip0_1_3222)" id="facebook logo">
          <path d={svgPaths.p50d1c80} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3222">
            <rect fill="white" height="14" width="7" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[79px] top-[211px]">
      <div className="absolute left-[79px] size-[24px] top-[211px]" />
      <FacebookLogo />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[79px] top-[211px]">
      <Group5 />
      <Group4 />
      <Group3 />
      <Group2 />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute bg-[#032a6c] h-[265px] left-[350px] overflow-clip top-[1338px] w-[1016px]" data-name="1">
      <p className="absolute font-['Roboto:Regular',_sans-serif] font-normal leading-[24px] left-[79px] text-[#dddddd] text-[14px] top-[117px] w-[534px]" style={{ fontVariationSettings: "'wdth' 100" }}>{`Lörem ipsum od ohet dilogi. Bell trabel, samuligt, ohöbel utom diska. Jinesade bel när feras redorade i belogi. FAR paratyp i muvåning, och pesask vyfisat. Viktiga poddradio har un mad och inde. `}</p>
      <Group10 />
      <Group9 />
      <Group8 />
      <Group7 />
    </div>
  );
}

function Logo() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Logo">
          <rect fill="var(--fill-0, #2D68FE)" height="32" id="Rectangle 2" rx="4" width="32" />
          <path d={svgPaths.p27e83100} fill="var(--fill-0, white)" id="Polygon 1" />
        </g>
      </svg>
    </div>
  );
}

function Logo1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Logo">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center p-[8px] relative w-full">
          <Logo />
          <p className="basis-0 font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[24px] text-white">Juego</p>
        </div>
      </div>
    </div>
  );
}

function UHomeAlt() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="u:home-alt">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="u:home-alt">
          <path d={svgPaths.p4165b00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Content() {
  return (
    <div className="bg-[#f757ac] relative rounded-[4px] shrink-0 w-full" data-name="Content">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center justify-center p-[12px] relative w-full">
          <UHomeAlt />
          <p className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">inicio</p>
        </div>
      </div>
    </div>
  );
}

function NavTextItem() {
  return (
    <div className="bg-[#f757ac] content-stretch flex flex-col items-center justify-center relative rounded-[4px] shrink-0 w-full" data-name="Nav Text Item">
      <Content />
    </div>
  );
}

function UBox() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="u:box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="u:box">
          <path d={svgPaths.p22eff600} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Content1() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Content">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center justify-center p-[12px] relative w-full">
          <UBox />
          <p className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">Juegos anteriores</p>
        </div>
      </div>
    </div>
  );
}

function NavTextItem1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full" data-name="Nav Text Item">
      <Content1 />
    </div>
  );
}

function UBox1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="u:box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="u:box">
          <path d={svgPaths.p22eff600} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Content2() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Content">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center justify-center p-[12px] relative w-full">
          <UBox1 />
          <p className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">Objetivos de Aprendizaje</p>
        </div>
      </div>
    </div>
  );
}

function NavTextItem2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full" data-name="Nav Text Item">
      <Content2 />
    </div>
  );
}

function UHomeAlt1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="u:home-alt">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="u:home-alt">
          <path d={svgPaths.p4165b00} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Content3() {
  return (
    <div className="bg-[#093c92] relative rounded-[4px] shrink-0 w-full" data-name="Content">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center justify-center p-[12px] relative w-full">
          <UHomeAlt1 />
          <p className="basis-0 font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[16px] text-white">Crear Sala</p>
        </div>
      </div>
    </div>
  );
}

function NavTextItem3() {
  return (
    <div className="bg-blue-50 content-stretch flex flex-col items-center justify-center relative rounded-[4px] shrink-0 w-full" data-name="Nav Text Item">
      <Content3 />
    </div>
  );
}

function TopItems() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Top Items">
      <NavTextItem />
      <NavTextItem1 />
      <NavTextItem2 />
      <NavTextItem3 />
    </div>
  );
}

function Top() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full" data-name="Top">
      <Logo1 />
      <TopItems />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute bg-white inset-0 rounded-[7000px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-0 rounded-[282.342px]" data-name="59">
          <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[282.342px] size-full" src={img59} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[7000px]" />
    </div>
  );
}

function DisplayPicture() {
  return (
    <div className="absolute inset-0" data-name="Display Picture">
      <Frame4 />
    </div>
  );
}

function DisplayPictureVariants() {
  return (
    <div className="overflow-clip relative shrink-0 size-[40px]" data-name="Display Picture Variants">
      <DisplayPicture />
    </div>
  );
}

function Frame3() {
  return (
    <div className="basis-0 content-stretch flex flex-col font-['Inter:Regular',_sans-serif] font-normal gap-[4px] grow items-start min-h-px min-w-px not-italic relative shrink-0 text-[12px]">
      <p className="leading-[16px] relative shrink-0 text-[#42e5f6] w-full">Michael Smith</p>
      <p className="leading-[14px] relative shrink-0 text-white w-full">michaelsmith12@udd.cl</p>
    </div>
  );
}

function Profile() {
  return (
    <div className="relative shrink-0 w-full" data-name="Profile">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
          <DisplayPictureVariants />
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Bottom() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Bottom">
      <Profile />
    </div>
  );
}

function DesktopContainer() {
  return (
    <div className="absolute bg-[#093c92] box-border content-stretch flex flex-col h-[1024px] items-start justify-between left-0 pb-[28px] pt-[20px] px-[20px] top-[-1px] w-[350px]" data-name="Desktop Container">
      <Top />
      <Bottom />
    </div>
  );
}

export default function HomeConSesionIniciada() {
  return (
    <div className="bg-white relative size-full" data-name="HOME- con sesión iniciada">
      <DesktopContainer />
      <div className="absolute bg-white h-[967px] left-[410px] top-[68px] w-[869px]" />
      <p className="absolute font-['Plus_Jakarta_Sans:ExtraBold',_sans-serif] font-extrabold h-[123px] leading-[normal] left-[454px] text-[40px] text-black top-[82px] w-[841px]">Bienvenido al Juego de Emprendimiento</p>
      <Player />
      <div className="absolute font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal h-[370px] leading-[normal] left-[455px] text-[20px] text-black text-justify top-[179px] w-[779px]">
        <p className="mb-0">Este juego está diseñado para que los estudiantes primerizos de la universidad aprendan emprendimiento de forma práctica y colaborativa. A través de varias etapas dinámicas, los alumnos se conocen, analizan problemáticas, diseñan soluciones creativas utilizando recursos como bloques de construcción, y desarrollan habilidades para presentar sus ideas — todo en un ambiente de trabajo en equipo y sana competencia.</p>
        <p className="mb-0">&nbsp;</p>
        <p className="mb-0">Como docente, tendrás un rol clave para crear y administrar las salas del juego, agrupar a los estudiantes, acompañar el proceso y evaluar con tokens. Este espacio digital te permitirá manejar todo fácilmente, con reportes y herramientas para dar feedback.</p>
        <p className="mb-0">&nbsp;</p>
        <p>Mira el video a continuación para conocer a fondo la mecánica y filosofía detrás del juego. ¡Prepárate para guiar una experiencia educativa memorable y motivadora!</p>
      </div>
      <SendCodeButton />
      <p className="absolute font-['Urbanist:SemiBold',_sans-serif] font-semibold h-[46px] leading-[normal] left-[849.5px] text-[40px] text-center text-white top-[1100px] translate-x-[-50%] w-[303px]">Empieza el juego</p>
      <Group6 />
      <Component />
    </div>
  );
}