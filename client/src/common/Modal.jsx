import React from 'react';
import styles from './Modal.module.css';

const Modal = ({active, setActive, children}) => {

    return (
      <div className={active ? `${styles.modal} ${styles.mActive}` : styles.modal} onClick={() => setActive(false)}>
          <div className={active ? `${styles.modalContent} ${styles.mcActive}` : styles.modalContent} onClick={e => e.stopPropagation()}>
            {children}
          </div>
      </div>
    )
  }

export default Modal