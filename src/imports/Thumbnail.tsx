import imgLandingPage2 from "figma:asset/8270c682072a179bd24f33a26077c13c18a9ccfb.png";

export default function Thumbnail() {
  return (
    <div className="bg-[#ecb159] relative size-full" data-name="Thumbnail">
      <div className="absolute h-[451px] left-[1452px] top-[108px] w-[444px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 444 451">
          <ellipse cx="222" cy="225.5" fill="var(--fill-0, #E0924B)" id="Ellipse 1" rx="222" ry="225.5" />
        </svg>
      </div>
      <div className="absolute h-[624px] left-[-77px] top-[-217px] w-[670px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 670 624">
          <ellipse cx="335" cy="312" fill="var(--fill-0, #E0924B)" id="Ellipse 2" rx="335" ry="312" />
        </svg>
      </div>
      <div className="absolute h-[208px] left-[-133px] top-[842px] w-[240px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 240 208">
          <ellipse cx="120" cy="104" fill="var(--fill-0, #E0924B)" id="Ellipse 3" rx="120" ry="104" />
        </svg>
      </div>
      <div className="absolute h-[3389px] left-[822px] rounded-[24px] top-[-1322px] w-[936px]" data-name="Landing Page 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" src={imgLandingPage2} />
      </div>
      <div className="absolute h-[3389px] left-[194px] rounded-[24px] shadow-[21px_6px_39px_0px_rgba(0,0,0,0.25)] top-[52px] w-[1027px]" data-name="Landing Page 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" src={imgLandingPage2} />
      </div>
    </div>
  );
}