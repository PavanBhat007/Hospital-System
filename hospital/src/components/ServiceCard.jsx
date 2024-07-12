import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ServiceCard({ img_path, title, subtitle, link, bgc }) {
  return (
    <div className='service' style={{backgroundColor: bgc}}>
        <div className='service-name'>
            <img src={img_path} />
            <p>{title}</p>
        </div>
        <div className='service-desc'>
            {subtitle}
        </div>
        <div className='service-link'>
            <Link to={link}>&#8599;</Link>
        </div>
    </div>
  )
}

ServiceCard.propTypes = {
    img_path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
}