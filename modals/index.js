import React, { useState } from "react";

const ModalBackground = ({ children, onClick }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "1",
        width: "100%",
        height: "100%",
        overflow: "auto",
        background: "rgba(0,0,0,0.5)",
        transition: "ease-in-out background .3s",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const ModalBody = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        margin: "10% 0 0 28%",
        padding: "20px",
        width: "50%",
        borderRadius: "10px",
      }}
      className="alert alert-danger bg-danger text-light"
    >
      {children}
    </div>
  );
};

export const Modal = ({ children, modalState, modalIsFalse }) => {
  const [showModal, setShowModal] = useState(true);
  const SetModalFalse = () => setShowModal(modalIsFalse);
  return (
    <>
      {showModal && (
        <>
          <ModalBackground onClick={SetModalFalse}>
            <ModalBody onClick={(e) => e.stopPropagation()}>
              <i
                style={{ color: "red", float: "right" }}
                onClick={() => setShowModal(modalState)}
                className="fa fa-close-o"
              ></i>
              {children}
            </ModalBody>
          </ModalBackground>
        </>
      )}
    </>
  );
};
