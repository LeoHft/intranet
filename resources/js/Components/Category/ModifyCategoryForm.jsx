import { useEffect, useState, useRef } from "react";
import Modal from "@/Components/Modal";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Transition } from '@headlessui/react';


export default function ModifyCategoryForm({ category, onClose }) {
    const [showingModifyCategoryModal, setShowingModifyCategoryModal] = useState(true);
    const name = useRef();
    const description = useRef();

    const { data, setData, errors, processing, reset } = useForm({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (category) {
            setData({
                name: category.Name || '',
                description: category.Description || '',
            });
        }
    }, [category]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`/api/updateCategory/${category.id}`, {
            name: data.name,
            description: data.description,
        })
        .then(response => {
            console.log("Category modified successfully:", response.data);
            reset();
            setShowingModifyCategoryModal(false);
            onClose(); 
        }).catch(error => {
            console.error("Error modifying Category:", error);
        });
    };

    return (
        <Modal show={showingModifyCategoryModal} onClose={() => { setShowingModifyCategoryModal(false); onClose(); }}>
            <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                <h1 className="text-lg font-medium text-gray-900">
                    Modifier une catégorie
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
    );
}
