import { motion } from "framer-motion";
import FloatingCards from "../FloatingCards";

// ─────────────────────────────────────────────
//  ISOMETRIC MATH
//  Tile: W=52px wide, H=26px tall (2:1 ratio)
//  Origin (col=0,row=0 top-vertex): OX, OY
// ─────────────────────────────────────────────
const W = 52, H = 26, HW = 26, HH = 13;
const OX = 320, OY = 185;

const ix = (c, r) => OX + (c - r) * HW;
const iy = (c, r) => OY + (c + r) * HH;

// Points string for a building's three faces
function faces(c, r, h) {
  const x = ix(c, r), y = iy(c, r);
  return {
    top:   `${x},${y-h} ${x+HW},${y+HH-h} ${x},${y+H-h} ${x-HW},${y+HH-h}`,
    left:  `${x-HW},${y+HH-h} ${x},${y+H-h} ${x},${y+H} ${x-HW},${y+HH}`,
    right: `${x},${y+H-h} ${x+HW},${y+HH-h} ${x+HW},${y+HH} ${x},${y+H}`,
    cx: x, cy: y,
  };
}

// ─────────────────────────────────────────────
//  CITY DATA  [col, row, height, variant]
//  variant: 0=tiny 1=small 2=med 3=large 4=tower
//  Sorted by painter's algo: col+row ascending
// ─────────────────────────────────────────────
const BLDGS = [
  [1,1,48,0],[2,0,44,0],[0,2,40,0],
  [1,2,62,1],[2,1,58,1],[3,0,52,0],
  [0,3,55,1],[1,3,78,2],[2,2,115,2],[3,1,68,1],[4,0,50,0],
  [0,4,60,1],[1,4,88,2],[2,3,145,3],[3,2,158,3],[4,1,72,1],[5,0,55,0],
  [0,5,65,2],[1,5,92,2],[2,4,162,3],[3,3,188,4],[4,2,195,4],[5,1,85,2],[6,0,60,1],
  [0,6,70,2],[1,6,96,2],[2,5,148,3],[3,4,172,3],[4,3,178,4],[5,2,160,3],[6,1,78,1],[7,0,55,0],
  [1,7,80,2],[2,6,132,3],[3,5,152,3],[4,4,158,3],[5,3,148,3],[6,2,118,2],[7,1,68,1],
  [2,7,112,2],[3,6,125,2],[4,5,138,2],[5,4,130,2],[6,3,108,2],[7,2,72,1],
  [3,7,98,2],[4,6,115,2],[5,5,108,2],[6,4,95,2],[7,3,65,1],
  [4,7,88,1],[5,6,92,1],[6,5,82,1],[7,4,58,1],
  [5,7,72,1],[6,6,68,1],[7,5,52,0],
  [6,7,55,0],[7,6,48,0],
].sort((a,b)=>(a[0]+a[1])-(b[0]+b[1]));

// Trees [col, row]
const TREES = [
  [0,1],[8,0],[8,1],[0,7],[8,2],[0,8],[8,7],[4,0],[3,8],[5,8],
];

// Road tiles (no building, just glowing ground) [col, row]
// We add road markings via SVG lines between building blocks

// ─────────────────────────────────────────────
//  COLOUR VARIANTS
// ─────────────────────────────────────────────
const VARIANTS = [
  { top:"#0b2a1c", left:"#061510", right:"#0a2218" },
  { top:"#0f3825", left:"#071b14", right:"#0c2d1e" },
  { top:"#134630", left:"#08201a", right:"#103824" },
  { top:"#175838", left:"#09281e", right:"#13452c" },
  { top:"#1a6642", left:"#0a2e20", right:"#155235" },
];

// Window glow for each variant
const WIN_COLOR = ["#3affc0","#45ffc8","#55ffd0","#65ffd8","#7affe0"];

// ─────────────────────────────────────────────
//  WINDOWS helper – scattered dots on left/right face
// ─────────────────────────────────────────────
function Windows({ cx, cy, h, variant, c, r }) {
  const wins = [];
  const rows = Math.max(1, Math.floor(h / 22));
  const col = WIN_COLOR[variant];

  for (let ri = 0; ri < rows; ri++) {
    const yOff = (ri + 0.5) * (h / rows);
    const delay = ((c + r + ri) * 0.15) % 3;

    // Left face windows
    const lx = cx - HW * 0.5;
    const ly = cy + H - h + yOff + HH * 0.25;
    wins.push(
      <rect
        key={`wL${c}${r}${ri}`}
        className="win-twinkle"
        x={lx - 3} y={ly - 2} width={5} height={4}
        fill={col} rx={1}
        style={{ "--wd": `${delay}s`, "--wdur": `${2.5 + ri * 0.3}s` }}
      />
    );

    // Right face windows
    const rx2 = cx + HW * 0.5;
    const ry2 = cy + H - h + yOff + HH * 0.25;
    wins.push(
      <rect
        key={`wR${c}${r}${ri}`}
        className="win-twinkle"
        x={rx2 - 2} y={ry2 - 2} width={5} height={4}
        fill={col} rx={1}
        style={{ "--wd": `${delay * 0.8}s`, "--wdur": `${2 + ri * 0.2}s` }}
      />
    );
  }
  return <>{wins}</>;
}

