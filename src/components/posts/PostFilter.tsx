import { useState, type ChangeEvent } from 'react';
import { Search, X, ChevronDown, Check, Tag } from 'lucide-react';
import type { PostFilterState } from '../../types';

interface PostFilterProps {
  filters: PostFilterState;
  onFilterChange: (filters: PostFilterState) => void;
  availableTags: string[];
}

export function PostFilter({
  filters,
  onFilterChange,
  availableTags,
}: PostFilterProps) {
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchQuery: e.target.value,
    });
  };

  const handleTagToggle = (tag: string) => {
    const isSelected = filters.selectedTags.includes(tag);
    const newTags = isSelected
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];

    onFilterChange({
      ...filters,
      selectedTags: newTags,
    });
  };

  const handleRemoveTag = (tag: string) => {
    onFilterChange({
      ...filters,
      selectedTags: filters.selectedTags.filter((t) => t !== tag),
    });
  };

  const handleClearTags = () => {
    onFilterChange({
      ...filters,
      selectedTags: [],
    });
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      sortBy: e.target.value as PostFilterState['sortBy'],
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      searchQuery: '',
      selectedTags: [],
      sortBy: 'latest',
    });
  };

  const hasActiveFilters = Boolean(
    filters.searchQuery ||
      filters.selectedTags.length > 0 ||
      filters.sortBy !== 'latest'
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 space-y-2.5">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Search posts..."
            className="w-full pl-9 pr-8 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative sm:w-48">
          <button
            type="button"
            onClick={() => setIsTagDropdownOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-left transition"
            aria-expanded={isTagDropdownOpen}
          >
            <div className="flex items-center gap-1.5 truncate">
              <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">
                {filters.selectedTags.length === 0
                  ? 'All Tags'
                  : `Tags (${filters.selectedTags.length})`}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-1" />
          </button>

          {isTagDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsTagDropdownOpen(false)}
              />
              <div className="absolute left-0 sm:right-0 mt-1 w-56 max-h-60 overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1.5 z-50 text-xs">
                <div className="flex items-center justify-between px-3 py-1 border-b border-gray-100 dark:border-gray-800 text-[11px] text-gray-500">
                  <span>Filter by tags</span>
                  {filters.selectedTags.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearTags}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="py-1">
                  {availableTags.map((tag) => {
                    const isChecked = filters.selectedTags.includes(tag);
                    return (
                      <label
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300 select-none transition"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTagToggle(tag)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                        />
                        <span className="flex-1 truncate">#{tag}</span>
                        {isChecked && <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                      </label>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sm:w-36">
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="w-full px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-xs sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Liked</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {filters.selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-gray-500">Active tags:</span>
          {filters.selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-medium"
            >
              <span>#{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-blue-900 dark:hover:text-white rounded-full"
                title={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={handleClearTags}
            className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1.5 border-t border-gray-100 dark:border-gray-800">
          <span>Active filters applied</span>
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Reset All
          </button>
        </div>
      )}
    </div>
  );
}

