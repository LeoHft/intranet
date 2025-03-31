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

export default function AddServiceForm() {
    const [showingAddServiceModal, setShowingAddServiceModal] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
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
    });

    const AddService = () => {
        setShowingAddServiceModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted");
        console.log("Selected categories:", selectedCategories);
        console.log("Selected status:", selectedStatus);
        console.log("Name:", data.name);
        console.log("Description:", data.description);
        console.log("Internal URL:", data.internal_url);
        console.log("External URL:", data.external_url);
        console.log("Image:", data.image);
        console.log("Data:", data);

        axios.post('/api/storeService', {
            name: data.name,
            description: data.description,
            internal_url: data.internal_url,
            external_url: data.external_url,
            image_url: data.image,
            category_id: selectedCategories.map(category => category.value),
            status_id: selectedStatus.value,
        })
        .then(response => {
            console.log("Service added successfully:", response.data);
            reset();
            setShowingAddServiceModal(false);
        }).catch(error => {
            console.error("Error adding service:", error);
        });
    }

    return (
        <section>
            <PrimaryButton onClick={AddService}> Ajouter un service </PrimaryButton>

            <Modal show={showingAddServiceModal} onClose={() => setShowingAddServiceModal(false)}>
                <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                    <h1 className="text-lg font-medium text-gray-900">
                        Ajouter un service
                    </h1>
                    <div>
                        <InputLabel htmlFor="name" value="Nom du service" />
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
                            required
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
                            required
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
                            required
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
                    <div>
                        <InputLabel htmlFor="image" value="Image" />
                        <TextInput
                            id="image"
                            ref={image}
                            value={data.image}
                            onChange={(e) => setData('image', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        Valider
                    </button>
                    
                </form>
            </Modal>
        </section>

    );


}