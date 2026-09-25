import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { GEO_NODES } from '../data/mockData';
import { GeoNode } from '../types/ohtli';
import {
  MapPin,
  Building,
  Mail,
  Users,
  CheckCircle2,
  Navigation,
  BookOpen,
  Search,
  Filter,
  ExternalLink,
  LocateFixed,
} from 'lucide-react';

export const GeoMapModule: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GeoNode>(GEO_NODES[0]);
  const [filterType, setFilterType] = useState<'TODOS' | 'CIEFD' | 'CINV'>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const filteredNodes = GEO_NODES.filter((node) => {
    const matchesType = filterType === 'TODOS' || node.type === filterType;
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.delegation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Leaflet map centered on Mexico
      const map = L.map(mapContainerRef.current, {
        center: [22.8, -100.0],
        zoom: 5,
        zoomControl: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | IMSS Ohtli 2.0',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    (Object.values(markersRef.current) as L.Marker[]).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Custom DivIcons for Nodes
    filteredNodes.forEach((node) => {
      const isSelected = selectedNode.id === node.id;
      
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${isSelected ? '#6B1D2F' : '#ffffff'};
            color: ${isSelected ? '#ffffff' : '#6B1D2F'};
            border: 2px solid ${isSelected ? '#C5A059' : '#6B1D2F'};
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 800;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            transform: translate(-50%, -100%);
          ">
            <span style="color: #C5A059;">●</span>
            <span>${node.type} ${node.city}</span>
          </div>
        `,
        iconSize: [110, 30],
        iconAnchor: [55, 30],
      });

      const marker = L.marker([node.lat, node.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 4px;">
          <div style="font-size: 10px; font-weight: 800; color: #6B1D2F; text-transform: uppercase;">
            ${node.type} • ${node.delegation}
          </div>
          <div style="font-size: 12px; font-weight: 800; color: #1c1917; margin-top: 2px;">
            ${node.name}
          </div>
          <div style="font-size: 11px; color: #555; margin-top: 4px;">
            ${node.city} • ${node.researchersCount} Investigadores
          </div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedNode(node);
      });

      markersRef.current[node.id] = marker;
    });

    // Invalidate map size to handle layout adjustments
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [filteredNodes, selectedNode.id]);

  // Pan to selected node when selectedNode changes
  const handleSelectNode = (node: GeoNode) => {
    setSelectedNode(node);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([node.lat, node.lng], 8, {
        duration: 1.2,
      });

      const marker = markersRef.current[node.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const handleResetMapView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.8, -100.0], 5, {
        duration: 1,
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Geo Header */}
      <div className="bg-[#FAF8F5] rounded-2xl p-5 md:p-6 border border-[#6B1D2F]/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#6B1D2F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                Geolocalización Redes IMSS
              </span>
              <span className="text-xs text-[#6B1D2F] font-bold">
                Red CIEFD (Formación Docente) y CINV (Investigación Médica)
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#6B1D2F]">
              Nodos y Centros de Investigación Nacionales IMSS
            </h1>
            <p className="text-xs text-[#1c1917]/80 mt-1 max-w-3xl">
              Localiza comités éticos, asesoría bioestadística y mentores investigadores en tu delegación o estado mediante nuestro mapa interactivo en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white p-1 rounded-xl border border-[#6B1D2F]/20 shadow-xs">
              <button
                onClick={() => setFilterType('TODOS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'TODOS' ? 'bg-[#6B1D2F] text-white' : 'text-[#1c1917]/70'
                }`}
              >
                Todos ({GEO_NODES.length})
              </button>
              <button
                onClick={() => setFilterType('CIEFD')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'CIEFD' ? 'bg-[#6B1D2F] text-white' : 'text-[#1c1917]/70'
                }`}
              >
                CIEFD (Docencia)
              </button>
              <button
                onClick={() => setFilterType('CINV')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === 'CINV' ? 'bg-[#6B1D2F] text-white' : 'text-[#1c1917]/70'
                }`}
              >
                CINV (Biomédica)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List & Filter */}
        <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#6B1D2F] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por ciudad o delegación (ej: Jalisco, CDMX, Mérida)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#6B1D2F]/20 bg-white text-xs outline-none focus:ring-2 focus:ring-[#6B1D2F]"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => handleSelectNode(node)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedNode.id === node.id
                    ? 'bg-[#6B1D2F] text-white border-[#6B1D2F] shadow-sm'
                    : 'bg-white border-[#6B1D2F]/15 hover:border-[#6B1D2F]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                  <span
                    className={`px-2 py-0.5 rounded ${
                      selectedNode.id === node.id
                        ? 'bg-white/20 text-white'
                        : 'bg-[#6B1D2F]/10 text-[#6B1D2F]'
                    }`}
                  >
                    {node.type} • {node.delegation}
                  </span>

                  <span
                    className={`text-[10px] font-semibold ${
                      selectedNode.id === node.id ? 'text-white/90' : 'text-[#1c1917]/70'
                    }`}
                  >
                    {node.city}
                  </span>
                </div>

                <h3
                  className={`font-bold text-xs ${
                    selectedNode.id === node.id ? 'text-white' : 'text-[#1c1917]'
                  }`}
                >
                  {node.name}
                </h3>
                
                <p
                  className={`text-[11px] truncate mt-1 ${
                    selectedNode.id === node.id ? 'text-white/80' : 'text-[#1c1917]/70'
                  }`}
                >
                  {node.researchersCount} Investigadores adscritos • {node.activeProtocolsCount} Protocolos
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Real Interactive Leaflet Map & Selected Node Card */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Interactive Leaflet OpenStreetMap View */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#6B1D2F]/15 pb-2">
              <h2 className="font-extrabold text-[#6B1D2F] text-sm flex items-center gap-1.5">
                <Navigation className="w-4 h-4" /> Cobertura Geográfica e Infraestructura IMSS
              </h2>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetMapView}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#6B1D2F] bg-[#6B1D2F]/10 hover:bg-[#6B1D2F] hover:text-white px-2.5 py-1 rounded-lg transition-colors"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Centrar México</span>
                </button>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  GPS Activo (OpenStreetMap)
                </span>
              </div>
            </div>

            {/* Map Canvas Container */}
            <div className="relative w-full h-[360px] rounded-xl border border-[#6B1D2F]/20 overflow-hidden shadow-inner z-0">
              <div ref={mapContainerRef} className="w-full h-full z-0" />
            </div>
          </div>

          {/* Selected Node Details Card */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#6B1D2F]/20 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#6B1D2F]/15 pb-3">
              <div>
                <span className="text-xs font-extrabold text-[#6B1D2F] bg-[#6B1D2F]/10 px-2.5 py-0.5 rounded">
                  {selectedNode.type} • {selectedNode.delegation}
                </span>
                <h3 className="text-lg font-bold text-[#1c1917] mt-1">
                  {selectedNode.name}
                </h3>
                <p className="text-xs text-[#1c1917]/70 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#6B1D2F]" /> {selectedNode.address}
                </p>
              </div>

              <a
                href={`mailto:${selectedNode.contactEmail}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#6B1D2F] text-white text-xs font-bold rounded-xl hover:bg-[#4A1320] transition-colors shadow-xs shrink-0"
              >
                <Mail className="w-4 h-4" />
                <span>Contactar Nodo</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#6B1D2F]/15 space-y-1">
                <span className="text-[#1c1917]/60 font-semibold block">Titular / Director del Nodo:</span>
                <strong className="text-[#6B1D2F] text-sm font-bold block">{selectedNode.directorName}</strong>
                <span className="text-[11px] text-[#1c1917]/70">{selectedNode.contactEmail}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#6B1D2F]/15 space-y-1">
                <span className="text-[#1c1917]/60 font-semibold block">Métricas de Actividad:</span>
                <div className="flex justify-between text-xs font-bold text-[#1c1917] pt-1">
                  <span>{selectedNode.researchersCount} Investigadores Titulares</span>
                  <span className="text-[#6B1D2F]">{selectedNode.activeProtocolsCount} Protocolos Activos</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-[#6B1D2F] uppercase tracking-wider">
                Servicios Ofrecidos a Médicos Residentes:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedNode.services.map((srv, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#6B1D2F]/10 text-xs font-semibold text-[#1c1917]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

