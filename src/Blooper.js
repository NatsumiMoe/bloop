import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import { useShortcuts } from './util';
import { motion } from 'framer-motion';

function Blooper({ containerWidth, containerHeight, speed }) {

  const [ { width, height }, setDims ] = useState({ width: 0, height: 0 });

  const maxX = containerWidth - width;
  const maxY = containerHeight - height;

  const [ x, setX ] = useState(0);
  const [ y, setY ] = useState(0);

  const [ hue, setHue ] = useState(0);
  const [ rot, setRot ] = useState(0);

  useEffect(() => {
    let [ localX, localY, vx, vy, vRot, localHue, localRot ] = [ 0, 0, speed, speed, 0.2, 0, 0 ];
    const update = () => {
      localX += vx;
      if (localX < 0 || localX > maxX) {
        localX = Math.min(Math.max(localX, 0), maxX);
        vx = -vx
        localHue += 27;
        vRot = -0.2 + 0.4 * Math.random();
      }
      localY += vy;
      if (localY < 0 || localY > maxY) {
        localY = Math.min(Math.max(localY, 0), maxY);
        vy = -vy;
        localHue += 27;
        vRot = -0.2 + 0.4 * Math.random();
      }
      localRot += vRot;
      setX(localX);
      setY(localY);
      setHue(localHue);
      setRot(localRot);
    }
    const interval = setInterval(update, 10);
    return () => clearInterval(interval);
  }, [ setX, setY, setHue, setRot, containerWidth, containerHeight, speed, maxX, maxY ]);

  return (
    <div className="blooper" style={{left: x, top: y, filter: `hue-rotate(${hue}deg)`, transform: `rotate(${rot}deg)` }}>
      <img
        src="/blooper/static/img/bloop.png"
        alt="Blooper"
        onLoad={(e) => { const { clientWidth, clientHeight } = e.target; setDims({width: clientWidth, height: clientHeight}) }}
      />
    </div>
  );
}

function Loading() {
  const parentVariants = {
    wave: {transition: {staggerChildren: 0.1, delayChildren: 2, repeat: Infinity}}
  };
  const childVariants = {
    wave: {top: 20, transition: { ease: 'easeInOut', duration: 0.5 }}
  };
  return (
    <motion.div variants={parentVariants} animate="wave" style={{position: 'relative', height: 100}}>
      {['L', 'O', 'A', 'D', 'I', 'N', 'G', '.', '.', '.'].map((letter, i) => {
        return (
          <motion.span key={i} variants={childVariants}>{letter}</motion.span>
        );
      })}
    </motion.div>
  );
}

export default function Wrapper() {
  const [ { width, height }, setDims ] = useState({ width: 0, height: 0 });
  const ref = useRef(null);
  const updateDimensions = useCallback(() => {
    if (ref.current !== null) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDims({ width, height });
    }
  }, [ref, setDims]);
  useLayoutEffect(updateDimensions, [updateDimensions]);
  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  const [ speed, setSpeed ] = useState(3);

  useShortcuts([
    {key: 'ArrowUp', fn: () => setSpeed(speed + 0.5)},
    {key: 'ArrowDown', fn: () => setSpeed(speed - 0.5)},
  ])

  return (
    <motion.div
      className="wrapper"
      ref={ref}
      animate={{background: ['linear-gradient(0deg, rgba(44,52,156,1) 0%, rgba(48,188,255,1) 100%)', 'linear-gradient(0deg, rgba(75,105,200,1) 0%, rgba(109,222,251,1) 100%)']}}
      transition={{ease: 'linear', duration: 5, yoyo: Infinity}}
    >
      {/* <Loading /> */}
      <Blooper containerWidth={width} containerHeight={height} speed={speed} />
    </motion.div>
  );
}
