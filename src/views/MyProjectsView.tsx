import React, { useState } from 'react';
import { ProjectRecord } from '../types';
import { 
  FolderKanban, 
  PlusCircle, 
  Building2, 
  TrendingUp, 
  Layers, 
  HardHat, 
  MapPin, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface MyProjectsViewProps {
  projects: ProjectRecord[];
  onSelectProject: (project: ProjectRecord) => void;
  onDeleteProject: (projectId: string) => void;
  onNavigate: (view: string) => void;
}

export const MyProjectsView: React.FC<MyProjectsViewProps> = ({
  projects,
  onSelectProject,
  onDeleteProject,
  onNavigate
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'road':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'bridge':
        return <Layers className="w-5 h-5 text-purple-500" />;
      default:
        return <Building2 className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Project Management Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-0.5">
            My Construction Projects ({projects.length})
          </h1>
        </div>

        <button
          onClick={() => onNavigate('create-project')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Projects' },
          { id: 'building', label: 'Buildings' },
          { id: 'road', label: 'Roads & Highways' },
          { id: 'bridge', label: 'Bridges' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => {
          const totalEstimatedCost = p.requiredMaterials.reduce(
            (acc, m) => acc + (m.editableQuantity * m.estimatedUnitPrice),
            0
          );

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {getCategoryIcon(p.category)}
                    </div>
                    <span className="text-xs font-bold capitalize text-slate-700">
                      {p.category} Construction
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {p.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{p.location}, {p.stateCity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Created on {p.createdAt}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-baseline">
                  <div>
                    <div className="text-[10px] text-slate-400">Estimated Materials:</div>
                    <div className="text-xs font-bold text-slate-700">{p.requiredMaterials.length} Items Calculated</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Approx. Raw Total:</div>
                    <div className="text-base font-black text-slate-900 font-display">
                      ₹{Math.round(totalEstimatedCost).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onSelectProject(p)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Open Estimate & BOQ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteProject(p.id)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
