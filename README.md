# react-leaflet-choropleth
This component extends geoJson from react-leaflet and will use chroma to set the color, using a property or function value.
This is highly based on [leaflet-choropleth](https://github.com/timwis/leaflet-choropleth) by timwis.
## Installation

`npm install LiveBy/react-leaflet-choropleth`

## Example
```js 
import Choropleth from 'react-leaflet-choropleth'
import { Map } from 'react-leaflet'

const style = {
    fillColor: '#F28F3B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
}

const map = (geojson) => (
  <Map>
    <Choropleth
      data={{type: 'FeatureCollection', features: geojson}}
      valueProperty={(feature) => feature.properties.value}
      visible={(feature) => feature.id !== active.id}
      scale={['#b3cde0', '#011f4b']}
      steps={7}
      mode='e'
      style={style}
      onEachFeature={(feature, layer) => layer.bindPopup(feature.properties.label)}
    />
  </Map>
)
```
