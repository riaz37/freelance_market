"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth } from "@contexts/AuthContext";
import {
  GET_ALL_PROJECTS,
  GET_MY_PROJECTS,
  CREATE_PROJECT_MUTATION,
  UPDATE_PROJECT_MUTATION,
  PUBLISH_PROJECT_MUTATION,
  DELETE_PROJECT_MUTATION,
} from "@lib/graphql/queries";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED";
  tags: string[];
  createdAt: string;
  updatedAt: string;
  freelancer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    skills?: string[];
    hourlyRate?: number;
  };
}

interface ProjectFormData {
  title: string;
  description: string;
  price: number;
  tags: string[];
}

const ProjectsManagement: React.FC = () => {
  const { user, token } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    price: 0,
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  // Determine which query to use based on user role
  const isFreelancer = user?.role === "FREELANCER";
  const query = isFreelancer ? GET_MY_PROJECTS : GET_ALL_PROJECTS;

  const { data, loading, error, refetch } = useQuery(query, {
    fetchPolicy: "cache-and-network",
  });

  const [createProject] = useMutation(CREATE_PROJECT_MUTATION);
  const [updateProject] = useMutation(UPDATE_PROJECT_MUTATION);
  const [publishProject] = useMutation(PUBLISH_PROJECT_MUTATION);
  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION);

  const projects: Project[] = data?.projects || data?.myProjects || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "PUBLISHED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <ClockIcon className="h-4 w-4" />;
      case "PUBLISHED":
        return <EyeIcon className="h-4 w-4" />;
      case "COMPLETED":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting project with data:", formData);
      console.log("Current user:", user);

      if (editingProject) {
        await updateProject({
          variables: {
            updateProjectInput: {
              id: editingProject.id,
              ...formData,
            },
          },
        });
      } else {
        await createProject({
          variables: {
            createProjectInput: formData,
          },
        });
      }

      setShowCreateForm(false);
      setEditingProject(null);
      setFormData({ title: "", description: "", price: 0, tags: [] });
      refetch();
    } catch (error) {
      console.error("Error saving project:", error);
      alert(`Error saving project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      price: project.price,
      tags: project.tags,
    });
    setShowCreateForm(true);
  };

  const handlePublish = async (projectId: string) => {
    try {
      await publishProject({
        variables: { id: projectId },
      });
      refetch();
    } catch (error) {
      console.error("Error publishing project:", error);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject({
          variables: { id: projectId },
        });
        refetch();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingProject(null);
    setFormData({ title: "", description: "", price: 0, tags: [] });
    setTagInput("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading projects: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {isFreelancer ? "My Projects" : "All Projects"}
          </h1>
          <p className="text-slate-600 mt-1">
            {isFreelancer
              ? "Manage your freelance projects and track their progress"
              : "Browse all available projects on the platform"}
          </p>
        </div>
        {isFreelancer && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create Project
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editingProject ? "Edit Project" : "Create New Project"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingProject ? "Update Project" : "Create Project"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {project.title}
                </h3>
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                >
                  {getStatusIcon(project.status)}
                  {project.status}
                </div>
              </div>
              {isFreelancer && (
                <div className="flex gap-1 ml-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-slate-600 text-sm mb-4 line-clamp-3">
              {project.description}
            </p>

            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-slate-900">
                ${project.price}
              </span>
              {project.freelancer && !isFreelancer && (
                <span className="text-sm text-slate-600">
                  by {project.freelancer.firstName}{" "}
                  {project.freelancer.lastName}
                </span>
              )}
            </div>

            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="text-slate-500 text-xs">
                    +{project.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedProject(project)}
                className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm"
              >
                View Details
              </button>
              {isFreelancer && project.status === "DRAFT" && (
                <button
                  onClick={() => handlePublish(project.id)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <BriefcaseIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {isFreelancer ? "No projects yet" : "No projects available"}
          </h3>
          <p className="text-slate-600">
            {isFreelancer
              ? "Create your first project to get started"
              : "Check back later for new projects"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;
