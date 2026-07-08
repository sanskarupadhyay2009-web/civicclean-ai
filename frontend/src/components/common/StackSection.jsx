import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function StackSection({ children, index = 0 }) {

    const ref = useRef(null);

    const { scrollYProgress } = useScroll({

        target: ref,

        offset: ["start end", "end start"]

    });

    const scale = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [0.92, 1, 0.94]
    );

    const rotateX = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [18, 0, -18]
    );

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [0.2, 1, 1, 0.25]
    );

    const y = useTransform(
        scrollYProgress,
        [0, 1],
        [120, -120]
    );

    return (

        <motion.section

            ref={ref}

            className="stack-section"

            style={{

                scale,

                rotateX,

                opacity,

                y,

                zIndex:100-index

            }}

        >

            {children}

        </motion.section>

    );

}

export default StackSection;