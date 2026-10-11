import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Livraria } from '../lib/supabase';

export type LivrariasMapHandle = {
  focus: (id: Livraria['id']) => boolean;
};

type LivrariasMapProps = {
  livrarias: Livraria[];
};

const CENTRO_SP: L.LatLngExpression = [-23.555, -46.66];

const casinha = L.divIcon({
  className: '',
  html: `<div style="width:30px;height:30px;border-radius:9px;background:#1D1D1F;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.25);border:2px solid #fff">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>
    </svg>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -16],
});

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function popupHtml(grupo: Livraria[]) {
  return grupo
    .map((l) => {
      const handle = l.instagram ? l.instagram.replace(/^@/, '') : null;
      return `<div class="prelo-pop">
        <p class="prelo-pop-nome">${escape(l.nome)}</p>
        ${l.endereco ? `<p class="prelo-pop-end">${escape(l.endereco)}</p>` : ''}
        ${handle ? `<a class="prelo-pop-ig" href="https://www.instagram.com/${encodeURIComponent(handle)}" target="_blank" rel="noopener noreferrer">${escape(handle)}</a>` : ''}
      </div>`;
    })
    .join('');
}

// Livrarias no mesmo endereço (ex.: duas lojas na mesma galeria) viram um
// marcador só, com todas no balão.
function agrupar(livrarias: Livraria[]) {
  const grupos = new Map<string, Livraria[]>();
  for (const l of livrarias) {
    if (l.lat == null || l.lng == null) continue;
    const key = `${l.lat.toFixed(4)},${l.lng.toFixed(4)}`;
    grupos.set(key, [...(grupos.get(key) ?? []), l]);
  }
  return [...grupos.values()];
}

const LivrariasMap = forwardRef<LivrariasMapHandle, LivrariasMapProps>(function LivrariasMap({ livrarias }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef(new Map<Livraria['id'], L.Marker>());

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: CENTRO_SP,
      zoom: 12,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: true,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    // Ruas do OpenStreetMap (gratuito, sem chave). O cinza vem do CSS em
    // index.css (.prelo-tiles), para combinar com o visual do site.
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'prelo-tiles',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const grupos = agrupar(livrarias);
    for (const grupo of grupos) {
      const marker = L.marker([grupo[0].lat!, grupo[0].lng!], { icon: casinha, title: grupo.map((l) => l.nome).join(', ') })
        .bindPopup(popupHtml(grupo), { closeButton: false, maxWidth: 260 })
        .addTo(map);
      grupo.forEach((l) => markersRef.current.set(l.id, marker));
    }
    if (grupos.length > 0) {
      const bounds = L.latLngBounds(grupos.map((g) => [g[0].lat!, g[0].lng!] as L.LatLngTuple));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [livrarias]);

  useImperativeHandle(ref, () => ({
    focus(id) {
      const marker = markersRef.current.get(id);
      const map = mapRef.current;
      if (!marker || !map) return false;
      map.flyTo(marker.getLatLng(), 16, { duration: 0.8 });
      marker.openPopup();
      return true;
    },
  }));

  return (
    <div
      ref={containerRef}
      className="relative z-0 h-[360px] md:h-[520px] w-full rounded-2xl overflow-hidden bg-fill"
      role="region"
      aria-label="Mapa das livrarias"
    />
  );
});

export default LivrariasMap;
