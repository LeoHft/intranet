import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/Tabs";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";
import { Cat } from "lucide-react";
import CategorySelect from "./CategorySelect";
import StatusSelect from "./StatusSelect";
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function AddCategoryForm() {
    const [showingAddCategoryModal, setShowingAddCategoryModal] = useState(false);
    const name = useRef();
    const description = useRef();


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
    });

    const AddCategory = () => {
        setShowingAddCategoryModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted");
        console.log("Name:", data.name);
        console.log("Description:", data.description);
        console.log("Data:", data);

        axios.post('/api/storeCategory', {
            name: data.name,
            description: data.description,
        })
        .then(response => {
            console.log("Category added successfully:", response.data);
            reset();
            setShowingAddCategoryModal(false);
        }).catch(error => {
            console.error("Error adding Category:", error);
        });
    }

    return (
        <section>
            <PrimaryButton onClick={AddCategory}> Ajouter une catégorie </PrimaryButton>

            <Modal show={showingAddCategoryModal} onClose={() => setShowingAddCategoryModal(false)}>
                <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                    <h1 className="text-lg font-medium text-gray-900">
                        Ajouter une catégorie
                    </h1>
                    <div>
                        <InputLabel htmlFor="name" value="Nom de la catégorie" />
                        <TextInput
                            id="name"
                            ref={name}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Nom de la catégorie"
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
                            placeholder="Description de la catégorie"
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