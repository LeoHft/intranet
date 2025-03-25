import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("/api/posts") // Appelle l'API Laravel
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    return (
        <div>
            <Head title="Dashboard" />
            <h1 className="text-red-500">Dashboard</h1>
            <ul>
                {data.map((post) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
}
