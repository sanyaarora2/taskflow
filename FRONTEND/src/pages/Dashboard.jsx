import { useEffect, useState } from "react";

import {
  Moon,
  Sun,
  Search,
  Bell,
  Plus,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Trash2,
  Pencil,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../utils/axios";
import AddTaskModal from '../components/AddTaskModal'
import EditTaskModal from '../components/EditTaskModal'

const Dashboard = ({ darkMode, setDarkMode }) => {

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get("/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  };

  const deleteTask = async (id) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || task.priority === filter || task.status === filter
    return matchesSearch && matchesFilter
  })

  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-black transition-all duration-500">

      {/* SIDEBAR */}
      <div className="w-72 hidden md:flex flex-col justify-between bg-white/70 dark:bg-white/5 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 p-6">
        <div>
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your productivity 🚀
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setFilter('all')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
              <ListTodo size={20} />
              Dashboard
            </button>
            <button
              onClick={() => setFilter('pending')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition dark:text-white">
              <Clock3 size={20} />
              Pending Tasks
            </button>
            <button
              onClick={() => setFilter('completed')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition dark:text-white">
              <CheckCircle2 size={20} />
              Completed
            </button>
            <button
              onClick={() => setFilter('high')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition dark:text-white">
              <CalendarDays size={20} />
              High Priority
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500 hover:text-white transition dark:text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* TOPBAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
              Welcome Back 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Here's your productivity overview today
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:scale-105 transition">
              <Bell className="dark:text-white" size={20} />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:scale-105 transition"
            >
              {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-black" size={20} />}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-xl hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Tasks</p>
                <h2 className="text-4xl font-bold mt-2">{tasks.length}</h2>
              </div>
              <ListTodo size={40} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Completed</p>
                <h2 className="text-4xl font-bold mt-2">{completedTasks}</h2>
              </div>
              <CheckCircle2 size={40} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Pending</p>
                <h2 className="text-4xl font-bold mt-2">{pendingTasks}</h2>
              </div>
              <Clock3 size={40} />
            </div>
          </div>
        </div>

        {/* TASK SECTION */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Tasks</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and organize your workflow</p>
            </div>

            <div className="flex gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:scale-[1.03] transition">
                <Plus size={18} />
                Add Task
              </button>
            </div>
          </div>

          {/* LOADING + EMPTY + TASK LIST */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Loading tasks...</p>
            </div>

          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-white">No Tasks Found</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Start by creating your first task 🚀</p>
            </div>

          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:scale-[1.01] transition bg-gray-50 dark:bg-black"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {task.description}
                    </p>
                    {task.deadline && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <CalendarDays size={12} />
                        {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex gap-3 mt-3 flex-wrap">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        task.priority === "high" ? "bg-red-100 text-red-600"
                        : task.priority === "medium" ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-600"
                      }`}>
                        {task.priority}
                      </span>
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditTask(task)}
                      className="p-3 rounded-xl bg-blue-100 text-blue-600 hover:scale-110 transition">
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="p-3 rounded-xl bg-red-100 text-red-600 hover:scale-110 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onTaskAdded={fetchTasks}
        />
      )}

      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onTaskUpdated={fetchTasks}
        />
      )}

    </div>
  );
};

export default Dashboard;