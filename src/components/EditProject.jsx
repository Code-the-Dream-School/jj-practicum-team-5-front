import { useState, useRef, useEffect } from "react";


const EditProject = ({ project, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        image: project?.image || '',
        date: project?.date || '',
    });

    const [imagePreview, setImagePreview] = useState(project?.image || '');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                date: project.date || '',
                imageFile: null,
            });
            setImagePreview(project.image || null);
        }
    }, [project]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
                reader.readAsDataURL(file);
                setFormData(prev => ({
                    ...prev,
                    imageFile: file,
                }));
            };
        }

    const handleRemoveImage = () => {
        setImagePreview('');
        setFormData(prev => ({
            ...prev,
            imageFile: null,
        }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            alert('Project title required');
            return;
        }
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('date', formData.date);
            if (formData.imageFile) data.append('image', formData.imageFile);

            const response = await fetch(`/api/v1/projects/${project.id}`, {
                method: 'PUT',
                body: data
            });

            if (!response.ok) throw new Error('Failed to update project');

            const updatedProject = await response.json();
            onSave(updatedProject);
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error saving project: ' + err.message);
        }
    };

const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
};

if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Edit project</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Data
                            </label>
                            <input
                                id="due-date"
                                type="date"
                                name="date"
                                value={formData.date ? new Date(formData.date).toISOString().slice(0, 10) : ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        date: e.target.value ? new Date(e.target.value).toISOString() : ""
                                    }))
                                }
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project image
                        </label>
                        {imagePreview && (
                            <div className="relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setFormData(prev => ({ ...prev, image: null, imageFile: null }));
                                    }}
                                    className="absolute -top-2 -right-2 bg-black w-8 h-8 flex items-center justify-center rounded-full border-2 border-white shadow-lg hover:bg-gray-800 hover:scale-110 transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <div className="flex items-center space-x-4">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <div className="w-full px-4 py-2  py-2 px-4 rounded-xl border bg-gradient-to-r from-blue-600 to-purple-600  text-center text-white hover:bg-gray-50 transition-colors">
                                    Choose file
                                </div>
                            </label>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            Upload an image file
                        </p>
                    </div>
                </div>


                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProject;