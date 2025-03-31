import { useEffect, useState, useRef } from "react";
import Modal from "@/Components/Modal";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


export default function ModifyUserForm({ user, onClose }) {
    const [showingModifyUserModal, setShowingModifyUserModal] = useState(true);
    const name = useRef();
    const email = useRef();

    const { data, setData, reset } = useForm({
        name: '',
        email: '',
    });

    useEffect(() => {
        if (user) {
            setData({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`/api/updateUser/${user.id}`, {
            name: data.name,
            email: data.email,
        })
        .then(response => {
            toast.success('Utilisateur modifié avec succès');
            reset();
            setShowingModifyUserModal(false);
            onClose(); 
        }).catch(error => {
            console.error("Error modifying user:", error);
            toast.error('Erreur lors de la modification de l\'utilisateur');
        });
    };

    return (
        <Modal show={showingModifyUserModal} onClose={() => { setShowingModifyUserModal(false); onClose(); }}>
            <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                <h1 className="text-lg font-medium text-gray-900">
                    Modifier un utilisateur
                </h1>
                <div>
                    <InputLabel htmlFor="name" value="Nom de l'utilisateur" />
                    <TextInput
                        id="name"
                        ref={name}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        placeholder="Nom de l'utilisateur"
                        required
                    />
                </div>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        ref={email}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        placeholder="Email de l'utilisateur"
                        required
                    />
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Valider
                </button>
            </form>
            <Toaster />
        </Modal>
    );
}
