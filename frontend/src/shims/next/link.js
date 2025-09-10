import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

export default function Link(props) {
	const { href, prefetch, children, ...rest } = props
	// Support both string and object hrefs
	const to = typeof href === 'string' ? href : href?.pathname || '/'
	return (
		<RouterLink to={to} {...rest}>
			{children}
		</RouterLink>
	)
}
