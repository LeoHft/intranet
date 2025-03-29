import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/Tabs";


export default function AdminDashboard() {
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");


    useEffect(() => {
        fetch("/api/posts") // Appelle l'API Laravel
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    return (
        <AuthenticatedLayout>
        <Head title="AdminDashboard" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList>
                        <TabsTrigger value="overview">Menu</TabsTrigger>
                        <TabsTrigger value="settings">Paramètres de services</TabsTrigger>
                        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8">
                            <p> zdzld</p>
                    </TabsContent>


                    <TabsContent value="settings" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <p> efkef </p>
                    </TabsContent>

                    <TabsContent value="users">
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
