import { useEffect, useState, useRef } from "react";
import Modal from "@/Components/Modal";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import CategorySelect from "@/Components/Category/CategorySelect";
import StatusSelect from "@/Components/Status/StatusSelect";
import UsersSelect from "../Users/UsersSelect";

export default function ModifyServiceForm({ service, onClose }) {
    const [showingModifyServiceModal, setShowingModifyServiceModal] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const { data, setData, reset } = useForm({
        name: '',
        description: '',
        wifiUrl: '',
        cloudflareUrl: '',
        image: '',
        categories: [],
        users: [],
        status: null,
    });

    useEffect(() => {
        if (service) {
            setData({
                name: service.Name || '',
                description: service.Description || '',
                wifiUrl: service.WifiUrl || '',
                cloudflareUrl: service.CloudflareUrl || '',
                image: service.ImageUrl || '',
                categories: service.categories?.map(cat => ({ value: cat.id, label: cat.Name })) || [],
                users: service.users?.map(user => ({ value: user.id, label: user.name })) || [],
                status: service.status ? { value: service.status.id, label: service.status.Name } : null,
            });
    
            setSelectedCategories(service.categories?.map(cat => ({ value: cat.id, label: cat.Name })) || []);
            setSelectedUsers(service.users?.map(user => ({ value: user.id, label: user.name })) || []);
            setSelectedStatus(service.status ? { value: service.status.id, label: service.status.Name } : null);
        }
    }, [service]);

    const handleSubmit = async (e) => {
        e.preventDefault();   
        const formData = new FormData();
        formData.append('_method', 'PUT'); 
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('internal_url', data.wifiUrl);
        formData.append('external_url', data.cloudflareUrl);
        if (imageFile) {
            formData.append('image', imageFile); // Ajout du fichier
        }
        formData.append('category_id', JSON.stringify(selectedCategories.map(cat => cat.value)));
        formData.append('user_id', JSON.stringify(selectedUsers.map(user => user.value)));
        formData.append('status_id', selectedStatus?.value || '');
    
        try {
            await axios.post(`/api/updateService/${service.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            toast.success('Service modifié avec succès');
            reset();
            setShowingModifyServiceModal(false);
            onClose();
        } catch (error) {
            console.error("Erreur lors de la modification du service:", error);
            toast.error('Erreur lors de la modification du service');
        }
    };
    

    return (
        <Modal show={showingModifyServiceModal} onClose={() => { setShowingModifyServiceModal(false); onClose(); }}>
            <form onSubmit={handleSubmit} className="mt-6 p-6 space-y-6">
                <h1 className="text-lg font-medium text-gray-900">
                    Modifier un service
                </h1>
                <div>
                    <InputLabel htmlFor="name" value="Nom du service*" />
                    <TextInput
                        id="name"
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
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        placeholder="Description du service"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="wifiUrl" value="Url interne" />
                    <TextInput
                        id="wifiUrl"
                        value={data.wifiUrl}
                        onChange={(e) => setData('wifiUrl', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        placeholder="URL Wifi"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="cloudflareUrl" value="Url externe" />
                    <TextInput
                        id="cloudflareUrl"
                        value={data.cloudflareUrl}
                        onChange={(e) => setData('cloudflareUrl', e.target.value)}
                        type="text"
                        className="mt-1 block w-full"
                        placeholder="URL Cloudflare"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="image" value="Image" />
                    {data.image && (
                        <div className="mt-2">
                            <p>Image actuelle :</p>
                            <img src={data.image} alt="Aperçu" className="w-32 h-32 object-cover rounded" />
                        </div>
                    )}
                    <input
                        id="image"
                        type="file"
                        className="mt-1 block w-full"
                        onChange={(e) => setImageFile(e.target.files[0])}
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
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Valider
                </button>
            </form>
            <Toaster />
        </Modal>
    );
}
