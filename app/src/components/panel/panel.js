import React, { useState } from "react";
import { ToastContainer } from 'react-toastify';
import Modal from '../modal/modal.js'
import PageList from "../pageList/pageList.js";
import BackupsList from "../backupsList/backupsList.js";
import EditorMeta from "../editorMeta/editorMeta.js";

const Panel = ({initPages, onSubmitChanges, logout, backupsList, restoreBackup, virtualDom}) => {
    const [showConfirmModal , setShowConfirmModal] = useState(false);
    const [showChooseModal , setShowChooseModal] = useState(false);
    const [showBackupModal , setShowBackupModal] = useState(false);
    const [showMetaModal , setShowMetaModal] = useState(false);
    const [showLogOutModal , setShowLogOutModal] = useState(false);

    return (
        <>
            <div className="panel">
                    <button className="uk-button uk-button-primary uk-margin-small-right" 
                    onClick={() => setShowChooseModal(true)}>Открыть</button>
                    <button className='uk-button uk-button-primary uk-margin-small-right' 
                    onClick={() => setShowConfirmModal(true)}>Сохранить</button>
                    <button className='uk-button uk-button-primary uk-margin-small-right' 
                    onClick={() => setShowMetaModal(true)}>Редактировать МЕТА</button>
                    <button className='uk-button uk-button-default uk-margin-small-right' 
                    onClick={() => setShowBackupModal(true)}>Восстановить</button>
                    <button className='uk-button uk-button-danger' 
                    onClick={() => setShowLogOutModal(true)}>Выход</button>
                    <ToastContainer />
            </div>

            {virtualDom ? <EditorMeta 
                onClose={() => setShowMetaModal(false)} 
                show={showMetaModal} 
                virtualDom={virtualDom}
                onSave={onSubmitChanges}/> : null}

            <Modal 
                title="Подтверждение" 
                submit 
                onClose={() => setShowConfirmModal(false)} 
                show={showConfirmModal} 
                onSubmit={onSubmitChanges}>
                <p>Вы действительно хотите сохранить изменения?</p>
            </Modal>

            <Modal 
                title="Открыть другую страницу" 
                choose 
                onClose={() => setShowChooseModal(false)} 
                show={showChooseModal}>
                <ul className="uk-list uk-list-divider">
                    <PageList 
                        init={initPages} 
                        setShowChooseModal={(bool) => setShowChooseModal(bool)} />
                </ul>
            </Modal>

            <Modal 
                title="Восстановление" 
                backup 
                onClose={() => setShowBackupModal(false)} 
                show={showBackupModal} 
                onSubmit={onSubmitChanges}>
                {backupsList.length < 1 ? null : <p>Вы действительно хотите восстановить предыдущее сохранение?</p>}
                <BackupsList 
                    backupsList={backupsList} 
                    restoreBackup={restoreBackup} 
                    setShowBackupModal={(bool) => setShowBackupModal(bool)} />
            </Modal>

            <Modal 
                title="Подтверждение" 
                logout 
                onClose={() => setShowLogOutModal(false)} 
                show={showLogOutModal} 
                onSubmit={logout}>
                <p>Вы действительно хотите выйти из административной панели?</p>
            </Modal>
        </>
    )
};

export default Panel;