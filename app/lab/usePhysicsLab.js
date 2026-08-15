import { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';

const WORLD_W = 1200;

export function usePhysicsLab() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const mouseRef = useRef(null);
  const worldHeightRef = useRef(800);
  
  const [phase, setPhase] = useState('lesson'); 
  const [isMinimized, setIsMinimized] = useState(false);
  const [lesson, setLesson] = useState(1);
  const [gravityType, setGravityType] = useState('Earth');
  const [resetTrigger, setResetTrigger] = useState(0);
  const [zoom, setZoom] = useState(1);

  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customShape, setCustomShape] = useState('circle');
  const [customMaterial, setCustomMaterial] = useState('wood');
  const [customSize, setCustomSize] = useState(40);
  const [customMassMult, setCustomMassMult] = useState(1);

  // 🚀 NEW: Added quizIndex to track multi-question quizzes
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizState, setQuizState] = useState('idle');
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) setIsMinimized(true);
  }, []);

  // Reset everything when the lesson changes
  useEffect(() => {
    setShowQuiz(false);
    setQuizIndex(0);
    setQuizState('idle');
    setSelectedAnswer(null);
    setPhase('lesson'); 
  }, [lesson]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('ui-zoom-change', { detail: zoom }));
  }, [zoom]);

  const materials = {
    rubber: { restitution: 0.95, friction: 0.1, density: 0.01, color: '#22d3ee', name: 'Rubber' },
    wood: { restitution: 0.4, friction: 0.4, density: 0.04, color: '#d97706', name: 'Wood' },
    metal: { restitution: 0.1, friction: 0.2, density: 0.1, color: '#94a3b8', name: 'Metal' },
    ice: { restitution: 0.2, friction: 0.001, density: 0.02, color: '#bae6fd', name: 'Ice' }
  };

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, World, Mouse, MouseConstraint, Composites, Constraint } = Matter;
    const engine = Engine.create({ positionIterations: 16, velocityIterations: 16, enableSleeping: false });
    engineRef.current = engine;

    const baseScale = window.innerWidth / WORLD_W;
    const WORLD_H = window.innerHeight / baseScale;
    worldHeightRef.current = WORLD_H;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: { width: window.innerWidth, height: window.innerHeight, wireframes: false, background: 'transparent', hasBounds: true }
    });
    renderRef.current = render;

    const ground = Bodies.rectangle(WORLD_W / 2, WORLD_H + 100, WORLD_W * 3, 250, { isStatic: true, render: { fillStyle: '#1e293b' } });
    const leftWall = Bodies.rectangle(-100, WORLD_H / 2, 200, WORLD_H * 3, { isStatic: true, render: { fillStyle: '#1e293b' } });
    const rightWall = Bodies.rectangle(WORLD_W + 100, WORLD_H / 2, 200, WORLD_H * 3, { isStatic: true, render: { fillStyle: '#1e293b' } });
    World.add(engine.world, [ground, leftWall, rightWall]);

    const buildEnvironment = () => {
      engine.gravity.y = 1; 
      setGravityType('Earth');

      if (lesson === 2) {
        World.add(engine.world, Bodies.rectangle(WORLD_W / 2, WORLD_H / 2 + 100, WORLD_W * 0.8, 40, { 
          isStatic: true, angle: Math.PI / 8, friction: 0.1, chamfer: { radius: 10 }, render: { fillStyle: '#334155' } 
        }));
      }
      if (lesson === 5) {
        const cradle = Composites.newtonsCradle(WORLD_W / 2 - 100, 100, 5, 20, 200);
        World.add(engine.world, cradle);
      }
      if (lesson === 6) {
        const pyramid = Composites.pyramid(WORLD_W / 2, WORLD_H - 300, 9, 10, 0, 0, (x, y) => Bodies.rectangle(x, y, 30, 30, { render: { fillStyle: '#d97706' } }));
        World.add(engine.world, pyramid);
      }
      if (lesson === 7) {
        const anchor = { x: WORLD_W / 2, y: 300 };
        const ball = Bodies.circle(anchor.x, anchor.y + 100, 30, { render: { fillStyle: '#f43f5e' } });
        const spring = Constraint.create({ pointA: anchor, bodyB: ball, stiffness: 0.05, render: { strokeStyle: '#64748b' } });
        World.add(engine.world, [ball, spring]);
      }
      if (lesson === 8) {
        const group = Matter.Body.nextGroup(true);
        const bridge = Composites.stack(WORLD_W * 0.2, WORLD_H * 0.4, 10, 1, 0, 0, (x, y) => Bodies.rectangle(x, y, 50, 25, { collisionFilter: { group: group }, density: 0.05, render: { fillStyle: '#64748b' } }));
        Composites.chain(bridge, 0.5, 0, -0.5, 0, { stiffness: 0.9, length: 2, render: { visible: false } });
        World.add(engine.world, [
          bridge,
          Constraint.create({ pointA: { x: WORLD_W * 0.2, y: WORLD_H * 0.4 }, bodyB: bridge.bodies[0], pointB: { x: -25, y: 0 }, stiffness: 0.9 }),
          Constraint.create({ pointA: { x: WORLD_W * 0.8, y: WORLD_H * 0.4 }, bodyB: bridge.bodies[bridge.bodies.length - 1], pointB: { x: 25, y: 0 }, stiffness: 0.9 })
        ]);
      }
      if (lesson === 9) {
        const softBody = Composites.softBody(WORLD_W / 2, 100, 5, 5, 2, 2, true, 16, { restitution: 0.5, friction: 0.05, render: { fillStyle: '#10b981' } });
        World.add(engine.world, softBody);
      }
      if (lesson === 10) {
        World.add(engine.world, [
          Bodies.rectangle(WORLD_W / 2 - 150, WORLD_H / 2 + 100, 300, 20, { isStatic: true, angle: Math.PI / 6, chamfer: { radius: 10 }, render: { fillStyle: '#334155' } }),
          Bodies.rectangle(WORLD_W / 2 + 150, WORLD_H / 2 + 100, 300, 20, { isStatic: true, angle: -Math.PI / 6, chamfer: { radius: 10 }, render: { fillStyle: '#334155' } })
        ]);
      }
    };

    buildEnvironment();

    const mouse = Mouse.create(render.canvas);
    mouseRef.current = mouse;
    const mouseConstraint = MouseConstraint.create(engine, { 
      mouse: mouse, 
      constraint: { stiffness: 0.05, angularStiffness: 0, damping: 0.1, render: { visible: false } } 
    });
    World.add(engine.world, mouseConstraint);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    let currentZoom = 1;
    let isPanning = false;
    let startX = 0;
    let startY = 0;

    const applyCameraView = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      render.options.width = window.innerWidth;
      render.options.height = window.innerHeight;

      const finalScale = (window.innerWidth / WORLD_W) * currentZoom;
      const visibleW = window.innerWidth / finalScale;
      const visibleH = window.innerHeight / finalScale;

      const cx = render.bounds.min.x + (render.bounds.max.x - render.bounds.min.x) / 2 || WORLD_W / 2;
      const cy = render.bounds.min.y + (render.bounds.max.y - render.bounds.min.y) / 2 || worldHeightRef.current / 2;

      render.bounds.min.x = cx - visibleW / 2;
      render.bounds.max.x = render.bounds.min.x + visibleW;
      render.bounds.min.y = cy - visibleH / 2;
      render.bounds.max.y = render.bounds.min.y + visibleH;

      Matter.Mouse.setScale(mouse, { x: 1 / finalScale, y: 1 / finalScale });
      Matter.Mouse.setOffset(mouse, render.bounds.min);
    };

    applyCameraView();

    const handleUIZoom = (e) => {
      currentZoom = e.detail;
      applyCameraView();
    };
    window.addEventListener('ui-zoom-change', handleUIZoom);

    const handleResize = () => applyCameraView();
    window.addEventListener('resize', handleResize);

    const handleWheel = (e) => {
      if (e.target.tagName !== 'CANVAS') return;
      e.preventDefault(); 
      const newZoom = Math.max(0.4, Math.min(currentZoom - e.deltaY * 0.0015, 3));
      currentZoom = newZoom;
      setZoom(newZoom); 
      applyCameraView();
    };
    window.addEventListener('wheel', handleWheel, { passive: false });

    const handlePointerDown = (e) => {
      if (e.target.tagName !== 'CANVAS') return;
      const allBodies = Matter.Composite.allBodies(engine.world).filter(b => !b.isStatic);
      const bodiesUnderMouse = Matter.Query.point(allBodies, mouse.position);
      
      if (bodiesUnderMouse.length === 0) {
        isPanning = true;
        startX = e.clientX || (e.touches && e.touches[0].clientX);
        startY = e.clientY || (e.touches && e.touches[0].clientY);
        render.canvas.style.cursor = 'grabbing';
      }
    };

    const handlePointerMove = (e) => {
      if (isPanning) {
        const currentX = e.clientX || (e.touches && e.touches[0].clientX);
        const currentY = e.clientY || (e.touches && e.touches[0].clientY);
        const finalScale = (window.innerWidth / WORLD_W) * currentZoom;

        render.bounds.min.x += (startX - currentX) / finalScale;
        render.bounds.max.x += (startX - currentX) / finalScale;
        render.bounds.min.y += (startY - currentY) / finalScale;
        render.bounds.max.y += (startY - currentY) / finalScale;

        Matter.Mouse.setOffset(mouse, render.bounds.min);
        startX = currentX; startY = currentY;
      }
    };

    const handlePointerUp = () => {
      isPanning = false;
      if (render.canvas) render.canvas.style.cursor = 'default';
    };

    render.canvas.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    render.canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('ui-zoom-change', handleUIZoom);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleWheel);
      render.canvas.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      render.canvas.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, [lesson, resetTrigger]); 

  const spawn = (type) => {
    if (!engineRef.current || !renderRef.current) return;
    const { Bodies, World } = Matter;
    const w = WORLD_W;
    const h = worldHeightRef.current; 
    const cx = renderRef.current.bounds.min.x + (renderRef.current.bounds.max.x - renderRef.current.bounds.min.x) / 2 + (Math.random() * 50 - 25);
    let newBody;

    switch(type) {
      case 'rubber': newBody = Bodies.circle(cx, 100, 40, { restitution: 0.95, render: { fillStyle: '#22d3ee' } }); break;
      case 'bowling': newBody = Bodies.circle(cx, 100, 50, { restitution: 0.1, density: 0.05, render: { fillStyle: '#475569' } }); break;
      case 'ice': newBody = Bodies.rectangle(w * 0.2, 100, 50, 50, { friction: 0, frictionStatic: 0, chamfer: { radius: 4 }, render: { fillStyle: '#bae6fd' } }); break;
      case 'wood': newBody = Bodies.rectangle(w * 0.2, 100, 50, 50, { friction: 0.5, frictionStatic: 0.8, chamfer: { radius: 4 }, render: { fillStyle: '#d97706' } }); break;
      case 'feather': newBody = Bodies.circle(cx, 100, 30, { frictionAir: 0.1, density: 0.001, render: { fillStyle: '#f8fafc' } }); break;
      case 'iron': newBody = Bodies.circle(cx, 100, 30, { frictionAir: 0.001, density: 0.05, render: { fillStyle: '#334155' } }); break;
      case 'wrecking-ball': newBody = Bodies.circle(w * 0.3, h * 0.3, 60, { density: 0.1, restitution: 0.1, render: { fillStyle: '#1e293b' } }); break;
      case 'heavy-box': newBody = Bodies.rectangle(cx, 50, 60, 60, { density: 0.1, frictionAir: 0.01, chamfer: { radius: 4 }, render: { fillStyle: '#9333ea' } }); break;
      case 'particles': 
        for(let i=0; i<30; i++) World.add(engineRef.current.world, Bodies.circle(cx + (Math.random()*100-50), 50, 8, { render: { fillStyle: '#eab308' } }));
        break;
      case 'custom':
        const mat = materials[customMaterial];
        const options = { restitution: mat.restitution, friction: mat.friction, density: mat.density * customMassMult, render: { fillStyle: mat.color } };
        const startX = lesson === 2 ? w * 0.2 : cx;
        if (customShape === 'circle') newBody = Bodies.circle(startX, 100, customSize, options);
        else if (customShape === 'square') newBody = Bodies.rectangle(startX, 100, customSize * 2, customSize * 2, { ...options, chamfer: { radius: 4 } });
        else if (customShape === 'triangle') newBody = Bodies.polygon(startX, 100, 3, customSize * 1.2, options);
        break;
    }
    if (newBody) World.add(engineRef.current.world, newBody);
  };

  const changeGravity = (type) => {
    if (!engineRef.current) return;
    setGravityType(type);
    engineRef.current.gravity.y = type === 'Earth' ? 1 : type === 'Moon' ? 0.16 : 2.4;
  };

  const clearLab = () => setResetTrigger(prev => prev + 1);

  // 🚀 MASSIVE UPGRADE: Multi-question quizzes + Math Formulas + Deep Theory
  const lessonData = {
    1: { 
      title: 'Restitution', desc: 'Observe kinetic energy retention.', formula: 'e = v / u',
      theory: [
        "Restitution is the physics term for 'bounciness'. When two objects collide, they physically compress against each other. The coefficient of restitution (e) measures how efficiently an object snaps back to its original shape without losing energy.",
        "On a microscopic level, this depends entirely on the material's molecular bonds. A rubber ball has long polymer chains that stretch and spring back with almost zero energy loss, resulting in a high restitution close to 1.0. In contrast, a dense chunk of metal or clay permanently deforms, turning kinetic energy into heat and sound rather than upward motion.",
        "🧮 Formula Breakdown: 'e' is the coefficient of restitution. 'v' is the final relative velocity after the bounce, and 'u' is the initial relative velocity right before impact. The result is always a number between 0 and 1.",
        "📝 Example Problem: A bouncy ball hits the ground at a speed of 10 m/s. It bounces back up at a speed of 8 m/s. What is the coefficient of restitution? Solution: e = 8 / 10. The restitution is 0.8!",
        "💡 Real World Application: We engineer car bumpers to have low restitution (so they crumple and absorb deadly crash energy), but we engineer billiard balls to have extremely high restitution (so they bounce off each other perfectly without losing speed).",
        "🔬 LAB EXPERIMENT: Rubber vs. Bowling Ball",
        "▶ Click 'Drop Rubber' first. Watch how the blue ball compresses slightly upon hitting the ground and aggressively pushes back, returning almost to its original drop height.",
        "▶ Click 'Drop Bowling Ball' next. Notice the heavy thud. Its dense, rigid structure doesn't compress and spring back. The kinetic energy is immediately lost to the ground."
      ],
      buttons: [{ label: 'Drop Rubber', action: () => spawn('rubber') }, { label: 'Drop Bowling Ball', action: () => spawn('bowling') }], 
      quiz: [
        { question: "Which material property determines how much kinetic energy is retained after a collision?", options: ["Density", "Restitution", "Friction", "Mass"], answer: 1, explanation: "Restitution measures kinetic energy retention." },
        { question: "If a material has a restitution of exactly 0, what happens when it hits the ground?", options: ["It bounces perfectly", "It shatters", "It sticks to the ground without bouncing", "It floats away"], answer: 2, explanation: "A restitution of 0 means 100% of the kinetic energy is absorbed or lost. Think of a lump of wet clay falling on the floor." },
        { question: "HARD: A ball is dropped from a roof. It hits the ground at 20 m/s. Its coefficient of restitution is 0.5. At what speed does it leave the ground?", options: ["5 m/s", "10 m/s", "15 m/s", "20 m/s"], answer: 1, explanation: "Using e = v/u. We know e=0.5 and u=20. So 0.5 = v/20. Multiply both sides by 20, and you get v = 10 m/s!" }
      ] 
    },
    2: { 
      title: 'Friction', desc: 'Friction resists sliding.', formula: 'F_f = μ × F_n',
      theory: [
        "Friction is the force that resists the relative motion of two solid surfaces sliding against each other. Even objects that look perfectly smooth to the naked eye actually have jagged, microscopic mountains and valleys on their surfaces.",
        "When two materials touch, these microscopic peaks catch onto each other. To keep moving, the object has to either rise over these peaks or break them off, which requires energy.",
        "🧮 Formula Breakdown: 'F_f' is the force of friction pulling backward. 'μ' (mu) is the coefficient of friction (how rough the surfaces are), and 'F_n' is the normal force (how heavily gravity is pushing the objects together).",
        "📝 Example Problem: A heavy wooden crate is being pushed. Gravity pushes it down with a Normal Force (F_n) of 100 Newtons. The coefficient of friction (μ) between the wood and the floor is 0.4. How much friction force must you overcome to move it? Solution: F_f = 0.4 × 100. You must push with more than 40 Newtons of force to move the crate!",
        "💡 Real World Application: Anti-lock braking systems (ABS) in cars are designed to prevent tires from sliding. Static friction (a rolling tire) provides much more grip than kinetic friction (a skidding tire)!",
        "🔬 LAB EXPERIMENT: Ice vs. Wood",
        "▶ In the lab, you will see a slanted ramp. Click 'Spawn Ice Block'. It slides down easily because ice has a near-zero 'μ' (friction coefficient).",
        "▶ Now click 'Spawn Wood Block'. Wood is porous and rough. The static friction is so high that gravity isn't strong enough to pull it down the slope. It gets stuck!"
      ],
      buttons: [{ label: 'Spawn Ice Block', action: () => spawn('ice') }, { label: 'Spawn Wood Block', action: () => spawn('wood') }], 
      quiz: [
        { question: "What force resists the blocks as they slide down the ramp?", options: ["Momentum", "Tension", "Gravity", "Friction"], answer: 3, explanation: "Friction is the resistance encountered when surfaces slide against each other." },
        { question: "In the friction formula (F_f = μ × F_n), what does 'F_n' (Normal Force) represent?", options: ["The speed of the object", "How hard the surfaces are pressed together", "The roughness of the material", "Air resistance"], answer: 1, explanation: "Normal force is the perpendicular force pushing the objects together, usually caused by gravity." },
        { question: "HARD: If you double the weight of a wooden box, what happens to the friction force required to push it?", options: ["It stays the same", "It is cut in half", "It doubles", "It quadruples"], answer: 2, explanation: "Because F_f = μ × F_n. By doubling the weight, you double the Normal Force (F_n), which doubles the total Friction Force!" }
      ] 
    },
    3: { 
      title: 'Gravity', desc: 'Change planetary mass.', formula: 'W = m × g', isGravity: true, 
      theory: [
        "Gravity is the invisible force that pulls massive objects toward each other. According to Einstein's Theory of General Relativity, massive objects actually warp the fabric of space-time around them, creating a 'dent' that other objects fall into.",
        "The more mass a planet has, the deeper the dent, and the stronger its gravitational pull. Earth pulls objects downward at a constant acceleration of 9.8 meters per second squared.",
        "🧮 Formula Breakdown: 'W' is Weight (the actual force of gravity pulling you down). 'm' is your mass (how much stuff you are made of), and 'g' is the gravitational acceleration of the planet.",
        "📝 Example Problem: A rover has a mass of 100 kg. On Earth (where g = 9.8), its weight is 980 Newtons. If it lands on the Moon (where g = 1.6), what is its weight? Solution: W = 100 × 1.6 = 160 Newtons. It became much lighter, but its mass (100kg) stayed exactly the same!",
        "💡 Real World Application: Astronauts on the Moon could easily jump 10 feet in the air wearing 200-pound spacesuits because the Moon's total mass is only 1.2% of Earth's!",
        "🔬 LAB EXPERIMENT: Changing Planets",
        "▶ Click the 'Moon' button. Suddenly, everything falls in slow motion. The mass of the objects hasn't changed, but the downward pull has weakened.",
        "▶ Click the 'Jupiter' button. Jupiter's massive gravity (24.79 m/s²) yanks objects to the floor almost instantly. More acceleration means higher velocity upon impact!"
      ],
      quiz: [
        { question: "What is the difference between Mass and Weight?", options: ["They are exactly the same thing", "Mass changes depending on the planet, weight stays the same", "Mass is how much matter you have, weight is how hard gravity pulls on that matter", "Weight is measured in kilograms, mass is measured in Newtons"], answer: 2, explanation: "Your mass never changes no matter where you are in the universe. Weight is just a measurement of gravity pulling on your mass!" },
        { question: "If you drop an object on Jupiter, why does it fall faster than on Earth?", options: ["Higher planetary mass creates stronger gravity", "No air resistance", "Magnetic pull", "Shorter distance"], answer: 0, explanation: "Jupiter is incredibly massive, creating a much stronger gravitational pull (g)." },
        { question: "HARD: A 10kg bowling ball and a 1kg wooden ball are dropped in a vacuum on Earth. Which hits the ground first?", options: ["The bowling ball", "The wooden ball", "They hit at the exact same time", "It depends on their shape"], answer: 2, explanation: "In a vacuum (no air resistance), gravity accelerates all objects at the exact same rate (9.8 m/s²), regardless of mass!" }
      ] 
    },
    4: { 
      title: 'Air Resistance', desc: 'Drag affects falling speed.', formula: 'F_d = ½ρv²C_dA',
      theory: [
        "In a perfect vacuum, all objects fall at the exact same speed regardless of their mass. However, on Earth, we live at the bottom of an ocean of air.",
        "As objects fall, they have to literally push billions of air molecules out of the way. This creates a friction force pushing upward, known as aerodynamic drag.",
        "🧮 Formula Breakdown: 'F_d' is the drag force. 'ρ' is air density, 'v' is velocity, 'C_d' is the aerodynamic shape coefficient, and 'A' is the surface area. Notice that velocity 'v' is squared—this means if you fall twice as fast, air resistance pushes back FOUR times as hard!",
        "📝 Example Problem: A skydiver is falling at 50 mph, and experiences 100 Newtons of air resistance. If she speeds up to 100 mph (doubling her velocity), how much air resistance will she experience? Solution: Because velocity is squared in the formula, doubling speed means 2² = 4. She will experience 400 Newtons of drag!",
        "💡 Real World Application: When drag force pushing UP perfectly equals gravity pulling DOWN, an object stops accelerating and falls at a constant speed. This is called 'Terminal Velocity'.",
        "🔬 LAB EXPERIMENT: Feather vs. Iron Ball",
        "▶ Click 'Drop Iron Ball'. Because its mass is high and its surface area is small, air resistance is negligible. It easily punches through the air molecules.",
        "▶ Click 'Drop Feather'. The feather has very little mass but a wide surface area. The upward force of the air quickly equals the downward pull of gravity. It reaches terminal velocity instantly, causing it to gently float."
      ],
      buttons: [{ label: 'Drop Feather', action: () => spawn('feather') }, { label: 'Drop Iron Ball', action: () => spawn('iron') }], 
      quiz: [
        { question: "Why does a feather fall slower than an iron ball on Earth?", options: ["Less mass", "Air resistance pushes against its large surface area", "Gravity pulls it less", "Lower restitution"], answer: 1, explanation: "On Earth, the feather catches the air, creating upward drag that fights gravity." },
        { question: "What is 'Terminal Velocity'?", options: ["The speed of light", "When an object hits the ground", "When gravity and air resistance cancel each other out, so the object stops speeding up", "When an object is thrown upward"], answer: 2, explanation: "When drag equals gravity, net force is zero. The object keeps falling, but stops accelerating." },
        { question: "HARD: According to the drag formula, if a car drives 3 times faster, how much more air resistance does it have to fight?", options: ["3 times as much", "6 times as much", "9 times as much", "It stays the same"], answer: 2, explanation: "Velocity is squared (v²). So 3² = 9. This is why driving fast burns so much extra fuel!" }
      ] 
    },
    5: { 
      title: 'Momentum', desc: 'Conservation of momentum.', formula: 'p = m × v',
      theory: [
        "Momentum is defined simply as 'mass in motion'. One of the most unbreakable rules in the universe is the Conservation of Momentum: in a closed system, momentum can never be created or destroyed, only transferred.",
        "A Newton's Cradle perfectly demonstrates this. When you pull back one ball and let it drop, it strikes the stationary balls with a specific amount of momentum (mass × velocity).",
        "🧮 Formula Breakdown: 'p' is momentum. 'm' is mass, and 'v' is velocity. A massive object moving slowly can have the exact same momentum as a tiny object moving incredibly fast.",
        "📝 Example Problem: A 2,000 kg truck is driving at 10 m/s. A 1,000 kg sports car is driving at 20 m/s. Which has more momentum? Solution: Truck (2000 × 10 = 20,000). Car (1000 × 20 = 20,000). They have the exact same momentum!",
        "💡 Real World Application: Because of momentum, heavy transport vehicles require vastly upgraded, high-friction brake systems to safely stop compared to normal cars.",
        "🔬 LAB EXPERIMENT: The Newton's Cradle",
        "▶ In the center of the lab, use your mouse to grab the ball on the far left, pull it high up, and let go.",
        "▶ Watch the energy transfer. The first ball stops completely when it hits, transferring 100% of its momentum into the chain. The middle balls pass the energy instantly through their atomic structure to the final ball.",
        "▶ Try grabbing TWO balls at once and dropping them! The system 'remembers' the total mass entering it, and exactly two balls will swing out on the other side."
      ],
      buttons: [], 
      quiz: [
        { question: "What does the Law of Conservation of Momentum state?", options: ["Momentum naturally fades away over time", "Momentum can never be created or destroyed in a closed system", "Heavy objects have no momentum", "Gravity controls momentum"], answer: 1, explanation: "Momentum is always conserved. It just transfers from one object to another." },
        { question: "In a Newton's Cradle, what causes the ball on the opposite end to swing out?", options: ["Conservation of Momentum", "Friction", "Air Resistance", "Tension"], answer: 0, explanation: "The momentum transfers perfectly through the rigid steel balls until it pushes the final one." },
        { question: "HARD: If a 10kg object moving at 5 m/s crashes into a stationary 10kg object and they stick together, what is their new speed?", options: ["2.5 m/s", "5 m/s", "10 m/s", "0 m/s"], answer: 0, explanation: "Initial momentum is 50. Since they stick together, the new mass is 20kg. To keep momentum at 50, the velocity must cut in half to 2.5 m/s (20 × 2.5 = 50)." }
      ] 
    },
    6: { 
      title: 'Kinetics', desc: 'Transfer massive force.', formula: 'KE = ½mv²',
      theory: [
        "Kinetic energy is the energy an object possesses due to its motion. When a heavy, fast-moving wrecking ball strikes a stationary structure, the First Law of Thermodynamics kicks in. The massive amount of kinetic energy cannot just vanish.",
        "🧮 Formula Breakdown: 'KE' is kinetic energy. 'm' is mass, and 'v' is velocity. Notice that velocity is squared. Doubling an object's mass doubles its energy, but doubling its speed quadruples its energy!",
        "📝 Example Problem: A baseball (mass = 1) is thrown at 10 mph. Its kinetic energy is 50. If the pitcher throws it twice as fast (20 mph), what is the new kinetic energy? Solution: 1/2 × 1 × 20². That is 1/2 × 400 = 200. Doubling the speed quadrupled the energy!",
        "💡 Real World Application: This squared velocity relationship is why a car crash at 80 mph is far more than twice as deadly as a crash at 40 mph. It has four times the destructive kinetic energy to dissipate!",
        "🔬 LAB EXPERIMENT: Wrecking Ball vs. Pyramid",
        "▶ You will see a neatly stacked pyramid of lightweight blocks. Click 'Drop Wrecking Ball' to spawn a massive, dense sphere in the upper corner.",
        "▶ Observe the impact. Because the wrecking ball is incredibly heavy and accelerates downward, it builds massive kinetic energy.",
        "▶ When it hits the pyramid, the energy transfers violently into the lightweight blocks. Because they have very little mass, the transferred energy converts into extreme velocity, launching the blocks like shrapnel."
      ],
      buttons: [{ label: 'Drop Wrecking Ball', action: () => spawn('wrecking-ball') }], 
      quiz: [
        { question: "When the wrecking ball hits the pyramid, where does its kinetic energy go?", options: ["It vanishes", "Turns into gravity", "Transfers into the blocks", "Increases mass"], answer: 2, explanation: "Energy cannot be destroyed; it transfers directly into the lighter blocks causing them to move." },
        { question: "According to the kinetic energy formula, which factor affects energy the most?", options: ["Mass", "Velocity", "Gravity", "Friction"], answer: 1, explanation: "Because velocity is squared (v²), a small increase in speed creates a massive increase in energy." },
        { question: "HARD: A 2kg block is moving at 4 m/s. What is its kinetic energy in Joules?", options: ["4 Joules", "8 Joules", "16 Joules", "32 Joules"], answer: 2, explanation: "KE = 1/2 × m × v². So, 1/2 × 2 × 4². Which is 1 × 16 = 16 Joules!" }
      ] 
    },
    7: { 
      title: 'Elasticity', desc: 'Springs & Constraints.', formula: 'F = -kx',
      theory: [
        "Elasticity describes a material's ability to return to its original shape after being stretched or compressed. This is mathematically governed by Hooke's Law.",
        "Hooke's Law states that the restorative force of a spring is directly proportional to how far you stretch it.",
        "🧮 Formula Breakdown: 'F' is the pulling force of the spring. 'k' is the spring constant (how stiff the spring is), and 'x' is the distance stretched. The negative sign just means the spring pulls in the opposite direction of the stretch.",
        "📝 Example Problem: A bungee cord has a stiffness (k) of 50 N/m. You stretch it by 2 meters (x). How much force is pulling back? Solution: F = 50 × 2 = 100 Newtons of restorative force!",
        "💡 Real World Application: Archery bows work on this exact principle. When you pull the string back, you are doing 'work' to bend the limbs of the bow, storing your muscle energy as elastic potential energy until you release it into the arrow.",
        "🔬 LAB EXPERIMENT: The Slingshot",
        "▶ Notice the red ball suspended in the air. It is attached to an invisible anchor point by an elastic constraint. Grab the ball with your mouse and drag it away from the center.",
        "▶ As you drag it further, you will notice the mouse link fighting you. You are building Potential Energy. When you let go, Hooke's Law takes over, violently snapping it back.",
        "▶ Click 'Drop Heavy Box'. Watch how the elastic constraint catches the heavy weight, stretching downward to absorb the force before bouncing back up."
      ],
      buttons: [{ label: 'Drop Heavy Box', action: () => spawn('heavy-box') }], 
      quiz: [
        { question: "What provides the restorative force that pulls the red ball back to the center?", options: ["Gravity", "Friction", "Restitution", "Elastic Tension"], answer: 3, explanation: "The constraint acts like a spring, converting potential energy back to kinetic." },
        { question: "If you stretch a spring twice as far, what happens to its pulling force?", options: ["It halves", "It stays the same", "It doubles", "It quadruples"], answer: 2, explanation: "Hooke's Law (F=kx) is linear. Double the stretch distance (x), double the force (F)!" },
        { question: "HARD: If a spring requires 10 Newtons of force to stretch it 1 meter, what is its spring constant (k)?", options: ["1 N/m", "5 N/m", "10 N/m", "100 N/m"], answer: 2, explanation: "Using F = kx. 10 = k × 1. Therefore, k must be 10 N/m." }
      ] 
    },
    8: { 
      title: 'Tension', desc: 'Suspension constraints.', formula: 'ΣF = 0 (Static Equilibrium)',
      theory: [
        "In engineering, forces usually fall into two categories: compression (pushing together) and tension (pulling apart). Tension is the pulling force transmitted axially by strings, cables, or chains.",
        "For a bridge to not collapse, it must be in 'Static Equilibrium'. This means all the downward forces (gravity) must be perfectly canceled out by upward forces (tension).",
        "🧮 Formula Breakdown: ΣF = 0 literally translates to 'The Sum (Σ) of all Forces (F) equals Zero'. If the downward weight is 1000N, the cables must pull upward with exactly 1000N.",
        "📝 Example Problem: A 50kg block is hanging from a rope. Gravity pulls it down with 500 Newtons of force. To achieve Static Equilibrium (so it doesn't fall), how much Tension must the rope provide? Solution: Exactly 500 Newtons upward!",
        "💡 Real World Application: Spider webs are nature's ultimate tension structures. A single strand of spider silk has a higher tensile strength than a steel wire of the exact same thickness!",
        "🔬 LAB EXPERIMENT: The Suspension Bridge",
        "▶ Look at the bridge suspended across the screen. The wooden planks are not glued together; they are chained via invisible tension constraints. Gravity is pulling them down, but the anchor points are pulling them up.",
        "▶ Click 'Drop Heavy Box' right over the middle of the bridge. Watch how the entire bridge dips. The downward force of the box increases the tension on every single link in the chain.",
        "▶ Notice how the impact wave travels along the bridge from the center to the anchors. This demonstrates how tension structures distribute localized weight safely across their entire span."
      ],
      buttons: [{ label: 'Drop Heavy Box', action: () => spawn('heavy-box') }], 
      quiz: [
        { question: "Which force primarily keeps the bridge from collapsing?", options: ["Compression", "Tension from chains", "Friction", "Restitution"], answer: 1, explanation: "The bridge is held up by tension—a pulling force acting along the invisible constraints." },
        { question: "What does 'Static Equilibrium' mean?", options: ["The object is moving very fast", "The object is vibrating", "All forces cancel each other out, so the object is perfectly still", "Gravity has been turned off"], answer: 2, explanation: "When the net force is zero, an object stays completely at rest." },
        { question: "HARD: A rope is rated to snap if tension exceeds 1,000 Newtons. You hang a 50kg box (500N weight) on it. Then, a friend pulls down on the box with 600N of force. What happens?", options: ["The rope holds", "The rope snaps", "The box floats", "Static equilibrium is reached"], answer: 1, explanation: "Total downward force is 500N (box) + 600N (friend) = 1100N. The rope can only provide 1000N of upward tension, so it snaps!" }
      ] 
    },
    9: { 
      title: 'Soft Bodies', desc: 'Deformable structures.', formula: 'Stress = F / A',
      theory: [
        "In basic physics math, we treat objects as 'rigid bodies'—meaning they never bend, squish, or deform. But in the real world, almost everything is slightly soft.",
        "A soft body deforms under mechanical stress. To simulate this computationally, engineers take dozens of tiny, hard particles and connect them all together in a grid using flexible, spring-like constraints.",
        "🧮 Formula Breakdown: 'Stress' is the internal pressure on a material. 'F' is the applied force, and 'A' is the area over which the force is distributed. Soft bodies increase the contact area 'A' when they squish, safely lowering the internal stress!",
        "📝 Example Problem: A 100 Newton force hits a rigid rigid wall on a tiny 1-inch area. Stress = 100/1 = 100. If the wall is soft and squishes, spreading the force over a 10-inch area, what is the new stress? Solution: Stress = 100/10 = 10. The soft body reduced the stress by 90%!",
        "💡 Real World Application: Modern cars are designed with 'crumple zones'. Instead of building a perfectly rigid car that transfers the shock of a crash directly into the passengers, engineers build a semi-soft front end that crushes to absorb the kinetic energy over a wider area and time.",
        "🔬 LAB EXPERIMENT: The Jello Block",
        "▶ In the lab, you will see a green, grid-like structure. Click 'Drop Heavy Box' onto it.",
        "▶ Instead of resisting the box and bouncing it away like a rigid shape, the soft body compresses. The impact force is safely distributed throughout the internal springs.",
        "▶ Grab one corner of the soft body with your mouse and drag it around. Watch how the rest of the body lags behind and jiggles. This is exactly how modern video games simulate realistic jelly, fat, or flexible plastics."
      ],
      buttons: [{ label: 'Drop Heavy Box', action: () => spawn('heavy-box') }], 
      quiz: [
        { question: "Why doesn't the soft-body Jello block shatter upon impact?", options: ["Flexible springs absorb and distribute the energy", "Zero mass", "Ignores gravity", "High friction"], answer: 0, explanation: "The elastic springs stretch and deform to gracefully absorb the impact energy." },
        { question: "How does a car's crumple zone protect passengers?", options: ["By making the car bounce off walls", "By absorbing kinetic energy through deformation", "By acting as a rigid shield", "By turning off gravity"], answer: 1, explanation: "Deforming (crumpling) takes energy. By absorbing that kinetic energy, less of it reaches the fragile human passengers inside." },
        { question: "HARD: According to the Stress formula (F/A), why do snowshoes keep you from sinking into deep snow?", options: ["They decrease your force (F)", "They increase the area (A) your weight is distributed over", "They increase your mass", "They generate heat"], answer: 1, explanation: "By spreading your weight (F) over a much larger surface area (A), the resulting pressure (Stress) on the snow is massively reduced!" }
      ] 
    },
    10: { 
      title: 'Granular Flow', desc: 'Particles acting like fluid.', formula: 'μ_s = tan(θ)',
      theory: [
        "Granular materials—like sand, grain, snow, or coffee grounds—are fascinating because they break the rules. They are made of solid pieces, but when you put millions of them together, they act collectively like a liquid.",
        "When sitting still in a pile, they lock together through static friction and behave perfectly like a solid block. You can even walk on them.",
        "🧮 Formula Breakdown: 'θ' (theta) is the Angle of Repose. This is the steepest angle a pile of sand can stack before gravity overcomes friction and causes an avalanche. μ_s is the coefficient of static friction holding the grains together.",
        "📝 Example Problem: You pour dry sand into a cone shape. The friction between the grains (μ_s) is 0.75. Using trigonometry (tan(θ) = 0.75), we find that θ is roughly 37 degrees. If you tilt the pile to 40 degrees, what happens? Solution: Avalanche! Gravity overcomes friction, and the solid pile turns into a flowing fluid.",
        "💡 Real World Application: Understanding granular flow is critical for preventing deadly snow avalanches, and designing agricultural grain silos (which can actually explode if the internal granular pressure builds incorrectly!).",
        "🔬 LAB EXPERIMENT: Simulating Fluid Dynamics",
        "▶ In the lab, there are two large ramps creating a funnel shape. Click 'Spawn 30 Particles' a few times to drop a massive pile of tiny yellow rigid bodies into the funnel.",
        "▶ Watch how they interact. As they hit the slanted walls, they tumble over each other, seeking the lowest possible resting point, perfectly mimicking water flowing through a channel.",
        "▶ Open the Forge, create a massive, heavy square, and drop it into the pile of particles. Watch how the particles 'splash' outward to make room for the denser object, displaying displacement just like water."
      ],
      buttons: [{ label: 'Spawn 30 Particles', action: () => spawn('particles') }], 
      quiz: [
        { question: "How do large amounts of small, solid particles behave when poured?", options: ["Like a solid block", "Like a fluid", "They float away", "Bounce perfectly"], answer: 1, explanation: "When thousands of tiny rigid bodies interact, their collective movement mimics fluid dynamics." },
        { question: "What is the 'Angle of Repose'?", options: ["The temperature sand melts at", "The steepest angle a granular pile can hold without collapsing", "The speed particles fall in a vacuum", "The bounciness of the particles"], answer: 1, explanation: "It's the maximum angle at which the friction between grains is strong enough to fight off gravity." },
        { question: "HARD: If you pour wet sand instead of dry sand, what happens to the Angle of Repose?", options: ["It decreases (flatter pile)", "It increases (steeper pile)", "It stays exactly the same", "It becomes zero"], answer: 1, explanation: "Water adds surface tension (cohesion) between the sand grains, massively increasing friction. This allows wet sand to stack in steep walls—which is why you use wet sand for sandcastles!" }
      ] 
    },
  };

  return {
    sceneRef, phase, setPhase, isMinimized, setIsMinimized,
    lesson, setLesson, gravityType, changeGravity,
    showCustomizer, setShowCustomizer, customShape, setCustomShape,
    customMaterial, setCustomMaterial, customSize, setCustomSize,
    customMassMult, setCustomMassMult, showQuiz, setShowQuiz,
    quizState, setQuizState, selectedAnswer, setSelectedAnswer,
    quizIndex, setQuizIndex, // 🚀 Exporting new multi-quiz states
    zoom, setZoom, clearLab, spawn,
    currentLesson: lessonData[lesson]
  };
}