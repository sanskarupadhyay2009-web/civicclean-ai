import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Straight overlay stack — no 3D tilt. Each section is pinned with
// position:sticky (see stacksection.css) and painted in DOM order, so
// as you scroll, the next section slides straight up and lands flush
// on top of the one before it, like cards being dealt one over another.
// The only scroll-linked motion left is a very subtle scale/opacity
// dip on the outgoing section right as the next one covers it — just
// enough to sell depth, with zero rotation.
function StackSection({ children, index = 0 }) {

    const ref = useRef(null);

    const { scrollYProgress } = useScroll({

        target: ref,

        offset: ["start start", "end start"]

    });

    const scale = useTransform(
        scrollYProgress,
        [0, 0.85, 1],
        [1, 1, 0.94]
    );

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.85, 1],
        [1, 1, 0.65]
    );

    return (

        <motion.section

            ref={ref}

            className="stack-section"

            style={{

                scale,

                opacity,

                zIndex: index + 1

            }}

        >

            {children}

        </motion.section>

    );

}

export default StackSection;
