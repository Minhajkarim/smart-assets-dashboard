import React from "react";

const LiveMap = () => {
  return (
    <div className="flex justify-center items-center">
      <iframe
        title="Live Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345091847!2d144.9537363153166!3d-37.81720997975188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0727c5d3cd37894!2sFederation+Square!5e0!3m2!1sen!2sau!4v1532583959913"
        width="100%"
        height="400"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default LiveMap;
