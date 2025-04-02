import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/Tabs";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components//TextInput";
import { Cat } from "lucide-react";
import CategorySelect from "@/Components//Category/CategorySelect";
import StatusSelect from "@/Components//Status/StatusSelect";
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import UsersSelect from "../Users/UsersSelect";

export default function AddServiceForm() {
    const [showingAddServiceModal, setShowingAddServiceModal] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const name = useRef();
    const description = useRef();
    const internal_url = useRef();
    const external_url = useRef();
    const image = useRef();


    const {
        data,
        setData,
        errors,
        post,
        processing,
        reset,
        recentlySuccessful,
    } = useForm({
        name: '',
        description: '',
        internal_url: '',
        external_url: '',
        image: '',
        categories: [],
        status: null,
        users: [],
    });

    const AddService = () => {
        setShowingAddServiceModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('internal_url', data.internal_url);
        formData.append('external_url', data.external_url);
        formData.append('image', data.image);
        formData.append('category_id', JSON.stringify(selectedCategories.map(category => category.value)));
        formData.append('user_id', JSON.stringify(selectedUsers.map(user => user.value)));
        formData.append('status_id', selectedStatus?.value || '');
    
        axios.post('/api/storeService', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
            toast.success('Service ajouté avec succès');
            console.log("Service ajouté :", response.data);
            reset();
            setShowingAddServiceModal(false);
        })
        .catch(error => {
            toast.error('Erreur lors de l\'ajout du service');
            console.error("Erreur :", error);
        });
    }

    return (
        <section>
            <PrimaryButton onClick={AddService}> Ajouter un service </PrimaryButton>

            <Modal show={showingAddServiceModal} onClose={() => setShowingAddServiceModal(false)}>
                <div className="max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h1 className="text-lg font-medium text-gray-900">
                        Ajouter un service
                    </h1>
                    <div>
                        <InputLabel htmlFor="name" value="Nom du service*" />
                        <TextInput
                            id="name"
                            ref={name}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Nom du service"
                            required
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="description" value="Description" />
                        <TextInput
                            id="description"
                            ref={description}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Description du service"
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="internal_url" value="Url interne" />
                        <TextInput
                            id="internal_url"
                            ref={internal_url}
                            value={data.internal_url}
                            onChange={(e) => setData('internal_url', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Url interne"
                        />
                    </div>
                    <div>
                        <InputLabel htmlFor="external_url" value="Url externe" />
                        <TextInput
                            id="external_url"
                            ref={external_url}
                            value={data.external_url}
                            onChange={(e) => setData('external_url', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Url externe"
                        />
                    </div>
                    <CategorySelect
                        selectedCategories={selectedCategories} 
                        setSelectedCategories={setSelectedCategories} 
                    />
                    <StatusSelect
                        selectedStatus={selectedStatus} 
                        setSelectedStatus={setSelectedStatus}
                    />
                    <UsersSelect
                        selectedUsers={selectedUsers} 
                        setSelectedUsers={setSelectedUsers}
                    />
                    <div>
                        <InputLabel htmlFor="image" value="Image*" />
                        <input
                            id="image"
                            type="file"
                            className="mt-1 block w-full"
                            onChange={(e) => setData('image', e.target.files[0])}
                            required
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Valider
                    </button>
                    
                </form>
                </div>
            </Modal>
            <Toaster />
        </section>

    );


}