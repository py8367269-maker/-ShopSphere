import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function Product3DViewer({ image, alt }) {
  const ref = useRef(null);
  const isDragging = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), {
    stiffness: 150,
    damping: 15,
  });

  const updateRotation = (clientX, clientY) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    updateRotation(e.clientX, e.clientY);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    x.set(0);
    y.set(0);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    updateRotation(touch.clientX, touch.clientY);
  };

  return (
    <div className="viewer-wrapper">
      <motion.div
        ref={ref}
        className="viewer-card"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          transformPerspective: 1000,
        }}
      >
        <img src={image} alt={alt} className="viewer-image" draggable={false} />
      </motion.div>
      <p className="viewer-hint">🖱️ Click and drag to rotate</p>
    </div>
  );
}

export default Product3DViewer;