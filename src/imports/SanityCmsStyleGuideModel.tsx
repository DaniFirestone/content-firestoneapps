function Section() {
  return <div className="absolute h-0 left-0 top-0 w-[1151.2px]" data-name="Section" />;
}

function Heading1() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[960px]" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-0.2px] tracking-[1.4px] uppercase">01</p>
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute content-stretch flex h-[31.988px] items-start left-0 top-[28px] w-[960px]" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['EB_Garamond:Regular',sans-serif] font-normal leading-[32px] min-h-px min-w-px relative text-[#101828] text-[24px] whitespace-pre-wrap">Color Palette</p>
    </div>
  );
}

function Container1() {
  return <div className="absolute bg-[#d1d5dc] h-[4px] left-0 rounded-[26843500px] top-[71.99px] w-[64px]" data-name="Container" />;
}

function Paragraph() {
  return (
    <div className="h-[45.5px] relative shrink-0 w-[672px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.4px] w-[599px] whitespace-pre-wrap">The foundational colors that define the visual identity. Each color has been tested for accessibility compliance.</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#f3f4f6] h-[31.988px] relative rounded-[26843500px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-[155.813px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[16px] py-[8px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] text-center tracking-[0.3px] uppercase">Show Accessibility</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex h-[45.5px] items-start justify-between left-0 top-[99.99px] w-[960px]" data-name="Container">
      <Paragraph />
      <Button />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[145.488px] left-0 top-0 w-[960px]" data-name="Container">
      <Heading1 />
      <Heading2 />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Container5() {
  return <div className="bg-[#594136] h-[133.325px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container" />;
}

function Heading3() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[49.6px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-0.2px]">Primary</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[153.81px] top-[4.8px] w-[46.188px]" data-name="Paragraph">
      <p className="font-['Consolas:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px]">#594136</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[20.788px] relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Paragraph1 />
    </div>
  );
}

function H() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[16px] h-[174.113px] items-start justify-self-stretch relative row-1 shrink-0" data-name="h9">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Container7() {
  return <div className="bg-[#f9e8e9] h-[133.325px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container" />;
}

function Heading4() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[66.775px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-0.2px]">Secondary</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[153.81px] top-[4.8px] w-[46.188px]" data-name="Paragraph">
      <p className="font-['Consolas:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px]">#F9E8E9</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[20.788px] relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Paragraph2 />
    </div>
  );
}

function H1() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[16px] h-[174.113px] items-start justify-self-stretch relative row-1 shrink-0" data-name="h9">
      <Container7 />
      <Container8 />
    </div>
  );
}

function Container9() {
  return <div className="bg-[#dd5c71] h-[133.325px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container" />;
}

function Heading5() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[43.237px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-0.2px]">Accent</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[153.81px] top-[4.8px] w-[46.188px]" data-name="Paragraph">
      <p className="font-['Consolas:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px]">#DD5C71</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[20.788px] relative shrink-0 w-full" data-name="Container">
      <Heading5 />
      <Paragraph3 />
    </div>
  );
}

function H2() {
  return (
    <div className="col-3 content-stretch flex flex-col gap-[16px] h-[174.113px] items-start justify-self-stretch relative row-1 shrink-0" data-name="h9">
      <Container9 />
      <Container10 />
    </div>
  );
}

function Container11() {
  return <div className="bg-[#fdeeeb] h-[133.325px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container" />;
}

function Heading6() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[76.088px]" data-name="Heading 3">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[-0.2px]">Background</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[153.81px] top-[4.8px] w-[46.188px]" data-name="Paragraph">
      <p className="font-['Consolas:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px]">#FDEEEB</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[20.788px] relative shrink-0 w-full" data-name="Container">
      <Heading6 />
      <Paragraph4 />
    </div>
  );
}

