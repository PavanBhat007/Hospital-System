import React from 'react';
import PropTypes from 'prop-types';

export default function Card(props) {
  return (
    <div className='card'>
        <img src={props.img_path} className='card-img' />
        <div className='card-body'>
            <h5 className="card-title">{props.title}</h5>
            <p className="card-text">{props.subtitle}</p>
            <a href={props.href}>Know more &#8599;</a>
        </div>
    </div>
  )
}

Card.propTypes = {
    img_path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
}