import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

function MyMapComponent() {
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [postcode, setPostcode] = useState("SO17 1BJ"); // 初始 postcode
  const mapRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCuH2C8Z1kqBW9-kj916mtxFTDh6MWPEXg" // 替换为你的 Google Maps API 密钥
  });

  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  const fetchPharmacies = () => {
    if (postcode.length > 0) {
      fetch(`http://10.14.149.222:8000/nearest-pharmacies/?postcode=${postcode}`)
        .then(response => response.json())
        .then(data => {
          setPharmacies(data);
          if (data.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            data.forEach(pharmacy => {
              bounds.extend(new window.google.maps.LatLng(pharmacy.latitude, pharmacy.longitude));
            });
            mapRef.current.fitBounds(bounds);
          }
        })
        .catch(error => console.log(error));
    }
  };

  // 使用 useEffect 钩子在组件首次渲染时触发一次搜索
  useEffect(() => {
    fetchPharmacies();
  }, []);

  return (
    <div>
      <input
        type="text"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value.replace(/\s+/g, ''))}
        placeholder="Enter postcode"
        style={{ margin: '10px 0' }}
      />
      <button onClick={fetchPharmacies} style={{ margin: '10px' }}>Search</button>
      {isLoaded ? (
          <>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapRef.current ? mapRef.current.getCenter().toJSON() : null}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
              {pharmacies.map(pharmacy => (
                  <Marker
                      key={pharmacy.name}
                      position={{lat: pharmacy.latitude, lng: pharmacy.longitude}}
                      onClick={() => setSelectedPharmacy(pharmacy)}
                  />
              ))}

              {selectedPharmacy && (
                  <InfoWindow
                      position={{lat: selectedPharmacy.latitude, lng: selectedPharmacy.longitude}}
                      onCloseClick={() => setSelectedPharmacy(null)}
                  >
                    <div>
                      <h2>{selectedPharmacy.name}</h2>
                      <p>Distance: {selectedPharmacy.distance}</p>
                      <p>PostCode: {selectedPharmacy.postcode}</p>
                    </div>
                  </InfoWindow>
              )}
            </GoogleMap>
            <div style={{marginTop: '20px'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                <tr style={{backgroundColor: '#f2f2f2', textAlign: 'left'}}>
                  <th style={{padding: '8px', textAlign: 'left'}}>Name</th>
                  <th style={{padding: '8px', textAlign: 'left'}}>PostCode</th>
                  <th style={{padding: '8px', textAlign: 'left'}}>Distance</th>
                </tr>
                </thead>
                <tbody>
                {pharmacies.map((pharmacy, index) => (
                    <tr key={index} style={{borderBottom: '1px solid #ddd'}}>
                      <td style={{padding: '8px', textAlign: 'left'}}>{pharmacy.name}</td>
                      <td style={{padding: '8px', textAlign: 'left'}}>{pharmacy.postcode}</td>
                      <td style={{padding: '8px', textAlign: 'left'}}>{pharmacy.distance}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </>
      ) : <></>}
    </div>
  );
}

export default MyMapComponent;
