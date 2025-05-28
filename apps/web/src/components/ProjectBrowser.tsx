'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '@contexts/AuthContext';
import {
  GET_ALL_PROJECTS,
  CREATE_ORDER_MUTATION,
} from '@lib/graphql/queries';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  tags: string[];
  createdAt: string;
  freelancer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    skills?: string[];
    hourlyRate?: number;
  };
}

const ProjectBrowser: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderRequirements, setOrderRequirements] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_ALL_PROJECTS, {
    fetchPolicy: 'cache-and-network',
  });

  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);

  const projects: Project[] = data?.projects || [];

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => project.status === 'PUBLISHED')
    .filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.freelancer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.freelancer.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(project => 
      selectedTags.length === 0 || 
      selectedTags.some(tag => project.tags.includes(tag))
    )
    .filter(project => {
      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      return project.price >= min && project.price <= max;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Get all unique tags for filter
  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)));

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleOrderProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      await createOrder({
        variables: {
          createOrderInput: {
            projectId: selectedProject.id,
            requirements: orderRequirements || undefined,
          },
        },
      });
      
      setShowOrderForm(false);
      setSelectedProject(null);
      setOrderRequirements('');
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const openOrderForm = (project: Project) => {
    setSelectedProject(project);
    setShowOrderForm(true);
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
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Browse Projects</h1>
        <p className="text-slate-600 mt-1">
          Discover talented freelancers and their amazing projects
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, freelancers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min $"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max $"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Filter by Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-600">
        Showing {filteredProjects.length} of {projects.filter(p => p.status === 'PUBLISHED').length} projects
      </div>

      {/* Order Form Modal */}
      {showOrderForm && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Order: {selectedProject.title}
            </h2>
            <form onSubmit={handleOrderProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Project Requirements (Optional)
                </label>
                <textarea
                  value={orderRequirements}
                  onChange={(e) => setOrderRequirements(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe any specific requirements or modifications..."
                />
              </div>
              
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Amount:</span>
                  <span className="text-lg font-bold text-slate-900">${selectedProject.price}</span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1"
                >
                  Place Order
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{project.title}</h3>
              <p className="text-slate-600 text-sm line-clamp-3">{project.description}</p>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">
                  {project.freelancer.firstName} {project.freelancer.lastName}
                </div>
                {project.freelancer.hourlyRate && (
                  <div className="text-xs text-slate-600">
                    ${project.freelancer.hourlyRate}/hour
                  </div>
                )}
              </div>
            </div>

            {project.freelancer.bio && (
              <p className="text-xs text-slate-600 mb-4 line-clamp-2">{project.freelancer.bio}</p>
            )}

            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="text-slate-500 text-xs">+{project.tags.length - 3} more</span>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-slate-900">${project.price}</span>
              <span className="text-xs text-slate-500">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedProject(project)}
                className="flex-1 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors text-sm"
              >
                View Details
              </button>
              {user?.role === 'CLIENT' && (
                <button
                  onClick={() => openOrderForm(project)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No projects found</h3>
          <p className="text-slate-600">
            Try adjusting your search criteria or check back later for new projects.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectBrowser;
