import { useCallback } from 'react';
import type { Container, Engine } from 'tsparticles-engine';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';

const Particle = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container);
    },
    []
  );
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="particles-js-canvas-el"
      // loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: '#F5F5F8',
          },
          position: 'absolute',
        },
        fullScreen: {
          enable: false,
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: false,
              mode: 'push',
            },
            onHover: {
              enable: false,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: '#B9BAE9',
          },
          links: {
            color: '#B9BAE9',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 3,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 4, max: 6 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export { Particle };
