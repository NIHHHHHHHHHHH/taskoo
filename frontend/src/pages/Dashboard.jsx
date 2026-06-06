import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";
import TaskForm from "../components/ui/TaskForm";
import TaskCard from "../components/ui/TaskCard";
import Button from "../components/ui/Button";
import API_BASE_URL from "../config/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  const getAuthHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus !== "all") params.append("status", filterStatus);

      const response = await fetch(
        `${API_BASE_URL}/api/tasks?${params.toString()}`,
        {
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        throw new Error("failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError("error loading tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchTerm, filterStatus]);

  const handleCreateTask = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("failed to create task");

      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setShowForm(false);
    } catch (err) {
      setError("error creating task");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tasks/${editingTask._id}`,
        {
          method: "PUT",
          headers: getAuthHeader(),
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("failed to update task");

      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      setEditingTask(null);
      setShowForm(false);
    } catch (err) {
      setError("error updating task");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("delete this task?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!response.ok) throw new Error("failed to delete task");

      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      setError("error deleting task");
    }
  };

  const handleToggleStatus = async (taskId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tasks/${taskId}/toggle`,
        {
          method: "PATCH",
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) throw new Error("failed to toggle status");

      const updatedTask = await response.json();
      setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    } catch (err) {
      setError("error updating task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Tasko</h1>
            <p className="text-text-muted">Welcome, {user.name}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="cursor-pointer">
            <LogOut size={18} className="mr-2 inline" />
            Logout
          </Button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-surface border border-border text-text placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2">
              <button onClick={() => setFilterStatus("all")}
                className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === "all" ? "bg-primary text-white" : "bg-surface border border-border text-text hover:bg-surface-light"}`}>
                All
              </button>
              <button onClick={() => setFilterStatus("pending")}
                className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === "pending" ? "bg-primary text-white" : "bg-surface border border-border text-text hover:bg-surface-light"}`}>
                Pending
              </button>
              <button onClick={() => setFilterStatus("completed")}
               className={`cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === "completed" ? "bg-primary text-white" : "bg-surface border border-border text-text hover:bg-surface-light"}`}>
                Completed
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-white bg-danger bg-opacity-10 p-3 rounded mb-4">{error}</p>
        )}

        {showForm && (
          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-text mb-4"> {editingTask ? "Edit Task" : "Create New Task"}</h2>
            <TaskForm
              onSubmit={ editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => { setShowForm(false); setEditingTask(null);}}
              initialTask={editingTask}
              loading={loading}
            />
          </div>
        )}

        {!showForm && (
          <Button variant="primary" onClick={() => setShowForm(true)} className="cursor-pointer mb-6">
            <Plus size={18} className="mr-2 inline" />
            New Task
          </Button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filterStatus === "all" || filterStatus === "pending" ? (
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">Pending</h2>
              <div className="bg-surface border border-border rounded-lg p-4 min-h-96">
                {pendingTasks.length === 0 ? (
                  <p className="text-text-muted text-center py-8">no pending tasks</p>
                ) : (
                  pendingTasks.map((task) => (
                    <TaskCard key={task._id} task={task} onDelete={handleDeleteTask}
                      onEdit={(t) => {
                        setEditingTask(t);
                        setShowForm(true);
                      }}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))
                )}
              </div>
            </div>
          ) : null}

          {filterStatus === "all" || filterStatus === "completed" ? (
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">Completed</h2>
              <div className="bg-surface border border-border rounded-lg p-4 min-h-96">
                {completedTasks.length === 0 ? (
                  <p className="text-text-muted text-center py-8">no completed tasks</p>
                ) : (
                  completedTasks.map((task) => (
                    <TaskCard key={task._id} task={task} onDelete={handleDeleteTask}
                      onEdit={(t) => {
                        setEditingTask(t);
                        setShowForm(true);
                      }}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}