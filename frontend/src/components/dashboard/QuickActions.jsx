import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Camera,
    Map,
    Bot
} from "lucide-react";

function QuickActions() {

    const navigate = useNavigate();

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

                    <motion.div

                        key={index}

                        className={`action-card ${action.color}`}

                        whileHover={{
                            y: -10,
                            scale: 1.02
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

                        <button
                            type="button"
                            onClick={() => navigate(action.path)}
                        >

                            Open →

                        </button>

                    </motion.div>

                ))}

            </div>

        </section>

    );

}

export default QuickActions;
