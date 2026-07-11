import { useEffect, useRef } from "react";

// Fixed, full-viewport canvas of drifting neon nodes connected by faint
// lines when close together — plus a soft repel field around the
// cursor so the network visibly reacts as you move your mouse.
// Sits behind the home page's stacked sections (and above the global
// starfield) purely as an ambient layer — canvas background is left
// transparent so it blends with whatever is already behind it.
export function CyberParticleBackground() {
  const canvasRef = useRef(null);

  // Mutable mouse coordinates kept in a ref so mouse movement never
  // triggers a React re-render — the animation loop reads this directly.
  const mouseRef = useRef({
    x: null,
    y: null,
    radius: 130, // proximity boundary (px) where particles start repelling
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;

    const resizeCanvas = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const particlesArray = [];
    const numberOfParticles = 80;
    const connectionDistance = 120;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
      }

      update() {
        if (this.x > width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > height || this.y < 0) this.speedY = -this.speedY;

        // Repel away from the cursor when inside its proximity radius
        const mouse = mouseRef.current;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy) || 1;

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxForce = 6;
            const force = (mouse.radius - distance) / mouse.radius;

            this.x += forceDirectionX * force * maxForce;
            this.y += forceDirectionY * force * maxForce;
          }
        }

        this.x += this.speedX;
        this.y += this.speedY;
      }

      draw() {
        ctx.fillStyle = "#00ffcc";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    function drawLines() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.hypot(dx, dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(0, 255, 204, ${opacity * 0.22})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    let frameId;
    function animate() {
      ctx.clearRect(0, 0, width, height);

      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      drawLines();
      frameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="cyber-particle-canvas"
    />
  );
}

export default CyberParticleBackground;
            
