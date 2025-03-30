import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import ModifyStatusForm from "@/Components/Status/ModifyStatusForm";
import Modal from '../Modal';

export default function ListStatus() {
    const [StatusList, setStatusList] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showModalModifyStatus, setShowModalModifyStatus] = useState(false);
    const [showModalDeleteStatus, setShowModalDeleteStatus] = useState(false);


    useEffect(() => {
        axios.get('/api/getStatus')
            .then(response => {
                console.log("Status fetched successfully:", response.data);
                setStatusList(response.data);
            })
            .catch(error => {
                console.error("Error fetching Status:", error);
            });
    }, []);

    const ModifyStatus = (status) => {
        setSelectedStatus(status);
        setShowModalModifyStatus(true); 
    }

    const DeleteStatusShow = (status) => {
        setSelectedStatus(status);
        setShowModalDeleteStatus(true);
    }

    const DeleteStatus = (e) => {
        e.preventDefault();
        axios.delete(`/api/deleteStatus/${selectedStatus.id}`)
            .then(response => {
                console.log("Status deleted successfully:", response.data);
                setStatusList(StatusList.filter(stat => stat.id !== selectedStatus.id));
                setShowModalDeleteStatus(false);
            })
            .catch(error => {
                console.error("Error deleting Status:", error);
            });
    }

    return (
        <>
        <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead className="bg-gray-200">
                <tr className="border border-gray-400">
                    <th className="border border-gray-400 px-4">Nom</th>
                    <th className="border border-gray-400 px-4">Description</th>
                    <th className="border border-gray-400 px-4">Date d'ajout</th>
                    <th className="border border-gray-400 px-4">Date de modification</th>
                    <th className="border border-gray-400 px-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {StatusList.length > 0 ? (
                    StatusList.map(status => (
                        <tr key={status.id} className="border border-gray-400">
                            <td className="border border-gray-400 px-4">{status.Name}</td>
                            <td className="border border-gray-400 px-4">{status.Description}</td>
                            <td className="border border-gray-400 px-4">{status.created_at}</td>
                            <td className="border border-gray-400 px-4">{status.updated_at}</td>
                            <td className="flex gap-2 content-center items-center justify-center py-1">
                                <SecondaryButton onClick={() => ModifyStatus(status)}>Modifier</SecondaryButton>
                                <DangerButton onClick={() => DeleteStatusShow(status)}>Supprimer</DangerButton>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center py-4">
                            Aucun status trouvée.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        {showModalModifyStatus && (
            <ModifyStatusForm
                status={selectedStatus}
                onClose={() => setShowModalModifyStatus(false)}
            />
        )}

        <Modal show={showModalDeleteStatus} onClose={() => setShowModalDeleteStatus(false)}>
            <form onSubmit={DeleteStatus} className="mt-6 p-6 space-y-6">
                <h1 className="text-lg font-medium text-gray-900">
                    Supprimer un status
                </h1>
                <p>Êtes-vous sûr de vouloir supprimer le status "{selectedStatus?.Name}" ?</p>
                <div className="flex gap-2 justify-end">
                    <SecondaryButton onClick={() => setShowModalDeleteStatus(false)}>Annuler</SecondaryButton>
                    <DangerButton type="submit">Supprimer</DangerButton>
                </div>
            </form>
        </Modal>

        </>
    );
}
