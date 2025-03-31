import { useState } from "react";
import { Check, X } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';


export default function ToggleSwitch() {
    const [enabled, setEnabled] = useState(false);
    const notification = () => {
        if (!enabled) { 
            toast.success('Accès depuis le réseau local');
        }
        else {
            toast.error("Accès depuis l'extérieur");
        }
    }

    return (
        <div>
            <button
                onClick={() => {
                    setEnabled(!enabled);
                    notification();
                }}
                className={`relative flex h-6 w-12 items-center rounded-full transition 
                    ${enabled ? "bg-indigo-600" : "bg-gray-300"} border-2 border-indigo-500`}
            >
                <div
                    className={`absolute left-0 flex h-5 w-5 items-center justify-center rounded-full bg-white transition-all 
                        ${enabled ? "translate-x-6" : "translate-x-0"}`}
                >
                    {enabled ? <Check className="h-4 w-4 text-indigo-600" /> : <X className="h-4 w-4 text-gray-500" />}
                </div>
            </button>
        <Toaster />
        </div>
    );
}
