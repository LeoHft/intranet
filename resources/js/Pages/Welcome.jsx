import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <GuestLayout>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-8">
                <Head title="Bienvenue" />
                <p className="font-serif text-3xl"> Votre intranet personnel et open source </p>
                <p className="font-serif text-xl"> Par HOFSTETTER Léo </p>
                <button type="button" onClick={() => window.location.href = "/login"} className="mt-15 text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                    Accédez à votre intranet
                </button>
            </div>
        </GuestLayout>
    );
}
