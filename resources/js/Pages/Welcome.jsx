import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import React, { useRef } from 'react';
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    gsap.registerPlugin(useGSAP, ScrollTrigger);

    const container = useRef();
    const sectionRefs = useRef([]);
    const buttonRef = useRef();

    useGSAP(() => {
        // Animation scroll du bouton principal
        gsap.to("#buttonLogin", {
            y: 500,
            scrollTrigger: {
                trigger: container.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                markers: false,
            },
        });

        // Animation fade/slide des blocs de sections
        sectionRefs.current.forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, y: 100 },
                {
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        toggleActions: "play none none none",
                        markers: false,
                    },
                    duration: 1,
                    delay: i * 0.2
                }
            );
        });

    }, { scope: container });

    return (
        <GuestLayout>
            <div
                ref={container}
                className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-8 min-h-[500vh]"
            >
                <Head title="Bienvenue" />

                {/* HERO */}
                <div className="mt-20 space-y-4">
                    <h1 className="text-6xl font-bold font-serif">Intranet</h1>
                    <p className="text-2xl font-light font-serif text-gray-500">
                        Centralisez vos services auto-hébergés, gérez les accès avec finesse.
                    </p>
                    <p className="text-xl text-gray-400 font-mono">Par HOFSTETTER Léo</p>
                    <button
                        id="buttonLogin"
                        type="button"
                        onClick={() => window.location.href = "/login"}
                        className="mt-10 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-lg px-6 py-3 transition-all"
                    >
                        Accédez à votre intranet
                    </button>
                </div>

                {/* SECTIONS */}
                <div className="grid md:grid-cols-3 gap-8 mt-30">
                    <div
                        className="p-6 border-2 border-pink-100 rounded-lg"
                        ref={el => sectionRefs.current[0] = el}
                    >
                        <h3 className="text-4xl font-semibold mb-2 font-serif text-left">
                            Gestion utilisateurs
                        </h3>
                        <p className="font-mono text-3xl text-left">
                            Créez des comptes utilisateurs et attribuez leurs des accès aux services selon les besoins.
                        </p>
                    </div>
                    <div
                        className="p-6 mt-50 border-2 border-pink-100 rounded-lg"
                        ref={el => sectionRefs.current[1] = el}
                    >
                        <h3 className="text-4xl font-semibold mb-2 font-serif">
                            Services organisés
                        </h3>
                        <p className="font-mono text-3xl">
                            Classez vos services par catégories, ajoutez des descriptions et statuts.
                        </p>
                    </div>
                    <div
                        className="p-6 border-2 border-pink-100 rounded-lg"
                        ref={el => sectionRefs.current[2] = el}
                    >
                        <h3 className="text-4xl font-semibold mb-2 font-serif text-right">
                            Accès centralisé
                        </h3>
                        <p className="font-mono text-3xl text-right">
                            Accédez à tous vos services depuis un seul endroit. Peu importe lesquels.
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
