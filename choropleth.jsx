import { GeoJson } from 'react-leaflet'
import chroma from 'chroma-js'
import React from 'react'

export default (props) => {
  const features = Array.isArray(props.data) ? props.data : props.data.features
  const chroms = getColors(props)
  return (
    <div>
      {features.map( (feature, idx) =>
        (<GeoJson
          key={idx}
          {...props}
          style={getStyle(props, chroms, feature)}
          {...getStyle(props, chroms, feature)}
          data={feature}
        />)
      ) }
      </div>
  )
}




function isFunction (prop) {
  return typeof prop === 'function'
}

function getColors({
  data,
  valueProperty,
  mode,
  steps,
  scale,
  colors: cl
}){

  const colors = {}
  const features = Array.isArray(data) ? data : data.features

  const values = features.map(item => isFunction(valueProperty)
    ? valueProperty(item)
    : item.properties[valueProperty])

  colors.limits = chroma.limits(values, mode, steps - 1)
  colors.colors = cl || chroma.scale(scale).colors(steps)
  return colors
}

function getStyle ({
  valueProperty,
  visible,
  style: userStyle
},{
  limits,
  colors
}, feature) {
  if( !(( isFunction(visible) && visible(feature) ) || feature.properties[visible] ) ) return userStyle

  const featureValue = isFunction(valueProperty)
    ? valueProperty(feature)
    : feature.properties[valueProperty]

  const idx = (!isNaN(featureValue))
    ? limits.findIndex(lim => featureValue <= lim)
    : -1

  if(colors[idx]){
    const style = {
      fillColor: colors[idx]
    }

    switch (typeof userStyle) {
      case 'function':
        return Object.assign(userStyle(feature), style)
      case 'object':
        return Object.assign({}, userStyle, style)
      default:
        return style
    }

  } else {
    return userStyle
  }

}