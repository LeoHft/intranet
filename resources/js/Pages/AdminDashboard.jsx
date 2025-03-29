import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AdminDashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("/api/posts") // Appelle l'API Laravel
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    return (
        <AuthenticatedLayout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Head title="AdminDashboard" />
            <h1 className="text-red-500 animate-bounce"> ADM Dashboard</h1>
            <ul>
                {data.map((post) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
        </AuthenticatedLayout>
    );
}
