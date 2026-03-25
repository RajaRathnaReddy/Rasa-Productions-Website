'use client';

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
// using loadSlim for better performance over the full engine
import { loadSlim } from "@tsparticles/slim";

export default function InteractiveBackground() {
    const [init, setInit] = useState(false);

    // Initialize the tsParticles engine once
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (_container?: Container): Promise<void> => {
        // particles loaded
    };

    const options: ISourceOptions = {
        background: {
            color: {
                value: "#000000", // deep black space
            },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push", // add particles on click
                },
                onHover: {
                    enable: true,
                    mode: "repulse", // push particles away from the mouse
                },
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 100, // repulse radius
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: ["#00f0ff", "#ff2a85", "#7b2d8b"], // Cyan, Pink, Purple mix
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce", // stay bound to the screen
                },
                random: true,
                speed: 1.5,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                },
                value: 50, // Optimized: reduced from 80 for better performance
            },
            opacity: {
                value: 0.4,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
    };

    if (!init) {
        return (
            <div className="fixed inset-0 bg-black -z-50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-cyan-400 animate-ping opacity-20" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 -z-50 pointer-events-auto">
            <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
                className="absolute inset-0"
            />
            {/* Ambient Base Glow behind the particles */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(123,45,139,0.15) 0%, transparent 80%)'
                }}
            />
        </div>
    );
}