function H3() {
  return (
    <div className="col-4 content-stretch flex flex-col gap-[16px] h-[174.113px] items-start justify-self-stretch relative row-1 shrink-0" data-name="h9">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Container4() {
  return (
    <div className="gap-x-[32px] gap-y-[32px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[174.113px] relative shrink-0 w-full" data-name="Container">
      <H />
      <H1 />
      <H2 />
      <H3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[238.113px] items-start left-0 pt-[32px] px-[32px] rounded-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-[193.49px] w-[960px]" data-name="Container">
      <Container4 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-0 top-[463.6px] w-[960px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Italic',sans-serif] font-normal italic leading-[16px] min-h-px min-w-px relative text-[#99a1af] text-[12px] whitespace-pre-wrap">Click any color to copy its hex value</p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[109.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] tracking-[0.6px] uppercase">Implementation</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function HI() {
  return (
    <div className="absolute content-stretch flex h-[56px] items-center justify-between left-0 pt-[0.8px] top-[512.39px] w-[960px]" data-name="hI">
      <div aria-hidden="true" className="absolute border-black border-solid border-t-[0.8px] inset-0 pointer-events-none" />
      <Text />
      <Icon />
    </div>
  );
}

function Section1() {
  return (
    <div className="h-[568.388px] relative shrink-0 w-full" data-name="Section">
      <Container />
      <Container3 />
      <Container13 />
      <HI />
    </div>
  );
}

function Heading7() {
  return (
    <div className="absolute h-[20px] left-0 top-0 w-[960px]" data-name="Heading 2">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-0.2px] tracking-[1.4px] uppercase">02</p>
    </div>
  );
}

function Heading8() {
  return (
    <div className="absolute content-stretch flex h-[31.988px] items-start left-0 top-[28px] w-[960px]" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['EB_Garamond:Regular',sans-serif] font-normal leading-[32px] min-h-px min-w-px relative text-[#101828] text-[24px] whitespace-pre-wrap">Typography</p>
    </div>
  );
}

function Container15() {
  return <div className="absolute bg-[#d1d5dc] h-[4px] left-0 rounded-[26843500px] top-[71.99px] w-[64px]" data-name="Container" />;
}

function Paragraph5() {
  return (
    <div className="absolute h-[22.75px] left-0 top-[99.99px] w-[672px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.4px]">Type system built on two complementary typefaces for hierarchy and readability.</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute h-[122.738px] left-0 top-0 w-[960px]" data-name="Container">
      <Heading7 />
      <Heading8 />
      <Container15 />
      <Paragraph5 />
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['EB_Garamond:Regular',sans-serif] font-normal leading-[48px] left-0 text-[#101828] text-[48px] top-[0.8px]">H1: Main Heading</p>
    </div>
  );
}

function Heading9() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['EB_Garamond:Regular',sans-serif] font-normal leading-[36px] left-0 text-[#101828] text-[30px] top-[-0.6px]">H2: Section Heading</p>
    </div>
  );
}

function Heading10() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['EB_Garamond:Medium',sans-serif] font-medium leading-[28px] left-0 text-[#101828] text-[20px] top-[-0.2px]">H3: Sub-heading</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[52px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Lato:Regular',sans-serif] leading-[26px] left-0 not-italic text-[#364153] text-[16px] top-[0.2px] w-[813px] whitespace-pre-wrap">Body text uses Lato for optimal readability. This paragraph demonstrates the standard font treatment for content and descriptions. The spacing and sizing have been carefully considered for comfortable reading.</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#594136] h-[44px] left-0 rounded-[26843500px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-0 w-[156.275px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Lato:Medium',sans-serif] leading-[24px] left-[78.5px] not-italic text-[16px] text-center text-white top-[10.4px]">Primary Button</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute bg-[#f3f4f6] h-[36px] left-[172.27px] rounded-[26843500px] top-[4px] w-[93.738px]" data-name="Text">
      <p className="absolute font-['Lato:Regular',sans-serif] leading-[20px] left-[16px] not-italic text-[#364153] text-[14px] top-[8.6px]">Label Text</p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[44px] relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Text1 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[32px] h-[432px] items-start left-0 pt-[48px] px-[48px] rounded-[24px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-[170.74px] w-[960px]" data-name="Container">
      <Heading />
      <Heading9 />
      <Heading10 />
      <Paragraph6 />
      <Container17 />
    </div>
  );
}

function Heading11() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[32px] top-[32px] w-[400px]" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] tracking-[1.2px] uppercase whitespace-pre-wrap">Primary Typeface</p>
    </div>
  );
}

function Heading12() {
  return (
    <div className="absolute h-[36px] left-[32px] top-[63.99px] w-[400px]" data-name="Heading 3">
      <p className="absolute font-['EB_Garamond:Regular',sans-serif] font-normal leading-[36px] left-0 text-[#101828] text-[30px] top-[-0.6px]">EB Garamond</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[20px] left-[32px] top-[111.99px] w-[400px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.2px]">For headings and display text</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[32px] top-[139.99px] w-[400px]" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Consolas:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] whitespace-pre-wrap">H1, H2, H3</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="bg-white col-1 h-[187.975px] justify-self-stretch relative rounded-[16px] row-1 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0" data-name="Container">
      <Heading11 />
      <Heading12 />
      <Paragraph7 />
      <Paragraph8 />
    </div>
  );
}

function Heading13() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[32px] top-[32px] w-[400px]" data-name="Heading 4">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] tracking-[1.2px] uppercase whitespace-pre-wrap">Secondary Typeface</p>
    </div>
  );
}