// ─────────────────────────────────────────────
//  TREE helper
// ─────────────────────────────────────────────
function Tree({ c, r }) {
  const x = ix(c, r), y = iy(c, r);
  const h = 28;
  const trunk = `${x},${y+H-h} ${x+4},${y+H-h+4} ${x},${y+H} ${x-4},${y+H-4}`;
  const topX = x, topY = y + H - h - 8;
  return (
    <>
      <polygon points={trunk} fill="#0d3018" />
      <ellipse
        className="tree-sway"
        cx={topX} cy={topY} rx={10} ry={7}
        fill="#1a5c30" stroke="#2ecc71" strokeWidth={0.5}
        style={{ "--td": `${r * 0.3}s`, "--tdur": `${3 + c * 0.2}s` }}
      />
    </>
  );
}

// ─────────────────────────────────────────────
//  CRAFT (spacecraft moving over city)
// ─────────────────────────────────────────────
function Craft() {
  // Path: enters from back-left, sweeps diagonally across, exits front-right
  // Uses <animateMotion> with SVG path for smooth isometric movement
  return (
    <g filter="url(#craftGlow)">
      <animateMotion
        dur="9s"
        repeatCount="indefinite"
        path="M60,280 C120,230 200,200 280,190 C360,180 420,175 500,185 C560,192 600,210 640,240"
        calcMode="spline"
        keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
      >
        <mpath xlinkHref="#craftPath" />
      </animateMotion>

      {/* Craft body */}
      <ellipse cx={0} cy={0} rx={14} ry={5} fill="#9affe0" opacity={0.9} />
      <ellipse cx={0} cy={0} rx={7} ry={3} fill="white" opacity={0.95} />
      {/* Trail */}
      <line x1={-14} y1={0} x2={-38} y2={4} stroke="#4affe8" strokeWidth={2} opacity={0.6} strokeLinecap="round" />
      <line x1={-14} y1={0} x2={-55} y2={6} stroke="#4affe8" strokeWidth={1} opacity={0.3} strokeLinecap="round" />
      {/* Engine glow */}
      <circle cx={-14} cy={0} r={4} fill="#7affe0" opacity={0.8} />
    </g>
  );
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
function CityScene() {
  return (
    <div className="city-scene">

      {/* Hidden path for craft motion */}
      <svg style={{position:"absolute",width:0,height:0}}>
        <defs>
          <path id="craftPath" d="M60,280 C120,230 200,200 280,190 C360,180 420,175 500,185 C560,192 600,210 640,240" />
        </defs>
      </svg>

      <motion.svg
        viewBox="0 0 660 520"
        className="city-svg"
        initial={{ opacity:0, scale:0.9 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ duration:1.4, ease:"easeOut" }}
      >
        <defs>
          {/* Ambient glow filter */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Strong craft glow */}
          <filter id="craftGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Dome gradient */}
          <radialGradient id="domeGrad" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.18"/>
            <stop offset="40%" stopColor="#10B981" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
          </radialGradient>

          {/* Ground glow */}
          <radialGradient id="groundGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
          </radialGradient>

          {/* Beacon beacon */}
          <radialGradient id="beaconGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7CFFD8" stopOpacity="1"/>
            <stop offset="100%" stopColor="#7CFFD8" stopOpacity="0"/>
          </radialGradient>

          <clipPath id="domeClip">
            <ellipse cx="330" cy="220" rx="290" ry="210"/>
          </clipPath>
        </defs>

        {/* ── GROUND GLOW ── */}
        <ellipse cx="330" cy="330" rx="260" ry="80"
          fill="url(#groundGlow)" opacity="0.7"/>

        {/* ── PLATFORM BASE (isometric diamond) ── */}
        {(() => {
          const pts = [
            `${ix(0,0)},${iy(0,0)}`,
            `${ix(8,0)},${iy(8,0)}`,
            `${ix(8,8)+0},${iy(8,8)+H}`,
            `${ix(0,8)+0},${iy(0,8)+H}`,
          ].join(" ");
          return null; // drawn per-tile below
        })()}

        {/* ── GROUND TILES ── */}
        {Array.from({length:8},(_,r)=>Array.from({length:8},(_,c)=>{
          const x=ix(c,r), y=iy(c,r);
          const pts=`${x},${y} ${x+HW},${y+HH} ${x},${y+H} ${x-HW},${y+HH}`;
          const hasBldg = BLDGS.some(b=>b[0]===c&&b[1]===r);
          const hasTree = TREES.some(t=>t[0]===c&&t[1]===r);
          if(hasBldg||hasTree) return null;
          return (
            <polygon key={`g${c}${r}`} points={pts}
              fill="#051a10" stroke="rgba(16,185,129,0.12)" strokeWidth={0.5}/>
          );
        }))}

        {/* ── ROAD LINES ── */}
        <g opacity="0.25" stroke="#10B981" strokeWidth="1">
          {[2,4,6].map(c=>(
            <line key={`rl${c}`}
              x1={ix(c,0)} y1={iy(c,0)+HH}
              x2={ix(c,7)} y2={iy(c,7)+HH}
            />
          ))}
          {[2,4,6].map(r=>(
            <line key={`rc${r}`}
              x1={ix(0,r)} y1={iy(0,r)+HH}
              x2={ix(7,r)} y2={iy(7,r)+HH}
            />
          ))}
        </g>

        {/* ── BUILDINGS + TREES (painter's order) ── */}
        {BLDGS.map(([c,r,h,v],i)=>{
          const f = faces(c,r,h);
          const col = VARIANTS[v] || VARIANTS[0];
          return (
            <g key={`b${c}${r}`}
              className="bldg-rise"
              style={{transformOrigin:`${f.cx}px ${f.cy+H}px`, "--bi": `${i*0.015}s`}}
            >
              {/* Right face */}
              <polygon points={f.right} fill={col.right}
                stroke="rgba(16,185,129,0.06)" strokeWidth={0.5}/>
              {/* Left face */}
              <polygon points={f.left} fill={col.left}
                stroke="rgba(16,185,129,0.06)" strokeWidth={0.5}/>
              {/* Top face */}
              <polygon points={f.top} fill={col.top}
                stroke="rgba(16,185,129,0.18)" strokeWidth={0.8}/>
              {/* Top glow edge */}
              <polygon points={f.top} fill="none"
                stroke={WIN_COLOR[v]} strokeWidth={0.5} opacity={0.4}/>
              {/* Windows */}
              <Windows cx={f.cx} cy={f.cy} h={h} variant={v} c={c} r={r}/>
              {/* Rooftop beacon */}
              <circle
                className="beacon-pulse"
                cx={f.cx} cy={f.cy-h} r={3}
                fill={WIN_COLOR[v]}
                filter="url(#glow)"
                style={{ "--bd": `${(c+r)*0.18}s` }}
              />
            </g>
          );
        })}

        {/* Trees */}
        {TREES.map(([c,r])=><Tree key={`t${c}${r}`} c={c} r={r}/>)}

        {/* ── DOME ── */}
        <g opacity="0.9">
          {/* Main dome shape */}
          <motion.ellipse cx="330" cy="220" rx="285" ry="205"
            fill="url(#domeGrad)"
            stroke="rgba(16,185,129,0.15)" strokeWidth={1}
            animate={{opacity:[0.7,1,0.7]}}
            transition={{duration:5, repeat:Infinity, ease:"easeInOut"}}
          />
          {/* Dome latitude lines */}
          {[0.25,0.5,0.75].map((t,i)=>(
            <ellipse key={i} cx="330" cy={220-205*t} rx={285*Math.sqrt(1-t*t)} ry={20*(1-t*0.5)}
              fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth={0.7}/>
          ))}
          {/* Dome longitude lines */}
          {[-1,-0.5,0,0.5,1].map((t,i)=>(
            <ellipse key={i} cx={330+285*t} cy="220" rx={12} ry={205}
              fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth={0.7}
              clipPath="url(#domeClip)"/>
          ))}
          {/* Top glow */}
          <motion.circle cx="330" cy="20" r="45"
            fill="rgba(16,185,129,0.25)" filter="url(#glow)"
            animate={{opacity:[0.4,0.9,0.4], r:[40,55,40]}}
            transition={{duration:4, repeat:Infinity, ease:"easeInOut"}}
          />
          {/* Dome top sparkle dots */}
          {[[-40,40],[40,35],[0,18],[80,75],[-80,72],[120,120],[-120,118]].map(([dx,dy],i)=>(
            <motion.circle key={i}
              cx={330+dx} cy={20+dy} r={1.5}
              fill="#9affe8"
              animate={{opacity:[0,1,0]}}
              transition={{duration:2, repeat:Infinity, delay:i*0.4}}
            />
          ))}
        </g>

        {/* ── MOVING CRAFT ── */}
        <Craft/>

        {/* ── DATA CONNECTION LINES ── */}
        <g opacity="0.3" stroke="#10B981" strokeWidth="1" fill="none">
          <motion.polyline
            points={`${ix(4,2)},${iy(4,2)-195} ${ix(3,3)},${iy(3,3)-188} ${ix(2,4)},${iy(2,4)-162}`}
            strokeDasharray="4 4"
            animate={{strokeDashoffset:[0,-16]}}
            transition={{duration:1, repeat:Infinity, ease:"linear"}}
          />
        </g>

        {/* ── AMBIENT PARTICLES ── */}
        {[...Array(6)].map((_,i)=>{
          const startX = 80+i*80, startY = 100+((i*37)%200);
          return (
            <motion.circle key={i} r={1.5}
              fill="#7affe0" opacity={0.6}
              animate={{
                cx:[startX, startX+(i%2?30:-30), startX],
                cy:[startY, startY-60, startY],
                opacity:[0,0.8,0],
              }}
              transition={{duration:4+i*0.4, repeat:Infinity, delay:i*0.5}}
            />
          );
        })}

      </motion.svg>

      {/* Floating info cards overlaid on top of SVG */}
      <FloatingCards/>

    </div>
  );
}

export default CityScene;
                                     
