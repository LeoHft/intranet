import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/Tabs";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import AddServiceForm from "@/Components/AddServiceForm";
import AddCategoryForm from "@/Components/Category/AddCategoryForm";
import { List } from "lucide-react";
import ListCategory from "@/Components/Category/ListCategory";
import AddStatusForm from "@/Components/Status/AddStatusForm";
import ListStatus from "@/Components/Status/ListStatus";


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
                        <TabsTrigger value="Servicessettings">Paramètres de services</TabsTrigger>
                        <TabsTrigger value="CategoriesSettings">Catégories</TabsTrigger>
                        <TabsTrigger value="StatusSettings">Status</TabsTrigger>
                        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8">
                        <p> duihfiufhef </p>
                    </TabsContent>


                    <TabsContent value="Servicessettings" className="space-y-8">
                        <AddServiceForm />
                        <table className="table-fixed border-collapse border border-gray-400">
                            <thead className="bg-gray-200">
                                <tr className="border border-gray-400">
                                    <th className="border border-gray-400 px-4">Nom</th>
                                    <th className="border border-gray-400 px-4">Description</th>
                                    <th className="border border-gray-400 px-4">Url interne</th>
                                    <th className="border border-gray-400 px-4">Url externe</th>
                                    <th className="border border-gray-400 px-4">Image</th>
                                    <th className="border border-gray-400 px-4">Catégorie(s)</th>
                                    <th className="border border-gray-400 px-4">Status actuel</th>
                                    <th className="border border-gray-400 px-4">Date d'ajout</th>
                                    <th className="border border-gray-400 px-4">Date de modificaton</th>
                                    <th className="border border-gray-400 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="border border-gray-400">
                                <tr className="border border-gray-400">
                                    <td className="px-4 border border-gray-400 px-4">Service 1</td>
                                    <td className="px-4 border border-gray-400 px-4">Description du service 1</td>
                                    <td className="px-4 border border-gray-400 px-4">https://example.com/service1</td>
                                    <td className="px-4 border border-gray-400 px-4">https://external.com/service1</td>
                                    <td className="px-4 border border-gray-400 px-4">image1.jpg</td>
                                    <td className="px-4 border border-gray-400 px-4">Catégorie 1</td>
                                    <td className="px-4 border border-gray-400 px-4">Actif</td>
                                    <td className="px-4 border border-gray-400 px-4">2023-10-01</td>
                                    <td className="px-4 border border-gray-400 px-4">2023-10-02</td>
                                    <td className="px-4 border border-gray-400 px-4">
                                        <SecondaryButton>Modifier</SecondaryButton>
                                        <DangerButton>Supprimer</DangerButton>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </TabsContent>

                    <TabsContent value="CategoriesSettings" className="space-y-8">
                        <AddCategoryForm />
                        <ListCategory />
                    </TabsContent>


                    <TabsContent value="StatusSettings" className="space-y-8">
                        <AddStatusForm />
                        <ListStatus />
                    </TabsContent>




                    <TabsContent value="users" className="space-y-8">

                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