function Heading14() {
  return (
    <div className="absolute content-stretch flex h-[36px] items-start left-[32px] top-[63.99px] w-[400px]" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Lato:Regular',sans-serif] leading-[36px] min-h-px min-w-px not-italic relative text-[#101828] text-[30px] whitespace-pre-wrap">Lato</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[20px] left-[32px] top-[111.99px] w-[400px]" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.2px]">For body copy and UI elements</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute content-stretch flex h-[15.988px] items-start left-[32px] top-[139.99px] w-[400px]" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Consolas:Regular',sans-serif] leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] whitespace-pre-wrap">P, Button, Label</p>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-white col-2 h-[187.975px] justify-self-stretch relative rounded-[16px] row-1 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0" data-name="Container">
      <Heading13 />
      <Heading14 />
      <Paragraph9 />
      <Paragraph10 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute gap-x-[32px] gap-y-[32px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[187.975px] left-0 top-[650.74px] w-[960px]" data-name="Container">
      <Container19 />
      <Container20 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[109.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] tracking-[0.6px] uppercase">Implementation</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function HI1() {
  return (
    <div className="absolute content-stretch flex h-[56px] items-center justify-between left-0 pt-[0.8px] top-[871.51px] w-[960px]" data-name="hI">
      <div aria-hidden="true" className="absolute border-black border-solid border-t-[0.8px] inset-0 pointer-events-none" />
      <Text2 />
      <Icon1 />
    </div>
  );
}

function Section2() {
  return (
    <div className="h-[927.513px] relative shrink-0 w-full" data-name="Section">
      <Container14 />
      <Container16 />
      <Container18 />
      <HI1 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[96px] h-[1719.9px] items-start left-[63.6px] pt-[64px] px-[32px] top-[155.99px] w-[1024px]" data-name="Main Content">
      <Section1 />
      <Section2 />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="content-stretch flex h-[15.988px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#99a1af] text-[12px] whitespace-pre-wrap">Last updated: February 15, 2026</p>
    </div>
  );
}

function Footer() {
  return (
    <div className="absolute content-stretch flex flex-col h-[80.787px] items-start left-0 pt-[32.8px] px-[95.6px] top-[1971.89px] w-[1151.2px]" data-name="Footer">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t-[0.8px] inset-0 pointer-events-none" />
      <Paragraph11 />
    </div>
  );
}

function G() {
  return (
    <div className="bg-[#fafafa] h-[2052.675px] relative shrink-0 w-full" data-name="g9">
      <Section />
      <MainContent />
      <Footer />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[729.6px] items-start left-0 top-0 w-[1151.2px]" data-name="Body">
      <G />
    </div>
  );
}

function Link() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[35.612px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] tracking-[0.3px] uppercase">Home</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[4.1px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] tracking-[0.3px] uppercase">›</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[84.513px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] tracking-[0.3px] uppercase">Business DNA</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[4.1px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] tracking-[0.3px] uppercase">›</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[147.963px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] tracking-[0.3px] uppercase">Emotionless Robot.Art</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[4.1px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#99a1af] text-[12px] tracking-[0.3px] uppercase">›</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[72px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#4a5565] text-[12px] tracking-[0.3px] uppercase">Style Guide</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex gap-[8px] h-[15.988px] items-center relative shrink-0 w-full" data-name="Navigation">
      <Link />
      <Text3 />
      <Link1 />
      <Text4 />
      <Link2 />
      <Text5 />
      <Text6 />
    </div>
  );
}

function Heading15() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['EB_Garamond:Regular',sans-serif] font-normal leading-[40px] left-0 text-[#101828] text-[36px] top-[-0.2px] tracking-[-0.9px]">Style Guide</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[-0.2px]">Emotionless Robot.Art</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[68px] relative shrink-0 w-[150.088px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Heading15 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f3f4f6] h-[31.988px] relative rounded-[26843500px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-[64.488px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[16px] py-[8px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] text-center tracking-[0.3px] uppercase">Dark</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#f3f4f6] h-[31.988px] relative rounded-[26843500px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-[70.6px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[16px] py-[8px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] text-center tracking-[0.3px] uppercase">Share</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f3f4f6] h-[31.988px] relative rounded-[26843500px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-[77.475px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[16px] py-[8px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] text-center tracking-[0.3px] uppercase">Export</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[31.988px] relative shrink-0 w-[236.563px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Button2 />
        <Button3 />
        <Button4 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex h-[68px] items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Container23 />
      <Container24 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[155.988px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[24px] items-start pt-[24px] px-[32px] relative size-full">
        <Navigation />
        <Container22 />
      </div>
    </div>
  );
}

function G1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.8)] content-stretch flex flex-col h-[155.988px] items-start left-0 px-[63.6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-0 w-[1151.2px]" data-name="g9">
      <Container21 />
    </div>
  );
}

export default function SanityCmsStyleGuideModel() {
  return (
    <div className="bg-white relative size-full" data-name="SanityCMS - Style Guide model">
      <Body />
      <G1 />
    </div>
  );
}