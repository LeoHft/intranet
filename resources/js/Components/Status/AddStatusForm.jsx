import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/Tabs";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function AddStatusForm() {
    const [showingAddStatusModal, setShowingAddStatusModal] = useState(false);
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

    const AddStatus = () => {
        setShowingAddStatusModal(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted");
        console.log("Name:", data.name);
        console.log("Description:", data.description);
        console.log("Data:", data);

        axios.post('/api/storeStatus', {
            name: data.name,
            description: data.description,
        })
        .then(response => {
            console.log("Status added successfully:", response.data);
            reset();
            setShowingAddStatusModal(false);
        }).catch(error => {
            console.error("Error adding Status:", error);
        });
    }

    return (
        <section>
            <PrimaryButton onClick={AddStatus}> Ajouter un status </PrimaryButton>

            <Modal show={showingAddStatusModal} onClose={() => setShowingAddStatusModal(false)}>
                <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                    <h1 className="text-lg font-medium text-gray-900">
                        Ajouter un status
                    </h1>
                    <div>
                        <InputLabel htmlFor="name" value="Nom du status" />
                        <TextInput
                            id="name"
                            ref={name}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            placeholder="Nom du status"
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
                            placeholder="Description du status"
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