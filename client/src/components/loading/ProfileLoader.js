import ContentLoader from "react-content-loader"

export const ProfileLoader = props => (
	<ContentLoader 
		height={600}
		width={300}
		speed={2}
		primaryColor="#f3f3f3"
		secondaryColor="#ecebeb"
		{...props}
	>
		<rect x="89" y="31" rx="4" ry="4" width="117" height="6.4" /> 
		<rect x="89" y="51" rx="3" ry="3" width="85" height="6.4" /> 
		<rect x="19.55" y="100" rx="3" ry="3" width="199.5" height="6.4" /> 
		<rect x="19.55" y="120" rx="3" ry="3" width="216.6" height="6.4" /> 
		<rect x="19.55" y="140" rx="3" ry="3" width="114.57" height="6.4" /> 
		<circle cx="49" cy="46" r="30" /> 
		<rect x="299.58" y="301.67" rx="0" ry="0" width="0" height="0" /> 
		<rect x="19.55" y="158" rx="3" ry="3" width="199.5" height="6.4" /> 
		<rect x="18.55" y="175" rx="3" ry="3" width="199.5" height="6.4" /> 
		<rect x="19.55" y="197" rx="3" ry="3" width="199.5" height="6.4" /> 
		<rect x="21.55" y="216" rx="3" ry="3" width="114.57" height="6.4" />
	</ContentLoader>
)

export default ProfileLoader