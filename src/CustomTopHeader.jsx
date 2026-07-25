/**
 * Starter CustomTopHeader — published via `php artisan vendor:publish --tag=mehr-panel-customize`
 * Destination: resources/admin/src/dynamic-layouts/CustomTopHeader.jsx
 * (Import path is relative to that destination, not this package file.)
 */
import React from "react";
import DefaultTopHeader from "../blocks/DefaultTopHeader";

function CustomTopHeader(props) {
  return (
    <div className="custom-top-header">
      <DefaultTopHeader {...props} />
    </div>
  );
}

export default CustomTopHeader;
