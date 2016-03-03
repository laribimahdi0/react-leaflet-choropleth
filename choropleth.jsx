import { GeoJson } from 'react-leaflet'
import chroma from 'chroma-js'
import React from 'react'

const style = ({
  valueProperty,
  style: userStyle,
  data,
  colors,
  scale,
  mode,
  steps
}) => {
  return feature => {

    const values = data.features.map(item => (typeof valueProperty === 'function')
      ? valueProperty(item)
      : item.properties[valueProperty])

    const limits = chroma.limits(values, mode, steps - 1)
    const colors = colors || chroma.scale(scale).colors(steps)

    const featureValue = (typeof valueProperty === 'function')
      ? valueProperty(feature)
      : feature.properties[valueProperty]
    
    const idx = (!isNaN(featureValue)) 
      ? limits.findIndex(lim => featureValue <= lim) 
      : -1
    
    const style = {
      fillColor: colors[idx] || 0
    }
    switch (typeof userStyle) {
      case 'function':
        return Object.assign(userStyle(), style)
      case 'object':
        return Object.assign({}, userStyle, style)
      default:
        return style
    }
  }
}

export default (props) => {
  props = Object.assign({}, props, {style: style(props)})
  return ( <GeoJson {...props} /> )
}