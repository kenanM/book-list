/* The Alert component renders a Bootstrap alert dialog box. It can be used to display information, warning and errors. */

import React from 'react';


export function Alert(props) {
  if (!props.message) {
    // If there is no message there should be no alert
    return null
  }
  return (
    <div className={"alert alert-" + (props.type || 'primary')} role="alert">
      {props.message}
    </div>
  )
}
