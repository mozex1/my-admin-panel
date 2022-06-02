import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

const Modal = ({onClose, onSubmit, title, submit, backup, logout, show, children}) => {
	const closeOnEscapeKeyDown = e => {
		if ((e.charCode || e.keyCode) === 27) {
			onClose();
		}
	};

	useEffect(() => {
		document.body.addEventListener("keydown", closeOnEscapeKeyDown);
		return function cleanup() {
		document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
		};
	}, []);

	const submitChanges = () => {
		onClose();
		onSubmit();
	}

	// const backupBtn = backup ? <button onClick={submitChanges} className="button uk-button uk-button-primary uk-modal-close">
	// Восстановить
	// </button> : null 
	const submitBtn = submit ? <button onClick={submitChanges} className="button uk-button uk-button-primary uk-modal-close">
	Все равно сохранить
	</button> : null 
	const logoutBtn = logout ? <button onClick={submitChanges} className="button uk-button uk-button-primary uk-modal-close">
	Выйти
	</button> : null 

	return ReactDOM.createPortal(
		<CSSTransition
			in={show}
			unmountOnExit
			timeout={{ enter: 0, exit: 300 }}
		>
			<div className="modal" onClick={onClose}>
				<div className="modal-content" onClick={e => e.stopPropagation()}>
					<div className="modal-header">
						<h5 className="modal-title">{title}</h5>
					</div>
					<div className="modal-body">{children}</div>
					<div className="modal-footer">
						<button onClick={onClose} className="button uk-button uk-button-default uk-margin-small-right uk-modal-close">
						Отмена
						</button>
						{submitBtn}
						{logoutBtn}
					</div>
				</div>
			</div>
		</CSSTransition>,
		document.getElementById("root")
	);
};

export default Modal;
