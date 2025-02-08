
// desktop code that need to be altered

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents,Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { firestore } from "../../firebase/config";
import { Dialog } from "@headlessui/react";
import L from 'leaflet';


// Fix for default Leaflet markers
const DefaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};


const AutoFitMap = ({ incidents }) => {
  const map = useMap()

  useEffect(() => {
    if (incidents.length > 0) {
      const validMarkers = incidents.filter(incident => 
        incident.location?.latitude && incident.location?.longitude
      )
      
      if (validMarkers.length > 0) {
        const bounds = L.latLngBounds(
          validMarkers.map(incident => [
            incident.location.latitude,
            incident.location.longitude
          ])
        )
        map.flyToBounds(bounds, {
          padding: [50, 50],
          animate: true
        })
      }
    }
  }, [incidents, map])

  return null
}

const Dashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Form states
  const [incidentType, setIncidentType] = useState("sighting");
  const [description, setDescription] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(firestore, "incidents"));
      const incidentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIncidents(incidentsData);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const deleteIncident = async () => {
    try {
      await deleteDoc(doc(firestore, "incidents", deleteId));
      setIncidents(incidents.filter((incident) => incident.id !== deleteId));
    } catch (error) {
      console.error("Error deleting incident:", error);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mapCenter] = useState([51.505, -0.09]); // Initial map center

  const handleSubmitReport = async () => {
    if (!description.trim() || !latitude || !longitude) {
      alert("Please fill all fields and select a location!");
      return;
    }

    const incidentTimestamp = Timestamp.fromDate(selectedDate);

    try {
      await addDoc(collection(firestore, "incidents"), {
        incidentType,
        description,
        location: { 
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        incidentTime: incidentTimestamp,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // Reset form
      setShowForm(false);
      setDescription("");
      setLatitude("");
      setLongitude("");
      setSelectedDate(new Date());
      fetchIncidents();
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="bg-linear-to-r from-white to-emerald-300 p-6 h-full">
      <h2 className="text-2xl font-bold text-emerald-600 text-center mb-4">Admin Dashboard</h2>

      <div className="flex h-full">

        {/* Left Sidebar */}
        <div className="w-1/4 p-4 h-screen bg-emerald-50/10 shadow-md rounded-lg">
          <h2 className="text-xl font-bold mb-4">Overall Statistics</h2>

          <div className="p-4 bg-emerald-200 rounded-lg mb-4 text-center">
            <p className="text-lg font-semibold">Registered Users</p>
            <p className="text-2xl">--</p>
          </div>

          <div className="p-4 bg-emerald-200 rounded-lg mb-4 text-center">
            <p className="text-lg font-semibold">Total Incidents</p>
            <p className="text-2xl">{incidents.length}</p>
          </div>

          <div className="p-4 bg-emerald-200 rounded-lg mb-4 text-center">
            <p className="text-lg font-semibold">Total Resources</p>
            <p className="text-2xl">--</p>
          </div>
        </div>

        {/* center Panel */}
        <div className="w-1/2 p-4 bg-white/10 shadow-md ml-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Reported Incidents</h2>

          {loading ? (
            <p>Loading incidents...</p>
          ) : (
            <ul className="space-y-4">
              {incidents.map((incident) => (
                <li key={incident.id} className="p-4 bg-emerald-50 shadow-md rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{incident.incidentType}</p>
                    <p className="text-gray-600 text-sm">{incident.description.substring(0, 50)}...</p>
                  </div>
                  <button onClick={() => confirmDelete(incident.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          <button onClick={() => setShowForm(!showForm)} className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg">
            + Report New Incident
          </button>


          {showForm && (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg space-y-4">
      <select
        value={incidentType}
        onChange={(e) => setIncidentType(e.target.value)}
        className="block w-full p-2 border rounded"
      >
        <option value="sighting">Sighting</option>
        <option value="accident">Accident</option>
        <option value="other">Other</option>
      </select>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full p-2 border rounded"
        placeholder="Description"
        rows="3"
      ></textarea>

      <div className="h-64 rounded-lg overflow-hidden">
        <MapContainer
      center={[6.719551, 80.785860]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler
            onMapClick={({ lat, lng }) => {
              setLatitude(lat.toFixed(6));
              setLongitude(lng.toFixed(6));
            }}
          />
          {latitude && longitude && (
            <Marker
              position={[parseFloat(latitude), parseFloat(longitude)]}
              icon={DefaultIcon}
            />
          )}
        </MapContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Selected Latitude</label>
          <input
            type="text"
            value={latitude}
            readOnly
            className="w-full p-2 border rounded bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Selected Longitude</label>
          <input
            type="text"
            value={longitude}
            readOnly
            className="w-full p-2 border rounded bg-gray-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Incident Date & Time</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleSubmitReport}
        className="mt-2 bg-emerald-600 text-white py-2 px-4 rounded w-full"
      >
        Submit Report
      </button>
    </div>
  )}
</div>


{/* Right panel - Map View */}
<div className="w-1/4 h-96 p-4 bg-white/10 shadow-md ml-4 rounded-lg">
  <h2 className="text-xl font-bold mb-4">Incident Map</h2>
  <div className="h-full rounded-lg overflow-hidden">
    <MapContainer
      center={[6.719551, 80.785860]}
      zoom={13}
      style={{ height: '80%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <AutoFitMap incidents={incidents} />
      
      {incidents.map((incident) => {
        if (!incident.location?.latitude || !incident.location?.longitude) {
          console.log('Invalid location for incident:', incident.id)
          return null
        }

        return (
          <Marker
            key={incident.id}
            position={[
              incident.location.latitude,
              incident.location.longitude
            ]}
            icon={DefaultIcon}
          >
            <Popup>
              <div className="space-y-1">
                <h3 className="font-semibold">{incident.incidentType}</h3>
                <p className="text-sm">{incident.description.substring(0, 50)}...</p>
                <p className="text-xs text-gray-500">
                  {incident.incidentTime?.toDate?.()?.toLocaleString() || 'Unknown time'}
                </p>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  </div>
</div>
</div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="mb-4">Are you sure you want to delete this incident?</p>
              <button onClick={deleteIncident} className="bg-red-500 text-white px-4 py-2 rounded-lg">Yes, Delete</button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
