import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal';
import dayjs from 'dayjs';
import toast, { Toaster } from 'react-hot-toast';

export default function CardServices() {
    const [servicesList, setServicesList] = useState([]);
    const [showingServiceModal, setShowingServiceModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        axios.get('/api/getUserServices')
        .then (response => {
            setServicesList(response.data);
        })
        .catch (error => {
            console.error("Error fetching services:", error);
            toast.error('Erreur lors de la récupération des services');
        });
    }, []);

    const DetailService = (service) => {
        setSelectedService(service);
        setShowingServiceModal(true);
    }


    return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-4">
        {
            servicesList.length > 0 ? servicesList.map(service => (
                <div key={service.id} onClick={() => DetailService(service)} className="max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-white">
                    <div className="relative overflow-hidden">
                        <img 
                            className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300 ease-in-out" 
                            src={service.image_url || "storage/images/no-photo-available.jpg"} 
                            alt={service.name} 
                        />
                        {service.status !== null && (
                            <span className="absolute top-2 right-2 bg-gray-700 text-white px-3 py-1 rounded-full text-xs">
                                {service.status.name}
                            </span>
                        )}
                        <div className="absolute top-2 left-2 space-y-1">
                            {Array.isArray(service.categories) && service.categories.map(category => (
                                <span key={category.id} className="inline-block bg-gray-700 text-white px-3 py-1 text-xs rounded-full mr-1">{category.name}</span>
                            ))}
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-lg">{service.name}</p>
                            {service.internal_url && (
                            <a href={service.internal_url} target='blank' className="text-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition">
                                {service.internal_url}
                            </a>
                            )}
                        </div>                         
                    </div>
                    <div className="p-4 pt-0">
                        <button type="submit" onClick={() => DetailService(service)} className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out">
                            Détails
                        </button>
                    </div>
                </div>


            )) : (
                <div className="flex justify-center items-center h-full w-full">
                    <p className="text-gray-500">Aucun service trouvé</p>
                </div>
            )
        }


        <Modal show={showingServiceModal} onClose={() => setShowingServiceModal(false)}>
            {selectedService && (
                <div className="max-w rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-white">
                    <div className="relative overflow-hidden">
                        <img 
                            className="w-full h-58 object-cover hover:scale-110 transition-transform duration-300 ease-in-out" 
                            src={selectedService.image_url || "storage/images/no-photo-available.jpg"} 
                            alt={selectedService.name} 
                        />
                        {selectedService.status !== null && (
                            <span className="absolute top-2 right-2 bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                                {selectedService.status.name}
                            </span>
                        )}
                        <div className="absolute top-2 left-2 space-y-1">
                            {Array.isArray(selectedService.categories) && selectedService.categories.map(category => (
                                <span key={category.id} className="inline-block bg-gray-700 text-white px-3 py-1 text-sm rounded-full mr-1">{category.name}</span>
                            ))}
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center-x justify-between">
                            <div className="flex flex-col space-y-1">
                                <p className="font-bold text-lg">{selectedService.name}</p>
                                <p className="text-gray-500 text-sm"> Créer le : {dayjs(selectedService.created_at).format('DD/MM/YYYY')} </p>
                                <p className="text-gray-500 text-sm"> Modifié le : {dayjs(selectedService.modified_at).format('DD/MM/YYYY')} </p>
                            </div>
                            <div className="flex flex-col space-y-2 justify-end">
                                {selectedService.internal_url && (
                                <a href={selectedService.internal_url} target='blank' className="text-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition">
                                    {selectedService.internal_url}
                                </a>
                                )}
                                {selectedService.external_url && (
                                    <a href={selectedService.external_url} target='blank' className="text-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition ">
                                        {selectedService.external_url}
                                    </a>
                                )} 
                            </div>  
                        </div>
                        <div className="mt-4 flex flex-col space-y-2"> 
                            <p className="text-gray-500 text-ml text-center">
                                {selectedService.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Modal>








    </section>

    );



}