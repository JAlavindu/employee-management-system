import { Component, EventEmitter, Output, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-picker.component.html',
  styleUrl: './map-picker.component.css',
})
export class MapPickerComponent implements OnInit, OnDestroy {
  @Output() addressSelected = new EventEmitter<string>();
  

  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  private http = inject(HttpClient);
  isLoading = false;

  ngOnInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Default to a central location (e.g., Colombo, Sri Lanka) or user's location
    const defaultLat = 6.9271;
    const defaultLng = 79.8612;

    this.map = L.map('map').setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Fix for default marker icon issues in Webpack/Angular
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    L.Marker.prototype.options.icon = iconDefault;

    // Handle Map Click
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.handleMapClick(e.latlng.lat, e.latlng.lng);
    });
  }

  private handleMapClick(lat: number, lng: number) {
    // 1. Add/Move Marker
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map!);
    }

    // 2. Fetch Address (Reverse Geocoding)
    this.isLoading = true;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.display_name) {
          this.addressSelected.emit(res.display_name);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Geocoding error', err);
        this.addressSelected.emit(`${lat}, ${lng}`); // Fallback to coordinates
      },
    });
  }
}
