import React from "react";

const BackupsList = ({backupsList, restoreBackup, setShowBackupModal}) => {
    const backups = backupsList.map(item => {
        return (
            <li  key={item.file}>
                <a 
                onClick={(e) => {
                    restoreBackup(e, item.file);
                    setShowBackupModal(false);
                }}
                className="uk-link-muted" 
                href='#'>Резервная копия от: {item.time}</a>
            </li>
        )
    });

    return (
        <>
            {backupsList.length < 1 ? <div>Резервные копии не найдены</div> : backups}
        </>
    )
}

export default BackupsList;