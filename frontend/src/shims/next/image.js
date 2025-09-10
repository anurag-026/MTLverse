import React from 'react'

export default function Image({ src, alt, width, height, className, style, priority, ...rest }) {
	const mergedStyle = { width, height, ...style }
	return <img src={src} alt={alt} className={className} style={mergedStyle} loading={priority ? 'eager' : rest.loading} {...rest} />
}
