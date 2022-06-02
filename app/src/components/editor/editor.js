import "../../helpers/iframeLoader.js";
import axios from 'axios';
import React, { Component } from 'react';
import DOMHelper from "../../helpers/domHelper.js";
import EditorText from "../editorText/editorText.js";
import EditorImages from "../editorImages/editorImages.js";
import Panel from "../panel/panel.js";
import Login from "../login/login.js";
import Spinner from "../spinner/spinner.js";
import { toast } from 'react-toastify';

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = "index.html";
        this.state = {
            backupsList: [],
            newPageName: "",
            loading: true,
            auth: false,
            loginError: false,
            loginLengthError: false
        }
        this.inputImg = React.createRef();;
        this.isLoading = this.isLoading.bind(this);
        this.isLoaded = this.isLoaded.bind(this);
        this.save = this.save.bind(this);
        this.init = this.init.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.restoreBackup = this.restoreBackup.bind(this);
    };
    

    componentDidMount() {
        this.checkAuth();      
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.auth !== prevState.auth) {
            this.init(null, this.currentPage);
        }
    }

    checkAuth() {
        axios.get('./api/checkAuth.php')
             .then( res => {
                 this.setState({auth: res.data.auth})
             })
    }

    login(pass) {
        if (pass.length > 5) {
            axios
                .post('./api/login.php', {'password': pass})
                .then(res => {
                    this.setState({
                        auth: res.data.auth,
                        loginError: !res.data.auth,
                        loginLengthError: false
                    });
                })
        } else {
            this.setState({
                loginError: false,
                loginLengthError: true
            })
        }
    }

    logout () {
        axios
            .get('./api/logout.php')
            .then(() => {
                window.location.replace('/');
            })
    }

    init = (e, page) => {
        if (e) {
            e.preventDefault();
        }

        if (this.state.auth) {
            this.isLoading();
            this.iframe = document.querySelector('iframe');
            this.open(page);
            this.loadBackupsList();
        }
    };

    async open(page) {
        this.currentPage = page;

        axios
            .get(`../${page}?rnd=${Math.random()}`)
            .then(res => DOMHelper.parseStrToDOM(res.data))
            .then(DOMHelper.wrapTextNodes)
            .then(DOMHelper.wrapImages)
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DOMHelper.serializeDOMToString)
            .then(html => axios.post("./api/saveTempPage.php", {html}))
            .then(() => this.iframe.load("../rnd543rnd0394.html"))
            .then(() => axios.post('./api/deleteTempPage.php'))
            .then(() => this.enableEditing())
            .then(() => this.injectStyles())
            .then(this.isLoaded);

            this.loadBackupsList();
    };

    async save () {
        this.isLoading();
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        DOMHelper.unwrapImages(newDom);
        const html = DOMHelper.serializeDOMToString(newDom);
        console.log('Save done!');
        await axios
            .post("./api/savePage.php", {pageName: this.currentPage, html})
            .then(() => toast.success("Изменения успешно сохранены!"))
            .catch(() => toast.error("Произошла ошибка при сохранении"))
            .finally(this.isLoaded)
            
        this.loadBackupsList();
    };

    enableEditing() {
        this.iframe.contentDocument.body.querySelectorAll("text-editor").forEach(element => {
            const id = element.getAttribute("nodeid");
            const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`);

            new EditorText(element, virtualElement);
        });

        this.iframe.contentDocument.body.querySelectorAll("[editableimgid]").forEach(element => {
            const id = element.getAttribute("editableimgid");
            const virtualElement = this.virtualDom.body.querySelector(`[editableimgid="${id}"]`);

            new EditorImages(element, virtualElement, this.inputImg.current, this.isLoading,  this.isLoaded)
        });
    };

    injectStyles() {
        const style = this.iframe.contentDocument.createElement("style");
        style.innerHTML = `
            text-editor:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
            text-editor:focus {
                outline: 3px solid red;
                outline-offset: 8px;
            }
            [editableimgid]:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
        `;
        this.iframe.contentDocument.head.appendChild(style);
    };

    loadBackupsList() {
        axios
            .get("./backups/backups.json")
            .then(res => this.setState({backupsList: res.data.filter(backup => {
                return backup.page === this.currentPage;
            })
        }))
    }

    restoreBackup = (e, backup) => {
        if (e) {
            e.preventDefault();
        }
        
        if (confirm("Вы действительно хотите восстановить страницу из этой резервной копии? Все несохраненные данные будут потеряны!")) {
            this.isLoading();
            return axios
                .post('./api/restoreBackup.php', {"page": this.currentPage, "file": backup})
                .then(this.open(this.currentPage))
        }
    }

    isLoading () {
        this.setState({
            loading: true
        });
    };

    isLoaded () {
        this.setState({
            loading: false
        });
    };

    render() {
        const { loading, backupsList, auth, loginLengthError, loginError } = this.state;
        let spinner = loading ? <Spinner active/> : <Spinner/>;
        
        if (!auth) {
            return <Login 
                    login={this.login} 
                    lengthErr={loginLengthError} 
                    logErr={loginError}
                    />
        }

        return (
            <>
                <Panel 
                    onSubmitChanges={this.save} 
                    initPages={this.init}
                    backupsList={backupsList}
                    restoreBackup={this.restoreBackup}
                    virtualDom={this.virtualDom}
                    logout={this.logout}
                    />
                <iframe src='' frameBorder="0"></iframe>
                <input ref={this.inputImg} type="file" accept="image/*" style={{'display': 'none'}}></input>
                {spinner}          
            </>
        )
    }
}