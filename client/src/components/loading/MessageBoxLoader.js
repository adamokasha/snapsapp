import ContentLoader from "react-content-loader"

export const MessageBoxLoader = props => (
  <ContentLoader 
    height={300}
    width={500}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <circle cx="89.51" cy="107.96" r="10.96" /> 
    <rect x="110.03" y="101.11" rx="5" ry="5" width="301.4" height="13.7" /> 
    <circle cx="89.51" cy="149.03" r="10.96" /> 
    <rect x="110.03" y="142.18" rx="5" ry="5" width="301.4" height="13.7" /> 
    <circle cx="89.51" cy="190.1" r="10.96" /> 
    <rect x="110.03" y="183.25" rx="5" ry="5" width="301.4" height="13.7" /> 
    <circle cx="89.51" cy="231.17" r="10.96" /> 
    <rect x="110.03" y="224.32" rx="5" ry="5" width="301.4" height="13.7" /> 
    <rect x="67.63" y="39.67" rx="0" ry="0" width="362" height="8" /> 
    <rect x="422.58" y="40.67" rx="0" ry="0" width="6.93" height="241.56" /> 
    <rect x="63.63" y="272.67" rx="0" ry="0" width="362" height="8" /> 
    <rect x="61.58" y="40.67" rx="0" ry="0" width="6.93" height="241.56" /> 
    <rect x="61.63" y="74.67" rx="0" ry="0" width="362" height="8" />
  </ContentLoader>
)

export default MessageBoxLoader;