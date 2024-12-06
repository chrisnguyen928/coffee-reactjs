import React from 'react'
import ReactDom from 'react-dom'

export default function Modal(props) {
    // Authentication window rendered within modal
    // to render out modal, go to index.html and add div under root div that has id=portal

    const {children, handleCloseModal} = props

    return ReactDom.createPortal(
        <div className="modal-container">
            {/* modal-underlay is backdrop behind the authentication window */}
            <button onClick={handleCloseModal} className="modal-underlay" />
            <div className="modal-content">
                {children}
            </div>
        </div>,

        // write this line of code to in order to use modal
        document.getElementById('portal')
    )
}
