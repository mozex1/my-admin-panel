import React, {Component} from 'react';
import { CSSTransition } from "react-transition-group";
import ReactDOM from "react-dom";

export default class EditorMeta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meta: {
                title: '',
                keywords: '',
                description: ''
            }
        }
    }

    componentDidMount() {
        this.getMeta(this.props.virtualDom);
    }

    componentDidUpdate(prevProps) {
        if (this.props.virtualDom !== prevProps.virtualDom) {
            this.getMeta(this.props.virtualDom);
        }
    }

    closeOnEscapeKeyDown = e => {
		if ((e.charCode || e.keyCode) === 27) {
			this.props.onClose();
		}
	};

    getMeta(virtualDom) {
        this.title = virtualDom.head.querySelector('title') || virtualDom.head.appendChild(virtualDom.createElement('title'));

        this.keywords = virtualDom.head.querySelector('meta[name="keywords"]');
        if (!this.keywords) {
            this.keywords = virtualDom.head.appendChild(virtualDom.createElement('meta'));
            this.keywords.setAttribute("name", "keywords");
            this.keywords.setAttribute("content", "");
        }

        this.description = virtualDom.head.querySelector('meta[name="description"]');
        if (!this.description) {
            this.description = virtualDom.head.appendChild(virtualDom.createElement('meta'));
            this.description.setAttribute("name", "description");
            this.description.setAttribute("content", "");
        }

        this.setState({
            meta: {
                title: this.title.innerHTML,
                keywords: this.keywords.getAttribute("content"),
                description: this.description.getAttribute("content")
            }
        })
    }

    applyMeta() {
        this.title.innerHTML = this.state.meta.title;
        this.keywords.setAttribute("content", this.state.meta.keywords);
        this.description.setAttribute("content", this.state.meta.description);
    }

    onValueChange(e) {

        if (e.target.getAttribute("data-title")) {
            e.persist();
            this.setState(({meta}) => {
                const newMeta = {
                    ...meta,
                    title: e.target.value
                }

                return {
                    meta: newMeta
                }
            })
        } else if (e.target.getAttribute("data-key")) {
            e.persist();
            this.setState(({meta}) => {
                const newMeta = {
                    ...meta,
                    keywords: e.target.value
                }

                return {
                    meta: newMeta
                }
            })
        } else {
            e.persist();
            this.setState(({meta}) => {
                const newMeta = {
                    ...meta,
                    description: e.target.value
                }

                return {
                    meta: newMeta
                }
            })
        }

    }

    onSubmit = () => {
        const { onSave, onClose } = this.props;
        this.applyMeta();
        onSave();
        onClose();
        console.log('Save meta tags done!');
    }

    render() {

        const { onClose, show } = this.props;
        const { title, keywords, description } = this.state.meta;

        return ReactDOM.createPortal(
            <CSSTransition
			in={show}
			unmountOnExit
			timeout={{ enter: 0, exit: 300 }}
		    >
            <div className="modal " onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>

                    <div className="modal-header">
                        <h2 className="modal-title">Редактирование Meta-тэгов</h2>
                    </div>

                    <div className="modal-body">
                        <form>
                            <div className="uk-margin">
                                <input
                                    data-title 
                                    className="uk-input" 
                                    type="text" 
                                    placeholder="Title" 
                                    value={title} 
                                    onChange={(e) => this.onValueChange(e)}/>
                            </div>

                            <div className="uk-margin">
                                <textarea 
                                    data-key
                                    className="uk-textarea" 
                                    rows="5" 
                                    placeholder="Keywords" 
                                    value={keywords}
                                    onChange={(e) => this.onValueChange(e)}></textarea>
                            </div>

                            <div className="uk-margin">
                                <textarea 
                                    data-descr
                                    className="uk-textarea" 
                                    rows="5" 
                                    placeholder="Description" 
                                    value={description}
                                    onChange={(e) => this.onValueChange(e)}></textarea>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer">
                        <button onClick={onClose} className="button uk-button uk-button-default uk-margin-small-right uk-modal-close">
                            Отменить
                        </button>
                        <button onClick={this.onSubmit} className="button uk-button uk-button-primary uk-margin-small-right uk-modal-close">
                            Применить
                        </button>
                    </div>
                </div>
            </div>
            </CSSTransition>, document.getElementById("root")
        )       
    }
}