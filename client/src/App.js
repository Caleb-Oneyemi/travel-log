import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEnteries } from './api';
import EntryForm from './entryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setPopup] = useState({});
  const [newLocation, setNewLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 6.6111,
    longitude: 20.9394,
    zoom: 3
  });

  const getEntries = async () => {
    const data = await listLogEnteries();
    setLogEntries(data);
  }

  useEffect(() => {
    getEntries();
  }, [])
  
  const showAddMarkerPopup = (event) => {
    const [ longitude, latitude ] = event.lngLat;
    setNewLocation({
      latitude,
      longitude
    })
  }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay'
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >

      {
        logEntries.map(entry => (
          <React.Fragment key={entry._id}>
            <Marker
              latitude={entry.latitude}
              longitude={entry.longitude}
              >
              <div
                onClick={() => setPopup({
                  showPopup,
                  [entry._id]: true,
                })}
              >
              <img
                src='https://i.imgur.com/y0G5YTX.png'
                alt='marker'
                className='marker'
                style={{
                  height: `${12 * viewport.zoom}px`,
                  width: `${12 * viewport.zoom}px`
                }}
              />
            </div>
          </Marker>
          {
            showPopup[entry._id]?(
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={true}
                closeOnClick={false}
                dynamicPosition={true}
                onClose={() => setPopup({ showPopup, [entry._id]: false })}
                anchor="top" >
                  <div className='popup'> 
                    <h3>{entry.location}</h3>
                    <p>{entry.comments}</p>
                    <small> 
                      {`visited on: ${new Date(entry.visitDate).toLocaleDateString()}`}
                    </small>
                    {entry.image && <img src={entry.image} alt={entry.title}/>}
                  </div>
            </Popup>
            ) : null
            
          }
            
          </React.Fragment>
        ))
      }
      {
        newLocation ? (
          <>
            <Marker
              key={newLocation._id}
              latitude={newLocation.latitude}
              longitude={newLocation.longitude}
              >
              <div>
              <img
                src='https://i.imgur.com/y0G5YTX.png'
                alt='marker'
                className='marker'
                style={{
                  height: `${12 * viewport.zoom}px`,
                  width: `${12 * viewport.zoom}px`
                }}
              />
            </div>
            </Marker>

            <Popup
              latitude={newLocation.latitude}
              longitude={newLocation.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => setNewLocation(null)}
              anchor="top"
            >
              
              <div className='popup'> 
                <EntryForm onClose={() => {
                  setNewLocation(null);
                  getEntries();
                }} location={newLocation} /> 
              </div>
            </Popup>
          </>
        ): null
      }
    </ReactMapGL>
  );
}

export default App;