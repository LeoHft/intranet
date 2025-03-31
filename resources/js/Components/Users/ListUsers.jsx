import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import ModifyUserForm from "@/Components/Users/ModifyUserForm";
import Modal from '../Modal';
import dayjs from 'dayjs';
import toast, { Toaster } from 'react-hot-toast';

export default function ListUsers() {
    const [usersList, setUsersList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModalModifyUser, setShowModalModifyUser] = useState(false);
    const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);


    useEffect(() => {
        axios.get('/api/getUsers')
            .then(response => {
                setUsersList(response.data);
            })
            .catch(error => {
                toast.error('Erreur lors de la récupération des utilisateurs');
                console.error("Error fetching users:", error);
            });
    }, []);

    const ModifyUser = (user) => {
        setSelectedUser(user);
        setShowModalModifyUser(true); 
    }

    const DeleteUserShow = (user) => {
        setSelectedUser(user);
        setShowModalDeleteUser(true);
    }

    const DeleteUsers = (e) => {
        e.preventDefault();
        axios.delete(`/api/deleteUser/${selectedUser.id}`)
            .then(response => {
                toast.success('Utilisateurs supprimé avec succès');
                setUsersList(usersList.filter(use => use.id !== selectedUser.id));
                setShowModalDeleteUser(false);
            })
            .catch(error => {
                console.error("Error deleting user:", error);
                toast.error('Erreur lors de la suppression de l\'utilisateur');
            });
    }

    return (
        <>
        <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead className="bg-gray-200">
                <tr className="border border-gray-400">
                    <th className="border border-gray-400 px-4">Nom</th>
                    <th className="border border-gray-400 px-4">Email</th>
                    <th className="border border-gray-400 px-4">Applications autorisées</th>
                    <th className="border border-gray-400 px-4">Date d'ajout</th>
                    <th className="border border-gray-400 px-4">Date de modification</th>
                    <th className="border border-gray-400 px-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {usersList.length > 0 ? (
                    usersList.map(user => (
                        <tr key={user.id} className="border border-gray-400">
                            <td className="border border-gray-400 px-4">{user.name}</td>
                            <td className="border border-gray-400 px-4">{user.email}</td>
                            <td className="border border-gray-400 px-4"></td> {/* {user.applications.map(app => app.name).join(', ')} */}
                            <td className="border border-gray-400 px-4">{dayjs(user.created_at).format('DD/MM/YYYY HH:mm')}</td>
                            <td className="border border-gray-400 px-4">{dayjs(user.updated_at).format('DD/MM/YYYY HH:mm')}</td>
                            <td className="flex gap-2 content-center items-center justify-center py-1">
                                <SecondaryButton onClick={() => ModifyUser(user)}>Modifier</SecondaryButton>
                                <DangerButton onClick={() => DeleteUserShow(user)}>Supprimer</DangerButton>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center text-gray-500 py-4">
                            Aucun utilisateur trouvé.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        {showModalModifyUser && (
            <ModifyUserForm
                user={selectedUser}
                onClose={() => setShowModalModifyUser(false)}
            />
        )}

        <Modal show={showModalDeleteUser} onClose={() => setShowModalDeleteUser(false)}>
            <form onSubmit={DeleteUsers} className="mt-6 p-6 space-y-6">
                <h1 className="text-lg font-medium text-gray-900">
                    Supprimer un utilisateur
                </h1>
                <p>Êtes-vous sûr de vouloir supprimer l'utilisateur "{selectedUser?.name}" ?</p>
                <div className="flex gap-2 justify-end">
                    <SecondaryButton onClick={() => setShowModalDeleteUser(false)}>Annuler</SecondaryButton>
                    <DangerButton type="submit">Supprimer</DangerButton>
                </div>
            </form>
        </Modal>
        <Toaster />
        </>
    );
}
