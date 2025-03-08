import React from "react";

const MapEmbed = () => {
  return (
    <div className="glass rounded-2xl overflow-hidden flex-grow">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3388.5917552624046!2d76.89068887541792!3d29.305931275303774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390dc3b5533b6d9f%3A0x1b563db61bcc0195!2sGEETA%20UNIVERSITY%2C%20NAULTHA%2C%20PANIPAT!5e1!3m2!1sen!2sin!4v1741448209609!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: "300px" }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Event Location"
      />
    </div>
  );
};

export default MapEmbed;
