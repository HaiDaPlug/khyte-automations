// Full Implementation
export function DnaWeaveSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" {...props}>
      <title>Horizontal DNA Weave Background</title>
      <desc>A slow, looping animation of a stylized DNA double helix built from thin lines, weaving horizontally across the frame.</desc>

      <style>{`
        .dna-path { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
        .dna-rung { stroke-width: 1; opacity: 0.5; }
        .vertical-oscillator { animation: gentleWave 16s ease-in-out infinite; }
        .horizontal-slider { animation: slideLeft 8s linear infinite; }
        @keyframes slideLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-400px); } }
        @keyframes gentleWave { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(20px); } }
      `}</style>

      <defs>
        <g id="dna-segment">
          <path className="dna-path" d="M0,100 C50,100 50,70 100,70 S150,100 200,100 S250,130 300,130 S350,100 400,100" />
          <path className="dna-path" d="M0,100 C50,100 50,130 100,130 S150,100 200,100 S250,70 300,70 S350,100 400,100" />
          <g className="dna-path dna-rung">
            <line x1="50" y1="85" x2="50" y2="115" />
            <line x1="150" y1="115" x2="150" y2="85" />
            <line x1="250" y1="85" x2="250" y2="115" />
            <line x1="350" y1="115" x2="350" y2="85" />
            <line x1="100" y1="70" x2="100" y2="130" opacity="0.3" />
            <line x1="200" y1="100" x2="200" y2="100" opacity="0.3" />
            <line x1="300" y1="130" x2="300" y2="70" opacity="0.3" />
          </g>
        </g>
      </defs>

      <g className="vertical-oscillator">
        <g className="horizontal-slider">
          <use href="#dna-segment" x="-400" />
          <use href="#dna-segment" x="0" />
          <use href="#dna-segment" x="400" />
          <use href="#dna-segment" x="800" />
          <use href="#dna-segment" x="1200" />
        </g>
      </g>
    </svg>
  );
}
