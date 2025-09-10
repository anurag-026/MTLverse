import { useNavigate, useParams as useRRParams, useLocation } from 'react-router-dom'

export function useRouter() {
	const navigate = useNavigate()
	const location = useLocation()
	return {
		push: (to) => navigate(to),
		prefetch: () => {},
		back: () => navigate(-1),
		replace: (to) => navigate(to, { replace: true }),
		pathname: location.pathname,
	}
}

export function useParams() {
	return useRRParams()
}
