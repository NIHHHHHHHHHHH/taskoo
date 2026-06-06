import { useState, useEffect } from "react";
import Input from "./Input";
import Button from "./Button";

export default function TaskForm({
  onSubmit,
  onCancel,
  initialTask = null,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title,
        description: initialTask.description || "",
      });
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Title" type="text" name="title" placeholder="Task title" value={formData.title} onChange={handleChange} error={errors.title}/>

      <div>
        <label className="block text-sm font-medium text-text mb-2">Description</label>
        <textarea name="description" placeholder="Task description (optional)" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-text placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"/>
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={loading} className="flex-1 cursor-pointer">
          {loading ? "Saving..." : initialTask ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} className="cursor-pointer flex-1"> Cancel</Button>
      </div>
    </form>
  );
}