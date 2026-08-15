'use client';
import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export default function PhysicsCanvas({ isGravityOff, onInitPhysics }) {
  const sceneRef = useRef(null);
  const engineRef = useRef(Matter.Engine.create());

  useEffect(() => {
    if (!isGravityOff || !sceneRef.current) return;

    const engine = engineRef.current;
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      },
    });

    // Add Boundaries
    const ground = Matter.Bodies.rectangle(
      window.innerWidth / 2, window.innerHeight + 30, window.innerWidth, 60, { isStatic: true }
    );
    const leftWall = Matter.Bodies.rectangle(
      -30, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true }
    );
    const rightWall = Matter.Bodies.rectangle(
      window.innerWidth + 30, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true }
    );

    Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Add Mouse Interactivity
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.Composite.add(engine.world, mouseConstraint);

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Send engine back to parent component to register DOM elements
    onInitPhysics(engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Composite.clear(engine.world, false);
    };
  }, [isGravityOff]);

  return ;
}