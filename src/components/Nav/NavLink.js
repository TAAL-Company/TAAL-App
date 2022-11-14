import React from 'react';
import { Link } from "@reach/router";
import './Navbar.css'

/**
 * Reach Routers gives us access to a function called getProps.
 * Whatever is returned by getProps(), in this case style,
 * will be applied to the Link attribute as props.
 * So here {...props} will be replaced by style: {}
 *
 * @param props
 * @return {*}
 * @constructor
 */
const NavLink = props => (
	<Link
		{...props}
		state={{ origin: props.origin }}
		getProps={({ isCurrent }) => ({ style: { color: isCurrent ? 'rgba(129,129,129,0.51)' : '#0a0a0a' } })}
		className="nav-link linker"
	/>
);

export default NavLink;
