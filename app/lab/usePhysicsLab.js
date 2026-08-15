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

  const [showQuiz, setShowQuiz] = useState(false);
  const [quizState, setQuizState] = useState('idle');
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) setIsMinimized(true);
  }, []);

  useEffect(() => {
    setShowQuiz(false);
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

  // 🚀 EXPANDED: Rich, deep-dive theory arrays!
  const lessonData = {
    1: { 
      title: 'Restitution', desc: 'Observe kinetic energy retention.', formula: 'e = v / u',
      theory: [
        "Restitution is the physics term for 'bounciness'. When two objects collide, they physically compress against each other. The coefficient of restitution (e) measures how efficiently an object snaps back to its original shape.",
        "On a microscopic level, this depends entirely on the material's molecular bonds. A rubber ball has long polymer chains that stretch and spring back with almost zero energy loss, resulting in a high restitution close to 1.0.",
        "In contrast, a heavy bowling ball or a chunk of clay absorbs the impact. The molecular bonds permanently deform or shift, turning the kinetic energy of the fall into heat and sound rather than upward motion. This is called an 'inelastic collision'."
      ],
      buttons: [{ label: 'Drop Rubber', action: () => spawn('rubber') }, { label: 'Drop Bowling Ball', action: () => spawn('bowling') }], 
      quiz: { question: "Which material property determines how much kinetic energy is retained after a collision?", options: ["Density", "Restitution", "Friction", "Mass"], answer: 1, explanation: "Restitution measures how much kinetic energy remains after an impact." } 
    },
    2: { 
      title: 'Friction', desc: 'Friction resists sliding.', formula: 'F_f = μ × F_n',
      theory: [
        "Friction is the force that resists the relative motion of two solid surfaces sliding against each other. Even objects that look perfectly smooth to the naked eye actually have jagged, microscopic mountains and valleys on their surfaces.",
        "When two materials touch, these microscopic peaks catch onto each other. To keep moving, the object has to either rise over these peaks or break them off, which requires energy.",
        "Ice has a near-zero coefficient of friction because a microscopic layer of water acts as a lubricant, filling in those valleys. Wood, however, is porous and rough, causing it to grip the surface and rapidly slow down."
      ],
      buttons: [{ label: 'Spawn Ice Block', action: () => spawn('ice') }, { label: 'Spawn Wood Block', action: () => spawn('wood') }], 
      quiz: { question: "What force resists the blocks as they slide down the ramp?", options: ["Momentum", "Tension", "Gravity", "Friction"], answer: 3, explanation: "Friction is the resistance encountered when moving over another surface." } 
    },
    3: { 
      title: 'Gravity', desc: 'Change planetary mass.', formula: 'F = m × a', isGravity: true, 
      theory: [
        "Gravity is the invisible force that pulls massive objects toward each other. According to Einstein's Theory of General Relativity, massive objects actually warp the fabric of space-time around them, creating a 'dent' that other objects fall into.",
        "The more mass a planet has, the deeper the dent, and the stronger its gravitational pull. Earth pulls objects downward at an acceleration of 9.8 meters per second squared.",
        "If you travel to Jupiter, which is incredibly massive, it accelerates objects downward 2.4 times faster than Earth! Conversely, the Moon has very little mass, allowing objects to fall in a slow, floaty manner."
      ],
      quiz: { question: "If you drop an object on Jupiter, why does it fall faster than on Earth?", options: ["Higher mass creates stronger gravity", "No air resistance", "Magnetic pull", "Shorter distance"], answer: 0, explanation: "Gravity is determined by planetary mass. Jupiter is massive, pulling objects faster." } 
    },
    4: { 
      title: 'Air Resistance', desc: 'Drag affects falling speed.', formula: 'F_d = ½ρv²C_dA',
      theory: [
        "A famous physics rule states that in a perfect vacuum, all objects fall at the exact same speed regardless of their mass. A feather and a bowling ball dropped on the moon will hit the ground simultaneously.",
        "However, on Earth, we live at the bottom of an ocean of air. As objects fall, they have to literally push billions of air molecules out of the way. This creates a friction force pushing upward, known as drag.",
        "Because a feather has a massive surface area relative to its tiny mass, air resistance easily counteracts gravity, causing it to drift. An iron ball's mass easily punches through the air, making it fall much faster."
      ],
      buttons: [{ label: 'Drop Feather', action: () => spawn('feather') }, { label: 'Drop Iron Ball', action: () => spawn('iron') }], 
      quiz: { question: "Why does the feather fall slower than the iron ball on Earth?", options: ["Less mass", "Air resistance pushes against its surface area", "Gravity pulls it less", "Lower restitution"], answer: 1, explanation: "On Earth, the feather catches the air, creating upward drag." } 
    },
    5: { 
      title: 'Momentum', desc: 'Conservation of momentum.', formula: 'p = m × v',
      theory: [
        "Momentum is defined simply as 'mass in motion'. One of the most unbreakable rules in the universe is the Conservation of Momentum: in a closed system, momentum can never be created or destroyed, only transferred.",
        "A Newton's Cradle perfectly demonstrates this. When you pull back one ball and let it drop, it strikes the stationary balls with a specific amount of momentum.",
        "Because the system is perfectly aligned, that exact amount of momentum travels through the atomic structure of the center balls and pushes the final ball outward with almost the exact same speed and energy!"
      ],
      buttons: [], 
      quiz: { question: "In a Newton's Cradle, what principle causes the ball on the opposite end to swing out?", options: ["Conservation of Momentum", "Friction", "Air Resistance", "Tension"], answer: 0, explanation: "Energy transfers through the stationary balls, conserving momentum!" } 
    },
    6: { 
      title: 'Kinetics', desc: 'Transfer massive force.', formula: 'KE = ½mv²',
      theory: [
        "Kinetic energy is the energy an object possesses due to its motion. The formula (KE = ½mv²) tells us a crucial secret: doubling an object's mass doubles its energy, but doubling its speed quadruples its energy!",
        "When a heavy, fast-moving wrecking ball strikes a stationary structure, the First Law of Thermodynamics kicks in. The massive amount of kinetic energy cannot just vanish.",
        "Instead, it forcefully transfers into the stationary blocks. If the blocks are light, that transferred energy sends them flying in all directions, demonstrating explosive kinetic transfer."
      ],
      buttons: [{ label: 'Drop Wrecking Ball', action: () => spawn('wrecking-ball') }], 
      quiz: { question: "When the wrecking ball hits the pyramid, where does its kinetic energy go?", options: ["It vanishes", "Turns into gravity", "Transfers into the blocks", "Increases mass"], answer: 2, explanation: "Energy cannot be destroyed; it transfers directly into the lighter blocks causing them to move." } 
    },
    7: { 
      title: 'Elasticity', desc: 'Springs & Constraints.', formula: 'F = -kx',
      theory: [
        "Elasticity describes a material's ability to return to its original shape after being stretched or compressed. This is governed by Hooke's Law.",
        "Hooke's Law states that the force needed to stretch a spring is directly proportional to how far you stretch it. Pull a rubber band twice as far, and it will pull back twice as hard.",
        "In our physics engine, we use 'constraints' to simulate this. When you drag the ball away from its anchor, the constraint acts exactly like a physical spring, building up potential energy and violently pulling the ball back when released."
      ],
      buttons: [{ label: 'Drop Heavy Box', action: () => spawn('heavy-box') }], 
      quiz: { question: "What provides the restorative force that pulls the ball back?", options: ["Gravity", "Friction", "Restitution", "Elastic Tension"], answer: 3, explanation: "The constraint acts like a spring, converting potential energy back to kinetic." } 
    },
    8: { 
      title: 'Tension', desc: 'Suspension constraints.', formula: 'T = m × g',
      theory: [
        "In engineering and physics, forces usually fall into two categories: compression (pushing together) and tension (pulling apart).",
        "Tension is the pulling force transmitted axially by strings, cables, or chains. Think of a massive suspension bridge: the heavy roadway wants to fall down due to gravity.",
        "To stop it from falling, massive steel cables are attached. These cables are pulled incredibly tight, creating an upward tension force that perfectly opposes the downward pull of gravity. As long as the cables don't snap, the bridge floats in mid-air!"
      ],
      buttons: [{ label: 'Drop Heavy Box', action: () => spawn('heavy-box') }], 
      quiz: { question: "Which force primarily keeps the bridge from collapsing?", options: ["Compression", "Tension from chains", "Friction", "Restitution"], answer: 1, explanation: "The bridge is held up by tension—a pulling force acting along the invisible constraints." } 
    },
    9: { 
      title: 'Soft Bodies', desc: 'Deformable structures.', formula: 'Stress = F / A',
      theory: [
        "In basic physics, we treat objects as 'rigid bodies'—meaning they never bend, squish, or deform. But in the real world, almost everything is slightly soft.",
        "A soft body deforms under mechanical stress. To simulate this computationally, engineers build 'meshes'. We take dozens of tiny, hard particles and connect them all together in a grid using flexible, spring-like constraints.",
        "When the object hits the ground, the outer particles stop, but the inner particles keep moving slightly. The springs stretch and compress, absorbing the shock and causing the entire structure to jiggle like a block of gelatin!"
      ],
      buttons: [{ label: 'Drop Heavy Box', action: () => spawn('heavy-box') }], 
      quiz: { question: "Why doesn't the soft-body Jello block shatter upon impact?", options: ["Flexible springs absorb the energy", "Zero mass", "Ignores gravity", "High friction"], answer: 0, explanation: "The elastic springs stretch and deform to gracefully absorb the impact energy." } 
    },
    10: { 
      title: 'Granular Flow', desc: 'Particles acting like fluid.', formula: 'μ = tan(θ)',
      theory: [
        "Granular materials—like sand, grain, snow, or coffee grounds—are fascinating because they break the rules. They are made of solid pieces, but when you put millions of them together, they act like a liquid.",
        "When sitting still in a bucket, they lock together through static friction and behave perfectly like a solid block. You can even walk on them.",
        "But when poured, those microscopic rigid bodies constantly collide, roll over each other, and flow around obstacles. By simulating hundreds of tiny solid balls in this lab, you can witness fluid dynamics emerging purely from solid collisions!"
      ],
      buttons: [{ label: 'Spawn 30 Particles', action: () => spawn('particles') }], 
      quiz: { question: "How do large amounts of small, solid particles behave when poured?", options: ["Like a solid block", "Like a fluid", "They float away", "Bounce perfectly"], answer: 1, explanation: "When thousands of tiny rigid bodies interact, their collective movement simulates fluid dynamics." } 
    },
  };

  return {
    sceneRef, phase, setPhase, isMinimized, setIsMinimized,
    lesson, setLesson, gravityType, changeGravity,
    showCustomizer, setShowCustomizer, customShape, setCustomShape,
    customMaterial, setCustomMaterial, customSize, setCustomSize,
    customMassMult, setCustomMassMult, showQuiz, setShowQuiz,
    quizState, setQuizState, selectedAnswer, setSelectedAnswer,
    zoom, setZoom, clearLab, spawn,
    currentLesson: lessonData[lesson]
  };
}