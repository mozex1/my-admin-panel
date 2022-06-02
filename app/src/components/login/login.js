import React, {Component} from 'react';
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pass: ""
        }
        this.closeOnEscapeKeyDown = this.closeOnEscapeKeyDown.bind(this);
    }

    closeOnEscapeKeyDown (e) {
		if ((e.charCode || e.keyCode) === 13) {
			this.props.login(this.state.pass)
		}
	};

    componentDidMount() {
        document.body.addEventListener("keydown", this.closeOnEscapeKeyDown);
    }

    componentDidCatch() {
        document.body.removeEventListener("keydown", this.closeOnEscapeKeyDown);
    }

    onPasswordChange(e) {
        this.setState({
            pass: e.target.value
        })
    }

    render() {
        const {pass} = this.state;
        const {login, lengthErr, logErr} = this.props;
        
        let renderLengthErr = lengthErr ? <span className="login-error">Пароль должен быть длиннее 5 символов</span> : null
        let renderLogErr = logErr ? <span className="login-error">Введен неправильный пароль!</span> : null

        return (
            <div className="login-container">
                <div className="login">
                    <h2 className="uk-modal-title uk-text-center">Авторизация</h2>
                    {/* <div className="uk-margin-top uk-text-lead">Пароль:</div> */}
                    <input
                        type="password" 
                        name="" 
                        id="" 
                        className="uk-input uk-margin-top"
                        placeholder="Пароль"
                        value={pass}
                        onChange={(e) => this.onPasswordChange(e)}></input>
                        { renderLogErr }
                        { renderLengthErr }                  
                    <button 
                        className="uk-button uk-button-primary uk-margin-top" 
                        type="button"
                        onClick={() => login(pass)}>Вход</button>
                </div>
            </div>
        )
    }
}