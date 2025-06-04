import { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/Tabs";
import AddServiceForm from "@/Components/Services/AddServiceForm";
import AddCategoryForm from "@/Components/Category/AddCategoryForm";
import ListCategory from "@/Components/Category/ListCategory";
import AddStatusForm from "@/Components/Status/AddStatusForm";
import ListStatus from "@/Components/Status/ListStatus";
import ListUsers from "@/Components/Users/ListUsers";
import AddUserForm from "@/Components/Users/AddUserForm";
import ListServices from "@/Components/Services/ListServices";


export default function AdminDashboard() {
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState("Servicessettings"); // Tab par défaut
    const [refreshTrigger, setRefreshTrigger] = useState(false);


    const triggerRefresh = () => setRefreshTrigger(prev => !prev);


    return (
        <AuthenticatedLayout>
        <Head title="AdminDashboard" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList>
                        <TabsTrigger value="Servicessettings">Paramètres de services</TabsTrigger>
                        <TabsTrigger value="CategoriesSettings">Catégories</TabsTrigger>
                        <TabsTrigger value="StatusSettings">Status</TabsTrigger>
                        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Servicessettings" className="space-y-8">
                        <AddServiceForm onServiceAdded={triggerRefresh}/>
                        <ListServices refreshTrigger={refreshTrigger}/>
                    </TabsContent>

                    <TabsContent value="CategoriesSettings" className="space-y-8">
                        <AddCategoryForm onCategoryAdded={triggerRefresh} />
                        <ListCategory refreshTrigger={refreshTrigger}/>
                    </TabsContent>


                    <TabsContent value="StatusSettings" className="space-y-8">
                        <AddStatusForm onStatusAdded={triggerRefresh}/>
                        <ListStatus refreshTrigger={refreshTrigger}/>
                    </TabsContent>




                    <TabsContent value="users" className="space-y-8">
                        <AddUserForm onUserAdded={triggerRefresh}/>
                        <ListUsers refreshTrigger={refreshTrigger}/>
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
