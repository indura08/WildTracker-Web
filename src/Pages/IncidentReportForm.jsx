import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import L from "leaflet";

// Fix missing marker icons issue in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const IncidentReportForm = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [incidentDate, setIncidentDate] = useState(new Date());
  const [description, setDescription] = useState("");

  // Function to handle map click
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setSelectedPosition(e.latlng);
      },
    });

    return selectedPosition ? (
      <Marker position={selectedPosition} icon={customIcon} />
    ) : null;
  }

  const handleSubmit = () => {
    if (!selectedPosition) {
      alert("Please select a location on the map.");
      return;
    }
    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    const incidentData = {
      location: {
        latitude: selectedPosition.lat,
        longitude: selectedPosition.lng,
      },
      incidentTime: incidentDate.toISOString(),
      description,
    };

    console.log("Incident Reported:", incidentData);
    alert("Incident reported successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Report New Incident</h2>

      {/* Map Section */}
      <div className="h-80 mb-4">
        <MapContainer
          center={[7.8731, 80.7718]} // Default location (Sri Lanka)
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>

      {/* Selected Location Display */}
      {selectedPosition && (
        <div className="mb-4">
          <p className="text-gray-700">
            Selected Location: 
            <span className="font-semibold">
              {selectedPosition.lat.toFixed(5)}, {selectedPosition.lng.toFixed(5)}
            </span>
          </p>
        </div>
      )}

      {/* Date & Time Picker */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Incident Date & Time</label>
        <DatePicker
          selected={incidentDate}
          onChange={(date) => setIncidentDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>

      {/* Description Input */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Description</label>
        <textarea
          className="border border-gray-300 p-2 rounded w-full h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident..."
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Report
      </button>
    </div>
  );
};

export default IncidentReportForm;
