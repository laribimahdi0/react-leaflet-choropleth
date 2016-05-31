import { GeoJson } from 'react-leaflet'
import chroma from 'chroma-js'
import React, { cloneElement, Children } from 'react'
import assign from './assign'
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
          children={props.children ? cloneChildrenWithFeature(props, feature) : props.children}
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
  visible = visible || (() => true) //If visible was not given, always return true
  if( !(( isFunction(visible) && visible(feature) ) || feature.properties[visible]) ) return userStyle

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
        return assign(userStyle(feature), style)
      case 'object':
        return assign({}, userStyle, style)
      default:
        return style
    }

  } else {
    return userStyle
  }

}

function cloneChildrenWithFeature(props, feature){
  const newProps = assign({}, props, { feature })
  return ChildNode.map(props.children, child => {
    return child ? cloneElement(child, newProps) : null
  })
}