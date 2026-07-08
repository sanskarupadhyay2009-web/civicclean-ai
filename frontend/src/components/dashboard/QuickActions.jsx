import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Camera,
    Map,
    Bot,
    ArrowRight
} from "lucide-react";

const MotionLink = motion(Link);

function QuickActions() {

    const actions = [

        {
            icon: <Camera size={32} />,
            title: "Report Waste",
            description:
                "Capture an image and let AI identify the waste instantly.",
            color: "purple",
            path: "/report"
        },

        {
            icon: <Map size={32} />,
            title: "Live Cleanliness Map",
            description:
                "View real-time cleanliness reports across your city.",
            color: "blue",
            path: "/map"
        },

        {
            icon: <Bot size={32} />,
            title: "Ask CivicClean AI",
            description:
                "Receive AI-powered environmental guidance and insights.",
            color: "green",
            path: "/assistant"
        }

    ];

    return (

        <section className="quick-actions">

            <h2>

                Quick Actions

            </h2>

            <div className="actions-grid">

                {actions.map((action, index) => (

                    <MotionLink

                        key={index}

                        to={action.path}

                        className={`action-card ${action.color}`}

                        whileHover={{
                            y: -10,
                            scale: 1.02
                        }}

                        whileTap={{
                            scale: 0.97
                        }}

                        transition={{
                            duration: .25
                        }}

                    >

                        <div className="action-icon">

                            {action.icon}

                        </div>

                        <h3>

                            {action.title}

                        </h3>

                        <p>

                            {action.description}

                        </p>

                        <span className="action-card-cta">

                            Open <ArrowRight size={16} />

                        </span>

                    </MotionLink>

                ))}

            </div>

        </section>

    );

}

export default QuickActions;
                            
