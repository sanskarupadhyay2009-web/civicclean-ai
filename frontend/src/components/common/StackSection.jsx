import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Straight overlay stack — no 3D tilt. Each section is pinned with
// position:sticky (see stacksection.css) and painted in DOM order, so
// as you scroll, the next section slides straight up and lands flush
// on top of the one before it, like cards being dealt one over another.
//
// The outer <motion.section> owns the scroll mechanics only (sticky
// positioning, scroll measurement) so it stays full-bleed and the
// useScroll math is never thrown off. The inner .stack-card is the
// actual visual "card" — rounded corners, shiny gradient border,
// molded shadow — and carries the subtle scale/opacity dip as the
// next card comes in to cover it.
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

                zIndex: index + 1

            }}

        >

            <motion.div

                className="stack-card"

                style={{

                    scale,

                    opacity

                }}

            >

                {children}

            </motion.div>

        </motion.section>

    );

}

export default StackSection;
        
