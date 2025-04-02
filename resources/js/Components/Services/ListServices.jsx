import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import ModifyServiceForm from "@/Components/Services/ModifyServiceForm"; // Modifié pour Services
import Modal from '../Modal';
import dayjs from 'dayjs';
import toast, { Toaster } from 'react-hot-toast';

export default function ListServices() {
    const [servicesList, setServicesList] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [showModalModifyService, setShowModalModifyService] = useState(false);
    const [showModalDeleteService, setShowModalDeleteService] = useState(false);

    useEffect(() => {
        axios.get('/api/getServices')
            .then(response => {
                console.log("Services fetched:", response.data); // Debugging line
                setServicesList(response.data);
            })
            .catch(error => {
                console.error("Error fetching services:", error);
                toast.error('Erreur lors de la récupération des services');
            });
    }, []);

    const modifyService = (service) => {
        setSelectedService(service);
        setShowModalModifyService(true);
    };

    const deleteServiceShow = (service) => {
        setSelectedService(service);
        setShowModalDeleteService(true);
    };

    const deleteService = (e) => {
        e.preventDefault();
        axios.delete(`/api/deleteService/${selectedService.id}`)
            .then(response => {
                toast.success('Service supprimé avec succès');
                setServicesList(servicesList.filter(service => service.id !== selectedService.id));
                setShowModalDeleteService(false);
            })
            .catch(error => {
                toast.error('Erreur lors de la suppression du service');
                console.error("Error deleting service:", error);
            });
    };

    return (
        <>
            <table className="table-auto border-collapse border border-gray-400 h-full w-full">
                <thead className="bg-gray-200">
                    <tr className="border border-gray-400">
                        <th className="border border-gray-400 px-4">Nom</th>
                        <th className="border border-gray-400 px-4">Description</th>
                        <th className="border border-gray-400 px-4">URL Intern</th>
                        <th className="border border-gray-400 px-4">URL Externe</th>
                        <th className="border border-gray-400 px-4">Image</th>
                        <th className="border border-gray-400 px-4"> Catégorie(s) </th>
                        <th className="border border-gray-400 px-4">Statut</th>
                        <th className="border border-gray-400 px-4">Utilisateur(s)</th>
                        {/* <th className="border border-gray-400 px-4">Date d'ajout</th>
                        <th className="border border-gray-400 px-4">Date de modification</th> */}
                        <th className="border border-gray-400 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {servicesList.length > 0 ? (
                        servicesList.map(service => (
                            <tr key={service.id} className="border border-gray-400 h-full">
                                <td className="border border-gray-400 px-4">{service.name}</td>
                                <td className="border border-gray-400 px-4">{service.description}</td>
                                <td className="border border-gray-400 px-4">{service.internal_url}</td>
                                <td className="border border-gray-400 px-4">{service.external_url}</td>
                                <td className="border border-gray-400 px-4">
                                    {service.image_url && (
                                        <img src={service.image_url} alt="Service" className="h-10 w-10 object-cover" />
                                    )}
                                </td>
                                <td className="border border-gray-400 px-4">
                                    {service.categories.filter(category => category !== null).map(category => (
                                        <span key={category.id} className="inline-block bg-gray-200 text-gray-700 px-2 py-1 mb-1 mt-1 rounded-full text-sm mr-2 hover:bg-gray-300">
                                            {category.name}
                                        </span>
                                    ))}
                                </td>
                                <td className="border border-gray-400 px-4">
                                    {service.status?.name ? (
                                        <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm mr-2 hover:bg-gray-300">
                                            {service.status.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500"> </span>
                                    )}
                                </td>
                                <td className="border border-gray-400 px-4">
                                    {service.users.filter(user => user !== null).map(user => (
                                        <span key={user.id} className="inline-block bg-gray-200 text-gray-700 px-2 py-1 mb-1 mt-1 rounded-full text-sm mr-2 hover:bg-gray-300">
                                            {user.name}
                                        </span>
                                    ))}
                                </td>
                                {/* <td className="border border-gray-400 px-4">{dayjs(service.created_at).format('DD/MM/YYYY HH:mm')}</td>
                                <td className="border border-gray-400 px-4">{dayjs(service.updated_at).format('DD/MM/YYYY HH:mm')}</td> */}
                                <td className="flex gap-2 content-center items-center justify-center h-full">
                                    <SecondaryButton onClick={() => modifyService(service)}>Modifier</SecondaryButton>
                                    <DangerButton onClick={() => deleteServiceShow(service)}>Supprimer</DangerButton>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center text-gray-500 py-4">
                                Aucun service trouvé.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showModalModifyService && (
                <ModifyServiceForm
                    service={selectedService}
                    onClose={() => setShowModalModifyService(false)}
                />
            )}

            <Modal show={showModalDeleteService} onClose={() => setShowModalDeleteService(false)}>
                <form onSubmit={deleteService} className="mt-6 p-6 space-y-6">
                    <h1 className="text-lg font-medium text-gray-900">
                        Supprimer un service
                    </h1>
                    <p>Êtes-vous sûr de vouloir supprimer le service "{selectedService?.name}" ?</p>
                    <div className="flex gap-2 justify-end">
                        <SecondaryButton onClick={() => setShowModalDeleteService(false)}>Annuler</SecondaryButton>
                        <DangerButton type="submit">Supprimer</DangerButton>
                    </div>
                </form>
            </Modal>
            <Toaster />
        </>
    );
}
