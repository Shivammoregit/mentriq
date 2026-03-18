import React, { useState } from 'react'

import { Filter, X } from 'lucide-react'

const CoursesFilter = ({ filters, setFilters, categories = [] }) => {
  const [open, setOpen] = useState(false)

  const categoryOptions = categories.length > 0
    ? categories
    : [
      'Web Development',
      'Data Structures',
      'Java',
      'React',
      'Node.js',
      'Full Stack',
      'Mobile App',
      'DevOps'
    ]

  const levelOptions = ['Beginner', 'Intermediate', 'Advanced']

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value
    }))
  }

  return (
    <div
      className="sticky top-20 z-10 bg-white/80 backdrop-blur-md shadow-lg border border-gray-200 rounded-3xl p-6 mb-12"
    >
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden w-full flex items-center justify-between py-4 px-6 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-2xl font-semibold mb-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <span className="flex items-center space-x-2">
          <Filter size={20} />
          <span>Filters</span>
        </span>
        <Filter size={20} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${open ? 'block' : 'md:block hidden'}`}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange('category', category)}
                className={`w-full p-3 rounded-xl text-left transition-all duration-200 border-2 ${filters.category === category
                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg'
                    : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Level</label>
          <div className="space-y-2">
            {levelOptions.map((level) => (
              <button
                key={level}
                onClick={() => handleFilterChange('level', level)}
                className={`w-full p-3 rounded-xl text-left transition-all duration-200 border-2 ${filters.level === level
                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg'
                    : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
          <div className="space-y-2">
            <button
              onClick={() => handleFilterChange('price', 'free')}
              className={`w-full p-3 rounded-xl text-left transition-all duration-200 border-2 ${filters.price === 'free'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg'
                  : 'bg-gray-50 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
            >
              Free Courses
            </button>
            <button
              onClick={() => handleFilterChange('price', 'paid')}
              className={`w-full p-3 rounded-xl text-left transition-all duration-200 border-2 ${filters.price === 'paid'
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg'
                  : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
                }`}
            >
              Paid Courses
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <button
            onClick={() => setFilters({})}
            className="w-full p-3 bg-red-50 border-2 border-red-200 text-red-700 font-semibold rounded-xl hover:bg-red-100 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <X size={18} />
            <span>Clear All</span>
          </button>

          <div className="mt-4 space-y-1 text-xs text-gray-500">
            <div>Active Filters:</div>
            {Object.values(filters).filter(Boolean).map((filter, i) => (
              <div key={i} className="flex items-center space-x-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                <span>{filter}</span>
                <button onClick={() => { }} className="ml-1 hover:text-indigo-600">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursesFilter
